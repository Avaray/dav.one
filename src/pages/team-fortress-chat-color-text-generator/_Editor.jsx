// src/pages/team-fortress-chat-color-text-generator/_Editor.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { COLOR_PALETTES, serializeEditorContent } from "./serializer.js";

export default function TF2Editor() {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);

  const [charCount, setCharCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeHex, setActiveHex] = useState("FFFFFF");

  // Helper do obliczania bajtów
  const calculateBytes = useCallback(() => {
    if (!editorRef.current) return;
    const tf2String = serializeEditorContent(editorRef.current);
    const blob = new Blob([tf2String]);
    setCharCount(blob.size);
  }, []);

  // Debounced update function
  // Używamy useRef, aby zachować timeout ID między renderami
  const debounceTimeout = useRef(null);

  const handleContentChange = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      calculateBytes();
    }, 100); // 100ms debounce
  };

  // Oblicz bajty przy załadowaniu
  useEffect(() => {
    calculateBytes();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [calculateBytes]);

  const applyColor = (hex) => {
    setActiveHex(hex);
    const selection = window.getSelection();
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
    // Możemy wywołać update tutaj, jeśli chcemy natychmiastowej reakcji na delete/backspace
    // ale onInput i tak to obsłuży
  };

  const handlePaste = (e) => {
    // Pozwalamy na wklejenie, ale wymuszamy przeliczenie z małym opóźnieniem,
    // żeby DOM zdążył się zaktualizować
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
    if (category === "Team Paints (Red/Blue)") {
      const reds = colors.filter((c) => c.type === "red");
      const blues = colors.filter((c) => c.type === "blue");

      return (
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center gap-1.5 pb-2 border-b border-white/5">
            {reds.map((color) => (
              <button
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-red-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {blues.map((color) => (
              <button
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-blue-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-1.5">
        {colors.map((color) => (
          <button
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
          <span className={`text-xs font-mono ${charCount > 127 ? "text-red-500 font-bold" : "text-slate-500"}`}>
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
            // KLUCZOWE ZMIANY EVENTÓW:
            onInput={handleContentChange} // To łapie każde wpisywanie, usuwanie
            onPaste={handlePaste} // Specjalna obsługa wklejania
            onKeyUp={handleContentChange} // Nawigacja strzałkami itp.
            onMouseUp={handleContentChange} // Zmiana zaznaczenia myszką
            onKeyDown={handleKeyDown}
            className="w-full h-full p-6 outline-none text-slate-200 overflow-auto custom-scrollbar whitespace-pre-wrap break-words"
            spellCheck={false}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          {charCount === 0 && (
            <div className="absolute top-6 left-6 text-slate-600 pointer-events-none select-none">
              Type here... Select text to colorize.
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
              onClick={removeColor}
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-400 rounded hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-colors"
            >
              RESET SELECTION
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-32 py-2 bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-sm rounded shadow-lg hover:shadow-orange-500/20 active:translate-y-0.5 transition-all flex justify-center items-center gap-2"
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
            className="bg-[#16181d] border border-slate-800/50 rounded-lg p-4 hover:border-slate-700 transition-colors flex flex-col h-full"
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
