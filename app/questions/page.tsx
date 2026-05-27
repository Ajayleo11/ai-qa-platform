import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Question = Awaited<ReturnType<typeof prisma.question.findMany>>[number];

export const dynamic = "force-dynamic";

const statusClass: Record<string, string> = {
  PENDING: "badge badge-pending",
  PROCESSING: "badge badge-processing",
  ANSWERED: "badge badge-answered",
  FAILED: "badge badge-failed",
};

export default async function QuestionsPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          AI Q&A
        </Link>
        <Link href="/" className="navbar-button">
          Ask a Question
        </Link>
      </nav>

      <div className="container">
        <h1 className="page-title">All Questions</h1>

        {questions.length === 0 ? (
          <p className="empty-state">
            No questions yet. Be the first to ask one.
          </p>
        ) : (
          <div className="questions-list">
            {questions.map((q: Question) => (
              <Link
                href={`/questions/${q.id}`}
                key={q.id}
                className="question-card"
              >
                <div className="question-card-header">
                  <span className="question-card-title">{q.title}</span>
                  <span className={statusClass[q.status]}>{q.status}</span>
                </div>

                {q.tags.length > 0 && (
                  <div className="tags-wrapper">
                    {q.tags.map((tag: string) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="question-card-date">
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}