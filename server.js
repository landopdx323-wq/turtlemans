import express from "express";
import fetch from "node-fetch";

const app = express();

// Proxy route
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const response = await fetch(targetUrl);
    let body = await response.text();

    // strip X-Frame-Options and CSP so site can load in iframe
    res.setHeader("Content-Security-Policy", "");
    res.setHeader("X-Frame-Options", "");

    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching: " + err.message);
  }
});

// Serve static files (like index.html)
app.use(express.static("public"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
