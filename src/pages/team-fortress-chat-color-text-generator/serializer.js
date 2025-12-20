// src/scripts/tf2-serializer.js

const CONSTANTS = {
  CTRL_COLOR: "\u0007",
  CTRL_ALPHA: "\u0008",
  CTRL_RESET: "\u0001",
};

function rgbToHex(rgb) {
  if (!rgb || rgb === "rgba(0, 0, 0, 0)") return null;
  if (rgb.startsWith("#")) return rgb.replace("#", "").toUpperCase();

  const rgbMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgbMatch) return null;

  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  return (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

export function serializeEditorContent(editorRoot) {
  let tf2String = "";
  let lastColor = null;

  const traverse = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parentStyle = window.getComputedStyle(node.parentElement);
      const colorRaw = parentStyle.color;
      const hex = rgbToHex(colorRaw);

      // Kolory uznawane za "domyślne" (czyli brak tagu koloru)
      const isDefault = hex === "E2E8F0" || hex === "FFFFFF" || hex === "CCCCCC" || hex === "94A3B8"; // Slate-200, White, Grey, Slate-400

      if (hex && !isDefault && hex !== lastColor) {
        // Double Tag Format
        tf2String += CONSTANTS.CTRL_COLOR + "color!" + CONSTANTS.CTRL_COLOR + hex;
        lastColor = hex;
      } else if ((isDefault || !hex) && lastColor !== null) {
        tf2String += CONSTANTS.CTRL_RESET;
        lastColor = null;
      }
      tf2String += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        tf2String += "\n";
      } else if (node.tagName === "DIV" && tf2String.length > 0) {
        tf2String += "\n";
      }
      node.childNodes.forEach(traverse);
    }
  };

  traverse(editorRoot);
  return tf2String;
}

// --- PEŁNA PALETA KOLORÓW TF2 ---
export const COLOR_PALETTES = {
  "Team & Basics": [
    { name: "Red Team", hex: "FF4040" },
    { name: "Blue Team", hex: "99CCFF" },
    { name: "Spectator", hex: "3EFF3E" },
    { name: "Critical Hit", hex: "A0FF28" },
    { name: "Low Health", hex: "FF3232" },
    { name: "Credits", hex: "43CB56" },
  ],
  "Item Qualities": [
    { name: "Normal", hex: "B2B2B2" },
    { name: "Unique", hex: "FFD700" },
    { name: "Vintage", hex: "476291" },
    { name: "Genuine", hex: "4D7455" },
    { name: "Strange", hex: "CF6A32" },
    { name: "Unusual", hex: "8650AC" },
    { name: "Haunted", hex: "38F3AB" },
    { name: "Collector's", hex: "AA0000" },
    { name: "Community", hex: "70B04A" },
    { name: "Valve", hex: "A50F79" },
  ],
  "Standard Paints": [
    { name: "Australium Gold", hex: "E7B53B" },
    { name: "Pink as Hell", hex: "FF69B4" },
    { name: "Lack of Hue", hex: "141414" },
    { name: "Abundance of Tinge", hex: "E6E6E6" },
    { name: "Dark Salmon Injustice", hex: "E9967A" },
    { name: "Indubitably Green", hex: "729E42" },
    { name: "Mann Co. Orange", hex: "CF7336" },
    { name: "Noble Hatter's Violet", hex: "51384A" },
    { name: "Deep Commitment to Purple", hex: "7D4071" },
    { name: "Taste of Defeat and Lime", hex: "32CD32" },
    { name: "Zepheniah's Greed", hex: "424F3B" },
    { name: "Drably Olive", hex: "808000" },
    { name: "Muskelmannbraun", hex: "A57545" },
    { name: "Peculiarly Drab Tincture", hex: "C5AF91" },
    { name: "Radigan Conagher Brown", hex: "694D3A" },
    { name: "Aged Moustache Grey", hex: "7E7E7E" },
  ],
  "Team Paints (Red/Blue)": [
    { name: "Team Spirit (Red)", hex: "B8383B" },
    { name: "Team Spirit (Blue)", hex: "5885A2" },
    { name: "Balaclavas (Red)", hex: "3B1F23" },
    { name: "Balaclavas (Blue)", hex: "18233D" },
    { name: "Value of Teamwork (Red)", hex: "803020" },
    { name: "Value of Teamwork (Blue)", hex: "256D8D" },
    { name: "Cream Spirit (Red)", hex: "C36C2D" },
    { name: "Cream Spirit (Blue)", hex: "B88035" },
    { name: "Waterlogged Lab Coat (Red)", hex: "A89A8C" },
    { name: "Waterlogged Lab Coat (Blue)", hex: "839FA3" },
    { name: "Air of Debonair (Red)", hex: "654740" },
    { name: "Air of Debonair (Blue)", hex: "28394D" },
  ],
};
