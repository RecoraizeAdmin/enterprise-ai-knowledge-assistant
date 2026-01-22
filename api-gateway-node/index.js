const express = require("express");
const app = express();
const rateLimitMap = {};


// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

app.post("/test", (req, res) => {
  res.json({
    message: "Request received",
    data: req.body,
  });
});

//error
app.get("/error", (req, res) => {
  throw new Error("Simulated server error");
});

//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/block", (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Blocking CPU for 5 seconds
  }
  res.json({ message: "Blocking request finished" });
});

app.get("/non-block", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  res.json({ message: "Non-blocking request finished" });
});

app.use((req, res, next) => {
    const ip = req.ip;
    rateLimitMap[ip] = (rateLimitMap[ip] || 0) + 1;
  
    if (rateLimitMap[ip] > 20) {
      return res.status(429).json({
        error: "Too many requests. Please slow down.",
      });
    }
  
    next();
  });
  

// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
