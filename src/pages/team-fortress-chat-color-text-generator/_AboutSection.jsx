import { useState } from "react";

export default function AboutSection() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="bg-[#16181d] border border-slate-800/50 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setAboutOpen(!aboutOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <p className=" text-slate-500 tracking-wider">
          Usage & About
        </p>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${aboutOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {aboutOpen && (
        <div className="border-t border-slate-800/50 p-6 space-y-4 text-sm text-slate-400">
          <div>
            <p className="text-slate-300 font-bold mb-2">How to Use</p>
            <ol className="">
              <li>Type your message in the editor</li>
              <li>Select the part of the text you want to colorize</li>
              <li>Click on a color from the palettes below, or use the color picker</li>
              <li>Click "COPY TEXT" to copy the formatted text</li>
              <li>
                Paste it in TF2 chat <b>when you are dead</b>{" "}
                (during preparation time or the active round; round of the game cannot be finished)
              </li>
            </ol>
          </div>

          <div>
            <p className="text-slate-300 font-bold mb-2">Inspiration</p>
            <p>
              The main inspiration for this project was{" "}
              <a
                href="https://sourcecolors.neocities.org/"
                className="underline hover:text-orange-400 transition-colors"
              >
                this website
              </a>
              . The idea was to create something more pleasant to use.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
