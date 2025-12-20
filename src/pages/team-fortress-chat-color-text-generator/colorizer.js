// src/pages/colorizer.js

export const COLOR_PALETTES = {
  "Teams & Basic": [
    { name: "Red Team", hex: "FF4040" },
    { name: "Blue Team", hex: "99CCFF" },
    { name: "Spec Green", hex: "3EFF3E" },
    { name: "Low Health", hex: "FF3232" },
    { name: "Credits", hex: "43CB56" },
  ],
  "Item Qualities": [
    { name: "Normal", hex: "B2B2B2" },
    { name: "Unique", hex: "FFD700" },
    { name: "Vintage", hex: "476291" },
    { name: "Genuine", hex: "4D7455" },
    { name: "Strange", hex: "CF6A32" },
    { name: "Haunted", hex: "38F3AB" },
    { name: "Collector's", hex: "AA0000" },
    { name: "Unusual", hex: "8650AC" },
    { name: "Community", hex: "70B04A" },
    { name: "Valve", hex: "A50F79" },
  ],
  "Standard Paints": [
    { name: "Australium Gold", hex: "E7B53B" },
    { name: "Pink as Hell", hex: "FF69B4" },
    { name: "A Distinctive Lack of Hue", hex: "141414" },
    { name: "An Extraordinary Abundance of Tinge", hex: "E6E6E6" },
    { name: "Dark Salmon Injustice", hex: "E9967A" },
    { name: "Indubitably Green", hex: "729E42" },
    { name: "Mann Co. Orange", hex: "CF7336" },
    { name: "Noble Hatter's Violet", hex: "51384A" },
    { name: "A Deep Commitment to Purple", hex: "7D4071" },
    { name: "The Bitter Taste of Defeat and Lime", hex: "32CD32" },
    { name: "Zepheniah's Greed", hex: "424F3B" },
  ],
  "Team Paints": [
    { name: "Team Spirit (Red)", hex: "B8383B" },
    { name: "Team Spirit (Blue)", hex: "5885A2" },
    { name: "Balaclavas (Red)", hex: "3B1F23" },
    { name: "Balaclavas (Blue)", hex: "18233D" },
    { name: "Value of Teamwork (Red)", hex: "803020" },
    { name: "Value of Teamwork (Blue)", hex: "256D8D" },
    { name: "Cream Spirit (Red)", hex: "C36C2D" },
    { name: "Cream Spirit (Blue)", hex: "B88035" },
  ],
};

const CONSTANTS = {
  CHAR_LIMIT: 127,
  CTRL_COLOR: "\u0007",
  CTRL_ALPHA: "\u0008",
  CTRL_RESET: "\u0001",
};

// --- LOGIC ---

export function processText(raw) {
  if (!raw) return "";

  // THE MAGIC FORMAT: \x07 + "color!" + \x07 + HEX
  // This adds exactly 14 chars (1+6+1+6) for standard colors
  // and 16 chars (1+6+1+8) for alpha colors.

  // Standard Hex: {#RRGGBB}
  let tf2String = raw.replace(/{#([0-9A-Fa-f]{6})}/g, (match, hex) => {
    return CONSTANTS.CTRL_COLOR + "color!" + CONSTANTS.CTRL_COLOR + hex.toUpperCase();
  });

  // Alpha Hex: {#RRGGBBAA}
  tf2String = tf2String.replace(/{#([0-9A-Fa-f]{8})}/g, (match, hex) => {
    return CONSTANTS.CTRL_ALPHA + "color!" + CONSTANTS.CTRL_ALPHA + hex.toUpperCase();
  });

  // Reset: {reset} -> \x01
  tf2String = tf2String.replace(/{reset}/g, CONSTANTS.CTRL_RESET);

  return tf2String;
}

export function generateHtmlPreview(raw) {
  if (!raw) return '<span class="text-slate-600 italic">Preview your text here...</span>';

  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/{#([0-9A-Fa-f]{6})}/g, (match, hex) => {
    return `</span><span style="color: #${hex}; text-shadow: 1px 1px 0 #000;">`;
  });

  html = html.replace(/{#([0-9A-Fa-f]{8})}/g, (match, hex) => {
    const color = hex.substring(0, 6);
    return `</span><span style="color: #${color}; opacity: 0.7; text-shadow: 1px 1px 0 #000;">`;
  });

  html = html.replace(/{reset}/g, `</span><span class="text-slate-200" style="text-shadow: none;">`);

  return `<span>${html}</span>`;
}

// --- INIT & ROBUST COPY ---

export function initColorizer() {
  const input = document.getElementById("input-text");
  const preview = document.getElementById("preview-box");
  const charCount = document.getElementById("char-count");
  const copyBtn = document.getElementById("copy-btn");
  const feedback = document.getElementById("copy-feedback");
  const customColorInput = document.getElementById("custom-color");
  const resetTagBtn = document.getElementById("btn-reset-tag");

  if (!input) return;

  const insertTag = (tag) => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    const newText = text.substring(0, start) + tag + text.substring(end);
    input.value = newText;
    input.focus();
    input.selectionStart = input.selectionEnd = start + tag.length;
    updateState();
  };

  const updateState = () => {
    const text = input.value;
    const processed = processText(text);

    if (preview) preview.innerHTML = generateHtmlPreview(text);

    const byteLength = new Blob([processed]).size;

    if (charCount) {
      charCount.textContent = `${byteLength} / ${CONSTANTS.CHAR_LIMIT} bytes`;
      const isOverLimit = byteLength > CONSTANTS.CHAR_LIMIT;
      charCount.className = isOverLimit
        ? "text-xs font-mono font-bold text-red-500"
        : "text-xs font-mono text-slate-500";
    }
  };

  input.addEventListener("input", updateState);

  document.querySelectorAll(".js-color-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const hex = e.currentTarget.dataset.hex;
      insertTag(`{#${hex}}`);
    });
  });

  resetTagBtn?.addEventListener("click", () => insertTag("{reset}"));

  customColorInput?.addEventListener("change", (e) => {
    const hex = e.target.value.replace("#", "").toUpperCase();
    insertTag(`{#${hex}}`);
  });

  copyBtn?.addEventListener("click", () => {
    const text = input.value;
    const payload = processText(text);

    // Fallback copy mechanism for raw bytes preservation
    const textArea = document.createElement("textarea");
    textArea.value = payload;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        if (feedback) {
          feedback.innerText = "Copied! Ready for TF2.";
          feedback.classList.remove("opacity-0");
          setTimeout(() => feedback.classList.add("opacity-0"), 3000);
        }
      } else {
        throw new Error("execCommand returned false");
      }
    } catch (err) {
      console.error("Copy failed", err);
    }

    document.body.removeChild(textArea);
  });

  updateState();
}
