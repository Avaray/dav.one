import React from "react";
import type { ColorFormat } from "./_types.ts";

interface ControlPanelProps {
  colorCount: number;
  format: ColorFormat;
  canUndo: boolean;
  canRedo: boolean;
  copied: boolean;
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFormatChange: (format: ColorFormat) => void;
  onAddColor: () => void;
  onRemoveColor: () => void;
  onCopyCSS: () => void;
}

const UndoIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
  </svg>
);

const RedoIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
  </svg>
);

const MinusIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  colorCount,
  format,
  canUndo,
  canRedo,
  copied,
  onGenerate,
  onUndo,
  onRedo,
  onFormatChange,
  onAddColor,
  onRemoveColor,
  onCopyCSS,
}) => {
  const formats: ColorFormat[] = ["OKLAB", "P3", "HEX", "RGB"];

  return (
    <div className="w-72 bg-slate-800 p-6 flex flex-col gap-4">
      <button
        type="button"
        onClick={onGenerate}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Generate (Space)
      </button>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RedoIcon />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {formats.map((fmt) => (
          <button
            type="button"
            key={fmt}
            onClick={() => onFormatChange(fmt)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              format === fmt ? "bg-slate-900 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRemoveColor}
          disabled={colorCount <= 4}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Remove color"
        >
          <MinusIcon />
        </button>
        <div className="flex-1 text-center text-white font-mono text-lg">{colorCount}</div>
        <button
          type="button"
          onClick={onAddColor}
          disabled={colorCount >= 12}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Add color"
        >
          <PlusIcon />
        </button>
      </div>

      <button
        type="button"
        onClick={onCopyCSS}
        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
      >
        {copied ? "Copied!" : "Copy CSS"}
      </button>
    </div>
  );
};

export default ControlPanel;
