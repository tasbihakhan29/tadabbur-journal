// Lightweight renderer for reflection markdown content.
// Our content is plain paragraphs (no headings/lists/code), so a minimal
// paragraph-splitter is sufficient and avoids pulling in a full MD pipeline.

export function MarkdownProse({ content }: { content: string }) {
  const blocks = content
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="prose-reflection">
      {blocks.map((block, i) => {
        // Treat a short standalone line starting with "~" as a signature line.
        if (block.startsWith("~")) {
          return (
            <p
              key={i}
              className="!mb-0 mt-10 text-right font-display italic text-emerald"
            >
              {block}
            </p>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
