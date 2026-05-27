import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  const { title, body, images = [] } = await req.json();

  const question = await prisma.question.create({
    data: { title, body, images },
  });

  await inngest.send({
    name: "question.created",
    data: { questionId: question.id },
  });

  return NextResponse.json(question, { status: 201 });
}

export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(questions);
}