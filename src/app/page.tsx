"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [code, setCode] = useState(`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reviewCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error("Failed to review code");
      const data = await response.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.bgGrid} />
      <div className={`${styles.glowOrb} ${styles.glowOrb1}`} />
      <div className={`${styles.glowOrb} ${styles.glowOrb2}`} />

      <div className={styles.wrapper}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Powered by Azure o4-mini
            </div>
            <h1 className={styles.title}>
              Code Review<br />Agent
            </h1>
            <p className={styles.subtitle}>
              AI-powered analysis using LangGraph multi-agent pipeline
            </p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <div className={styles.statVal}>3</div>
              <div className={styles.statLabel}>Agents</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statVal}>AI</div>
              <div className={styles.statLabel}>Powered</div>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className={styles.grid}>

          {/* Input Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <span className={`${styles.panelIcon} ${styles.iconBlue}`}>✦</span>
                Input Code
              </div>
              <span className={styles.lineCount}>
                {code.split("\n").length} lines
              </span>
            </div>

            <textarea
              className={styles.codeInput}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              spellCheck={false}
            />

            <button
              className={`${styles.btnPrimary} ${loading ? styles.btnShimmer : ""}`}
              onClick={reviewCode}
              disabled={loading || !code.trim()}
            >
              {loading ? "⟳  Analyzing Code..." : "⚡  Review Code"}
            </button>

            {error && <div className={styles.errorMsg}>⚠ {error}</div>}
          </div>

          {/* Results Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <span className={`${styles.panelIcon} ${styles.iconViolet}`}>◈</span>
                Review Results
              </div>
              {result && (
                <span className={`${styles.lineCount} ${styles.lineCountSuccess}`}>
                  ✓ Complete
                </span>
              )}
            </div>

            <div className={styles.resultsScroll}>
              {loading ? (
                <div className={styles.skeletonWrap}>
                  <div className={`${styles.skeleton} ${styles.skeletonSm}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonMd}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonLg}`} />
                </div>
              ) : !result ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>◎</div>
                  <div className={styles.emptyText}>
                    Submit your code to get an AI-powered review
                  </div>
                </div>
              ) : (
                <>
                  {/* Analysis */}
                  <div className={`${styles.resultSection} ${styles.sectionAnalysis}`}>
                    <div className={`${styles.sectionLabel} ${styles.labelBlue}`}>
                      ◆ Analysis
                    </div>
                    <p className={styles.sectionText}>{result.analysis}</p>
                  </div>

                  {/* Issues */}
                  <div className={`${styles.resultSection} ${styles.sectionIssues}`}>
                    <div className={`${styles.sectionLabel} ${styles.labelAmber}`}>
                      ⚠ Issues Found ({result.issues?.length || 0})
                    </div>
                    {result.issues && result.issues.length > 0 ? (
                      <ul className={styles.issueList}>
                        {result.issues.map((issue: string, i: number) => (
                          <li key={i} className={styles.issueItem}>
                            <span className={styles.issueBullet} />
                            <span>{issue.replace(/^-\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.sectionText}>No issues found</p>
                    )}
                  </div>

                  {/* Report */}
                  <div className={`${styles.resultSection} ${styles.sectionReport}`}>
                    <div className={`${styles.sectionLabel} ${styles.labelGreen}`}>
                      ✦ Full Report
                    </div>
                    <div className={styles.reportText}>{result.report}</div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}