import { useDocumentStore } from "@/app/stores/document-store";

const BASE_URL = "http://localhost:3001";

export async function uploadDocuments(files: File[]) {
  const store = useDocumentStore.getState();

  for (const file of files) {
    const tempId = crypto.randomUUID();

    // 1. optimistic UI
    store.addDocument({
      id: tempId,
      name: file.name,
      size: file.size,
      type: file.name.split(".").pop()?.toLowerCase() as any,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
    });

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${BASE_URL}/documents`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      const serverDoc = json.document;

      // 2. replace optimistic with real doc (NO flicker)
      store.updateDocument(tempId, {
        id: serverDoc.id,
        name: serverDoc.name,
        size: serverDoc.size,
        type: serverDoc.type,
        status: serverDoc.status ?? "processing",
        progress: serverDoc.progress ?? 0,
        uploadedAt: serverDoc.uploadedAt,
      });
    } catch (e) {
      store.updateDocument(tempId, {
        status: "error",
        progress: 0,
      });
    }
  }
}
