import { useState } from "react";

export default function HistoryFavourites({
  activeTab,
  setActiveTab,
  history,
  favourites,
  restoreFromHistory,
  copyFromHistory,
  toggleFavouriteEntry,
  clearAllHistory,
  clearAllFavourites,
}) {
  const [showConfirmHistory, setShowConfirmHistory] = useState(false);
  const [showConfirmFavourites, setShowConfirmFavourites] = useState(false);

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
      setShowConfirmFavourites(false);
    }
  };

  const cancelClear = () => {
    setShowConfirmHistory(false);
    setShowConfirmFavourites(false);
  };

  return (
    <div className="bg-[#16181d] border border-slate-800/50 rounded-lg overflow-hidden flex flex-col h-[calc(100vh-2rem)]">
      {/* Tab Headers */}
      <div className="flex border-b border-slate-800/50 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
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
          className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
            activeTab === "favourites"
              ? "bg-slate-800/30 text-slate-300 border-b-2 border-orange-500"
              : "text-slate-500 hover:bg-slate-800/20"
          }`}
        >
          Favourites ({favourites.length}/{MAX_ENTRIES})
        </button>
      </div>

      {/* Clear All Button */}
      {displayItems.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full px-3 py-1.5 text-xs font-bold bg-red-900/20 text-red-400 rounded hover:bg-red-900/30 border border-red-800/50 hover:border-red-700 transition-colors uppercase tracking-wide"
          >
            Clear All {activeTab === "history" ? "History" : "Favourites"}
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {(showConfirmHistory || showConfirmFavourites) && (
        <div className="px-4 py-3 bg-red-900/10 border-b border-red-800/50 shrink-0">
          <p className="text-sm text-red-300 mb-3 text-center">
            Are you sure you want to clear all {activeTab === "history" ? "history" : "favourites"}?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirmClear}
              className="flex-1 px-3 py-1.5 text-xs font-bold bg-red-700 text-white rounded hover:bg-red-600 transition-colors uppercase tracking-wide"
            >
              Yes, Clear All
            </button>
            <button
              type="button"
              onClick={cancelClear}
              className="flex-1 px-3 py-1.5 text-xs font-bold bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {displayItems.length === 0
          ? (
            <div className="p-8 text-center text-slate-600 text-sm">
              {activeTab === "history"
                ? "No history yet. Copy some text to get started!"
                : "No favourites yet. Star some entries to save them!"}
            </div>
          )
          : (
            <div className="divide-y divide-slate-800/50">
              {displayItems.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-slate-800/20 transition-colors flex items-center gap-3"
                >
                  <div
                    className="flex-1 font-mono text-sm overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: entry.html }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavouriteEntry(entry.id)}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded shadow-md active:translate-y-0.5 transition-all ${
                      entry.isFavourite
                        ? "bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:shadow-orange-500/20"
                        : "bg-slate-700 hover:bg-slate-600 hover:shadow-slate-500/20"
                    }`}
                    title={entry.isFavourite ? "Remove from favourites" : "Add to favourites"}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill={entry.isFavourite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={entry.isFavourite ? 0 : 2}
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
                    className="shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 rounded shadow-md hover:shadow-orange-500/20 active:translate-y-0.5 transition-all"
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
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
