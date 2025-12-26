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
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const RedoIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
    />
  </svg>
);

const MinusIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
    <div className="h-32 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Generate (Space)
        </button>

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <UndoIcon />
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <RedoIcon />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-1">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemoveColor}
            disabled={colorCount <= 4}
            className="p-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            title="Remove color"
          >
            <MinusIcon />
          </button>

          <span className="text-slate-300 font-mono text-sm px-2">{colorCount}</span>

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
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
