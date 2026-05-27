"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    setLoading(false);
    router.push("/questions");
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <span className="navbar-brand">AI Q&A</span>
        <Link href="/questions" className="navbar-link">
          Browse Questions
        </Link>
      </nav>

      <div className="container">
        <h1 className="page-title">Ask anything</h1>
        <p className="page-subtitle">
          Get AI-powered answers to your questions instantly.
        </p>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="e.g. How does useEffect work in React?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Details</label>
            <textarea
              placeholder="Describe your question in more detail..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="form-textarea"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="form-button"
          >
            {loading ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      </div>
    </div>
  );
}