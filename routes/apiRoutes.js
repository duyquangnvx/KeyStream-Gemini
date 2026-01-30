const express = require("express");
const keyService = require("../services/keyService");
const geminiService = require("../services/geminiService");
const config = require("../config");

module.exports = (io) => {
  const router = express.Router();

  const handleRequest = async (req, res, attemptedKeys = []) => {
    const keyObj = keyService.getOptimalKey(attemptedKeys);

    if (!keyObj) {
      return res.status(429).json({
        error: {
          message:
            "All keys are currently exhausted or in cooldown. Please wait.",
          code: 429,
        },
      });
    }

    keyService.updateKeyStatus(keyObj.key, "active"); // Mark as active, update lastUsed
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const currentKey = keyObj.key;

    let targetModel = req.body.model
      .replace("models/", "")
      .replace(/^Proxy:\s*/, "");

    io.emit("log", {
      id: requestId,
      type: "info",
      message: `[${targetModel}] -> Attempting Key: ...${currentKey.slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
    });

    try {
      if (req.body.stream) {
        const result = await geminiService.generateContent(
          currentKey,
          targetModel,
          req.body.messages,
          true,
        );

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        for await (const chunk of result.stream) {
          const text = chunk.text();
          res.write(
            `data: ${JSON.stringify({
              id: requestId,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model: targetModel,
              choices: [
                { delta: { content: text }, index: 0, finish_reason: null },
              ],
            })}

`,
          );
        }
        res.write(`data: [DONE]\n\n`);
        res.end();

        keyService.incrementKeyUsage(currentKey);
        io.emit("traffic_update");
        io.emit("log", {
          id: requestId,
          type: "success",
          message: "Stream Success.",
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        const result = await geminiService.generateContent(
          currentKey,
          targetModel,
          req.body.messages,
          false,
        );
        const text = result.response.text();

        keyService.incrementKeyUsage(currentKey);
        io.emit("traffic_update");
        io.emit("log", {
          id: requestId,
          type: "success",
          message: "Request Success.",
          timestamp: new Date().toLocaleTimeString(),
        });

        res.json({
          id: requestId,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: targetModel,
          choices: [
            {
              message: { role: "assistant", content: text },
              finish_reason: "stop",
              index: 0,
            },
          ],
        });
      }
      io.emit("stats_update", keyService.getKeyPool());
    } catch (error) {
      const isRateLimit = (
        error.message.includes("429") ||
        error.message.includes("Quota") ||
        error.message.includes("exhausted")
      );

      io.emit("log", {
        id: requestId,
        type: "error",
        message: isRateLimit
          ? `Rate Limit Hit (${attemptedKeys.length + 1}/${keyService.getKeyPool().length})`
          : error.message,
        timestamp: new Date().toLocaleTimeString(),
      });

      if (isRateLimit) {
        keyService.updateKeyStatus(currentKey, "cooldown");
        keyService.incrementKeyErrors(currentKey);
        io.emit("stats_update", keyService.getKeyPool());

        const newAttemptedKeys = [...attemptedKeys, currentKey];

        if (newAttemptedKeys.length < keyService.getKeyPool().length) {
          await new Promise((r) => setTimeout(r, 200));
          return handleRequest(req, res, newAttemptedKeys);
        }
      }

      if (!res.headersSent) {
        res.status(500).json({ error: { message: error.message } });
      }
    }
  };

  // API Routes
  router.post("/v1/chat/completions", (req, res) => handleRequest(req, res, []));

  router.get("/v1/models", (req, res) => {
    res.json({
      object: "list",
      data: geminiService.getDynamicModels().map((id) => ({
        id,
        object: "model",
        created: 1677610602,
        owned_by: "google",
      })),
    });
  });

  router.get("/api/keys", (req, res) => res.json(keyService.getKeyPool()));

  router.get("/api/config-template", async (req, res) => {
    if (geminiService.getDynamicModels().length === 0) await geminiService.fetchGoogleModels();
    res.json(geminiService.getDynamicModels());
  });

  router.post("/api/refresh-models", async (req, res) => {
    await geminiService.fetchGoogleModels();
    io.emit("stats_update", keyService.getKeyPool()); // Ensure UI updates if keys were used
    res.json(geminiService.getDynamicModels());
  });

  router.post("/api/keys", (req, res) => {
    const { key } = req.body;
    if (keyService.addKey(key)) {
      io.emit("stats_update", keyService.getKeyPool());
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid key or key already exists." });
    }
  });

  return router;
};
