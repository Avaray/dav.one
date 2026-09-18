---
title: "Generate Music with YuE2: A Simple Guide to Style and Lyrics Prompts"
description: "YuE2 is an AI model that turns your lyrics and a style description into a full song - and it's already competing with Suno. This guide breaks down exactly how to structure your lyrics and style prompts, from section tags and syllable counts to choosing the right planning mode, so what you get back actually matches what you had in mind."
created: "2026-09-12T16:58:06Z"
icon: "game-icons:button-finger"
genre: "Tutorial"
author: "Dawid Wasowski"
---

[YuE2](https://huggingface.co/m-a-p/YuE2-3B) is a free, open AI model that creates full songs from two inputs: 
a style description and your lyrics. It's built by the [Multimodal Art Projection](https://m-a-p.ai/) research team with [HKUST](https://en.wikipedia.org/wiki/Hong_Kong_University_of_Science_and_Technology), and independent tests show [it matching or beatin](https://huggingface.co/m-a-p/YuE2-3B/blob/main/assets/figure1.png) best commercial music generators available today.

What makes YuE2 different from most "type words, get a song" tools is that it doesn't jump straight to audio. First, it writes down a small musical plan - a melody and chords in a readable notation called ABC - and only after that does it render the final 48kHz stereo song. This means the song you get is the direct result of a plan you can inspect, and that plan is shaped almost entirely by how you write your prompt.

This guide focuses on one thing: **how to write your style and lyrics so the song actually sounds like what you asked for.**

## The two things you write

Every YuE2 song comes from two text fields:

1. **Style** - a short description of what the song should sound like (genre, instruments, mood, voice).
2. **Lyrics** - the words of the song, split into labeled sections.

Below, you'll find a detailed breakdown of how to write each of these fields so that the model produces a song that matches your vision.

## Rule 1: Label every section

YuE2 reads your lyrics as a sequence of labeled blocks, not as one long poem. Put a label in square brackets before each part of the song:

```text [1,4,7,10,13,16]
[Verse]
I’m walking down this empty street...

[Pre-Chorus]
And every step I take...

[Chorus]
We are the fire burning through...

[Bridge]
Maybe we were lost, or maybe...

[Interlude]
Hold your breath and listen...

[Outro]
There's nothing left...
```

Only write actual words under a label. Don't put a song title above the lyrics, and don't add notes to yourself inside the text - the lyrics field should contain nothing but the section tags and the words that get sung.

## Rule 2: Leave one blank line between sections

Separate every section from the next with a full empty line (two line breaks in a row). This is how the model knows where one part of the song ends and the next begins. If sections run together without a break, the structure can blur and the song may not follow your intended arrangement.

## Rule 3: Don't open the song with written intro lyrics

The team behind YuE2 has found that the `[Intro]` label is less reliable than other labels when it's placed first and given words to sing. Two safer options:

- Start the song directly with `[Verse]` or `[Chorus]`.
- If you want a wordless instrumental opening, you can still write `[Intro]` as a label, just leave it empty (no lyric lines underneath) before your first real section. This tells the model "there's an intro here" without asking it to sing anything unstable.

## Rule 4: Keep each section short

The model generates audio in chunks of roughly 30 seconds per section. If you cram too many words into one `[Verse]` or `[Chorus]` block, the model has to rush to fit them in, and words can come out slurred, sped up, or cut off mid-line. Aim for a handful of lines per section - similar to how a real song is structured - rather than long paragraphs.

## Rule 5: Match your syllables to the beat, not just your word count

Word count alone doesn't tell you how a line will actually sing. What matters more is the number of syllables in a line, because the model has to fit those syllables into a beat one by one - much like a rapper fitting words into a bar. If a line has too many syllables, the extra ones don't just get sung faster; they can spill over into the next beat and quietly push the rest of the line, or even the next line, out of place. That's often what's behind a generated song that sounds slightly "off" even though the words themselves are correct.

If you've used Suno before, you might be used to chaining words together with hyphens to force them into a single beat (something like "walking-down-the-street-fast"). That trick doesn't reliably help with YuE2. A steadier approach is the one songwriters already use for genres like rap: count the syllables in each line, and keep that count consistent whenever a line repeats - especially in the chorus.

## Rule 6: Write repeats out in full

If your chorus comes back later in the song, don't shorten it to something like `(repeat chorus)` or `[Chorus x2]`. Copy the full chorus text again under a new `[Chorus]` label wherever it repeats. The model doesn't expand shorthand - it sings whatever text is actually there.

## Rule 7: Keep the lyrics field to lyrics only

Avoid production-style notes inside the lyrics, such as "(drums build up here)," "(pause)," or "[key change]." These aren't words that can be sung, and they tend to confuse the model rather than guide it. If you want to signal an instrumental moment, use a label like `[Interlude]` or `[Guitar Solo]` and leave it without lyric lines.

## Writing a style prompt that actually shapes the song

Your style prompt works alongside the lyrics, and it's just as important. A style prompt that reliably gets good results usually covers five ingredients:

| Ingredient | Examples |
|---|---|
| Genre | pop, city pop, cyber metal, jazz-funk, ballad |
| Instruments | acoustic guitar, pulsing bass, analog synths, brushed drums |
| Mood | dreamy, uplifting, melancholic, energetic |
| Vocal gender | male vocal, female vocal |
| Vocal tone | airy vocal, deep voice, bright vocal, expressive lead vocal |

You don't need to include all five every time, but the more of them you cover, the more predictable the result tends to be. You can write them as a natural, comma-separated description:

```
Jazz-funk, warm lead vocal, Rhodes piano, electric bass, tight drums, upbeat
```

Order doesn't matter much - put the words that matter most to you first, since they tend to get the most weight.

## Keep your lyrics' language and your style prompt in sync

YuE2 can sing in several languages. If your style prompt says "Korean pop", write your lyrics in Korean. If it says "English rock", write them in English. Mixing a genre associated with one language and lyrics in a different language tends to produce less natural-sounding results, since the model is trying to match a vocal style it learned alongside that language.

## Choosing how much creative control to give up

When you generate a song, you set a `cot` (chain-of-thought / planning) option:

| Setting | What it does | Good for |
|---|---|---|
| `cot="full"` | Plans both melody and chords before rendering (default) | Original songs, most everyday use |
| `cot="melody"` | Plans only the melody, keeps harmony more open | Covers, when you're supplying your own chord ideas |
| `cot="off"` | Skips the planning step entirely | Quick experiments, maximum variety between generations |

Because the planning stage in `"full"` and `"melody"` modes produces a readable score before any audio is made, you can preview it, and even hand-edit it, before committing to a final render.

In practice, `cot="full"` tends to be the most reliable setting overall, and it's the one to reach for if you want an **instrumental track with no vocals at all**. With the full melody-and-chord plan in place, the model has enough structure to build a complete arrangement even when there are no words to sing. You'll see exactly what that looks like in the instrumental version of the complete example below.

## Making a cover of an existing song

YuE2 can also restyle a song that already exists:

1. Get the melody as a score (the project's companion tool, [SheetSage2](https://huggingface.co/m-a-p/SheetSage2), can transcribe an existing recording into notation).
2. Get the lyrics, split into sections matching the recording.
3. Write a new style prompt describing the sound you want instead, and generate with `cot="melody"`.

The result keeps the original melody and words but performs them in a new style - for example, turning a folk song into a heavy metal track.

<!-- ## Editing a song after it's generated

Because YuE2 keeps the plan (the ABC score) separate from the final audio, you can revise a song without starting over. You can hand-edit the score yourself, or describe the change you want in plain language (for example, "make the harmony more jazzy and add a saxophone solo") and let an editing agent update the score and style prompt for you. YuE2 then renders the updated version from the revised plan. -->

## A complete example, put together

**Song with lyrics**

**Style prompt:**

```
Indie pop, bright acoustic guitar, soft drums, warm female lead vocal, hopeful
```

**Lyrics:**
```
[Verse]
Streetlights flicker on an empty road
Every step feels lighter than it's ever showed

[Pre-Chorus]
Something's changing, I can feel it grow
Every heartbeat tells me where to go

[Chorus]
We are rising with the morning sun
Nothing's over till the story's done
Hold my hand and we will find the way
Turning shadows into brighter days

[Bridge]
Quiet streets are singing back to me
Every doubt is finally set free

[Chorus]
We are rising with the morning sun
Nothing's over till the story's done
Hold my hand and we will find the way
Turning shadows into brighter days

[Outro]
Brighter days, brighter days
```

Notice the structure: labeled sections, a blank line between each one, no written intro, a repeated chorus written out in full, and a style prompt that covers genre, instruments, mood, and vocal type.

**Instrumental version**

Same song, same arrangement, just nobody singing. Every section tag stays exactly where it was - only the lyric lines underneath them and the vocal-related words in the style prompt are gone:

**Style prompt:**

```
Indie pop, bright acoustic guitar, soft drums, hopeful, instrumental
```

**Lyrics:**
```
[Verse]

[Pre-Chorus]

[Chorus]

[Bridge]

[Chorus]

[Outro]
```

This is different from leaving `lyrics` empty altogether - YuE2 still needs the section tags to plan the arrangement, it just has no words to set a melody to.

## Quick checklist before you generate

- Every section has a `[Label]` in square brackets
- There's a blank line between every section
- The song starts with `[Verse]` or `[Chorus]`, not a lyric-filled `[Intro]`
- Each section is short enough to sing in about 30 seconds
- Lines that repeat (like the chorus) have a similar syllable count each time
- Repeated sections are written out in full, not shortened
- The lyrics contain only words meant to be sung - no stage directions
- The style prompt covers genre, instruments, mood, and vocal type
- The lyrics' language matches the genre described in the style prompt

Follow these and you'll get songs from YuE2 that sound much closer to what you actually had in mind.

## Sources and further reading

- Official model card: [huggingface.co/m-a-p/YuE2-3B](https://huggingface.co/m-a-p/YuE2-3B)
- Code repository and prompt engineering guide: [github.com/multimodal-art-projection/YuE](https://github.com/multimodal-art-projection/YuE)
- Live demo page: [map-yue2.github.io](https://map-yue2.github.io/)
- Instructions for Agents/LLMs to create songs: [yue2-prompt-rules.md](/yue2-prompt-rules.md)
