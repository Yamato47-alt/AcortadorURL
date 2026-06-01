import { useState } from "react";
import { shortenUrl, getStats, BASE_URL } from "./Api/urlServices";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("home");

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setStats(null);
    try {
      const data = await shortenUrl(url);
      setResult(data);
      setView("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStats = async () => {
    if (!result?.shortCode) return;
    setError("");
    try {
      const data = await getStats(result.shortCode);
      setStats(data);
      setView("stats");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    const shortUrl = `${BASE_URL}/${result.shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setStats(null);
    setError("");
    setView("home");
  };

  const shortLink = result ? `${BASE_URL}/${result.shortCode}` : "";
  const qrUrl = result ? `${BASE_URL}/api/urls/${result.shortCode}/qr` : "";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"></link>
        <div style={styles.logo} onClick={handleReset}>
          <span style={styles.logoIcon}>⌗</span>
          <span style={styles.logoText}>cortaurl</span>
        </div>
      </header>

      <main style={styles.main}>
        {view === "home" && (
          <section style={styles.hero}>
            <h1 style={styles.title}>Acortá cualquier URL<br />en un segundo</h1>
            <p style={styles.subtitle}>Pegá tu link, generá el código corto y compartilo.</p>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                type="text"
                placeholder="https://tu-url-larga.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <button
                style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar"}
              </button>
            </div>
            {error && <p style={styles.errorMsg}>{error}</p>}
          </section>
        )}

        {view === "result" && result && (
          <section style={styles.card}>
            <p style={styles.cardLabel}>Tu URL corta</p>
            <a href={shortLink} target="_blank" rel="noreferrer" style={styles.shortLink}>
              {shortLink}
            </a>

            <div style={styles.actions}>
              <button style={styles.btnSecondary} onClick={handleCopy}>
                {copied ? "¡Copiado!" : "Copiar link"}
              </button>
              <button style={styles.btnSecondary} onClick={handleStats}>
                Ver stats
              </button>
              <button style={styles.btnSecondary} onClick={handleReset}>
                Nueva URL
              </button>
            </div>

            <div style={styles.qrSection}>
              <p style={styles.cardLabel}>Código QR</p>
              <img src={qrUrl} alt="QR code" style={styles.qrImg} />
            </div>
          </section>
        )}

        {view === "stats" && stats && (
          <section style={styles.card}>
            <button style={styles.backBtn} onClick={() => setView("result")}>
              ← Volver
            </button>

            <p style={styles.cardLabel}>URL original</p>
            <p style={styles.originalUrl}>{stats.originalUrl}</p>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{stats.totalClicks}</span>
                <span style={styles.statLabel}>Clicks totales</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{stats.shortCode}</span>
                <span style={styles.statLabel}>Short code</span>
              </div>
            </div>

            {stats.lastVisits?.length > 0 && (
              <>
                <p style={{ ...styles.cardLabel, marginTop: "1.5rem" }}>Últimas visitas</p>
                <div style={styles.visitList}>
                  {stats.lastVisits.map((v, i) => (
                    <div key={i} style={styles.visitRow}>
                      <span style={styles.visitTime}>
                        {new Date(v.visitedAt).toLocaleString("es-AR")}
                      </span>
                      <span style={styles.visitIp}>{v.ipAddress}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {stats.lastVisits?.length === 0 && (
              <p style={styles.noVisits}>Todavía no hay visitas registradas.</p>
            )}
          </section>
        )}
      </main>

      <footer style={styles.footer}>
        <span>cortaurl — portfolio project</span>
      </footer>
    </div>
    
  );
  
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    background: "#0d0d0d",
    color: "#f0ede6",
  },
  header: {
    padding: "1.25rem 2rem",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    userSelect: "none",
  },
  logoIcon: {
    fontSize: "22px",
    color: "#c8f465",
    lineHeight: 1,
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "500",
    letterSpacing: "0.04em",
    color: "#f0ede6",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
  },
  hero: {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: "600",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    marginBottom: "1rem",
    color: "#f0ede6",
  },
  subtitle: {
    fontSize: "1.05rem",
    color: "#888",
    marginBottom: "2.5rem",
    lineHeight: 1.6,
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "6px",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "0.95rem",
    color: "#f0ede6",
    padding: "10px 12px",
    fontFamily: "inherit",
  },
  btn: {
    background: "#c8f465",
    color: "#0d0d0d",
    border: "none",
    borderRadius: "8px",
    padding: "10px 22px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
  errorMsg: {
    marginTop: "1rem",
    color: "#f87171",
    fontSize: "0.9rem",
  },
  card: {
    background: "#161616",
    border: "1px solid #222",
    borderRadius: "16px",
    padding: "2rem",
    maxWidth: "520px",
    width: "100%",
  },
  cardLabel: {
    fontSize: "0.78rem",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "0.5rem",
  },
  shortLink: {
    display: "block",
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#c8f465",
    textDecoration: "none",
    marginBottom: "1.5rem",
    wordBreak: "break-all",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  btnSecondary: {
    background: "transparent",
    color: "#f0ede6",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  qrSection: {
    borderTop: "1px solid #222",
    paddingTop: "1.5rem",
    textAlign: "center",
  },
  qrImg: {
    width: "160px",
    height: "160px",
    borderRadius: "8px",
    background: "#fff",
    padding: "8px",
    marginTop: "0.5rem",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#555",
    fontSize: "0.85rem",
    cursor: "pointer",
    padding: "0",
    marginBottom: "1.5rem",
    fontFamily: "inherit",
  },
  originalUrl: {
    fontSize: "0.9rem",
    color: "#888",
    wordBreak: "break-all",
    marginBottom: "1.5rem",
    lineHeight: 1.5,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  statBox: {
    background: "#1a1a1a",
    border: "1px solid #222",
    borderRadius: "10px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#f0ede6",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: "0.78rem",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  visitList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  visitRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1a1a1a",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "0.85rem",
  },
  visitTime: {
    color: "#888",
  },
  visitIp: {
    color: "#c8f465",
    fontFamily: "monospace",
    fontSize: "0.8rem",
  },
  noVisits: {
    color: "#555",
    fontSize: "0.9rem",
    marginTop: "1rem",
  },
  footer: {
    padding: "1.25rem 2rem",
    borderTop: "1px solid #222",
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#333",
  },
};