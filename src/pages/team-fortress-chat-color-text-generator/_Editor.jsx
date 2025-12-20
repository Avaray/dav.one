import { useRef, useState } from "react";
import { COLOR_PALETTES, serializeEditorContent } from "./serializer.js";

export default function TF2Editor() {
  const editorRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeHex, setActiveHex] = useState(null);

  // Funkcja aplikująca kolor do zaznaczenia
  const applyColor = (hex) => {
    const selection = globalThis.getSelection();
    if (!selection.rangeCount) return;

    // Przywrócenie focusu na edytor
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Używamy execCommand 'foreColor'.
    // Jest to stara metoda, ale NAJLEPSZA do "inteligentnego" zarządzania spanami.
    // Przeglądarka sama rozdziela istniejące tagi i aplikuje nowy kolor tylko tam gdzie trzeba.
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, "#" + hex);

    setActiveHex(hex);
    calculateBytes();
  };

  const removeColor = () => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand("removeFormat", false, null); // Usuwa formatowanie
    calculateBytes();
  };

  // Obliczanie bajtów (Symulacja na żywo)
  const calculateBytes = () => {
    if (!editorRef.current) return;
    // Musimy zserializować treść, aby policzyć bajty w formacie TF2
    const tf2String = serializeEditorContent(editorRef.current);
    const blob = new Blob([tf2String]);
    setCharCount(blob.size);
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    const payload = serializeEditorContent(editorRef.current);

    // Hack z textarea do kopiowania bajtów sterujących
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

        {/* EDITOR AREA (ContentEditable) */}
        <div
          className="relative h-64 w-full text-lg font-mono leading-relaxed bg-[#16181d] cursor-text"
          onClick={() => editorRef.current?.focus()}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={calculateBytes}
            onMouseUp={calculateBytes} // Aktualizuj przy kliknięciu (zmiana kursora)
            onKeyUp={calculateBytes}
            className="w-full h-full p-6 outline-none text-slate-200 overflow-auto custom-scrollbar whitespace-pre-wrap wrap-break-word"
            spellCheck={false}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />

          {/* Placeholder (widoczny tylko gdy pusto) */}
          {charCount === 0 && (
            <div className="absolute top-6 left-6 text-slate-600 pointer-events-none select-none">
              Type here... Select text to colorize.
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-4 bg-[#1e2026] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-700 hover:border-slate-500 transition-colors">
              <div
                className="w-4 h-4 rounded-full border border-white/10"
                style={{
                  backgroundColor: activeHex ? `#${activeHex}` : "transparent",
                  background: !activeHex ? "linear-gradient(to top right, #3b82f6, #a855f7)" : undefined,
                }}
              >
              </div>
              <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => applyColor(e.target.value.replace("#", ""))}
              />
              <span className="text-xs font-bold text-slate-400">PICKER</span>
            </div>
            <button
              type="button"
              onClick={removeColor}
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-400 rounded hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-colors"
            >
              RESET SELECTION
            </button>
          </div>

          <button
            onClick={handleCopy}
            type="button"
            className="px-6 py-2 bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-sm rounded shadow-lg hover:shadow-orange-500/20 active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span>{copyFeedback ? "COPIED!" : "COPY TEXT"}</span>
          </button>
        </div>
      </div>

      {/* --- PALETTES GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(COLOR_PALETTES).map(([category, colors]) => (
          <div
            key={category}
            className="bg-[#16181d] border border-slate-800/50 rounded-lg p-3 hover:border-slate-700 transition-colors"
          >
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center border-b border-slate-800 pb-2">
              {category}
            </h3>
            <div className="flex flex-wrap justify-center gap-1.5">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => applyColor(color.hex)}
                  className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-slate-500 shadow-sm"
                  style={{ backgroundColor: `#${color.hex}` }}
                  title={color.name}
                  type="button"
                >
                </button>
              ))}
            </div>
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
