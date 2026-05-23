import { HealthController } from "./controller";

export default async function healthRoutes(app: any) {
  const controller = new HealthController();

  app.get("/health/server", controller.checkServer);

  app.get("/health/db", controller.checkDB);

  app.get("/health/ollama", controller.checkOllama);
}
