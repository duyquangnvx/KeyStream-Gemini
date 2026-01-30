const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const config = require("./config");
const keyService = require("./services/keyService");
const geminiService = require("./services/geminiService");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = config.PORT;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

// Initialize key service and load keys
keyService.loadKeys();

// Initialize Gemini model fetching
geminiService.initializeModelFetching();

// Use API routes
app.use("/", apiRoutes(io));

server.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 GEMINI PROXY IS RUNNING`);
  console.log(`📡 Local Address: http://localhost:${PORT}`);
  console.log(`===========================================\n`);
});