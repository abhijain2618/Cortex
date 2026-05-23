"use client";

import { useRef, useState, useCallback } from "react";
import { X, FileUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { uploadDocuments } from "../lib/services/document.service";

const ACCEPTED_TYPES = [".pdf", ".txt", ".md", ".docx", ".csv", ".html"];

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    setSelected((prev) => {
      const existing = new Set(prev.map((f) => f.name));

      const newFiles = Array.from(files).filter((f) => !existing.has(f.name));

      return [...prev, ...newFiles];
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSubmit = async () => {
    if (selected.length === 0) return;

    setUploading(true);

    try {
      uploadDocuments(selected); // NO await (important)
      setSelected([]);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-surface border border-border-mid rounded-lg w-[480px] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between mb-1">
          <h2 className="text-base font-semibold">Upload document</h2>
          <button onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <p className="text-[13px] text-text-secondary mb-5">
          Files will be indexed into your RAG system
        </p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded px-6 py-9 text-center cursor-pointer",
            dragging ? "border-accent bg-accent/10" : "border-border-mid",
          )}
        >
          <FileUp size={32} className="mx-auto mb-3" />
          <p>Drop files or browse</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* Selected files */}
        {selected.length > 0 && (
          <div className="mt-4 space-y-2">
            {selected.map((f, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{f.name}</span>
                <button
                  onClick={() =>
                    setSelected((prev) => prev.filter((_, j) => j !== i))
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={handleClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || uploading}
          >
            Upload {uploading ? "..." : `(${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
