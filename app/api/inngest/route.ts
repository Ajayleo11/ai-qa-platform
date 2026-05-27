import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { answerQuestion } from "@/inngest/functions/answer-question";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [answerQuestion],
});