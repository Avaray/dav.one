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

      const isDefault = hex === "E2E8F0" || hex === "FFFFFF" || hex === "CCCCCC" || hex === "94A3B8";

      if (hex && !isDefault && hex !== lastColor) {
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

export const COLOR_PALETTES = {
  "Team Paints (Red/Blue)": [
    // Podstawowe
    { name: "Red Team", hex: "FF4040", type: "red" },
    { name: "Blue Team", hex: "99CCFF", type: "blue" },
    // Team Paints (Red)
    { name: "Team Spirit (Red)", hex: "B8383B", type: "red" },
    { name: "Balaclavas (Red)", hex: "3B1F23", type: "red" },
    { name: "Value of Teamwork (Red)", hex: "803020", type: "red" },
    { name: "Cream Spirit (Red)", hex: "C36C2D", type: "red" },
    { name: "Waterlogged Lab Coat (Red)", hex: "A89A8C", type: "red" },
    { name: "Air of Debonair (Red)", hex: "654740", type: "red" },
    // Team Paints (Blue)
    { name: "Team Spirit (Blue)", hex: "5885A2", type: "blue" },
    { name: "Balaclavas (Blue)", hex: "18233D", type: "blue" },
    { name: "Value of Teamwork (Blue)", hex: "256D8D", type: "blue" },
    { name: "Cream Spirit (Blue)", hex: "B88035", type: "blue" },
    { name: "Waterlogged Lab Coat (Blue)", hex: "839FA3", type: "blue" },
    { name: "Air of Debonair (Blue)", hex: "28394D", type: "blue" },
  ],
  "Item Qualities": [
    // Grey -> Yellow/Orange -> Red -> Purple -> Green
    { name: "Normal", hex: "B2B2B2" }, // Grey
    { name: "Unique", hex: "FFD700" }, // Gold
    { name: "Strange", hex: "CF6A32" }, // Orange
    { name: "Collector's", hex: "AA0000" }, // Dark Red
    { name: "Valve", hex: "A50F79" }, // Magenta
    { name: "Unusual", hex: "8650AC" }, // Purple
    { name: "Vintage", hex: "476291" }, // Blue
    { name: "Haunted", hex: "38F3AB" }, // Teal/Cyan
    { name: "Genuine", hex: "4D7455" }, // Green
    { name: "Community", hex: "70B04A" }, // Light Green
  ],
  "Standard Paints": [
    // Grayscale (White -> Black)
    { name: "An Extraordinary Abundance of Tinge", hex: "E6E6E6" },
    { name: "Aged Moustache Grey", hex: "7E7E7E" },
    { name: "A Color Similar to Slate", hex: "2F4F4F" },
    { name: "After Eight", hex: "2D2D24" },
    { name: "A Distinctive Lack of Hue", hex: "141414" },

    // Yellows / Oranges / Browns
    { name: "Australium Gold", hex: "E7B53B" },
    { name: "The Color of a Gentlemann's Business Pants", hex: "F0E68C" },
    { name: "Muskelmannbraun", hex: "A57545" },
    { name: "Mann Co. Orange", hex: "CF7336" },
    { name: "Radigan Conagher Brown", hex: "694D3A" },
    { name: "Peculiarly Drab Tincture", hex: "C5AF91" },
    { name: "Ye Olde Rustic Colour", hex: "7C6C57" },
    { name: "Drably Olive", hex: "808000" },

    // Reds / Pinks
    { name: "Dark Salmon Injustice", hex: "E9967A" },
    { name: "Pink as Hell", hex: "FF69B4" },

    // Purples
    { name: "Color No. 216-190-216", hex: "D8BED8" },
    { name: "A Deep Commitment to Purple", hex: "7D4071" },
    { name: "Noble Hatter's Violet", hex: "51384A" },

    // Greens
    { name: "A Mann's Mint", hex: "BCDDB3" },
    { name: "The Bitter Taste of Defeat and Lime", hex: "32CD32" },
    { name: "Indubitably Green", hex: "729E42" },
    { name: "Zepheniah's Greed", hex: "424F3B" },
  ],
};
