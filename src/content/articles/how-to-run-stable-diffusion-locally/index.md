---
title: 'How to run Stable Diffusion locally on your computer'
description: "If you want to run Stable Diffusion locally on your computer and don't know the best way to do it, this article will help you choose the right method."
created: 'Aug 28 2024'
updated: 'Oct 04 2024'
icon: 'cbi:desktop-computer'
---

## Hardware requirements

The minimum requirement is a computer with a graphics card that has at least 6GB
[VRAM](https://en.wikipedia.org/wiki/Video_random-access_memory). It is possible
to work on 4GB with some tweaks, but in my opinion, it's not worth trying. The
perfect scenario is to have a top-tier graphics card like
[Nvidia RTX4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/).
I recommend reading the article about
[the ways and costs of generating graphics](/the-ways-and-costs-of-generating-graphics-using-stable-diffusion)
before you start.

## Installers

Some of popular User Interfaces (UIs) have their own installers. Even if that's
just a simple script that downloads and configures everything for you, it's
still an installer. It's better than forcing users to execute commands manually
in the [terminal](https://en.wikipedia.org/wiki/Computer_terminal).

This is the list of popular UIs with installers:

- [Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- [Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [InvokeAI](https://github.com/invoke-ai/InvokeAI)
- [Fooocus](https://github.com/lllyasviel/Fooocus)
- [StableSwarmUI](https://github.com/Stability-AI/StableSwarmUI)

You need to read the documentation of each installer to know how to use it. Some
of them has significantly better performance than others. Some of them supports
[FLUX](https://blackforestlabs.ai/), some not yet. Each of them has different
features, so you need to choose the one that suits your needs.

Cons:

- You may encounter problems with installation and running. Be prepared to spend
  some time on manual configuration and fixing errors.
- You may need to learn how to use
  [Symbolic Links](https://en.wikipedia.org/wiki/Symbolic_link) to share models
  between UIs.

## Stability Matrix

[Stability Matrix](https://github.com/LykosAI/StabilityMatrix) is a
Multi-Platform Package Manager for Stable Diffusion. Supports Windows, Linux and
MacOS. You can use it to download and run
[UIs](/how-to-run-stable-diffusion-locally#installers) locally without
unnecessary configuration.

Pros:

- Easy to use.
- You don't need to install requirements manually.
- You can have multiple UIs installed at the same time and share models between
  them.
- Has model browser that allows you to download models directly.

## LynxHub

[LynxHub](https://github.com/KindaBrazy/LynxHub) is another Multi-Platform
Package Manager for Stable Diffusion. Released for public in August 2024.
Basically it does the same thing as
[Stability Matrix](/how-to-run-stable-diffusion-locally#stability-matrix). Has a
bit different features and UI.
[Here](https://www.reddit.com/r/StableDiffusion/comments/1f1ksb9/comment/lk0ft46/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
is a comment from the author about the differences between them. Personally, I
didn't have a chance to do large tests of LynxHub yet.

Pros:

- Easy to use.
- Nice looking User Interface.

## Pinokio

[Pinokio](https://pinokio.computer/) - is "a browser that lets you install, run,
and programmatically control ANY application, automatically". Pinokio is not
focused on Stable Diffusion, but you can use it to run popular UIs. Community
feedback is positive. However, due to the issues mentioned below, I have not
tested it good enough yet.

Cons:

- Terrible App installer. You need to specify the path to install the app
  manually. And if that path already exists, you will need to delete it first.
- Has issues with App State Management. You can clearly see that when you change
  settings.
- Terrible UI/UX.

## Docker

[Docker](https://www.docker.com/) is a platform that enables developers to
automate the deployment of applications inside lightweight, portable containers.
In easy words - you download an file that contains everything you need to run
Stable Diffusion and you launch it. Anyway, it's a bit more complicated than
previous methods, because you will need to:

- [Install and configure Docker](https://www.docker.com/get-started/).
- Select and download proper image from [Docker Hub](https://hub.docker.com/).
  Each image has different features and requirements. So you will need to spend
  some time on searching.
- Configure Container. For this part you will need to read the documentation of
  the image you downloaded. In most cases you will need to set up just a few
  environment variables.

Pros:

- You can switch between different Docker images.
- It's secure. Things are isolated from your system. Even if you will run a
  [Pickle Tensor](https://huggingface.co/docs/hub/en/security-pickle#why-is-it-dangerous)
  model, it won't harm your computer.

Cons:

- Sharing models between Docker images is harder. You will need to
  [configure it](https://docs.docker.com/get-started/docker-concepts/running-containers/sharing-local-files/).

There are tons of Docker images created by the community. You need to find the
one that suits your needs. Check
[Docker Hub](https://hub.docker.com/search?q=stable%20diffusion) and
[GitHub](https://github.com/search?q=stable%20diffusion%20docker&type=repositories).
Personally, I recommend using [AI-Dock](https://github.com/ai-dock) images. They
are well maintained and they give you a cool feature to use
[Provisioning Scripts](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script)
to "perform certain actions when starting a container, such as creating
directories and downloading files".
