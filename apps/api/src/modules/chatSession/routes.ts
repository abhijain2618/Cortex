import { ChatSessionController } from "./controller";

const controller = new ChatSessionController();

export default async function chatSessionRoutes(app: any) {
  // Create New Session - call on app load for new session each time
  app.post("/chat/session", controller.create);

  // Get all session - user level session not created
  // To Do - associate session at user level. Not part of MVP
  app.get("/chat/sessions", controller.list);

  // Session details and related messages
  // Updated user messages per session
  // Need to update the chat responses from agent
  app.get("/chat/sessions/:id", controller.get);
}
