type DescriptionBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "section";
      title: string;
    }
  | {
      type: "list";
      items: string[];
    };

type EtsyProductDescriptionProps = {
  description: string;
};

const sectionLabels = [
  "Caractéristiques",
  "Livraison",
  "Sur mesure",
  "Une question ?"
];

function sectionTitleFrom(line: string) {
  return sectionLabels.find((label) => line.includes(label));
}

function bulletTextFrom(line: string) {
  const match = line.match(/^(?:#{1,6}\s*)?[•*-]\s+(.+)$/);

  return match?.[1]?.trim() ?? null;
}

function parseDescription(description: string) {
  const blocks: DescriptionBlock[] = [];
  const paragraphLines: string[] = [];
  const listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" ").trim()
    });
    paragraphLines.length = 0;
  }

  function flushList() {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      type: "list",
      items: [...listItems]
    });
    listItems.length = 0;
  }

  const lines = description.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const sectionTitle = sectionTitleFrom(line);

    if (sectionTitle) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "section",
        title: line
      });
      return;
    }

    const bulletText = bulletTextFrom(line);

    if (bulletText) {
      flushParagraph();
      listItems.push(bulletText);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}

export default function EtsyProductDescription({
  description
}: EtsyProductDescriptionProps) {
  const blocks = parseDescription(description);
  let hasDisplayedIntro = false;

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-5 text-muted">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          const isIntro = !hasDisplayedIntro;
          hasDisplayedIntro = true;

          return (
            <p
              key={`${block.type}-${index}`}
              className={
                isIntro
                  ? "pb-3 text-lg italic leading-8 text-muted sm:text-xl sm:leading-9"
                  : "text-base leading-8 text-muted"
              }
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "section") {
          return (
            <h2
              key={`${block.type}-${index}`}
              className="pt-7 font-display text-2xl font-semibold leading-tight text-foreground"
            >
              {block.title}
            </h2>
          );
        }

        return (
          <ul
            key={`${block.type}-${index}`}
            className="list-disc space-y-2 pl-5 text-base leading-8 text-muted marker:text-accent-warm"
          >
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
