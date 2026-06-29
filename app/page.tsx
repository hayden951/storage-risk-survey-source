export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 48, maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Storage Risk Survey Widget</h1>
      <p style={{ color: "#6b7280", marginBottom: 24, lineHeight: 1.7 }}>
        Add the survey bubble to any website by pasting one line of code before your closing &lt;/body&gt; tag:
      </p>
      <pre style={{ background: "#f3f4f6", padding: 16, borderRadius: 8, fontSize: 13, overflowX: "auto" }}>
        {`<script src="https://YOUR-VERCEL-URL/widget.js"></script>`}
      </pre>
    </main>
  );
}
