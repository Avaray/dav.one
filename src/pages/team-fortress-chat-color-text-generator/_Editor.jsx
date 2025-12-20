import { useCallback, useEffect, useRef, useState } from "react";
import { COLOR_PALETTES, serializeEditorContent } from "./serializer.js";

export default function TF2Editor() {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);

  const [charCount, setCharCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeHex, setActiveHex] = useState("FFFFFF");

  // Helper to calculate bytes
  const calculateBytes = useCallback(() => {
    if (!editorRef.current) return;
    const tf2String = serializeEditorContent(editorRef.current);
    const blob = new Blob([tf2String]);
    setCharCount(blob.size);
  }, []);

  // Debounced update function
  // We use useRef to keep timeout ID between renders
  const debounceTimeout = useRef(null);

  const handleContentChange = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      calculateBytes();
    }, 100); // 100ms debounce
  };

  // Calculate bytes on load
  useEffect(() => {
    calculateBytes();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [calculateBytes]);

  const applyColor = (hex) => {
    setActiveHex(hex);
    const selection = globalThis.getSelection();
    if (!selection.rangeCount) return;

    if (editorRef.current) {
      editorRef.current.focus();
    }

    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, "#" + hex);

    // Trigger immediate update after color change
    calculateBytes();
  };

  const triggerColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const removeColor = () => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand("removeFormat", false, null);
    calculateBytes();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    // We could trigger update here if we want immediate reaction to delete/backspace
    // but onInput handles that anyway
  };

  const handlePaste = (_e) => {
    // Allow paste, but force recalculation with a small delay,
    // so the DOM has time to update
    setTimeout(calculateBytes, 0);
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    const payload = serializeEditorContent(editorRef.current);

    const textArea = document.createElement("textarea");
    textArea.value = payload;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(textArea);
  };

  const renderColorGrid = (category, colors) => {
    // Special handling for Team Paints - split into Red and Blue sections
    if (category === "Team Paints") {
      const reds = colors.filter((c) => c.type === "red");
      const blues = colors.filter((c) => c.type === "blue");

      return (
        <>
          {/* RED SECTION */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {reds.map((color) => (
              <button
                type="button"
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-red-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>

          <hr className="my-3 border-slate-800" />

          {/* BLUE SECTION */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {blues.map((color) => (
              <button
                type="button"
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-blue-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>
        </>
      );
    }

    // Standard grid for other categories
    return (
      <div className="flex flex-wrap justify-center gap-1.5">
        {colors.map((color) => (
          <button
            type="button"
            key={color.hex}
            onClick={() => applyColor(color.hex)}
            className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-slate-500 shadow-sm"
            style={{ backgroundColor: `#${color.hex}` }}
            title={color.name}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* --- EDITOR STACK --- */}
      <div className="relative w-full bg-[#16181d] border border-slate-800 rounded-xl shadow-2xl overflow-hidden group">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#1e2026] border-b border-slate-800">
          <div className="flex gap-2 opacity-50">
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          </div>
          <span
            className={`text-xs font-mono select-none ${charCount > 127 ? "text-red-500 font-bold" : "text-slate-500"}`}
          >
            {charCount}/127 bytes
          </span>
        </div>

        {/* EDITOR AREA */}
        <div
          className="relative h-32 w-full text-lg font-mono leading-relaxed bg-[#16181d] cursor-text"
          onClick={() => editorRef.current?.focus()}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onPaste={handlePaste}
            onKeyUp={handleContentChange}
            onMouseUp={handleContentChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-6 outline-none text-slate-200 overflow-auto custom-scrollbar whitespace-pre-wrap wrap-break-word"
            spellCheck={false}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          {charCount === 0 && (
            <div className="absolute top-6 left-6 text-slate-600 pointer-events-none select-none">
              Type here... Then select text to colorize.
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-4 bg-[#1e2026] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Color Picker Button */}
            <div
              onClick={triggerColorPicker}
              className="relative group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-700 hover:border-slate-500 transition-colors select-none"
            >
              <div
                className="w-4 h-4 rounded-full border border-white/10 shadow-sm transition-colors duration-300"
                style={{ backgroundColor: `#${activeHex}` }}
              >
              </div>

              <input
                ref={colorInputRef}
                type="color"
                className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
                value={`#${activeHex}`}
                onChange={(e) => applyColor(e.target.value.replace("#", "").toUpperCase())}
              />
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                COLOR PICKER
              </span>
            </div>

            <button
              type="button"
              onClick={removeColor}
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-400 rounded hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-colors select-none"
            >
              RESET SELECTION
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-32 py-2 bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-sm rounded shadow-lg hover:shadow-orange-500/20 active:translate-y-0.5 transition-all flex justify-center items-center gap-2 select-none"
          >
            <span>{copyFeedback ? "COPIED!" : "COPY TEXT"}</span>
          </button>
        </div>
      </div>

      {/* --- PALETTES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(COLOR_PALETTES).map(([category, colors]) => (
          <div
            key={category}
            className="bg-[#16181d] border border-slate-800/50 rounded-lg p-4 hover:border-slate-700 transition-colors flex flex-col h-full select-none"
          >
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center border-b border-slate-800 pb-2">
              {category}
            </h3>
            {renderColorGrid(category, colors)}
          </div>
        ))}
      </div>

      <footer className="text-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-xs text-slate-500">
          Works in <span className="text-slate-300">Team Chat</span> and{" "}
          <span className="text-slate-300">Dead Chat</span>.
        </p>
      </footer>
    </div>
  );
}
