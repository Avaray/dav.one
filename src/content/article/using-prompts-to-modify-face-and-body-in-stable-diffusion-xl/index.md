---
title: 'Using prompts to modify face and body in Stable Diffusion XL'
description: "The model you choose and the prompts you write are the most significant factors in generating realistic images. If you don't specify exactly how the generated person should look, they will most likely resemble those on which the model was trained. In this article, you'll see how you can manipulate the appearance of a generated person using just prompts."
created: 'Aug 30 2024'
icon: 'i-game-icons:dodging'
draft: true
---

## The Basics

**The model** you choose has the most significant impact on the quality of the generated images.
It's very important to choose the right model for the work you want to do.
There are models trained to generate realistic images of people, general models that can generate anything, models targeted at generating anime or cartoon styles, and many more. You can find them on popular website [CivitAI.com](https://civitai.com/models?ref_code=ADD-THI).
In case of Realistic Person Generation, I recommend using [RealVis](https://civitai.com/models/139562?modelVersionId=789646), [ZavyChroma](https://civitai.com/models/119229?modelVersionId=641087) and [CHINOOK](https://civitai.com/models/400589?modelVersionId=495482). The first one is my personal favorite in moment of writing this article. 
Every model has its own strengths and weaknesses. You need to find the one that suits your needs best.

The second most important factor are **the prompts** you write. Positive and Negative.
They have impact on the appearance of the generated person and the overall quality of the image.
If you don't specify exactly how the generated person should look, they will most likely resemble those on which the model was trained.
I don't remember how many times I've seen people talking on [Reddit](https://www.reddit.com/r/StableDiffusion/) about seeing the same faces in generated images. 
You have many possibilities to manipulate the appearance of the generated person using just prompts.
Starting from the face shape, through the hair style, skin tone, body type, specific body parts, age, nationality and more.
Fun fact, even prompting a name of the person can have an impact on the final image.
And at the end, you can use specific keywords to make the generated person looks a bit different.

The third factor is **configuration** in your UI. Image resolution, Sampler, number of Sampling Steps and Guidance Scale are the most important things. Each of them has a huge impact on the final image. Higher resolution means more details will be visible. It's like giving artist a bigger canvas to paint on. Sampler has control over image generation process and each sampler can produce different results.
More Sampling Steps means more details will be rendered. Skin and clothes will have better textures. More objects will appear on generated image. Guidance Scale is a multiplier for the influence of the prompts on the final image. 
So, with higher Guidance Scale, the prompts will have more impact on the final image.

## Negative prompt

Let's start with the negative prompt and then move on to the positive things.
Negative prompts are not just for specifying objects that should not appear in the generated image, but they also can have an impact on the quality of the generated image. They are not required, but from my experience, they helps. In my own works I prefer to use [Negative Embeddings](https://wiki.civitai.com/wiki/Embedding) - because they are more convinient to use. I can recommend you to use [NDXL](https://civitai.com/models/454470/negative-dynamics-xl), [FiXL](https://civitai.com/models/385105/fixl?modelVersionId=429806) or [ACNeg1](https://civitai.com/models/148131?modelVersionId=166373) (you can mix them, but using only one should be enough). Anyway, for the purpose of this article, let's create short negative prompt. We will specify what we don't want to see in the generated image. 

```
worst quality, low quality, low resolution, painting, illustration, cartoon, sketch, 3d, 2d, blurry, grainy, pixelated, distorted, poorly drawn, bad anatomy, unrealistic proportions, text, watermark, signature, error, artifact
```

## Positive prompt - What we want to generate

Let's generate a photography of a real person. Let the woman be the subject of our work and let's start our positive prompt by specifying that we want to generate a photography of a woman. Prompting hard on the photography types will help us to generate a realistic image. 

```
photoshoot, photo studio, RAW photo, editorial photography, film stock photography, a photography of a woman
```

Keep in mind that:
- Different models might work with different keywords. Always check the documentation of the model you are using.
  Some models might react more to the specific keywords than others.
- Using `Realistic` keyword might make your person look less realistic. That's because the model might think that you want to generate a realistic painting or illustration. It's better to avoid this keyword.

We have basic stuff covered. We can move on to the modifications.

## Face Features

We can specify all the face features we want to modify. Starting from the face shape, through the eyes, nose, mouth, ears, chin, cheeks, forehead, eyebrows, freckles, moles, scares, wrinkles, facial hair and ending on expressions (hope I didn't forget anything). We can describe them in a way that we want them to be. 

Examples: `oval face shape`, `bushy eyebrows`, `big eyes`, `wide nose`, `full lips`, `double chin`, `freckles on the cheeks`, `wrinkles around the eyes`.

## Hair Style and Color

Good thing is that Stable Diffusion knows some hair styles. But probably you don't know them. 
You can ask AI for the list, browse the internet, read some fashion magazines or just find the [list that already exists](https://github.com/Avaray/stable-diffusion-simple-wildcards/blob/sdxl/wildcards/hairstyles.txt). When you find the name of the hair style you like, you can use it in the prompt, combining it with the color (if you want).

Examples: `long dark hair`, `short curly hair`, `blonde double bun`, `twisted bangs`, `pink dreadlocks`.

Keep in mind that:
- Unnatural hair colors (like blue, yellow, green, etc.) are harder to generate.
- Prompts containing specific words like `pearl`, `orange` or `pineapple` might generate these objects instead of affecting the hair.

## Skin

You can describe the skin tone, texture, and any other skin features you want to see.

Examples: `dark skin`, `pale skin`, `detailed skin texture`, `freckles on the skin`, `freckles on the shoulders`, `tan`, `tan lines`, `saggy skin`, `wet skin`.

## Body Type

You can modify the body type in three ways. 

1. By describing the person's profession like: `athlete`, `sumo wrestler`, `bodybuilder`.
1. By specifying the body type like: `slim body type`, `chubby body type`, `muscular body type`, 
2. By specifying individual body parts like: , `long legs`, `big belly`, `muscular arms`.

TODO

<!-- tutaj tez wspomniec o wzroscie -->

## Nationality

Prompting Nationalities is connected with the skin tone, facial features and body types.

You can get large list of nationalities [here](https://github.com/Avaray/stable-diffusion-simple-wildcards/blob/sdxl/wildcards/nationalities.txt).

TODO

## Body Type

<!-- tutaj tez wspomniec o wzroscie -->

## Age

## Scenery

## Lighting

## Camera Type and Film

## Year and Style


### 

I used resolution of `768x1366`, `DPM++ 3M SDE Karras`, `45 Sampling Steps`, `Guidance Scale 6` and `CLIP_SKIP 1`.
