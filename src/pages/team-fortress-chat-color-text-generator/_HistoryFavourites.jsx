import { useState } from "react";

export default function HistoryFavourites({
  activeTab,
  setActiveTab,
  history,
  favourites,
  restoreFromHistory,
  copyFromHistory,
  toggleFavouriteEntry,
  deleteEntry,
  clearAllHistory,
  clearAllFavourites,
}) {
  const [showConfirmHistory, setShowConfirmHistory] = useState(false);
  const [showConfirmFavourites, setShowConfirmFavourites] = useState(false);
  const [scriptSelection, setScriptSelection] = useState([]);
  const [scriptCopied, setScriptCopied] = useState(false);

  const displayItems = activeTab === "history" ? history : favourites;
  const MAX_ENTRIES = 100;

  const handleClearAll = () => {
    if (activeTab === "history") {
      setShowConfirmHistory(true);
    } else {
      setShowConfirmFavourites(true);
    }
  };

  const confirmClear = () => {
    if (activeTab === "history") {
      clearAllHistory();
      setShowConfirmHistory(false);
    } else {
      clearAllFavourites();
      setScriptSelection([]); // Clear selection when clearing favourites
      setShowConfirmFavourites(false);
    }
  };

  const cancelClear = () => {
    setShowConfirmHistory(false);
    setShowConfirmFavourites(false);
  };

  const showModal = showConfirmHistory || showConfirmFavourites;

  // Check if entry is in favourites
  const isInFavourites = (entryId) => {
    return favourites.some((fav) => fav.id === entryId);
  };

  // Toggle selection for script generation
  const toggleScriptSelection = (entryId) => {
    setScriptSelection((prev) => {
      if (prev.includes(entryId)) {
        return prev.filter((id) => id !== entryId);
      } else {
        return [...prev, entryId];
      }
    });
  };

  // Generate and copy TF2 script
  const handleCopyScript = () => {
    if (scriptSelection.length === 0) return;

    // Filter favourites to get selected items in order
    // We map over 'favourites' to preserve the order they appear in the list
    const selectedItems = favourites.filter((fav) => scriptSelection.includes(fav.id));

    if (selectedItems.length === 0) return;

    // Generate script lines
    // alias "msg1" "say Wiadomosc 1; bind o msg2"
    // ...
    // alias "msgN" "say Wiadomosc N; bind o msg1"

    const scriptLines = selectedItems.map((item, index) => {
      const currentAlias = `msg${index + 1}`;
      const nextAlias = `msg${index + 1 === selectedItems.length ? 1 : index + 2}`;
      // Clean payload: remove newlines and escape quotes if necessary (basic escaping)
      const message = item.payload.replace(/"/g, "'").replace(/\n/g, " ");

      return `alias "${currentAlias}" "say ${message}; bind o ${nextAlias}"`;
    });

    // MODIFICATION: Join with newline character instead of space
    const script = scriptLines.join("\n");

    navigator.clipboard.writeText(script).then(() => {
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="bg-[#16181d] border border-slate-800/50 rounded-lg overflow-hidden flex flex-col max-h-256 xl2:max-h-[calc(100vh-2rem)]">
        {/* Tab Headers with Delete Button */}
        <div className="flex items-center border-b border-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
              activeTab === "history"
                ? "bg-slate-800/30 text-slate-300 border-b-2 border-orange-500"
                : "text-slate-500 hover:bg-slate-800/20"
            }`}
          >
            History ({history.length}/{MAX_ENTRIES})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("favourites")}
            className={`flex-1 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
              activeTab === "favourites"
                ? "bg-slate-800/30 text-slate-300 border-b-2 border-orange-500"
                : "text-slate-500 hover:bg-slate-800/20"
            }`}
          >
            Favourites ({favourites.length}/{MAX_ENTRIES})
          </button>

          {/* Script Copy Button (Only for Favourites) */}
          {activeTab === "favourites" && displayItems.length > 0 && (
            <button
              type="button"
              onClick={handleCopyScript}
              disabled={scriptSelection.length === 0}
              // MODIFICATION: Added 'relative' and fixed width to prevent layout shift
              className={`relative px-4 py-3 transition-colors border-l border-slate-800/50 w-[53px] flex items-center justify-center ${
                scriptSelection.length > 0
                  ? "text-green-500 hover:bg-green-900/20 cursor-pointer"
                  : "text-slate-700 cursor-not-allowed"
              }`}
              title={scriptCopied ? "Copied!" : "Copy TF2 Loop Script (Select items first)"}
            >
              {/* MODIFICATION: Absolute positioning for feedback to not affect layout */}
              <span
                className={`absolute inset-0 flex items-center justify-center font-bold text-[10px] transition-opacity duration-200 ${
                  scriptCopied ? "opacity-100" : "opacity-0"
                }`}
              >
                COPIED
              </span>
              <svg
                className={`w-5 h-5 transition-opacity duration-200 ${scriptCopied ? "opacity-0" : "opacity-100"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}

          {displayItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-slate-800/20 transition-colors border-l border-slate-800/50"
              title={`Clear all ${activeTab}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {displayItems.length === 0
            ? (
              <div className="p-8 text-center text-slate-600">
                {activeTab === "history"
                  ? "No history yet. Copy some text to get started!"
                  : "No favourites yet. Star some entries to save them!"}
              </div>
            )
            : (
              <div>
                {displayItems.map((entry) => {
                  const isFavourited = activeTab === "history" ? isInFavourites(entry.id) : true;
                  const isSelected = scriptSelection.includes(entry.id);

                  return (
                    <div
                      key={entry.id}
                      // MODIFICATION: 'items-center' ensures vertical centering of checkbox
                      className="p-4 hover:bg-slate-800/20 transition-colors flex items-center gap-3 border-b border-slate-800/50 last:border-0"
                    >
                      {/* Checkbox for Script Selection (Only in Favourites) */}
                      {activeTab === "favourites" && (
                        <div className="shrink-0 flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleScriptSelection(entry.id)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-orange-600 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer accent-orange-600"
                          />
                        </div>
                      )}

                      <div
                        className="flex-1 font-mono overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: entry.html }}
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavouriteEntry(entry.id, isFavourited)}
                        className={`shrink-0 w-8 h-8 flex items-center justify-center rounded shadow-md active:translate-y-0.5 transition-all ${
                          isFavourited
                            ? "bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/20"
                            : "bg-slate-700 hover:bg-slate-600 hover:shadow-slate-500/20"
                        }`}
                        title={isFavourited ? "Remove from favourites" : "Add to favourites"}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill={isFavourited ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={isFavourited ? 0 : 2}
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
                        onClick={() => deleteEntry(entry.id, activeTab === "favourites")}
                        className="shrink-0 w-8 h-8 flex items-center justify-center bg-red-900/20 hover:bg-red-900/30 rounded shadow-md hover:shadow-red-500/20 active:translate-y-0.5 transition-all border border-red-800/50 hover:border-red-700"
                        title="Delete entry"
                      >
                        <svg
                          className="w-4 h-4 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => restoreFromHistory(entry.html)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded shadow-md hover:shadow-slate-500/20 active:translate-y-0.5 transition-all"
                        title="Restore to editor"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyFromHistory(entry.payload)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 rounded shadow-md hover:shadow-orange-500/20 active:translate-y-0.5 transition-all"
                        title="Copy to clipboard"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#16181d] border border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-slate-200 mb-3">
              Confirm {activeTab === "history" ? "History" : "Favourites"} Deletion
            </h3>
            <p className="text-slate-400 mb-6">
              {activeTab === "history"
                ? "Do you really want to delete entire history?"
                : "Do you really want to delete entire list of your favourites?"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmClear}
                className="flex-1 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors uppercase tracking-wide"
              >
                Yes, Delete All
              </button>
              <button
                type="button"
                onClick={cancelClear}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
