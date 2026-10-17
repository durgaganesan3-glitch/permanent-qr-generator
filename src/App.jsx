
import { useState } from "react";
import QRCode from "qrcode";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  async function generateQR() {
    setError("");
    setQrCode("");

    let website = url.trim();

    if (!website) {
      setError("Please enter a website URL.");
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(website)) {
      website = `https://${website}`;
    }

    try {
      const parsed = new URL(website);

      if (
        !["http:", "https:"].includes(parsed.protocol) ||
        !parsed.hostname.includes(".")
      ) {
        throw new Error("Invalid URL");
      }

      const image = await QRCode.toDataURL(parsed.href, {
        width: 400,
        margin: 3,
        errorCorrectionLevel: "H",
        color: {
          dark: "#281347",
          light: "#FFFFFF",
        },
      });

      setQrCode(image);
    } catch {
      setError("Enter a valid website URL, such as https://example.com");
    }
  }

  function downloadQR() {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "permanent-static-qr.png";
    link.click();
  }

  return (
    <main className="page">
      <section className="card">
        <div className="logo">▦</div>

        <h1>Permanent QR Generator</h1>
        <p className="subtitle">
          Create free static QR codes that never expire on their own.
        </p>

        <label htmlFor="website">Enter your website URL</label>

        <input
          id="website"
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") generateQR();
          }}
        />

        <button className="generate" onClick={generateQR}>
          Generate QR Code
        </button>

        {error && <p className="error">{error}</p>}

        {qrCode && (
          <div className="result">
            <img src={qrCode} alt="Generated static QR code" />
            <p className="success">Your QR code is ready!</p>
            <button className="download" onClick={downloadQR}>
              Download QR Code (PNG)
            </button>
          </div>
        )}

        <div className="features">
          <p>✓ Free QR code generation</p>
          <p>✓ No login or subscription</p>
          <p>✓ No built-in expiry date</p>
        </div>

        <footer>
          QR codes work while their destination websites remain accessible.
        </footer>
      </section>
    </main>
  );
}

export default App;
