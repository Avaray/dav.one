---
title: 'Useful links for daily work with Stable Diffusion'
description: 'A simple list of useful websites, places and tools that will help you in your daily work with Stable Diffusion.'
created: '2023-10-06T13:37:00.000Z'
updated: '2025-06-21T16:42:03.377Z'
icon: 'game-icons:andromeda-chain'
author: 'Dawid Wasowski'
---

## User Interfaces

- [Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) and
  [reForge](https://github.com/Panchovix/stable-diffusion-webui-reForge)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- [Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [InvokeAI](https://github.com/invoke-ai/InvokeAI)
- [Fooocus](https://github.com/lllyasviel/Fooocus)
- [Kohya](https://github.com/bmaltais/kohya_ss)
- [SwarmUI](https://github.com/mcmonkeyprojects/SwarmUI)
- [SD.Next](https://github.com/vladmandic/automatic)

## Applications

- [Stability Matrix](https://github.com/LykosAI/StabilityMatrix) - a Multi-Platform Package Manager for Stable
  Diffusion. You can use it to download and run your favorite UI locally without unnecessary configuration.
- [LynxHub](https://github.com/KindaBrazy/LynxHub) - another Multi-Platform Package Manager for Stable Diffusion. It's a
  newer tool than Stability Matrix. Released in August 2024.
- [chaiNNer](https://chainner.app/) - a node-based image processing GUI aimed at making chaining image processing tasks
  easy and customizable. You can find models on [OpenModelDB](https://openmodeldb.info/).
- [TagGUI](https://github.com/jhc13/taggui) - cross-platform desktop app for adding and editing image tags and captions.
- [DatasetEditor](https://github.com/Jelosus2/DatasetEditor) - Windows app for editing datasets. Currently at early
  stages of development. Includes "autotagger" tool that lets you tag images automatically. Autotagger currently
  supports only [Pony Diffusion](https://civitai.com/models/257749/pony-diffusion-v6-xl) models, but
  [author](https://github.com/Jelosus2) said it will be extended to other models.
- [VastAI Docker Images](https://github.com/ai-dock) <div class="badge badge-soft badge-warning">Outdated</div> -
  containerized UIs such as [Forge](https://hub.docker.com/r/vastai/sd-forge),
  [ComfyUI](https://hub.docker.com/r/vastai/comfy), and [Fooocus](https://hub.docker.com/r/vastai/fooocus), built on
  their [base image](https://github.com/vast-ai/base-image), which can be run on either a local machine or a
  [rented server](/useful-links-for-daily-work-with-stable-diffusion#server-rentals).

## Models

- [CivitAI](https://civitai.com/?ref_code=ADD-THI) - the best place to find great Checkpoints, Lora's, Embeddings and
  more. Almost every model has some images generated using it. So you can easily find out if it's worth downloading.
  Also it's a great place for inspiration.
- [HuggingFace](https://huggingface.co/) - a platform for sharing and deploying AI models.\
  I recommend checking out the [Spaces](https://huggingface.co/spaces?sort=trending&search=sdxl) section and especially
  [LoRA Studio](https://huggingface.co/spaces/enzostvs/lora-studio).
- [OpenModelDB](https://openmodeldb.info/) - a community driven database of AI Upscaling models.

## Server rentals

- [Vast.ai](https://cloud.vast.ai/?ref_id=62878&creator_id=42512&name=null) - a great place to rent a server for your
  work. You can find there a lot of different configurations and prices. Servers are located around the world. This
  service has the best prices.
- [Runpod.io](https://runpod.io?ref=gzvzzzv9) - a bit more expensive than Vast and has a worse server browser, but it’s
  still a good place to rent a server.

## Styles and Studies

- [SDXL Artistic Studies](https://rikkar69.github.io/SDXL-artist-study/) - awesome studies on
  [Artists](https://rikkar69.github.io/SDXL-artist-study/tags/),
  [Art Mediums](https://rikkar69.github.io/SDXL-artist-study/art-mediums/),
  [Art Movements](https://rikkar69.github.io/SDXL-artist-study/art-movements/),
  [Camera Models](https://rikkar69.github.io/SDXL-artist-study/cameras/),
  [Camera Films](https://rikkar69.github.io/SDXL-artist-study/film/). I highly recommend last two, because they are very
  useful in realistic photography generation.
- [SDXL Artist Style Studies](https://sdxl.parrotzone.art/) - probably the biggest collection of artist styles for SDXL.
- [SDXL Artists Browser](https://huggingface.co/spaces/terrariyum/SDXL-artists-browser) - browser for SDXL artists.
- [Stable Diffusion 1.5 Artists Cheat Sheet](https://supagruen.github.io/StableDiffusion-CheatSheet/) - a cheat sheet
  for Stable Diffusion 1.5. Might not work with newer models like SDXL.
- [Lighting Types in SDXL](https://www.reddit.com/r/StableDiffusion/comments/1cjwi04/made_this_lighting_guide_for_myself_thought_id/) -
  a Reddit post showing different lighting types in SDXL.
- [Nationalities in Stable Diffusion](https://www.reddit.com/r/StableDiffusion/comments/13oea0i/photorealistic_portraits_of_200_ethinicities/) -
  a Reddit post showing different nationalities in Stable Diffusion 1.5. It works with SDXL too.

## Tools

- [CLIP Interrogator](https://huggingface.co/spaces/pharmapsychotic/CLIP-Interrogator)
  <div class="badge badge-soft badge-warning">Currently broken</div> - analyzes images and generates descriptive text
  prompts for SD1 & SDXL. [This one](https://huggingface.co/spaces/fffiloni/CLIP-Interrogator-2) is for SD2 and
  [this one](https://huggingface.co/spaces/deepghs/wd14_tagging_online) is for Pony Diffusion.
- [Diffusion Tokenizer](https://sd-tokenizer.rocker.boo/) - converts text prompts into numerical tokens used by
  diffusion models.

## Tutorials

- [stable-diffusion-art.com](https://stable-diffusion-art.com/tutorials/) - a great website with many useful tutorials.
  Each tutorial is focused on a specific topic. You can find basics as well as more advanced tutorials there.
- [Articles @ CivitAI](https://civitai.com/articles?ref_code=ADD-THI) - there are many guides created by the community.
  Some are great and some are useless. You need to find good ones by yourself.
- [ComfyUI Examples](https://comfyanonymous.github.io/ComfyUI_examples/) - some examples of how to use
  [Nodes](https://comfyui-wiki.com/en/interface/node-options) in ComfyUI.

## Communities

- [Stable Diffusion @ Reddit](https://www.reddit.com/r/StableDiffusion/) - a place where you can find news related to
  [Stable Diffusion](https://stability.ai/stable-image) and [Flux](https://blackforestlabs.ai/) models. You can find
  there many interesting works and discussions. That's also a good place to ask for help if you have any problems with
  your work.

## Discord Servers

All of the following Discord servers are great places to ask for help, share your work, and find inspiration. You need
to find your favorite one by yourself.

- [CivitAI.com](https://discord.gg/civitai)
- [AI Revolution](https://discord.gg/bQPPbaHtdt)
- [AI Art with Sebastian Kamph](https://discord.gg/vVCWFhMsrx)
- [Stable Diffusion](https://discord.gg/stablediffusion)

## YouTube Channels

All of the following YouTube channels offer useful tutorials and interesting content.

- [Olivio Sarikas](https://www.youtube.com/@OlivioSarikas/videos)
- [Sebastian Kamph](https://www.youtube.com/@sebastiankamph/videos)
- [Aitrepreneur](https://www.youtube.com/@Aitrepreneur/videos)
- [Nerdy Rodent](https://www.youtube.com/@NerdyRodent/videos)
