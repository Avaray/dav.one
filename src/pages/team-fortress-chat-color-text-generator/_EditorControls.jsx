export default function EditorControls({
  activeHex,
  triggerColorPicker,
  colorInputRef,
  applyColor,
  removeColor,
  handleCopy,
  toggleFavourite,
  isFavourite,
  copyFeedback,
}) {
  return (
    <div className="p-4 bg-[#1e2026] border border-slate-800 rounded-xl mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Color Picker Button */}
        <div
          onClick={triggerColorPicker}
          className="relative group cursor-pointer flex items-center justify-center gap-2 px-3 py-1.5 bg-black/40 rounded border border-slate-700 hover:border-slate-500 transition-colors select-none"
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
          <span className="font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wide">
            Color Picker
          </span>
        </div>

        <button
          type="button"
          onClick={removeColor}
          className="px-3 py-1.5 font-bold bg-slate-800 text-slate-400 rounded hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-colors select-none uppercase tracking-wide"
        >
          Reset Color
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleFavourite}
          className={`w-10 h-10 flex items-center justify-center rounded shadow-md active:translate-y-0.5 transition-all ${
            isFavourite
              ? "bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/20"
              : "bg-slate-700 hover:bg-slate-600 hover:shadow-slate-500/20"
          }`}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          <svg
            className="w-5 h-5 text-white"
            fill={isFavourite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="w-32 py-2 bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded shadow-lg hover:shadow-orange-500/20 active:translate-y-0.5 transition-all flex justify-center items-center gap-2 select-none"
        >
          <span>{copyFeedback ? "COPIED!" : "COPY TEXT"}</span>
        </button>
      </div>
    </div>
  );
}
