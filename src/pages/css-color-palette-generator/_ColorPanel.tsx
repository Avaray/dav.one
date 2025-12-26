import React from "react";
import { formatColor, getContrastRatio } from "./_colorUtils.ts";
import type { ColorFormat } from "./_types.ts";

interface ColorPanelProps {
  color: string;
  index: number;
  name: string;
  isLocked: boolean;
  format: ColorFormat;
  onToggleLock: (index: number) => void;
  onNameChange: (index: number, name: string) => void;
}

const LockIcon: React.FC<{ locked: boolean }> = ({ locked }) => {
  if (locked) {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    );
  }

  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  );
};

export const ColorPanel: React.FC<ColorPanelProps> = ({
  color,
  index,
  name,
  isLocked,
  format,
  onToggleLock,
  onNameChange,
}) => {
  const textColor = getContrastRatio("#ffffff", color) > 4.5 ? "#fff" : "#000";

  return (
    <div
      className="flex-1 relative group"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={() => onToggleLock(index)}
          className="p-3 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors mb-4"
          style={{ color: textColor }}
        >
          <LockIcon locked={isLocked} />
        </button>

        <div
          className="px-4 py-2 rounded-lg bg-black/30 backdrop-blur-sm text-sm font-mono"
          style={{ color: textColor }}
        >
          {formatColor(color, format)}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(index, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm border-none outline-none text-sm font-mono"
          style={{ color: textColor }}
          placeholder={`color-${index + 1}`}
        />
      </div>
    </div>
  );
};

export default ColorPanel;
