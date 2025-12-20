// src/pages/colorizer.js

export const COLOR_PALETTES = {
  "Team Colors": [
    { name: "Red Team", hex: "FF4040" },
    { name: "Blue Team", hex: "99CCFF" },
    { name: "Spectator", hex: "3EFF3E" },
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
  "HUD & Misc": [
    { name: "Low Health", hex: "FF3232" },
    { name: "Credits Green", hex: "43CB56" },
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

  // Format: \x07 + "color!" + \x07 + HEX
  let tf2String = raw.replace(/{#([0-9A-Fa-f]{6})}/g, (match, hex) => {
    return CONSTANTS.CTRL_COLOR + "color!" + CONSTANTS.CTRL_COLOR + hex.toUpperCase();
  });

  tf2String = tf2String.replace(/{#([0-9A-Fa-f]{8})}/g, (match, hex) => {
    return CONSTANTS.CTRL_ALPHA + "color!" + CONSTANTS.CTRL_ALPHA + hex.toUpperCase();
  });

  tf2String = tf2String.replace(/{reset}/g, CONSTANTS.CTRL_RESET);
  return tf2String;
}

// Improved Syntax Highlighting
export function generateHighlighting(raw) {
  if (!raw) return "<br>"; // Return break if empty to maintain height

  // 1. Escape HTML
  let safeRaw = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Tokenize
  // We split by color tags but keep them in the array
  const parts = safeRaw.split(/({#[0-9A-Fa-f]{6,8}}|{reset})/g);

  let html = "";
  let currentColor = null; // null means default color

  parts.forEach((part) => {
    if (!part) return;

    const hexMatch = part.match(/{#([0-9A-Fa-f]{6,8})}/);
    const resetMatch = part.match(/{reset}/);

    if (hexMatch) {
      // This is a TAG -> Render it DIMMED
      html += `<span class="text-slate-600 font-normal select-none opacity-50">${part}</span>`;
      // Set current color for SUBSEQUENT text
      currentColor = hexMatch[1].substring(0, 6);
    } else if (resetMatch) {
      // This is a RESET TAG -> Render it DIMMED
      html += `<span class="text-slate-600 font-normal select-none opacity-50">${part}</span>`;
      currentColor = null;
    } else {
      // This is TEXT CONTENT
      if (currentColor) {
        // Colorized text
        // Adding text-shadow helps visibility on dark backgrounds
        html +=
          `<span style="color: #${currentColor}; text-shadow: 0 0 2px rgba(0,0,0,0.5); font-weight: bold;">${part}</span>`;
      } else {
        // Default text (White/Grey)
        html += `<span class="text-slate-200">${part}</span>`;
      }
    }
  });

  // Handle trailing newline for textarea sync
  if (raw.endsWith("\n")) {
    html += "<br>&nbsp;";
  }

  return html;
}

// --- INIT ---

export function initColorizer() {
  const input = document.getElementById("input-text");
  const backdrop = document.getElementById("editor-backdrop");
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

    // Update visuals
    if (backdrop) backdrop.innerHTML = generateHighlighting(text);

    const byteLength = new Blob([processed]).size;
    if (charCount) {
      charCount.textContent = `${byteLength}/127`;
      charCount.className = byteLength > 127 ? "font-mono font-bold text-red-500" : "font-mono text-slate-500";
    }
  };

  // Sync Scroll
  const syncScroll = () => {
    if (backdrop) {
      backdrop.scrollTop = input.scrollTop;
      backdrop.scrollLeft = input.scrollLeft;
    }
  };

  input.addEventListener("input", updateState);
  input.addEventListener("scroll", syncScroll);
  new ResizeObserver(syncScroll).observe(input);

  // Palette Clicks
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

  // Copy Logic
  copyBtn?.addEventListener("click", () => {
    const text = input.value;
    const payload = processText(text);

    const textArea = document.createElement("textarea");
    textArea.value = payload;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      if (feedback) {
        feedback.classList.remove("opacity-0");
        setTimeout(() => feedback.classList.add("opacity-0"), 2000);
      }
    } catch (err) {
      console.error(err);
    }

    document.body.removeChild(textArea);
  });

  // Initial Run
  updateState();
}
