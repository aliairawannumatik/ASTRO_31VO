import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Calculator, ChevronLeft, ChevronRight, History, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { evaluate, pi, e as eulerE, factorial, sqrt, log, log10, sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh, abs, ceil, floor, round, gcd, lcm, mod, nthRoot, pow, exp, combinations, permutations } from "mathjs";

type AngleMode = "DEG" | "RAD";
type DisplayMode = "NORM" | "MATH" | "FRAC";

type HistoryItem = {
  expression: string;
  displayExpression: string;
  result: string;
  timestamp: number;
};

// Format expression for display with proper math rendering
const formatDisplayExpression = (expr: string): string => {
  let formatted = expr;
  // Keep expression as-is for display, mathjs will handle evaluation
  return formatted;
};

// Convert display expression to mathjs compatible expression
const toMathJsExpression = (expr: string, angleMode: AngleMode): string => {
  let mathExpr = expr;
  
  // Replace display symbols with mathjs functions
  mathExpr = mathExpr.replace(/×/g, "*");
  mathExpr = mathExpr.replace(/÷/g, "/");
  mathExpr = mathExpr.replace(/−/g, "-");
  mathExpr = mathExpr.replace(/π/g, "(pi)");
  mathExpr = mathExpr.replace(/√\(/g, "sqrt(");
  mathExpr = mathExpr.replace(/∛\(/g, "cbrt(");
  // Convert superscript numbers to ^ notation
  mathExpr = mathExpr.replace(/²/g, "^2");
  mathExpr = mathExpr.replace(/³/g, "^3");
  mathExpr = mathExpr.replace(/⁻¹/g, "^(-1)");
  mathExpr = mathExpr.replace(/\^/g, "^");
  mathExpr = mathExpr.replace(/(\d+)!/g, "factorial($1)");
  mathExpr = mathExpr.replace(/Ans/g, "0"); // Will be replaced with actual answer
  // Replace log display with mathjs functions
  mathExpr = mathExpr.replace(/log₁₀\(/g, "log10(");
  mathExpr = mathExpr.replace(/10\^\(/g, "10^(");
  // e^( → exp(  (consume the opening paren to avoid double paren)
  mathExpr = mathExpr.replace(/e\^\(/g, "exp(");
  // fallback: bare e^ without paren
  mathExpr = mathExpr.replace(/e\^/g, "exp(");

  // Auto-close any unclosed parentheses (so user doesn't need to close ^ expressions manually)
  const openCount = (mathExpr.match(/\(/g) || []).length;
  const closeCount = (mathExpr.match(/\)/g) || []).length;
  const diff = openCount - closeCount;
  if (diff > 0) {
    mathExpr += ")".repeat(diff);
  }

  // Handle angle conversions for trig functions
  if (angleMode === "DEG") {
    // Wrap trig function arguments with degree to radian conversion
    const trigFuncs = ["sin", "cos", "tan"];
    trigFuncs.forEach(func => {
      const regex = new RegExp(`${func}\\(([^)]+)\\)`, "g");
      mathExpr = mathExpr.replace(regex, `${func}(($1) * pi / 180)`);
    });
    
    // Inverse trig functions need radian to degree conversion
    const invTrigFuncs = ["asin", "acos", "atan"];
    invTrigFuncs.forEach(func => {
      const regex = new RegExp(`${func}\\(([^)]+)\\)`, "g");
      mathExpr = mathExpr.replace(regex, `(${func}($1) * 180 / pi)`);
    });
  }
  
  return mathExpr;
};

// Format result as fraction if possible
const formatAsFraction = (value: number): { numerator: number; denominator: number } | null => {
  if (!Number.isFinite(value) || Math.abs(value) > 1000000) return null;
  
  const tolerance = 1e-10;
  let numerator = value;
  let denominator = 1;
  
  while (Math.abs(numerator - Math.round(numerator)) > tolerance && denominator < 10000) {
    numerator *= 10;
    denominator *= 10;
  }
  
  numerator = Math.round(numerator);
  
  // Find GCD
  const findGCD = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };
  
  const gcdVal = findGCD(numerator, denominator);
  numerator /= gcdVal;
  denominator /= gcdVal;
  
  if (denominator === 1 || denominator > 1000) return null;
  
  return { numerator, denominator };
};

const formatResult = (value: number, displayMode: DisplayMode): string => {
  if (!Number.isFinite(value)) return "Error";
  
  if (displayMode === "FRAC") {
    const frac = formatAsFraction(value);
    if (frac && frac.denominator !== 1) {
      return `${frac.numerator}/${frac.denominator}`;
    }
  }
  
  const rounded = parseFloat(value.toPrecision(12));
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
};

// Cursor element shown between characters (blinking caret)
const CursorCaret = () => (
  <span
    aria-hidden="true"
    className="inline-block w-[2px] h-[1em] bg-cyan-300 align-middle mx-[1px] animate-pulse"
  />
);

// Render expression string with proper superscripts for ^(...) notation,
// with a clickable cursor and per-character click handlers for editing.
const renderExpression = (
  expr: string,
  cursorPos: number,
  onSetCursor: (pos: number) => void
): React.ReactNode => {
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const charSpan = (ch: string, idx: number) => (
    <span
      key={`c-${idx}`}
      onClick={(e) => {
        e.stopPropagation();
        onSetCursor(idx);
      }}
      className="cursor-text select-none"
    >
      {ch}
    </span>
  );

  while (i < expr.length) {
    // Render cursor before this position if needed
    if (i === cursorPos) {
      elements.push(<CursorCaret key={`cur-${i}-${key++}`} />);
    }

    if (expr[i] === "^" && i + 1 < expr.length && expr[i + 1] === "(") {
      const caretIdx = i; // position of "^"
      const openIdx = i + 1; // position of "("
      i += 2; // skip ^(
      let depth = 1;
      const innerChars: { ch: string; idx: number }[] = [];
      while (i < expr.length) {
        if (expr[i] === "(") depth++;
        else if (expr[i] === ")") {
          depth--;
          if (depth === 0) break;
        }
        innerChars.push({ ch: expr[i], idx: i });
        i++;
      }
      const closeIdx = i; // position of ")" (or end)
      const hasClose = i < expr.length;
      if (hasClose) i++; // skip closing )

      // Tiny invisible anchor so user can place cursor BEFORE the superscript by clicking the "^"
      elements.push(
        <span
          key={`hat-${caretIdx}`}
          onClick={(e) => {
            e.stopPropagation();
            onSetCursor(caretIdx);
          }}
          className="cursor-text select-none text-cyan-300/30"
        >
          ^
        </span>
      );

      // Superscript block — clickable per character, with cursor support inside
      elements.push(
        <sup
          key={`sup-${key++}`}
          className="text-[0.6em] leading-none text-yellow-200"
          onClick={(e) => {
            // clicking empty area inside the sup → place cursor at end of exponent
            e.stopPropagation();
            onSetCursor(closeIdx);
          }}
        >
          {/* cursor at start of exponent */}
          {cursorPos === openIdx + 1 && <CursorCaret />}
          {innerChars.length === 0 && cursorPos !== openIdx + 1 && cursorPos !== closeIdx && (
            <span className="text-yellow-200/60">▮</span>
          )}
          {innerChars.map(({ ch, idx }) => (
            <Fragment key={`sc-${idx}`}>
              {charSpan(ch, idx)}
              {cursorPos === idx + 1 && <CursorCaret />}
            </Fragment>
          ))}
        </sup>
      );
    } else {
      elements.push(charSpan(expr[i], i));
      i++;
    }
  }

  // Cursor at end of expression
  if (cursorPos >= expr.length) {
    elements.push(<CursorCaret key={`cur-end-${key++}`} />);
  }

  return elements.length > 0 ? <>{elements}</> : <CursorCaret />;
};

const KalkulatorScientificPage = () => {
  const navigate = useNavigate();
  const [expression, setExpression] = useState<string>("");
  const [displayExpression, setDisplayExpression] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("MATH");
  const [shiftMode, setShiftMode] = useState(false);
  const [alphaMode, setAlphaMode] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [lastAnswer, setLastAnswer] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLivePreview, setIsLivePreview] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  // Refs that always hold the latest values, used inside event handlers
  // to avoid stale closures (so we don't have to re-attach the keyboard
  // listener on every keystroke).
  const expressionRef = useRef(expression);
  const cursorRef = useRef(cursorPosition);
  useEffect(() => {
    expressionRef.current = expression;
  }, [expression]);
  useEffect(() => {
    cursorRef.current = cursorPosition;
  }, [cursorPosition]);

  // Insert a string at the current cursor position and advance the cursor.
  const insertAtCursor = useCallback((value: string) => {
    const expr = expressionRef.current;
    const pos = Math.min(Math.max(cursorRef.current, 0), expr.length);
    const next = expr.slice(0, pos) + value + expr.slice(pos);
    setExpression(next);
    setCursorPosition(pos + value.length);
  }, []);

  // Funcs that we delete as a single token (e.g. "sin(")
  const TOKEN_FUNCS = [
    "asinh(", "acosh(", "atanh(",
    "asin(", "acos(", "atan(",
    "sinh(", "cosh(", "tanh(",
    "log₁₀(", "ln(", "sin(", "cos(", "tan(",
    "abs(", "Exp(", "exp(",
    "10^(", "e^(", "^(1/", "√(", "∛(",
  ];

  const handleClearAll = () => {
    playPopSound();
    setExpression("");
    setDisplayExpression("");
    setResult("0");
    setCursorPosition(0);
    setIsLivePreview(false);
  };

  // Live evaluation: compute result as the user types, even before "=" is pressed.
  // Errors from incomplete/invalid expressions are silenced — the previous result
  // simply remains until the expression becomes valid again.
  useEffect(() => {
    if (!expression.trim()) {
      setResult("0");
      setIsLivePreview(false);
      return;
    }
    try {
      let mathExpr = toMathJsExpression(expression, angleMode);
      mathExpr = mathExpr.replace(/Ans/g, lastAnswer.toString());
      const value = evaluate(mathExpr);
      const numValue = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(numValue)) return;
      setResult(formatResult(numValue, displayMode));
      setIsLivePreview(true);
    } catch {
      // ignore — keep showing the last valid result while user is still typing
    }
  }, [expression, angleMode, displayMode, lastAnswer]);

  const handleDelete = () => {
    playPopSound();
    const expr = expressionRef.current;
    const pos = cursorRef.current;
    if (pos <= 0 || expr.length === 0) return;

    // Try to delete a multi-character token immediately before the cursor
    let deletedLen = 0;
    for (const func of TOKEN_FUNCS) {
      if (pos >= func.length && expr.slice(pos - func.length, pos) === func) {
        deletedLen = func.length;
        break;
      }
    }
    if (deletedLen === 0) deletedLen = 1;

    const next = expr.slice(0, pos - deletedLen) + expr.slice(pos);
    setExpression(next);
    setCursorPosition(pos - deletedLen);
  };

  const moveCursor = useCallback((delta: number) => {
    const expr = expressionRef.current;
    setCursorPosition((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > expr.length) return expr.length;
      return next;
    });
  }, []);

  const handleInput = useCallback((value: string) => {
    playPopSound();
    insertAtCursor(value);
    setShiftMode(false);
    setAlphaMode(false);
  }, [insertAtCursor]);

  const handleFunction = useCallback((func: string, displayFunc?: string) => {
    playPopSound();
    const displayText = displayFunc || func;
    insertAtCursor(displayText + "(");
    setShiftMode(false);
    setAlphaMode(false);
  }, [insertAtCursor]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleInput(e.key);
      } else if (e.key === ".") {
        handleInput(".");
      } else if (e.key === "+") {
        handleInput("+");
      } else if (e.key === "-") {
        handleInput("−");
      } else if (e.key === "*") {
        handleInput("×");
      } else if (e.key === "/") {
        handleInput("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEqual();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape") {
        handleClearAll();
      } else if (e.key === "(") {
        handleInput("(");
      } else if (e.key === ")") {
        handleInput(")");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveCursor(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveCursor(1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setCursorPosition(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCursorPosition(expressionRef.current.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, moveCursor]);

  const handleEqual = () => {
    playPopSound();
    if (!expression.trim()) return;
    
    try {
      let mathExpr = toMathJsExpression(expression, angleMode);
      mathExpr = mathExpr.replace(/Ans/g, lastAnswer.toString());
      
      const value = evaluate(mathExpr);
      const numValue = typeof value === "number" ? value : Number(value);
      
      if (!Number.isFinite(numValue)) {
        setResult("Error");
        return;
      }
      
      const formatted = formatResult(numValue, displayMode);
      setResult(formatted);
      setLastAnswer(numValue);
      setIsLivePreview(false);
      
      setHistory(prev => [
        { 
          expression, 
          displayExpression: expression,
          result: formatted, 
          timestamp: Date.now() 
        },
        ...prev
      ].slice(0, 50));
      
    } catch (err) {
      setResult("Syntax Error");
    }
  };

  const toggleAngleMode = () => {
    playPopSound();
    setAngleMode(prev => prev === "DEG" ? "RAD" : "DEG");
  };

  const toggleDisplayMode = () => {
    playPopSound();
    setDisplayMode(prev => {
      if (prev === "NORM") return "MATH";
      if (prev === "MATH") return "FRAC";
      return "NORM";
    });
  };

  const handleShift = () => {
    playPopSound();
    setShiftMode(prev => !prev);
    setAlphaMode(false);
  };

  const handleAlpha = () => {
    playPopSound();
    setAlphaMode(prev => !prev);
    setShiftMode(false);
  };

  const handleMemoryPlus = () => {
    playPopSound();
    const current = parseFloat(result);
    if (!Number.isNaN(current)) {
      setMemory(prev => prev + current);
    }
  };

  const handleMemoryMinus = () => {
    playPopSound();
    const current = parseFloat(result);
    if (!Number.isNaN(current)) {
      setMemory(prev => prev - current);
    }
  };

  const handleMemoryRecall = () => {
    playPopSound();
    insertAtCursor(memory.toString());
  };

  const handleMemoryClear = () => {
    playPopSound();
    setMemory(0);
  };

  const handleAns = () => {
    playPopSound();
    insertAtCursor("Ans");
  };

  const handleHistorySelect = (item: HistoryItem) => {
    playPopSound();
    setExpression(item.expression);
    setCursorPosition(item.expression.length);
    setResult(item.result);
    setShowHistory(false);
  };

  // Render fraction display
  const renderFractionDisplay = (value: string) => {
    if (value.includes("/")) {
      const parts = value.split("/");
      if (parts.length === 2) {
        return (
          <div className="inline-flex flex-col items-center justify-center mx-1">
            <span className="text-2xl border-b border-cyan-400/60 px-1 leading-tight">{parts[0]}</span>
            <span className="text-2xl px-1 leading-tight">{parts[1]}</span>
          </div>
        );
      }
    }
    return <span>{value}</span>;
  };

  // Vibration function
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // Button component for calculator
  const CalcButton = ({ 
    children, 
    onClick, 
    className = "", 
    subLabel = "",
    subLabelColor = "text-amber-400",
    disabled = false 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
    subLabel?: string;
    subLabelColor?: string;
    disabled?: boolean;
  }) => {
    const handleClick = () => {
      vibrate();
      onClick();
    };
    
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative flex flex-col items-center justify-center rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {subLabel && (
          <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-medium ${subLabelColor} whitespace-nowrap`}>
            {subLabel}
          </span>
        )}
        {children}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      
      <div className="relative z-10 w-full max-w-md px-2 py-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-400/40">
              <Calculator className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-cyan-400 text-glow-cyan tracking-wide">
                SCIENTIFIC CALCULATOR
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Indicators */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 text-[10px] font-mono">
          <div className="flex items-center gap-3">
            <button onClick={toggleDisplayMode} className="text-white/60 hover:text-white transition-colors">
              <span className={displayMode === "NORM" ? "text-cyan-400" : ""}>NORM</span>
              {" "}
              <span className={displayMode === "MATH" ? "text-cyan-400" : ""}>MATH</span>
              {" "}
              <span className={displayMode === "FRAC" ? "text-cyan-400" : ""}>FRAC</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            {memory !== 0 && <span className="text-amber-400">M</span>}
            <span className={`px-1.5 py-0.5 rounded ${angleMode === "DEG" ? "bg-cyan-500/30 text-cyan-400" : "bg-purple-500/30 text-purple-400"}`}>
              {angleMode}
            </span>
          </div>
        </div>

        {/* Display */}
        <div className="mx-2 mb-3 rounded-xl bg-gradient-to-b from-cyan-900/20 to-slate-900/40 border border-cyan-500/20 p-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
          <div
            ref={displayRef}
            className="min-h-[100px] flex flex-col justify-end text-right font-mono"
          >
            {/* Expression — tap anywhere to place cursor; tap a character to place
                cursor before it. Empty area sets cursor at end. */}
            <div
              role="textbox"
              aria-label="Expression editor — tap to position cursor"
              onClick={() => setCursorPosition(expression.length)}
              className="text-xl text-cyan-300/90 break-all leading-relaxed mb-2 overflow-x-auto tracking-wide cursor-text min-h-[1.75rem]"
            >
              {renderExpression(expression, cursorPosition, (pos) => setCursorPosition(pos))}
            </div>
            {/* Result — live preview shown in cyan while typing, white after "=" */}
            <div className={`text-4xl font-bold flex items-center justify-end gap-1 ${isLivePreview ? "text-cyan-300/80" : "text-white"}`}>
              {displayMode === "FRAC" && result.includes("/") ? (
                <>
                  <span className={`mr-1 ${isLivePreview ? "text-cyan-300/50" : "text-white/50"}`}>=</span>
                  {renderFractionDisplay(result)}
                </>
              ) : (
                <>
                  {expression && <span className={isLivePreview ? "text-cyan-300/50" : "text-white/50"}>=</span>}
                  <span className="ml-1">{result}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="absolute top-32 left-2 right-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3 max-h-[300px] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-cyan-400">History</h3>
              <button onClick={() => setShowHistory(false)} className="text-white/50 hover:text-white text-xs">
                Close
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-white/40">No history yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button
                    key={item.timestamp}
                    onClick={() => handleHistorySelect(item)}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <div className="text-xs text-white/50 font-mono truncate">{item.expression}</div>
                    <div className="text-sm text-cyan-400 font-semibold">= {item.result}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calculator Buttons */}
        <div className="mx-1 space-y-1.5">
          {/* Row 1: Mode buttons */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={handleShift}
              className={`h-9 text-xs ${shiftMode ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]" : "bg-purple-500/30 text-purple-300 border border-purple-500/50"}`}
            >
              SHIFT
            </CalcButton>
            <CalcButton
              onClick={handleAlpha}
              className={`h-9 text-xs ${alphaMode ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "bg-blue-500/30 text-blue-300 border border-blue-500/50"}`}
            >
              ALPHA
            </CalcButton>
            <CalcButton onClick={() => { playPopSound(); moveCursor(-1); }} className="h-9 text-white/80 bg-slate-700/50 border border-white/10 hover:bg-slate-600/60">
              <ChevronLeft className="w-4 h-4" />
            </CalcButton>
            <CalcButton onClick={() => { playPopSound(); moveCursor(1); }} className="h-9 text-white/80 bg-slate-700/50 border border-white/10 hover:bg-slate-600/60">
              <ChevronRight className="w-4 h-4" />
            </CalcButton>
            <CalcButton onClick={toggleDisplayMode} className="h-9 text-xs text-white/80 bg-slate-700/50 border border-white/10">
              MODE
            </CalcButton>
            <CalcButton
              onClick={toggleAngleMode}
              className="h-9 text-xs bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
            >
              {angleMode}
            </CalcButton>
          </div>

          {/* Row 2: Scientific functions */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => shiftMode ? handleFunction("asin") : handleFunction("sin")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "sin⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "sin⁻¹" : "sin"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleFunction("acos") : handleFunction("cos")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "cos⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "cos⁻¹" : "cos"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleFunction("atan") : handleFunction("tan")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "tan⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "tan⁻¹" : "tan"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("10^(") : handleFunction("log10", "log₁₀")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "10ˣ"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "10ˣ" : "log"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("e^(") : handleFunction("log", "ln")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "eˣ"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "eˣ" : "ln"}
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("⁻¹")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
            >
              x⁻¹
            </CalcButton>
          </div>

          {/* Row 3: More scientific */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => shiftMode ? handleFunction("cbrt", "∛") : handleFunction("sqrt", "√")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "∛"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "∛" : "√"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("³") : handleInput("²")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "x³"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "x³" : "x²"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("^(1/") : handleInput("^(")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "ʸ√x"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "ʸ√x" : "xʸ"}
            </CalcButton>
            <CalcButton
              onClick={() => handleFunction("abs")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "Pol"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "Pol" : "|x|"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("e") : handleInput("π")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "e"}
              subLabelColor="text-amber-400"
            >
              {shiftMode ? "e" : "π"}
            </CalcButton>
            <CalcButton
              onClick={() => handleFunction("exp")}
              className="h-10 text-xs bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
            >
              Exp
            </CalcButton>
          </div>

          {/* Row 4: Hyperbolic / Special */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => shiftMode ? handleFunction("asinh") : handleFunction("sinh")}
              className="h-10 text-[10px] bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "sinh⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "sinh⁻¹" : "sinh"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleFunction("acosh") : handleFunction("cosh")}
              className="h-10 text-[10px] bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "cosh⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "cosh⁻¹" : "cosh"}
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleFunction("atanh") : handleFunction("tanh")}
              className="h-10 text-[10px] bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "tanh⁻¹"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "tanh⁻¹" : "tanh"}
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("(")}
              className="h-10 text-sm bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
            >
              (
            </CalcButton>
            <CalcButton
              onClick={() => handleInput(")")}
              className="h-10 text-sm bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
            >
              )
            </CalcButton>
            <CalcButton
              onClick={() => shiftMode ? handleInput("nPr") : handleInput("!")}
              className="h-10 text-sm bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600/60"
              subLabel={shiftMode ? "" : "nPr"}
              subLabelColor="text-amber-400"
            >
              {shiftMode ? "nPr" : "x!"}
            </CalcButton>
          </div>

          {/* Row 5: Memory and numbers */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => shiftMode ? handleMemoryClear() : handleMemoryRecall()}
              className="h-11 text-xs bg-slate-800/70 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700/70"
              subLabel={shiftMode ? "" : "STO"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "STO" : "RCL"}
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("7")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="MATRIX"
              subLabelColor="text-amber-400"
            >
              7
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("8")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="VECTOR"
              subLabelColor="text-amber-400"
            >
              8
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("9")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="FUNC"
              subLabelColor="text-amber-400"
            >
              9
            </CalcButton>
            <CalcButton
              onClick={handleDelete}
              className="h-11 text-sm bg-purple-600/60 text-white border border-purple-500/50 hover:bg-purple-500/60"
            >
              DEL
            </CalcButton>
            <CalcButton
              onClick={handleClearAll}
              className="h-11 text-sm font-bold bg-orange-500/80 text-white border border-orange-400/50 hover:bg-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              AC
            </CalcButton>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => shiftMode ? handleMemoryMinus() : handleMemoryPlus()}
              className="h-11 text-xs bg-slate-800/70 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700/70"
              subLabel={shiftMode ? "" : "M-"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "M-" : "M+"}
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("4")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="STAT"
              subLabelColor="text-amber-400"
            >
              4
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("5")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="CMPLX"
              subLabelColor="text-amber-400"
            >
              5
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("6")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="DISTR"
              subLabelColor="text-amber-400"
            >
              6
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("×")}
              className="h-11 text-lg bg-slate-700/70 text-cyan-400 border border-cyan-500/30 hover:bg-slate-600/70"
            >
              ×
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("÷")}
              className="h-11 text-lg bg-slate-700/70 text-cyan-400 border border-cyan-500/30 hover:bg-slate-600/70"
            >
              ÷
            </CalcButton>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={handleMemoryMinus}
              className="h-11 text-xs bg-slate-800/70 text-rose-400 border border-rose-500/30 hover:bg-slate-700/70"
            >
              M−
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("1")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="COPY"
              subLabelColor="text-amber-400"
            >
              1
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("2")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="PASTE"
              subLabelColor="text-amber-400"
            >
              2
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("3")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="Ran#"
              subLabelColor="text-amber-400"
            >
              3
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("+")}
              className="h-11 text-lg bg-slate-700/70 text-cyan-400 border border-cyan-500/30 hover:bg-slate-600/70"
            >
              +
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("−")}
              className="h-11 text-lg bg-slate-700/70 text-cyan-400 border border-cyan-500/30 hover:bg-slate-600/70"
            >
              −
            </CalcButton>
          </div>

          {/* Row 8 */}
          <div className="grid grid-cols-6 gap-1">
            <CalcButton
              onClick={() => handleInput("0")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
            >
              0
            </CalcButton>
            <CalcButton
              onClick={() => handleInput(".")}
              className="h-11 text-lg font-bold bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="π"
              subLabelColor="text-amber-400"
            >
              .
            </CalcButton>
            <CalcButton
              onClick={() => handleInput("E")}
              className="h-11 text-sm bg-slate-800/80 text-white border border-white/10 hover:bg-slate-700/80"
              subLabel="e"
              subLabelColor="text-amber-400"
            >
              Exp
            </CalcButton>
            <CalcButton
              onClick={() => { playPopSound(); if (shiftMode) { insertAtCursor(lastAnswer.toString()); } else { handleAns(); } setShiftMode(false); }}
              className="h-11 text-sm bg-slate-800/80 text-amber-400 border border-amber-500/30 hover:bg-slate-700/80"
              subLabel={shiftMode ? "" : "PreAns"}
              subLabelColor="text-purple-400"
            >
              {shiftMode ? "PreAns" : "Ans"}
            </CalcButton>
            <CalcButton
              onClick={handleEqual}
              className="col-span-2 h-11 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white border border-orange-400/50 hover:from-orange-400 hover:to-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            >
              =
            </CalcButton>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              navigate("/menu");
            }}
            className="text-xs text-white/50 hover:text-cyan-400 transition-colors font-body flex items-center gap-1"
          >
            <ChevronLeft className="w-3 h-3" />
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default KalkulatorScientificPage;
