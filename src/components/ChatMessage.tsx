import { memo, useMemo } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

// Parse markdown and LaTeX content
const parseContent = (text: string) => {
  const elements: React.ReactNode[] = [];
  let key = 0;

  // Split by block math first ($$...$$)
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
  let lastIndex = 0;
  let match;

  const textWithBlockMath = text;
  const parts: { type: "text" | "blockmath"; content: string }[] = [];

  while ((match = blockMathRegex.exec(textWithBlockMath)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: textWithBlockMath.slice(lastIndex, match.index),
      });
    }
    parts.push({ type: "blockmath", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < textWithBlockMath.length) {
    parts.push({ type: "text", content: textWithBlockMath.slice(lastIndex) });
  }

  parts.forEach((part) => {
    if (part.type === "blockmath") {
      elements.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <BlockMath math={part.content} />
        </div>
      );
    } else {
      // Process inline math and markdown in text parts
      const processedText = processInlineContent(part.content, key);
      key += 1000; // Increment key to avoid collisions
      elements.push(...processedText);
    }
  });

  return elements;
};

const processInlineContent = (text: string, baseKey: number) => {
  const elements: React.ReactNode[] = [];
  let key = baseKey;

  // Split by inline math ($...$) but not $$
  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={key++} />);
    }

    // Check for headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-primary mt-4 mb-2">
          {parseInlineMath(line.slice(4), key)}
        </h3>
      );
      key += 100;
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-primary mt-4 mb-2">
          {parseInlineMath(line.slice(3), key)}
        </h2>
      );
      key += 100;
      return;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-primary mt-4 mb-2">
          {parseInlineMath(line.slice(2), key)}
        </h1>
      );
      key += 100;
      return;
    }

    // Check for list items
    if (line.match(/^[\-\*]\s/)) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2">
          <span className="text-accent">•</span>
          <span>{parseInlineMath(line.slice(2), key)}</span>
        </div>
      );
      key += 100;
      return;
    }

    // Check for numbered lists
    const numberedMatch = line.match(/^(\d+)\.\s/);
    if (numberedMatch) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2">
          <span className="text-accent font-bold">{numberedMatch[1]}.</span>
          <span>{parseInlineMath(line.slice(numberedMatch[0].length), key)}</span>
        </div>
      );
      key += 100;
      return;
    }

    // Regular text with inline math and bold
    elements.push(
      <span key={key++}>{parseInlineMath(line, key)}</span>
    );
    key += 100;
  });

  return elements;
};

const parseInlineMath = (text: string, baseKey: number) => {
  const elements: React.ReactNode[] = [];
  let key = baseKey;

  // Process bold text and inline math
  const inlineMathRegex = /\$([^\$]+)\$/g;
  const boldRegex = /\*\*([^\*]+)\*\*/g;

  // First, replace inline math with placeholders
  const mathPlaceholders: { placeholder: string; math: string }[] = [];
  let processedText = text.replace(inlineMathRegex, (match, math) => {
    const placeholder = `__MATH_${mathPlaceholders.length}__`;
    mathPlaceholders.push({ placeholder, math });
    return placeholder;
  });

  // Then handle bold text
  const boldParts = processedText.split(boldRegex);
  boldParts.forEach((part, index) => {
    // Odd indices are bold text
    const isBold = index % 2 === 1;
    
    // Check for math placeholders in this part
    let currentPart = part;
    const mathMatches = currentPart.match(/__MATH_(\d+)__/g);
    
    if (mathMatches) {
      const subParts = currentPart.split(/__MATH_\d+__/);
      subParts.forEach((subPart, subIndex) => {
        if (subPart) {
          if (isBold) {
            elements.push(
              <strong key={key++} className="text-accent font-bold">
                {subPart}
              </strong>
            );
          } else {
            elements.push(<span key={key++}>{subPart}</span>);
          }
        }
        if (subIndex < mathMatches.length) {
          const mathIndex = parseInt(mathMatches[subIndex].match(/\d+/)![0]);
          const mathContent = mathPlaceholders[mathIndex].math;
          elements.push(
            <span key={key++} className="mx-1">
              <InlineMath math={mathContent} />
            </span>
          );
        }
      });
    } else {
      if (part) {
        if (isBold) {
          elements.push(
            <strong key={key++} className="text-accent font-bold">
              {part}
            </strong>
          );
        } else {
          elements.push(<span key={key++}>{part}</span>);
        }
      }
    }
  });

  return elements;
};

const ChatMessage = memo(({ role, content }: ChatMessageProps) => {
  const parsedContent = useMemo(() => parseContent(content), [content]);

  if (role === "user") {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-muted/60 backdrop-blur border border-border/50 rounded-2xl rounded-br-sm px-4 py-3 max-w-[85%]">
          <p className="text-foreground text-sm font-body whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center border border-border/50">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center border border-purple-400/30 shadow-lg shadow-purple-500/20">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur border border-purple-500/30 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] shadow-lg shadow-purple-500/10">
        <div className="text-foreground text-sm font-body leading-relaxed">
          {parsedContent}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
