"use client";

interface ChatTitleProps {
  title: string;
  documentCount: number;
  retrievedChunkCount: number;
}

export const ChatTitle = ({
  title,
  documentCount,
  retrievedChunkCount,
}: ChatTitleProps) => {
  return (
    <div className="min-w-0">
      {" "}
      <h1 className="text-sm font-semibold truncate">{title} </h1>
      <p className="text-xs text-text-secondary mt-0.5">
        {documentCount} doc
        {documentCount !== 1 ? "s" : ""}
        {" · "}
        {retrievedChunkCount} chunks retrieved
      </p>
    </div>
  );
};
