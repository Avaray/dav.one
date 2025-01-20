---
title: 'The ways and costs of generating graphics using Stable Diffusion'
description: 'An in-depth comparison of generation methods, helping you choose between investing in hardware, renting cloud services, or using web platforms. Includes practical insights on costs, performance, and limitations.'
created: '1690119420000'
updated: '1724765820000'
icon: 'game-icons:take-my-money'
---

## Generating images on your own computer

If you have top-tier graphics card like
[Nvidia RTX4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/)
or you can afford to buy a top-tier graphics card, it will be the best option
for you to work on your own computer, and you can pretty much stop reading this
article right now. You will work on your own hardware and won't be dependent on
anyone.

A poor computer can prevent you from generating graphics or it will greatly slow
down your work. The minimum requirement to start is a graphics card with at
least 6GB [VRAM](https://en.wikipedia.org/wiki/Video_random-access_memory). You
will be able to generate graphics in low resolution. It will require a lot of
time investment to generate images - and generated images may not necessarily
satisfy you.

<!-- In short, the more VRAM you have, the higher resolution images you can generate. -->

Let's do some calculations.

On RTX4090, generating basic image using any Stable Diffusion 1.5 model with a
resolution of 768x768 pixels and Sampling Steps 75 takes about 5 seconds, while
on my old Nvidia GTX1660, it takes about 30 seconds. Now add the need to use a
very popular extensions like
[ControlNet](https://github.com/lllyasviel/ControlNet) and
[ADetailer](https://github.com/Bing-su/adetailer). The time for generating
graphics will increase significantly. On RTX4090, it will take about 10-15
seconds, while on GTX1660, it can take up to 2 minutes. Keep in mind that I
didn't mention the [Upscaling](https://stable-diffusion-art.com/ai-upscaler/),
which extremely increases generation times.

Based on the average generation time, you will generate either 300 images with
RTX4090 or 40 with GTX1660 per hour using the previously mentioned settings.

Now imagine these calculations were based on Stable Diffusion 1.5, which is an
old model. The newer popular models like
[SDXL](https://stability.ai/news/stable-diffusion-sdxl-1-announcement) or
[FLUX](https://blackforestlabs.ai/) are much more demanding in terms of hardware
requirements.

The amount of time you'll spend on a weak computer might be sick.

## Renting Servers

The most sensible if you have a weak computer and you don't have money to buy a
new graphics card Just Like That. You can rent servers with top tier graphics
cards. You can even rent a server with multiple graphics cards. In the case of
these services, the prices per hour are fixed, which is good. You know how much
you pay. You can deposit as much money as you want and rent a server even for a
few minutes (which will cost you few cents). In the moment of writing this
article, the price for renting a community server with single RTX4090 is about
$0.20 per hour. Prices are changing depending on the time of day and the demand
for servers. Mostly, the prices are cheaper at weekends.

Services mentioned below allow you to run
[Docker](https://docs.docker.com/get-started/overview/) images. You can select a
"Template" with a ready-to-use User Interfaces (UI) for Stable Diffusion like
[Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui),
[ComfyUI](https://github.com/comfyanonymous/ComfyUI),
[InvokeAI](https://github.com/invoke-ai/InvokeAI),
[Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge),
[Fooocus](https://github.com/lllyasviel/Fooocus) and more.

Before choosing a Docker image, familiarize yourself with its documentation.
Personally, I recommend [AI-Dock](https://github.com/ai-dock) based images. They
give you ability to quick start with
[Provisioning Script](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script).
I even created a repository containing templates with awesome models, you can
find it [here](https://github.com/Avaray/stable-diffusion-templates).

I recommend only these two services, which confirmed to me that you won't lose
the money you've deposited. The first one is my personal favorite.

### [Vast.ai](https://cloud.vast.ai/?ref_id=62878&creator_id=42512&name=null)

Best prices. Mentioned
[on Reddit](https://www.reddit.com/r/StableDiffusion/search/?q=vast.ai&restrict_sr=1&type=comment&sort=top)
many times. Clear website. You have server browser showing all (available and
unavailable) servers along with many details about them (showing their
performance, reliability, geo-locations, network speeds and much more). You have
many sorting options that will make it easier for you to choose a server that
meets your requirements. They provide API, so you can automate things if you are
a programmer.

### [Runpod.io](https://runpod.io?ref=gzvzzzv9)

More expensive than Vast. Mentioned
[on Reddit](https://www.reddit.com/r/StableDiffusion/search/?q=runpod.io&restrict_sr=1&type=comment&sort=top)
many times too. It's also an easy and simple website. However, it has much less
information about servers.

## Using Google Colab

[Google Colab](https://colab.research.google.com/) is a free service, but you
need to pay to use Web UI's. I personally used both the free version (before the
company's policy changed) and the paid version (before and after changes). The
image generation was relatively fast. Sometimes, the speed of generating images
in the Pro version was the same as the free version, which concerned me. It's
good that it consumes fewer credits (deposited funds) when you are not using
[GPU](https://en.wikipedia.org/wiki/Graphics_processing_unit). You can take a
break, ride to grocery store. But when you work it might consume your credits
rapidly! You don't know what costs to expect. That's the very reason why I
stopped using Google Colab. The second reason was that after a month, credits
are blocked, and in order to use them, You need to reactivate Colab Pro. If this
is not done, all credits will be lost after 90 days (seriously, Google?).

I think that Google Colab is a good place for training models, but not for
generating graphics. If you wan't to pay for a service, I recommend
[renting a server](/the-ways-and-costs-of-generating-graphics-using-stable-diffusion#renting-servers).

Recently, I've found a repository that allows you to use InvokeAI on Free Tier.
You can find it [here](https://github.com/i-huzaifa-arshad/InvokeAi-Colab). I
assume that with [tunneling](https://ngrok.com/our-product/secure-tunnels), it's
possible to use other UIs. However, I don't intend to check it, as generating
images on Colab is currently several times slower than on a single RTX4090. For
me, it's not worth it.

## Dedicated Websites

Dedicated Websites (online generators) are the best place for people who have
never generated anything before and want to see "what this AI-generated art is
all about?". You'll most likely need to register, and you'll receive virtual
currency that you can use to generate a certain number of images. You don't
really require any technical knowledge or installing anything on your computer.
You just write a prompt and wait for the image to be generated. Good websites
will let you tweak the settings and choose a cool model. I will not promote any
of them. You can search for them
[by yourself](https://www.perplexity.ai/search/list-of-online-ai-art-generato-yhjt_nEcR0qd4WlJdSfx8Q).

However, they come with limitations.

- You won't be able to use most of the models and add-ons created by the
  community.
- You won't have access to advanced configurations, all samplers and cool
  extensions.
- Certain prompts might be prohibited, so you won't be able to generate images
  you like.
- Most likely, you won't be able to compete with professional artists.

The biggest cost here is not money or time - **it's sacrificing freedom and
capabilities for convenience**.

## Finish

Time is money, and money is time. Sometimes you have to sacrifice something
else.

My intention was to show you that there are several possibilities for graphic
generation. This article should help you decide where you will generate your
future masterpieces.
