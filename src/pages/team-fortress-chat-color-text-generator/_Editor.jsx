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
    const isFav = favourites.some((entry) => entry.html === currentHtml);
    setCurrentEntryIsFavourite(isFav);
  }, [favourites]);

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
      const savedFavourites = localStorage.getItem("tf2-favourites");

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      if (savedFavourites) {
        setFavourites(JSON.parse(savedFavourites));
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    try {
      localStorage.setItem("tf2-history", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  // Save favourites to localStorage
  const saveFavourites = (newFavourites) => {
    try {
      localStorage.setItem("tf2-favourites", JSON.stringify(newFavourites));
    } catch (error) {
      console.error("Failed to save favourites:", error);
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

    const existingFavIndex = favourites.findIndex((entry) => entry.html === currentHtml);

    if (existingFavIndex !== -1) {
      // Remove from favourites
      const newFavourites = favourites.filter((_, index) => index !== existingFavIndex);
      setFavourites(newFavourites);
      saveFavourites(newFavourites);
      setCurrentEntryIsFavourite(false);
    } else {
      // Add to favourites
      const newEntry = {
        id: Date.now(),
        payload: payload,
        html: currentHtml,
        timestamp: new Date().toISOString(),
      };
      const newFavourites = [newEntry, ...favourites].slice(0, 100);
      setFavourites(newFavourites);
      saveFavourites(newFavourites);
      setCurrentEntryIsFavourite(true);
    }
  };

  const toggleFavouriteEntry = (entryId, currentlyInFavourites) => {
    if (currentlyInFavourites) {
      // Remove from favourites
      const newFavourites = favourites.filter((entry) => entry.id !== entryId);
      setFavourites(newFavourites);
      saveFavourites(newFavourites);
    } else {
      // Find in history and add to favourites
      const entryToAdd = history.find((entry) => entry.id === entryId);
      if (entryToAdd) {
        const newFavourites = [entryToAdd, ...favourites].slice(0, 100);
        setFavourites(newFavourites);
        saveFavourites(newFavourites);
      }
    }

    // Update current entry favourite status if it matches
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (currentlyInFavourites) {
        const removedEntry = favourites.find((e) => e.id === entryId);
        if (removedEntry && removedEntry.html === currentHtml) {
          setCurrentEntryIsFavourite(false);
        }
      } else {
        const addedEntry = history.find((e) => e.id === entryId);
        if (addedEntry && addedEntry.html === currentHtml) {
          setCurrentEntryIsFavourite(true);
        }
      }
    }
  };

  const deleteEntry = (entryId, fromFavourites) => {
    if (fromFavourites) {
      const newFavourites = favourites.filter((entry) => entry.id !== entryId);
      setFavourites(newFavourites);
      saveFavourites(newFavourites);
    } else {
      const newHistory = history.filter((entry) => entry.id !== entryId);
      setHistory(newHistory);
      saveHistory(newHistory);

      // Also remove from favourites if it exists there
      const newFavourites = favourites.filter((entry) => entry.id !== entryId);
      setFavourites(newFavourites);
      saveFavourites(newFavourites);
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const clearAllFavourites = () => {
    setFavourites([]);
    saveFavourites([]);
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
    <div className="w-full h-full max-w-480 mx-auto overflow-y-auto custom-scrollbar p-4">
      {/* Main Layout - 60/40 ratio at xl2 breakpoint */}
      <div className="flex flex-col xl2:grid xl2:grid-cols-[3fr_2fr] gap-6">
        {/* Left Section (Editor + Color Palettes) - 60% */}
        <div className="space-y-6">
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

        {/* Right Section (History/Favourites) - 40% */}
        <div className="xl2:sticky xl2:top-0">
          <HistoryFavourites
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            history={history}
            favourites={favourites}
            restoreFromHistory={restoreFromHistory}
            copyFromHistory={copyFromHistory}
            toggleFavouriteEntry={toggleFavouriteEntry}
            deleteEntry={deleteEntry}
            clearAllHistory={clearAllHistory}
            clearAllFavourites={clearAllFavourites}
          />
        </div>
      </div>

      {/* About Section - Shows here on small screens (below xl2) */}
      <div className="xl2:hidden mt-6">
        <AboutSection />
      </div>
    </div>
  );
}
