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
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
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
      className="flex-1 flex flex-col justify-between p-6"
      style={{ backgroundColor: color }}
    >
      <button
        onClick={() => onToggleLock(index)}
        className="p-3 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors mb-4"
        style={{ color: textColor, opacity: isLocked ? 1 : 0.7 }}
      >
        <LockIcon locked={isLocked} />
      </button>
      <div>
        <div className="text-2xl font-mono mb-3" style={{ color: textColor }}>
          {formatColor(color, format)}
        </div>
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
