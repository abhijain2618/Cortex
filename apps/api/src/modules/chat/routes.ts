import { ChatController } from "./controller";

export default async function chatRoutes(app: any) {
  const controller = new ChatController();

  app.post("/chat", controller.ask);
}
