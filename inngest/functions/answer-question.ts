import { inngest } from "../client";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const answerQuestion = inngest.createFunction(
  {
    id: "answer-question",
    retries: 3,
    triggers: { event: "question.created" },
  },
  async ({ event, step }) => {
    const { questionId } = event.data as { questionId: string };

    // Step 1: Fetch question
    const question = await step.run("fetch-question", async () => {
      return await prisma.question.findUnique({
        where: { id: questionId },
      });
    });

    if (!question) throw new Error("Question not found");

    // Step 2: Mark as processing
    await step.run("mark-processing", async () => {
      return await prisma.question.update({
        where: { id: questionId },
        data: { status: "PROCESSING" },
      });
    });

    // Step 3: Build message content
    const content: OpenAI.ChatCompletionContentPart[] = [
      { type: "text", text: `${question.title}\n\n${question.body}` },
    ];

    if (question.images.length > 0) {
      question.images.forEach((url: string) => {
        content.push({
          type: "image_url",
          image_url: { url },
        });
      });
    }

    // Step 4: Generate answer
    const answer = await step.run("generate-answer", async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful technical assistant. Answer clearly and concisely.",
          },
          { role: "user", content },
        ],
      });
      return response.choices[0].message.content;
    });

    // Step 5: Generate tags with cheaper model
    const tags = await step.run("generate-tags", async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: 'Return ONLY a JSON array of 3-5 short tags. Example: ["react","hooks","typescript"]',
          },
          {
            role: "user",
            content: `${question.title}\n\n${question.body}`,
          },
        ],
      });
      const raw = response.choices[0].message.content ?? "[]";
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    });

    // Step 6: Save to DB
    await step.run("save-answer", async () => {
      return await prisma.question.update({
        where: { id: questionId },
        data: { answer, tags, status: "ANSWERED" },
      });
    });

    return { questionId, status: "ANSWERED" };
  }
);