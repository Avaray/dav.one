import { useCallback, useEffect, useRef, useState } from "react";
import { serializeEditorContent } from "./serializer.js";
import EditorArea from "./_EditorArea.jsx";
import ColorPalettes from "./_ColorPalettes.jsx";
import HistoryFavourites from "./_HistoryFavourites.jsx";
import AboutSection from "./_AboutSection.jsx";

export default function TF2Editor() {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);

  const [charCount, setCharCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeHex, setActiveHex] = useState("FFFFFF");
  const [history, setHistory] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [activeTab, setActiveTab] = useState("history");
  const [currentEntryIsFavourite, setCurrentEntryIsFavourite] = useState(false);

  // Helper to calculate bytes
  const calculateBytes = useCallback(() => {
    if (!editorRef.current) return;
    const tf2String = serializeEditorContent(editorRef.current);
    const blob = new Blob([tf2String]);
    setCharCount(blob.size);

    // Check if current content is in favourites
    const currentHtml = editorRef.current.innerHTML;
    const isFav = history.some((entry) => entry.html === currentHtml && entry.isFavourite);
    setCurrentEntryIsFavourite(isFav);
  }, [history]);

  // Debounced update function
  const debounceTimeout = useRef(null);

  const handleContentChange = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      calculateBytes();
    }, 100);
  };

  // Load history and favourites from localStorage on mount
  useEffect(() => {
    calculateBytes();

    try {
      const savedHistory = localStorage.getItem("tf2-history");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        setFavourites(parsedHistory.filter((entry) => entry.isFavourite));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  // Update favourites when history changes
  useEffect(() => {
    setFavourites(history.filter((entry) => entry.isFavourite));
  }, [history]);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    try {
      localStorage.setItem("tf2-history", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const applyColor = (hex) => {
    setActiveHex(hex);
    const selection = globalThis.getSelection();
    if (!selection.rangeCount) return;

    if (editorRef.current) {
      editorRef.current.focus();
    }

    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, "#" + hex);

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
  };

  const handlePaste = (_e) => {
    setTimeout(calculateBytes, 0);
  };

  const toggleFavourite = () => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    const payload = serializeEditorContent(editorRef.current);

    if (!payload.trim()) return;

    const existingIndex = history.findIndex((entry) => entry.html === currentHtml);

    if (existingIndex !== -1) {
      // Toggle existing entry
      const newHistory = [...history];
      newHistory[existingIndex].isFavourite = !newHistory[existingIndex].isFavourite;
      setHistory(newHistory);
      saveHistory(newHistory);
      setCurrentEntryIsFavourite(newHistory[existingIndex].isFavourite);
    } else {
      // Add new entry as favourite
      const newEntry = {
        id: Date.now(),
        payload: payload,
        html: currentHtml,
        timestamp: new Date().toISOString(),
        isFavourite: true,
      };
      const newHistory = [newEntry, ...history].slice(0, 100);
      setHistory(newHistory);
      saveHistory(newHistory);
      setCurrentEntryIsFavourite(true);
    }
  };

  const toggleFavouriteEntry = (entryId) => {
    const newHistory = history.map((entry) =>
      entry.id === entryId ? { ...entry, isFavourite: !entry.isFavourite } : entry
    );
    setHistory(newHistory);
    saveHistory(newHistory);

    // Update current entry favourite status if it matches
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const updatedEntry = newHistory.find((e) => e.id === entryId);
      if (updatedEntry && updatedEntry.html === currentHtml) {
        setCurrentEntryIsFavourite(updatedEntry.isFavourite);
      }
    }
  };

  const clearAllHistory = () => {
    const newHistory = [];
    setHistory(newHistory);
    saveHistory(newHistory);
    setCurrentEntryIsFavourite(false);
  };

  const clearAllFavourites = () => {
    const newHistory = history.map((entry) => ({ ...entry, isFavourite: false }));
    setHistory(newHistory);
    saveHistory(newHistory);
    setCurrentEntryIsFavourite(false);
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

      // Check if text is empty
      if (!payload.trim()) {
        document.body.removeChild(textArea);
        return;
      }

      // Check if same as previous entry
      if (history.length > 0 && history[0].payload === payload) {
        document.body.removeChild(textArea);
        return;
      }

      // Check if this payload already exists in history
      const existingIndex = history.findIndex((entry) => entry.payload === payload);

      let newHistory;
      if (existingIndex !== -1) {
        // Move existing entry to the top
        const existingEntry = history[existingIndex];
        newHistory = [
          { ...existingEntry, timestamp: new Date().toISOString() },
          ...history.slice(0, existingIndex),
          ...history.slice(existingIndex + 1),
        ];
      } else {
        // Add new entry
        const htmlContent = editorRef.current.innerHTML;
        const newEntry = {
          id: Date.now(),
          payload: payload,
          html: htmlContent,
          timestamp: new Date().toISOString(),
          isFavourite: currentEntryIsFavourite,
        };
        newHistory = [newEntry, ...history].slice(0, 100);
      }

      setHistory(newHistory);
      saveHistory(newHistory);
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(textArea);
  };

  // Copy from history
  const copyFromHistory = (payload) => {
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

  // Restore from history to editor
  const restoreFromHistory = (html) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      editorRef.current.focus();
      calculateBytes();
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto space-y-6 px-4">
      {/* Main Layout - 2:1 ratio at xl2 breakpoint */}
      <div className="flex flex-col xl2:grid xl2:grid-cols-3 xl2:items-start gap-6">
        {/* Left Section (Editor + Color Palettes) - Takes 2 columns */}
        <div className="xl2:col-span-2 space-y-6">
          <EditorArea
            editorRef={editorRef}
            charCount={charCount}
            handleContentChange={handleContentChange}
            handlePaste={handlePaste}
            handleKeyDown={handleKeyDown}
            activeHex={activeHex}
            triggerColorPicker={triggerColorPicker}
            colorInputRef={colorInputRef}
            applyColor={applyColor}
            removeColor={removeColor}
            handleCopy={handleCopy}
            toggleFavourite={toggleFavourite}
            isFavourite={currentEntryIsFavourite}
            copyFeedback={copyFeedback}
          />

          <ColorPalettes applyColor={applyColor} />

          {/* About Section - Shows here on large screens (xl2) */}
          <div className="hidden xl2:block">
            <AboutSection />
          </div>
        </div>

        {/* Right Section (History/Favourites) - Takes 1 column */}
        <div className="xl2:col-span-1">
          <HistoryFavourites
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            history={history}
            favourites={favourites}
            restoreFromHistory={restoreFromHistory}
            copyFromHistory={copyFromHistory}
            toggleFavouriteEntry={toggleFavouriteEntry}
            clearAllHistory={clearAllHistory}
            clearAllFavourites={clearAllFavourites}
          />
        </div>
      </div>

      {/* About Section - Shows here on small screens (below xl2) */}
      <div className="xl2:hidden">
        <AboutSection />
      </div>
    </div>
  );
}
