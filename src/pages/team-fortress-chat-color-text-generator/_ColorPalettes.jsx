import { COLOR_PALETTES } from "./serializer.js";

export default function ColorPalettes({ applyColor }) {
  const renderColorGrid = (category, colors) => {
    if (category === "Team Paints") {
      const reds = colors.filter((c) => c.type === "red");
      const blues = colors.filter((c) => c.type === "blue");

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap justify-center gap-1.5">
            {reds.map((color) => (
              <button
                type="button"
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-red-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {blues.map((color) => (
              <button
                type="button"
                key={color.hex}
                onClick={() => applyColor(color.hex)}
                className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-blue-500/50 shadow-sm"
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      );
    }

    if (category === "Item Qualities") {
      return (
        <div className="grid grid-cols-5 gap-1.5 place-content-center">
          {colors.map((color) => (
            <button
              type="button"
              key={color.hex}
              onClick={() => applyColor(color.hex)}
              className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-slate-500 shadow-sm"
              style={{ backgroundColor: `#${color.hex}` }}
              title={color.name}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-1.5">
        {colors.map((color) => (
          <button
            type="button"
            key={color.hex}
            onClick={() => applyColor(color.hex)}
            className="group relative w-8 h-8 rounded-md hover:scale-110 hover:z-10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#16181d] focus:ring-slate-500 shadow-sm"
            style={{ backgroundColor: `#${color.hex}` }}
            title={color.name}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {Object.entries(COLOR_PALETTES).map(([category, colors]) => (
        <div
          key={category}
          className={`bg-[#16181d] border border-slate-800/50 rounded-lg p-4 hover:border-slate-700 transition-colors flex flex-col h-full select-none ${
            category === "Standard Paints" ? "md:col-span-2" : "md:col-span-1"
          }`}
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center border-b border-slate-800 pb-2">
            {category}
          </p>
          {renderColorGrid(category, colors)}
        </div>
      ))}
    </div>
  );
}
