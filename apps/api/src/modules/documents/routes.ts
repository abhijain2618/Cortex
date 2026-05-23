import { DocumentController } from "./controller";

export default async function documentRoutes(app: any) {
  const controller = new DocumentController();

  app.post("/documents", controller.upload);
  app.get("/documents", controller.list);
}
