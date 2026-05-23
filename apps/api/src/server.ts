process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import multipart from "@fastify/multipart";
import healthRoutes from "./modules/health/routes";
import documentRoutes from "./modules/documents/routes";
import chatRoutes from "./modules/chat/routes";
import chatSessionRoutes from "./modules/chatSession/routes";

dotenv.config();

const app = Fastify();

const start = async () => {
  try {
    await app.register(cors, {
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://hoppscotch.io",
      ],
      methods: ["GET", "POST", "OPTIONS"],
    });

    await app.register(multipart, {
      limits: { fileSize: 50 * 1024 * 1024 },
    });

    // IMPORTANT: await all plugins
    await app.register(healthRoutes);
    await app.register(documentRoutes);
    await app.register(chatRoutes);
    await app.register(chatSessionRoutes);
    await app.listen({
      port: 3001,
      host: "0.0.0.0",
    });

    console.info("API running on http://localhost:3001");
  } catch (err) {
    console.error("❌ API BOOT ERROR:", err);
    process.exit(1);
  }
};

start();

// prevent premature exit in container + turbo environments
process.stdin.resume();
