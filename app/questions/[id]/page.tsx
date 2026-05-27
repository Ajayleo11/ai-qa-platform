import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) notFound();

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          AI Q&A
        </Link>
        <Link href="/questions" className="navbar-link">
          Back to Questions
        </Link>
      </nav>

      <div className="container">
        <div className="detail-page">
          <div className="detail-card">
            <h1 className="detail-title">{question.title}</h1>
            <p className="detail-body">{question.body}</p>

            {question.tags.length > 0 && (
              <div className="tags-wrapper">
                {question.tags.map((tag: string) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="detail-card">
            <h2 className="answer-heading">AI Generated Answer</h2>

            {question.status === "PENDING" ||
            question.status === "PROCESSING" ? (
              <p className="answer-pending">
                Generating your answer, please refresh in a few seconds.
              </p>
            ) : question.status === "FAILED" ? (
              <p className="answer-failed">
                Failed to generate an answer. Please try submitting again.
              </p>
            ) : (
              <p className="answer-text">{question.answer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}