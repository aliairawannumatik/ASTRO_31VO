import { memo, useMemo } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isDark?: boolean;
}

const parseContent = (text: string) => {
  const elements: React.ReactNode[] = [];
  let key = 0;

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
      const processedText = processInlineContent(part.content, key);
      key += 1000;
      elements.push(...processedText);
    }
  });

  return elements;
};

const processInlineContent = (text: string, baseKey: number) => {
  const elements: React.ReactNode[] = [];
  let key = baseKey;

  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={key++} />);
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-bold text-cyan-300 mt-4 mb-2 font-display">
          {parseInlineMath(line.slice(4), key)}
        </h3>
      );
      key += 100;
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-cyan-300 mt-4 mb-2 font-display">
          {parseInlineMath(line.slice(3), key)}
        </h2>
      );
      key += 100;
      return;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold text-cyan-300 mt-4 mb-2 font-display">
          {parseInlineMath(line.slice(2), key)}
        </h1>
      );
      key += 100;
      return;
    }

    if (line.match(/^[\-\*]\s/)) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2 my-0.5">
          <span className="text-cyan-400 mt-0.5">▸</span>
          <span>{parseInlineMath(line.slice(2), key)}</span>
        </div>
      );
      key += 100;
      return;
    }

    const numberedMatch = line.match(/^(\d+)\.\s/);
    if (numberedMatch) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-2 my-0.5">
          <span className="text-cyan-400 font-bold font-mono text-xs mt-0.5">{numberedMatch[1]}.</span>
          <span>{parseInlineMath(line.slice(numberedMatch[0].length), key)}</span>
        </div>
      );
      key += 100;
      return;
    }

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

  const inlineMathRegex = /\$([^\$]+)\$/g;
  const mathPlaceholders: { placeholder: string; math: string }[] = [];
  let processedText = text.replace(inlineMathRegex, (match, math) => {
    const placeholder = `__MATH_${mathPlaceholders.length}__`;
    mathPlaceholders.push({ placeholder, math });
    return placeholder;
  });

  const boldParts = processedText.split(/\*\*([^\*]+)\*\*/g);
  boldParts.forEach((part, index) => {
    const isBold = index % 2 === 1;

    let currentPart = part;
    const mathMatches = currentPart.match(/__MATH_(\d+)__/g);

    if (mathMatches) {
      const subParts = currentPart.split(/__MATH_\d+__/);
      subParts.forEach((subPart, subIndex) => {
        if (subPart) {
          if (isBold) {
            elements.push(
              <strong key={key++} className="text-yellow-300 font-bold">
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
            <strong key={key++} className="text-yellow-300 font-bold">
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

const ChatMessage = memo(({ role, content, isDark = true }: ChatMessageProps) => {
  const parsedContent = useMemo(() => parseContent(content), [content]);

  if (role === "user") {
    return (
      <div className="flex items-end gap-2 justify-end">
        <div className={`px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm font-body whitespace-pre-wrap leading-relaxed ${
          isDark
            ? "bg-gradient-to-br from-indigo-600/80 to-blue-700/80 border border-indigo-400/30 text-white shadow-lg shadow-indigo-500/20 backdrop-blur"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
        }`}>
          {content}
        </div>
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border mb-0.5 ${
          isDark
            ? "bg-indigo-700/60 border-indigo-400/30"
            : "bg-blue-100 border-blue-300"
        }`}>
          <User className={`w-3.5 h-3.5 ${isDark ? "text-indigo-300" : "text-blue-500"}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {/* AI Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full overflow-hidden border mb-0.5 ${
        isDark
          ? "border-cyan-400/40 shadow-[0_0_10px_rgba(103,232,249,0.25)]"
          : "border-blue-300 shadow-md"
      }`}>
        <img src="/robot-numatik.jpeg" alt="AI" className="w-full h-full object-cover" />
      </div>

      {/* AI Bubble */}
      <div className={`relative px-4 py-3 rounded-2xl rounded-bl-sm max-w-[82%] text-sm font-body leading-relaxed ${
        isDark
          ? "bg-[#0d1a2e]/90 border border-cyan-500/20 text-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(103,232,249,0.1)] backdrop-blur"
          : "bg-white border border-blue-100 text-gray-800 shadow-md"
      }`}>
        {/* Top accent line */}
        {isDark && (
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rounded-full" />
        )}
        <div className={`leading-relaxed ${isDark ? "text-slate-200" : "text-gray-800"}`}>
          {parsedContent}
        </div>
        {/* Label tag */}
        {isDark && (
          <div className="mt-2 pt-2 border-t border-cyan-500/10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500/50 tracking-widest uppercase">NUMATIK AI</span>
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
