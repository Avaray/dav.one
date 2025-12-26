import React, { useEffect, useRef, useState } from "react";
import ColorPanel from "./_ColorPanel.tsx";
import ControlPanel from "./_ControlPanel.tsx";
import { formatColor } from "./_colorUtils.ts";
import { generatePalette } from "./_paletteGenerator.ts";
import type { ColorFormat, LockedColor, PaletteState, StorageData } from "./_types.ts";

const PaletteGenerator: React.FC = () => {
  const [colorCount, setColorCount] = useState(4);
  const [colors, setColors] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<LockedColor[]>([]);
  const [colorNames, setColorNames] = useState<string[]>([]);
  const [format, setFormat] = useState<ColorFormat>("OKLAB");
  const [history, setHistory] = useState<PaletteState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);

  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("palette-generator");
    if (saved) {
      const data: StorageData = JSON.parse(saved);
      setColors(data.colors || []);
      setLockedColors(data.lockedColors || []);
      setColorNames(data.colorNames || []);
      setColorCount(data.colorCount || 4);
      setFormat(data.format || "OKLAB");
    } else {
      const defaultNames = ["background", "foreground", "primary", "secondary"];
      setColorNames(defaultNames);
      generateNewPalette(4, []);
    }
  }, []);

  const saveToLocalStorage = (data: StorageData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem("palette-generator", JSON.stringify(data));
    }, 500);
  };

  const generateNewPalette = (count = colorCount, locked = lockedColors) => {
    const newColors = generatePalette(count, locked);
    const newNames = [...colorNames];

    while (newNames.length < count) {
      newNames.push(`color-${newNames.length + 1}`);
    }

    setColors(newColors);
    setColorNames(newNames);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ colors: newColors, names: newNames, count });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    saveToLocalStorage({
      colors: newColors,
      colorNames: newNames,
      lockedColors: locked,
      colorCount: count,
      format,
    });
  };

  const toggleLock = (index: number) => {
    const newLocked = [...lockedColors];
    newLocked[index] = {
      locked: !newLocked[index]?.locked,
      color: colors[index],
    };
    setLockedColors(newLocked);
    saveToLocalStorage({ colors, colorNames, lockedColors: newLocked, colorCount, format });
  };

  const updateColorName = (index: number, name: string) => {
    const newNames = [...colorNames];
    newNames[index] = name;
    setColorNames(newNames);
    saveToLocalStorage({ colors, colorNames: newNames, lockedColors, colorCount, format });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setColors(state.colors);
      setColorNames(state.names);
      setColorCount(state.count);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setColors(state.colors);
      setColorNames(state.names);
      setColorCount(state.count);
      setHistoryIndex(newIndex);
    }
  };

  const addColor = () => {
    if (colorCount < 12) {
      const newCount = colorCount + 1;
      setColorCount(newCount);
      generateNewPalette(newCount, lockedColors);
    }
  };

  const removeColor = () => {
    if (colorCount > 4) {
      const newCount = colorCount - 1;
      setColorCount(newCount);
      const newColors = colors.slice(0, newCount);
      const newNames = colorNames.slice(0, newCount);
      const newLocked = lockedColors.slice(0, newCount);

      setColors(newColors);
      setColorNames(newNames);
      setLockedColors(newLocked);

      saveToLocalStorage({
        colors: newColors,
        colorNames: newNames,
        lockedColors: newLocked,
        colorCount: newCount,
        format,
      });
    }
  };

  const copyCSS = () => {
    const css = `:root {
${colors.map((color, i) => `  --color-${colorNames[i]}: ${formatColor(color, format)};`).join("\n")}
}`;

    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        generateNewPalette();
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        }
      }
    };

    globalThis.addEventListener("keydown", handleKeyPress);
    return () => globalThis.removeEventListener("keydown", handleKeyPress);
  }, [colorCount, lockedColors, historyIndex, history]);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      <div className="flex-1 flex">
        {colors.map((color, index) => (
          <ColorPanel
            key={index}
            color={color}
            index={index}
            name={colorNames[index] || ""}
            isLocked={lockedColors[index]?.locked || false}
            format={format}
            onToggleLock={toggleLock}
            onNameChange={updateColorName}
          />
        ))}
      </div>

      <ControlPanel
        colorCount={colorCount}
        format={format}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        copied={copied}
        onGenerate={() => generateNewPalette()}
        onUndo={undo}
        onRedo={redo}
        onFormatChange={setFormat}
        onAddColor={addColor}
        onRemoveColor={removeColor}
        onCopyCSS={copyCSS}
      />
    </div>
  );
};

export default PaletteGenerator;
