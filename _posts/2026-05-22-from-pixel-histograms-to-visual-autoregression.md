---
layout: post
title: "From Pixel Histograms to Visual Autoregression: How Images Learn to See Themselves"
date: 2026-05-22 12:00:00 -0700
tags: computer-vision VAR autoregressive CNN ViT embeddings image-generation
math: true
---

In this post we are going to walk through image generation evolution to understand how neural networks learn to see. Across the evolution of  large language models: all the way from most popular token in Markov chains to GPT, compression pressure forces models to increase prediction power. In vision with analogy to LLMs, we show that by changing representation we achieve better intelligence, i.e. higher quality generation. The entire evolution is being able to predict the next token with a better accuracy.
As a bonus, we get to see what each representation captures and at which cost.

---

> The core insight is a direct analogy from language models: prediction pressure forces spatial compression. Spatial compression forces hierarchical abstraction. Hierarchical abstraction is what we call seeing.

---

###### Stage 0: Random Pixels

We start by predicting random pixels. To do so we sample each pixel uniformly from 0 to 255 RGB, that generates television static. This is the visual equivalent of the same mechanism of sampling random words from a dictionary. 

---

###### Stage 1: Color Histograms

As a next step, we now sample pixels weighted by the color distribution of a real image. 
And this is an equivalent of a visual unigram, where histogram compresses 200,000 pixel (256x256x3 image) values into 256 frequency counts.  The compression ratio is enormous, so what survives that compression is a palette, but we still have zero spatial structure. Visually we see that colors that are more frequently occuring have a higher chance of being selected. 

---

###### Stage 2: Local Filters

Now we give the model a concept of neighbors. Instead of treating each pixel in isolation, we look at small local patches. This is what classical computer vision was focusing for decades from 1960s: like  edge detectors, Gabor filters, texture synthesis approaches, etc. More recently, Portilla and Simoncelli (2000) showed that a richer set of local statistics (correlations between filter responses across scales and orientations) could produce remarkably convincing textures, but the approach still could not generate objects or scenes.

The result though is significantly better than random histograms. Local filters can produce convincing textures: wood grain, fur, woven fabric, grass. The generated patches look locally plausible, especially when zoomed any small region, it could pass for the real thing as the model has learned neighbourhoods.
But since there is no global coherence, the zoomed out picture doesn't make any sense. 

<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2rem 0; overflow-x: auto;">
<div style="min-width: 600px; padding: 8px 0;">
<div style="display: flex; gap: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <!-- Text Markov -->
  <div style="flex: 1; text-align: center;">
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 10px;">Text: Bigram</div>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px 12px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: nowrap;">
        <span style="font-size: 13px; color: #a1a1aa; background: #f4f4f5; border-radius: 6px; padding: 6px 10px;">the</span>
        <span style="font-size: 13px; color: #a1a1aa; background: #f4f4f5; border-radius: 6px; padding: 6px 10px;">white</span>
        <span style="font-size: 14px; color: #fff; background: #f97316; border-radius: 6px; padding: 6px 10px; font-weight: 600;">rabbit</span>
        <span style="font-size: 13px; color: #a1a1aa; background: #f4f4f5; border-radius: 6px; padding: 6px 10px;">?</span>
      </div>
      <svg width="100%" height="40" viewBox="0 0 200 40" style="display: block; margin: 8px auto 0;">
        <defs><marker id="markov-ah" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#f97316"/></marker></defs>
        <path d="M 80 8 C 80 30, 120 30, 120 8" stroke="#f97316" stroke-width="1.5" fill="none" marker-end="url(#markov-ah)" stroke-dasharray="4,3"/>
      </svg>
      <div style="font-size: 11px; color: #71717a; margin-top: 2px;">P(? | rabbit) from lookup table</div>
    </div>
  </div>

  <!-- Equals sign -->
  <div style="display: flex; align-items: center; flex-shrink: 0;">
    <span style="font-size: 22px; color: #d4d4d8; font-weight: 300;">≈</span>
  </div>

  <!-- Visual Markov -->
  <div style="flex: 1; text-align: center;">
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 10px;">Vision: 3x3 Filter</div>
    <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px 12px;">
      <div style="display: inline-grid; grid-template-columns: repeat(5, 28px); grid-template-rows: repeat(5, 28px); gap: 2px;">
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #f97316; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #ffedd5; border: 2px solid #fb923c; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
        <div style="background: #e4e4e7; border-radius: 3px;"></div>
      </div>
      <div style="font-size: 11px; color: #71717a; margin-top: 10px;">P(center | 8 neighbors)</div>
    </div>
  </div>

</div>
<div style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Both models condition on a small local window. Both fail when structure extends beyond that window.</div>
</div>
</div>

This is the exact analog of Markov chains in text. A bigram model generates locally plausible word pairs that collapse over longer distances. A trigram model produces convincing sentence fragments that contradict themselves a few sentences later. Local filters produce convincing texture patches that never organize into meaningful wholes. In both cases, the model has memorized local co-occurrence statistics and has zero capacity to represent global structure.

The failure mode is also parallel. Markov text generators fall into loops: "the rabbit was not a moment to be no use in the door." Texture synthesis algorithms fall into tiling: the same 50x50 patch of grass repeats forever because the local matching procedure keeps finding the same nearest neighbor. So the visual Markov loop can be thought as a texture tile.


###### The $O(V^n)$ Wall and  Why Compression Discovers Hierarchy
There is also a visual analogy for the storage problem that overwhelms n-gram language models. 
If you want to build a lookup table of all possible 3x3 grayscale patches, you need $256^9 \approx 5 \times 10^{21}$ entries. That is already impossibly large. For color patches it becomes $256^{27}$. Extending to 8x8 patches (which are still far too small to capture objects) gives $256^{192}$. 

Just as language models hit the $O(V^n)$ wall where expanding the n-gram context creates exponentially more table entries, visual models hit the same wall where expanding the patch size creates exponentially more pixel combinations. So both domains independently evolve to the same direction: replace the discrete lookup table with a continuous learned representation that compresses the space.



<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2rem 0; overflow-x: auto;">
<div style="min-width: 600px; padding: 8px 0;">
<div style="display: flex; align-items: stretch; gap: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <!-- Pixels -->
  <div style="flex: 1; text-align: center;">
    <div style="background: #f4f4f5; border: 2px solid #d4d4d8; border-radius: 12px; padding: 14px 8px; margin: 0 3px; min-height: 130px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">Input</div>
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 4px;">Raw Pixels</div>
      <div style="font-size: 11px; color: #a1a1aa;">196,608 values<br>not reusable</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; flex-shrink: 0; padding: 0 1px;">
    <svg width="28" height="20" viewBox="0 0 28 20"><defs><marker id="ch1" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#d4d4d8"/></marker></defs><line x1="0" y1="10" x2="20" y2="10" stroke="#d4d4d8" stroke-width="2" marker-end="url(#ch1)"/></svg>
  </div>

  <!-- Edges -->
  <div style="flex: 1; text-align: center;">
    <div style="background: #fefce8; border: 2px solid #fde68a; border-radius: 12px; padding: 14px 8px; margin: 0 3px; min-height: 130px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a16207; margin-bottom: 6px;">Layer 1</div>
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 4px;">Edges</div>
      <div style="font-size: 11px; color: #a1a1aa;">shared across<br>all categories</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; flex-shrink: 0; padding: 0 1px;">
    <svg width="28" height="20" viewBox="0 0 28 20"><defs><marker id="ch2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#fbbf24"/></marker></defs><line x1="0" y1="10" x2="20" y2="10" stroke="#fbbf24" stroke-width="2" marker-end="url(#ch2)"/></svg>
  </div>

  <!-- Textures -->
  <div style="flex: 1; text-align: center;">
    <div style="background: #fff7ed; border: 2px solid #fb923c; border-radius: 12px; padding: 14px 8px; margin: 0 3px; min-height: 130px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #c2410c; margin-bottom: 6px;">Layer 2</div>
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 4px;">Textures</div>
      <div style="font-size: 11px; color: #a1a1aa;">shared across<br>many categories</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; flex-shrink: 0; padding: 0 1px;">
    <svg width="28" height="20" viewBox="0 0 28 20"><defs><marker id="ch3" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#fb923c"/></marker></defs><line x1="0" y1="10" x2="20" y2="10" stroke="#fb923c" stroke-width="2" marker-end="url(#ch3)"/></svg>
  </div>

  <!-- Parts -->
  <div style="flex: 1; text-align: center;">
    <div style="background: #fff1e6; border: 2px solid #f97316; border-radius: 12px; padding: 14px 8px; margin: 0 3px; min-height: 130px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ea580c; margin-bottom: 6px;">Layer 3</div>
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 4px;">Parts</div>
      <div style="font-size: 11px; color: #a1a1aa;">shared within<br>category families</div>
    </div>
  </div>

  <div style="display: flex; align-items: center; flex-shrink: 0; padding: 0 1px;">
    <svg width="28" height="20" viewBox="0 0 28 20"><defs><marker id="ch4" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#f97316"/></marker></defs><line x1="0" y1="10" x2="20" y2="10" stroke="#f97316" stroke-width="2" marker-end="url(#ch4)"/></svg>
  </div>

  <!-- Objects -->
  <div style="flex: 1; text-align: center;">
    <div style="background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 2px solid #ea580c; border-radius: 12px; padding: 14px 8px; margin: 0 3px; min-height: 130px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #dc2626; margin-bottom: 6px;">Layer 4</div>
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 4px;">Objects</div>
      <div style="font-size: 11px; color: #a1a1aa;">category-specific<br>abstractions</div>
    </div>
  </div>

</div>

<!-- Annotation bar -->
<div style="display: flex; gap: 0; margin-top: 10px; font-size: 11px; color: #a1a1aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="flex: 1; text-align: center; padding: 6px 4px; border-top: 2px solid #d4d4d8;">most specific<br>least reusable</div>
  <div style="flex: 0 0 28px;"></div>
  <div style="flex: 3; text-align: center; padding: 6px 4px;"></div>
  <div style="flex: 0 0 28px;"></div>
  <div style="flex: 1; text-align: center; padding: 6px 4px; border-top: 2px solid #ea580c;">most abstract<br>most reusable</div>
</div>
<div style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Compression forces compositionality. Each layer throws away irrelevant detail and keeps reusable structure.</div>
</div>
</div>


This is the key section of the post. The argument for language is well-known: the $O(V^n)$ wall forces Word2Vec-style embeddings, and prediction pressure accidentally discovers king - man + woman = queen. 

The argument for vision is the same. A system that recognizes cats cannot memorize images. The same cat under different lighting, angle, and background produces pixel arrays as different as a cat and a truck, so the lookup table becomes impossible. So the system must learn a representation that throws away everything irrelevant (pixels, lighting, background) and keeps only what matters (pointed ears, whiskers, slit pupils).

The compression that best serves recognition turns out to be compositional. Edge detectors are reusable across all categories, so they emerge first. Texture detectors reuse across many categories, so they emerge next. Part detectors reuse within category families. Object detectors are category-specific.

This hierarchy is not designed. It emerges because it is the most parameter-efficient compression for prediction. And it is the visual version of king - man + woman = queen: take the feature for a tabby cat, subtract the tabby texture, add black fur, and you land near the feature for a black cat. "Cat-ness" and "fur pattern" are separable dimensions in feature space, discovered by compression, never requested.

The early layers of a CNN (LeCun et al., 1989; Krizhevsky et al., 2012) reinvent Gabor filters (Hubel and Wiesel, 1962). The deep layers learn part detectors they were not optimized for. Zeiler and Fergus (2014) made this visible by deconvolving activations back to pixel space. Alain and Bengio (2017) proved it with linear probes: freeze the CNN, train a tiny classifier on tasks it was never trained on (indoor/outdoor? water present? natural lighting?), and the probe achieves high accuracy. The compressed representation encodes concepts that were never part of the training signal.

```
Frozen CNN Feature [d=2048]  ──>  [ Simple Linear Probe ]  ──>  Indoor or Outdoor?
```
This is another example of how prediction pressure creates knowledge that was never optimized for.

---

#### Stage 3: ViT and the Language Bridge

<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2rem 0; overflow-x: auto;">
<div style="min-width: 600px; padding: 8px 0;">
<div style="display: flex; align-items: center; gap: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <!-- Image with grid -->
  <div style="flex: 0 0 auto; text-align: center;">
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 8px;">256 x 256 Image</div>
    <div style="display: inline-grid; grid-template-columns: repeat(4, 36px); grid-template-rows: repeat(4, 36px); gap: 2px; border: 2px solid #d4d4d8; border-radius: 8px; padding: 4px; background: #fafafa;">
      <div style="background: #93c5fd; border-radius: 3px;"></div>
      <div style="background: #93c5fd; border-radius: 3px;"></div>
      <div style="background: #60a5fa; border-radius: 3px;"></div>
      <div style="background: #60a5fa; border-radius: 3px;"></div>
      <div style="background: #86efac; border-radius: 3px;"></div>
      <div style="background: #fde68a; border-radius: 3px;"></div>
      <div style="background: #a78bfa; border-radius: 3px;"></div>
      <div style="background: #86efac; border-radius: 3px;"></div>
      <div style="background: #4ade80; border-radius: 3px;"></div>
      <div style="background: #f97316; border: 2px solid #ea580c; border-radius: 3px;"></div>
      <div style="background: #fbbf24; border-radius: 3px;"></div>
      <div style="background: #4ade80; border-radius: 3px;"></div>
      <div style="background: #22c55e; border-radius: 3px;"></div>
      <div style="background: #22c55e; border-radius: 3px;"></div>
      <div style="background: #16a34a; border-radius: 3px;"></div>
      <div style="background: #16a34a; border-radius: 3px;"></div>
    </div>
    <div style="font-size: 11px; color: #71717a; margin-top: 6px;">each cell = 16x16 pixel patch</div>
  </div>

  <!-- Arrow -->
  <div style="flex: 0 0 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg width="50" height="24" viewBox="0 0 50 24"><defs><marker id="vit1" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#f97316"/></marker></defs><line x1="0" y1="12" x2="40" y2="12" stroke="#f97316" stroke-width="2" marker-end="url(#vit1)"/></svg>
    <div style="font-size: 10px; color: #a1a1aa; margin-top: 2px;">flatten</div>
  </div>

  <!-- Token sequence -->
  <div style="flex: 1; text-align: center;">
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 8px;">Patch Token Sequence</div>
    <div style="display: flex; gap: 3px; align-items: center; justify-content: center; flex-wrap: wrap; background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px;">
      <span style="background: #93c5fd; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #93c5fd; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #60a5fa; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #60a5fa; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #86efac; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #fde68a; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #a78bfa; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #86efac; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #4ade80; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #f97316; width: 22px; height: 22px; border-radius: 4px; display: inline-block; border: 2px solid #ea580c;"></span>
      <span style="background: #fbbf24; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #4ade80; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #22c55e; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #22c55e; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #16a34a; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
      <span style="background: #16a34a; width: 22px; height: 22px; border-radius: 4px; display: inline-block;"></span>
    </div>
    <div style="font-size: 11px; color: #71717a; margin-top: 6px;">16 tokens, just like 16 words in a sentence</div>
  </div>

  <!-- Arrow -->
  <div style="flex: 0 0 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <svg width="50" height="24" viewBox="0 0 50 24"><defs><marker id="vit2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill="#f97316"/></marker></defs><line x1="0" y1="12" x2="40" y2="12" stroke="#f97316" stroke-width="2" marker-end="url(#vit2)"/></svg>
    <div style="font-size: 10px; color: #a1a1aa; margin-top: 2px;">embed</div>
  </div>

  <!-- Vectors -->
  <div style="flex: 0 0 auto; text-align: center;">
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 8px;">Patch Embeddings</div>
    <div style="background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 2px solid #f97316; border-radius: 8px; padding: 12px 16px;">
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: #71717a; line-height: 1.8;">
        <span style="color: #93c5fd;">[0.2, -0.8, ...]</span><br>
        <span style="color: #93c5fd;">[0.3, -0.7, ...]</span><br>
        <span style="color: #71717a;">⋮</span><br>
        <span style="color: #f97316; font-weight: 600;">[0.9, -0.1, ...]</span><br>
        <span style="color: #71717a;">⋮</span><br>
        <span style="color: #16a34a;">[0.1, &nbsp;0.6, ...]</span>
      </div>
    </div>
    <div style="font-size: 11px; color: #71717a; margin-top: 6px;">d = 768 per patch</div>
  </div>

</div>
<div style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">An image becomes a sentence. Each patch becomes a word. Self-attention connects them all.</div>
</div>
</div>


Vision Trasnformers ViT (Dosovitskiy et al., 2020) make the language analogy exact. To generate a sequence of input tokens, the image is divided into  16x16 patches (words), that are embed  into a vector of the image (i.e.sentence). Then they run self-attention across all patches, where self-attention connects all patches together. 
The architecture is identical to a text transformer except the attention maps are now spatial. 
Because attention is global from the first layer, ViT captures long-range dependencies that CNNs need many stacked layers to approximate. Linear probes on ViT features encode not just object identity but spatial relationships, depth ordering, and geometric consistency.

However, unlike  text, images have a natural multi-scale decomposition. 
This means images offer a choice for autoregressive generation. PixelCNN (van den Oord et al., 2016) goes raster-scan: left to right, top to bottom, committing to local details before knowing the global structure. The result is horizontal banding artifacts. Coarse-to-fine generation avoids this entirely: decide the layout first, add detail later, never generate a region without knowing the global context.

---

## Stage 4: VAR (Visual AutoRegression)
This naturally brings us to Visual Autoregressive models, or VARS. 

A CNN takes a full-resolution image and compresses it layer by layer, while VAR starts from the coarsest description and expands scale by scale: a single token becomes layout, then objects, then textures, then a full image - which is a generation! So in a sense, 
**VAR is the CNN's compression hierarchy run backward**: if discrimination results in compression, generation is decompression. 

<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2rem 0; overflow-x: auto;">
<div style="min-width: 600px; padding: 8px 0;">
<div style="display: flex; align-items: flex-end; gap: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <!-- 1x1 -->
  <div style="flex: 0 0 auto; text-align: center; padding: 0 8px;">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">1x1</div>
    <div style="display: inline-grid; grid-template-columns: 1fr; width: 24px; height: 24px; margin: 0 auto;">
      <div style="background: #60a5fa; border-radius: 3px;"></div>
    </div>
    <div style="font-size: 9px; color: #a1a1aa; margin-top: 4px;">mood</div>
  </div>

  <div style="flex: 0 0 auto; display: flex; align-items: center; padding-bottom: 18px;">
    <svg width="24" height="16" viewBox="0 0 24 16"><defs><marker id="var1" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#d4d4d8"/></marker></defs><line x1="0" y1="8" x2="16" y2="8" stroke="#d4d4d8" stroke-width="1.5" marker-end="url(#var1)"/></svg>
  </div>

  <!-- 2x2 -->
  <div style="flex: 0 0 auto; text-align: center; padding: 0 8px;">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">2x2</div>
    <div style="display: inline-grid; grid-template-columns: repeat(2, 20px); grid-template-rows: repeat(2, 20px); gap: 2px;">
      <div style="background: #93c5fd; border-radius: 2px;"></div>
      <div style="background: #60a5fa; border-radius: 2px;"></div>
      <div style="background: #86efac; border-radius: 2px;"></div>
      <div style="background: #4ade80; border-radius: 2px;"></div>
    </div>
    <div style="font-size: 9px; color: #a1a1aa; margin-top: 4px;">layout</div>
  </div>

  <div style="flex: 0 0 auto; display: flex; align-items: center; padding-bottom: 18px;">
    <svg width="24" height="16" viewBox="0 0 24 16"><defs><marker id="var2" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#fbbf24"/></marker></defs><line x1="0" y1="8" x2="16" y2="8" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#var2)"/></svg>
  </div>

  <!-- 4x4 -->
  <div style="flex: 0 0 auto; text-align: center; padding: 0 8px;">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">4x4</div>
    <div style="display: inline-grid; grid-template-columns: repeat(4, 14px); grid-template-rows: repeat(4, 14px); gap: 1px;">
      <div style="background: #bfdbfe; border-radius: 1px;"></div>
      <div style="background: #93c5fd; border-radius: 1px;"></div>
      <div style="background: #60a5fa; border-radius: 1px;"></div>
      <div style="background: #60a5fa; border-radius: 1px;"></div>
      <div style="background: #93c5fd; border-radius: 1px;"></div>
      <div style="background: #bfdbfe; border-radius: 1px;"></div>
      <div style="background: #a78bfa; border-radius: 1px;"></div>
      <div style="background: #60a5fa; border-radius: 1px;"></div>
      <div style="background: #86efac; border-radius: 1px;"></div>
      <div style="background: #fde68a; border-radius: 1px;"></div>
      <div style="background: #f97316; border-radius: 1px;"></div>
      <div style="background: #4ade80; border-radius: 1px;"></div>
      <div style="background: #4ade80; border-radius: 1px;"></div>
      <div style="background: #22c55e; border-radius: 1px;"></div>
      <div style="background: #16a34a; border-radius: 1px;"></div>
      <div style="background: #22c55e; border-radius: 1px;"></div>
    </div>
    <div style="font-size: 9px; color: #a1a1aa; margin-top: 4px;">composition</div>
  </div>

  <div style="flex: 0 0 auto; display: flex; align-items: center; padding-bottom: 18px;">
    <svg width="24" height="16" viewBox="0 0 24 16"><defs><marker id="var3" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#fb923c"/></marker></defs><line x1="0" y1="8" x2="16" y2="8" stroke="#fb923c" stroke-width="1.5" marker-end="url(#var3)"/></svg>
  </div>

  <!-- 8x8 -->
  <div style="flex: 0 0 auto; text-align: center; padding: 0 8px;">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">8x8</div>
    <div style="display: inline-grid; grid-template-columns: repeat(8, 9px); grid-template-rows: repeat(8, 9px); gap: 1px;">
      <div style="background: #dbeafe;"></div><div style="background: #bfdbfe;"></div><div style="background: #93c5fd;"></div><div style="background: #93c5fd;"></div><div style="background: #60a5fa;"></div><div style="background: #60a5fa;"></div><div style="background: #3b82f6;"></div><div style="background: #60a5fa;"></div>
      <div style="background: #bfdbfe;"></div><div style="background: #93c5fd;"></div><div style="background: #93c5fd;"></div><div style="background: #bfdbfe;"></div><div style="background: #a78bfa;"></div><div style="background: #60a5fa;"></div><div style="background: #60a5fa;"></div><div style="background: #60a5fa;"></div>
      <div style="background: #bbf7d0;"></div><div style="background: #86efac;"></div><div style="background: #fde68a;"></div><div style="background: #fbbf24;"></div><div style="background: #f97316;"></div><div style="background: #fb923c;"></div><div style="background: #86efac;"></div><div style="background: #4ade80;"></div>
      <div style="background: #86efac;"></div><div style="background: #4ade80;"></div><div style="background: #fde68a;"></div><div style="background: #f97316;"></div><div style="background: #ea580c;"></div><div style="background: #fbbf24;"></div><div style="background: #4ade80;"></div><div style="background: #22c55e;"></div>
      <div style="background: #4ade80;"></div><div style="background: #22c55e;"></div><div style="background: #86efac;"></div><div style="background: #4ade80;"></div><div style="background: #fbbf24;"></div><div style="background: #22c55e;"></div><div style="background: #16a34a;"></div><div style="background: #22c55e;"></div>
      <div style="background: #4ade80;"></div><div style="background: #22c55e;"></div><div style="background: #22c55e;"></div><div style="background: #16a34a;"></div><div style="background: #22c55e;"></div><div style="background: #16a34a;"></div><div style="background: #16a34a;"></div><div style="background: #15803d;"></div>
      <div style="background: #22c55e;"></div><div style="background: #16a34a;"></div><div style="background: #16a34a;"></div><div style="background: #16a34a;"></div><div style="background: #15803d;"></div><div style="background: #16a34a;"></div><div style="background: #15803d;"></div><div style="background: #166534;"></div>
      <div style="background: #16a34a;"></div><div style="background: #15803d;"></div><div style="background: #15803d;"></div><div style="background: #166534;"></div><div style="background: #15803d;"></div><div style="background: #166534;"></div><div style="background: #166534;"></div><div style="background: #14532d;"></div>
    </div>
    <div style="font-size: 9px; color: #a1a1aa; margin-top: 4px;">objects</div>
  </div>

  <div style="flex: 0 0 auto; display: flex; align-items: center; padding-bottom: 18px;">
    <svg width="24" height="16" viewBox="0 0 24 16"><defs><marker id="var4" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#f97316"/></marker></defs><line x1="0" y1="8" x2="16" y2="8" stroke="#f97316" stroke-width="1.5" marker-end="url(#var4)"/></svg>
  </div>

  <!-- 16x16 -->
  <div style="flex: 1; text-align: center; padding: 0 8px;">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 6px;">16x16</div>
    <div style="width: 100%; max-width: 130px; aspect-ratio: 1; margin: 0 auto; border-radius: 6px; background: linear-gradient(180deg, #bfdbfe 0%, #93c5fd 20%, #86efac 35%, #f97316 42%, #fbbf24 48%, #4ade80 55%, #22c55e 70%, #16a34a 85%, #15803d 100%); border: 2px solid #f97316;"></div>
    <div style="font-size: 9px; color: #a1a1aa; margin-top: 4px;">detail + texture</div>
  </div>

</div>
<div style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Each scale doubles the resolution. The plan comes first. Detail comes last.</div>
</div>
</div>
More specifically,
VAR (Tian et al., 2024) predicts the next scale, not the next pixel. Generation starts at 1x1 (global color), then 2x2 (spatial layout), then 4x4, 8x8, doubling each time, conditioned on all coarser scales via attention.

$$r_1 \rightarrow r_2 \rightarrow r_3 \rightarrow \cdots \rightarrow r_K$$

Each scale doubles the resolution, followe by details.
VAR demonstrates power-law scaling similar to LLMs, suggesting coarse-to-fine is the right inductive bias for visual autoregression the way left-to-right is right for text. The field has already moved past class-conditional: VAR-CLIP enables text-to-image, Infinity (Li et al., 2024) scales to 1024x1024, HART (Tang et al., 2024) hybridizes discrete and continuous tokens, xAR explores flexible resolution schedules.

---

##### The Other Roads: GANs and Diffusion
It's important to mention two
 other families reached photorealism first. Both independently discovered the same coarse-to-fine hierarchy.

StyleGAN (Karras et al., 2019; 2020) has an explicit multi-resolution architecture: 4x4 constant upsampled through 8x8, 16x16, 32x32, and so on. Coarse styles control pose and shape, while fine styles control skin pores and hair texture. This mirrors VAR's scale hierarchy, but the training signal is adversarial (fool the discriminator) rather than predictive. The representations are less interpretable because they were optimized for deception, not prediction.

Diffusion models (Ho et al., 2020; Rombach et al., 2022) are not autoregressive at all. They predict noise and subtract it. But Dieleman (2023) showed that denoising implicitly follows a coarse-to-fine schedule: high noise destroys high frequencies first, so early denoising steps recover global composition and late steps recover fine detail. Diffusion does coarse-to-fine without being told to.


What's interesting here is that since 
the multi-scale structure of images is not an artifact of any particular architecture, but rather a property of the visual world, three completely different training objectives discovered it independently.

<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2rem 0; overflow-x: auto;">
<div style="min-width: 600px; padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

<!-- Shared destination label -->
<div style="text-align: center; margin-bottom: 16px;">
  <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa;">Three training signals, one destination</span>
</div>

<div style="display: flex; gap: 12px;">

  <!-- AR column -->
  <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
    <div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 12px; padding: 16px 14px; text-align: center; flex: 1;">
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 6px;">Autoregressive</div>
      <div style="font-size: 12px; color: #71717a; line-height: 1.5; margin-bottom: 8px;">Predict the next scale</div>
      <div style="font-size: 11px; color: #a1a1aa; background: #ffedd5; border-radius: 6px; padding: 6px 8px; display: inline-block;">VAR, PixelCNN, DALL-E</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; color: #ea580c; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 20px; padding: 3px 10px; display: inline-block;">explicit hierarchy</div>
    </div>
  </div>

  <!-- GAN column -->
  <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
    <div style="background: #f5f3ff; border: 2px solid #8b5cf6; border-radius: 12px; padding: 16px 14px; text-align: center; flex: 1;">
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 6px;">Adversarial</div>
      <div style="font-size: 12px; color: #71717a; line-height: 1.5; margin-bottom: 8px;">Fool the discriminator</div>
      <div style="font-size: 11px; color: #a1a1aa; background: #ede9fe; border-radius: 6px; padding: 6px 8px; display: inline-block;">StyleGAN, BigGAN</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; color: #7c3aed; background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 20px; padding: 3px 10px; display: inline-block;">implicit hierarchy</div>
    </div>
  </div>

  <!-- Diffusion column -->
  <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
    <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 16px 14px; text-align: center; flex: 1;">
      <div style="font-size: 14px; font-weight: 700; color: #18181b; margin-bottom: 6px;">Diffusion</div>
      <div style="font-size: 12px; color: #71717a; line-height: 1.5; margin-bottom: 8px;">Reverse the noise</div>
      <div style="font-size: 11px; color: #a1a1aa; background: #d1fae5; border-radius: 6px; padding: 6px 8px; display: inline-block;">Stable Diffusion, Imagen</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; padding: 3px 10px; display: inline-block;">emergent hierarchy</div>
    </div>
  </div>

</div>

<!-- Converging arrows -->
<div style="text-align: center; margin: 12px 0 8px;">
  <svg width="300" height="36" viewBox="0 0 300 36" style="display: inline-block;">
    <line x1="50" y1="4" x2="150" y2="30" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="150" y1="4" x2="150" y2="30" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="250" y1="4" x2="150" y2="30" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
    <circle cx="150" cy="32" r="4" fill="#18181b"/>
  </svg>
</div>

<!-- Destination -->
<div style="text-align: center;">
  <div style="display: inline-block; background: linear-gradient(135deg, #fff7ed, #f5f3ff, #ecfdf5); border: 2px solid #18181b; border-radius: 12px; padding: 12px 28px;">
    <div style="font-size: 14px; font-weight: 700; color: #18181b;">Coarse-to-fine generation</div>
    <div style="font-size: 11px; color: #71717a; margin-top: 2px;">a property of images, not of any architecture</div>
  </div>
</div>

</div>
</div>



---

## The Ladder
To  summarize the word-to-vision model evolution analogy, we show for each row how the model answers on what does survive the compression at this level. The modality is invariant as ompression finds hierarchical structure in both language and images because both describe a world that is hierarchically structured. For example, all models: DALL-E (Ramesh et al., 2021), Chameleon (Meta, 2024), and Infinity already process text and image tokens with the same transformer architecture regardless of the modality input. 


<!-- ⟦RESTORED FIGURE from May-25 backup — review & reposition⟧ -->
<div style="margin: 2.5rem 0; overflow-x: auto;">
<div style="min-width: 640px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

<!-- Header row -->
<div style="display: flex; gap: 0; margin-bottom: 6px;">
  <div style="flex: 5; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; padding: 8px;">Language</div>
  <div style="flex: 3; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; padding: 8px;">What Survives</div>
  <div style="flex: 5; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a; padding: 8px;">Vision</div>
</div>

<!-- Stage 0 -->
<div style="display: flex; gap: 0; margin-bottom: 6px; align-items: stretch;">
  <div style="flex: 5; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Random Words</div>
    <div style="font-size: 11px; color: #a1a1aa;">Uniform sampling from dictionary</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: #f4f4f5; border: 2px solid #d4d4d8; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #a1a1aa; white-space: nowrap;">nothing</div>
  </div>
  <div style="flex: 5; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Random Pixels</div>
    <div style="font-size: 11px; color: #a1a1aa;">Uniform RGB per pixel</div>
  </div>
</div>

<!-- Stage 1 -->
<div style="display: flex; gap: 0; margin-bottom: 6px; align-items: stretch;">
  <div style="flex: 5; background: #fefce8; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Unigram Frequencies</div>
    <div style="font-size: 11px; color: #a1a1aa;">P(word) from corpus counts</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: #fefce8; border: 2px solid #fde68a; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #a16207; white-space: nowrap;">style / palette</div>
  </div>
  <div style="flex: 5; background: #fefce8; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Color Histograms</div>
    <div style="font-size: 11px; color: #a1a1aa;">P(color) from image statistics</div>
  </div>
</div>

<!-- Stage 2 -->
<div style="display: flex; gap: 0; margin-bottom: 6px; align-items: stretch;">
  <div style="flex: 5; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Markov Chains</div>
    <div style="font-size: 11px; color: #a1a1aa;">P(word | previous n words)</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #92400e; white-space: nowrap;">local structure</div>
  </div>
  <div style="flex: 5; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Local Filters</div>
    <div style="font-size: 11px; color: #a1a1aa;">P(pixel | neighboring pixels)</div>
  </div>
</div>

<!-- Stage 3 -->
<div style="display: flex; gap: 0; margin-bottom: 6px; align-items: stretch;">
  <div style="flex: 5; background: #fff7ed; border: 1px solid #fb923c; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Word2Vec</div>
    <div style="font-size: 11px; color: #a1a1aa;">Dense embeddings from prediction</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: #fff7ed; border: 2px solid #fb923c; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #c2410c; white-space: nowrap;">relationships</div>
  </div>
  <div style="flex: 5; background: #fff7ed; border: 1px solid #fb923c; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">CNN Embeddings</div>
    <div style="font-size: 11px; color: #a1a1aa;">Learned hierarchical features</div>
  </div>
</div>

<!-- Stage 4 -->
<div style="display: flex; gap: 0; margin-bottom: 6px; align-items: stretch;">
  <div style="flex: 5; background: #fff1e6; border: 1px solid #f97316; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">Transformers</div>
    <div style="font-size: 11px; color: #a1a1aa;">Attention over full context</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: #fff1e6; border: 2px solid #f97316; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #ea580c; white-space: nowrap;">global reasoning</div>
  </div>
  <div style="flex: 5; background: #fff1e6; border: 1px solid #f97316; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">ViT Patches</div>
    <div style="font-size: 11px; color: #a1a1aa;">Attention over all patches</div>
  </div>
</div>

<!-- Stage 5 -->
<div style="display: flex; gap: 0; align-items: stretch;">
  <div style="flex: 5; background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 1px solid #ea580c; border-radius: 10px; padding: 10px 14px;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">GPT / Scale</div>
    <div style="font-size: 11px; color: #a1a1aa;">Next-token at massive scale</div>
  </div>
  <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
    <div style="background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 2px solid #ea580c; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #dc2626; white-space: nowrap;">world models</div>
  </div>
  <div style="flex: 5; background: linear-gradient(135deg, #fff7ed, #ffedd5); border: 1px solid #ea580c; border-radius: 10px; padding: 10px 14px; text-align: right;">
    <div style="font-size: 13px; font-weight: 700; color: #18181b;">VAR</div>
    <div style="font-size: 11px; color: #a1a1aa;">Next-scale autoregression</div>
  </div>
</div>

<!-- Bottom annotation -->
<div style="text-align: center; margin-top: 14px; font-size: 12px; color: #a1a1aa;">Same compression ladder. Same abstractions. Different modality.</div>

</div>
</div>




---


Below is an Interactive Playground, where you can switch between stages, select a different source image and watch the generation process at each lebel.   At Stage 5, step through VAR's scale-by-scale generation and see coherence emerge from compression.
<div id="vision-playground">
<style>
  #vision-playground *, #vision-playground *::before, #vision-playground *::after { margin: 0; padding: 0; box-sizing: border-box; }
  #vision-playground {
    --vp-text-primary: #111;
    --vp-text-secondary: #888;
    --vp-text-muted: #bbb;
    --vp-bg: #fff;
    --vp-bg-alt: #fafafa;
    --vp-bg-canvas: #f4f4f4;
    --vp-border: #e5e5e5;
    --vp-accent: #f97316;
    --vp-accent-hover: #ea580c;
    --vp-accent-soft: rgba(249,115,22,0.12);
    --vp-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --vp-font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-family: var(--vp-font-sans);
    color: var(--vp-text-primary);
    line-height: 1.5;
    max-width: 100%;
    margin: 2rem 0;
    padding: 24px;
    border: 1px solid var(--vp-border);
    border-radius: 14px;
    background: var(--vp-bg);
  }

  #vision-playground .vp-header { text-align: center; margin-bottom: 20px; }
  #vision-playground .vp-header h3 { font-size: 18px; font-weight: 700; margin: 0; }
  #vision-playground .vp-header p { font-size: 13px; color: var(--vp-text-secondary); margin-top: 4px; }

  #vision-playground .vp-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  @media (max-width: 600px) { #vision-playground .vp-controls { grid-template-columns: 1fr; } }

  #vision-playground .vp-ctrl { display: flex; flex-direction: column; gap: 4px; }
  #vision-playground .vp-ctrl[hidden] { display: none; }
  #vision-playground .vp-lbl {
    font-size: 11px; font-weight: 600;
    color: var(--vp-text-secondary);
    text-transform: uppercase; letter-spacing: 0.5px;
    display: flex; justify-content: space-between; align-items: baseline;
  }
  #vision-playground .vp-val {
    font-family: var(--vp-font-mono);
    color: var(--vp-accent); font-weight: 700; font-size: 11px;
  }

  #vision-playground select, #vision-playground input[type=range] { width: 100%; }
  #vision-playground select {
    padding: 7px 10px;
    border: 1px solid var(--vp-border); border-radius: 6px;
    background: var(--vp-bg); color: var(--vp-text-primary);
    font-size: 13px; cursor: pointer;
  }
  #vision-playground input[type=range] {
    -webkit-appearance: none; height: 6px;
    border-radius: 3px; background: var(--vp-border);
    outline: none; margin-top: 8px;
  }
  #vision-playground input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 16px; height: 16px;
    border-radius: 50%; background: var(--vp-accent);
    cursor: pointer; border: 2px solid var(--vp-bg);
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
  }
  #vision-playground input[type=range]::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--vp-accent); cursor: pointer;
    border: 2px solid var(--vp-bg);
  }

  #vision-playground .vp-actions {
    display: flex; gap: 10px; align-items: center;
    flex-wrap: wrap; margin-bottom: 16px;
  }
  #vision-playground .vp-btn {
    padding: 9px 22px; border: none; border-radius: 8px;
    background: var(--vp-accent); color: #fff;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background 0.2s;
  }
  #vision-playground .vp-btn:hover { background: var(--vp-accent-hover); }
  #vision-playground .vp-btn[hidden] { display: none; }
  #vision-playground .vp-btn-ghost {
    background: var(--vp-bg); color: var(--vp-accent);
    border: 1px solid var(--vp-accent);
  }
  #vision-playground .vp-btn-ghost:hover { background: var(--vp-accent-soft); }

  #vision-playground .vp-stage-info {
    flex: 1; min-width: 200px;
    font-size: 12px; color: var(--vp-text-secondary);
    font-style: italic;
  }

  #vision-playground .vp-display {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
  @media (max-width: 720px) { #vision-playground .vp-display { grid-template-columns: 1fr; } }

  #vision-playground .vp-panel {
    border: 1px solid var(--vp-border); border-radius: 10px;
    background: var(--vp-bg); overflow: hidden;
    display: flex; flex-direction: column;
  }
  #vision-playground .vp-panel-hdr {
    padding: 8px 12px;
    border-bottom: 1px solid var(--vp-border);
    display: flex; justify-content: space-between; align-items: center;
    gap: 8px;
  }
  #vision-playground .vp-panel-title {
    font-size: 10px; font-weight: 700;
    color: var(--vp-text-secondary); text-transform: uppercase; letter-spacing: 0.5px;
  }
  #vision-playground .vp-panel-sub {
    font-size: 10px; color: var(--vp-text-muted);
    font-family: var(--vp-font-mono);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  #vision-playground .vp-canvas-wrap {
    position: relative; background: var(--vp-bg-canvas);
    aspect-ratio: 1 / 1;
  }
  #vision-playground .vp-canvas {
    display: block; width: 100%; height: 100%;
    image-rendering: pixelated; image-rendering: crisp-edges;
  }
  #vision-playground .vp-canvas.vp-clickable { cursor: crosshair; }

  #vision-playground .vp-caption {
    padding: 12px 16px;
    border: 1px solid var(--vp-border); border-radius: 8px;
    background: var(--vp-bg-alt);
    font-size: 12px; color: var(--vp-text-secondary);
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  #vision-playground .vp-cap-label {
    font-weight: 700; color: var(--vp-text-primary);
    text-transform: uppercase; letter-spacing: 0.4px; font-size: 10px;
  }
  #vision-playground .vp-cap-text { flex: 1; }

  #vision-playground .vp-tag {
    display: inline-block; font-size: 10px; font-weight: 600;
    padding: 2px 7px; border-radius: 4px;
    background: var(--vp-accent-soft); color: var(--vp-accent);
  }

  #vision-playground .vp-empty {
    padding: 32px; text-align: center;
    font-size: 13px; color: var(--vp-text-muted); font-style: italic;
  }
</style>

<div class="vp-header">
  <h3>Vision Playground</h3>
  <p>Six stages of seeing — random pixels to coarse-to-fine generation.</p>
</div>

<div class="vp-controls">
  <div class="vp-ctrl">
    <div class="vp-lbl">Stage <span class="vp-tag" id="vpStageTag">Random</span></div>
    <select id="vpStageSelect">
      <option value="0">Stage 0: Random Pixels</option>
      <option value="1">Stage 1: Color Histogram</option>
      <option value="2">Stage 2: Local Filters</option>
      <option value="3">Stage 3: CNN Features</option>
      <option value="4">Stage 4: ViT Attention</option>
      <option value="5">Stage 5: VAR (next-scale)</option>
    </select>
  </div>
  <div class="vp-ctrl">
    <div class="vp-lbl">Source image</div>
    <select id="vpImgSelect">
      <option value="landscape">Mountain road</option>
      <option value="lake">Mountain lake</option>
      <option value="balloons">Hot air balloons</option>
      <option value="city">Cityscape</option>
    </select>
  </div>

  <div class="vp-ctrl vp-stage-only" data-show="2" hidden>
    <div class="vp-lbl">Filter</div>
    <select id="vpFilterSelect">
      <option value="hedge">Horizontal edges (Sobel-y)</option>
      <option value="vedge">Vertical edges (Sobel-x)</option>
      <option value="diag">Diagonal edges</option>
      <option value="mag" selected>All edges (magnitude)</option>
    </select>
  </div>

  <div class="vp-ctrl vp-stage-only" data-show="3" hidden>
    <div class="vp-lbl">Layer depth <span class="vp-val" id="vpLayerVal">Middle</span></div>
    <input type="range" id="vpLayerSlider" min="0" max="2" step="1" value="1">
  </div>
  <div class="vp-ctrl vp-stage-only" data-show="3" hidden>
    <div class="vp-lbl">Feature map <span class="vp-val" id="vpChannelVal">1/8</span></div>
    <input type="range" id="vpChannelSlider" min="0" max="7" step="1" value="0">
  </div>

  <div class="vp-ctrl vp-stage-only" data-show="4" hidden>
    <div class="vp-lbl">Focal patch <span class="vp-val" id="vpPatchVal">7,7</span></div>
    <input type="range" id="vpPatchSlider" min="0" max="195" step="1" value="97">
  </div>

  <div class="vp-ctrl vp-stage-only" data-show="5" hidden>
    <div class="vp-lbl">VAR scale <span class="vp-val" id="vpScaleVal">1×1</span></div>
    <input type="range" id="vpScaleSlider" min="0" max="7" step="1" value="0">
  </div>
</div>

<div class="vp-actions">
  <button class="vp-btn" id="vpGenBtn">Generate</button>
  <button class="vp-btn vp-btn-ghost vp-stage-only" data-show="5" id="vpAnimBtn" hidden>Animate scales</button>
  <span class="vp-stage-info" id="vpInfo"></span>
</div>

<div class="vp-display">
  <div class="vp-panel">
    <div class="vp-panel-hdr">
      <span class="vp-panel-title">Source</span>
      <span class="vp-panel-sub" id="vpSourceSub">224×224</span>
    </div>
    <div class="vp-canvas-wrap">
      <canvas id="vpSourceCanvas" class="vp-canvas" width="224" height="224"></canvas>
    </div>
  </div>
  <div class="vp-panel">
    <div class="vp-panel-hdr">
      <span class="vp-panel-title" id="vpMiddleTitle">Representation</span>
      <span class="vp-panel-sub" id="vpMiddleSub">—</span>
    </div>
    <div class="vp-canvas-wrap">
      <canvas id="vpMiddleCanvas" class="vp-canvas" width="224" height="224"></canvas>
    </div>
  </div>
  <div class="vp-panel">
    <div class="vp-panel-hdr">
      <span class="vp-panel-title">Generated</span>
      <span class="vp-panel-sub" id="vpOutputSub">—</span>
    </div>
    <div class="vp-canvas-wrap">
      <canvas id="vpOutputCanvas" class="vp-canvas" width="224" height="224"></canvas>
    </div>
  </div>
</div>

<div class="vp-caption">
  <span class="vp-cap-label">What survives compression:</span>
  <span class="vp-cap-text" id="vpCapText">Nothing — pure entropy.</span>
</div>

<div class="vp-empty" id="vpEmpty" hidden>
  Pre-computed data not loaded. Run <code>python post_pipeline/vision_widget/precompute.py</code>.
</div>
</div>

<script src="/assets/js/vision_playground_data.js"></script>
<script>
(function() {
  'use strict';
  const root = document.getElementById('vision-playground');
  if (!root) return;
  if (!window.VP_DATA) {
    const empty = root.querySelector('#vpEmpty');
    if (empty) empty.removeAttribute('hidden');
    return;
  }

  const D = window.VP_DATA;
  const IMG = D.img_size;            // 224
  const PATCH = D.patch;             // 16
  const GRID = IMG / PATCH;          // 14
  const N_PATCH = GRID * GRID;       // 196
  const LAYER_NAMES = D.cnn_layers;  // ["layer1", "layer2", "layer3"]
  const VAR_SCALES = D.var_scales;   // [1,2,4,8,16,32,64]
  const N_VAR = VAR_SCALES.length + 1; // include "full"

  const state = {
    stage: 0,
    imgKey: 'landscape',
    cnnLayer: 1,        // 0=layer1, 1=layer2, 2=layer3
    cnnChannel: 0,
    filterType: 'mag',
    vitPatch: 97,
    varScale: 0,        // index into [0..VAR_SCALES.length], last = "full"
    animating: false,
  };

  // ── DOM ──
  const $ = (id) => root.querySelector('#' + id);
  const els = {
    stageSelect: $('vpStageSelect'),
    stageTag:    $('vpStageTag'),
    imgSelect:   $('vpImgSelect'),
    filterSelect:$('vpFilterSelect'),
    layerSlider: $('vpLayerSlider'),
    layerVal:    $('vpLayerVal'),
    channelSlider: $('vpChannelSlider'),
    channelVal:  $('vpChannelVal'),
    patchSlider: $('vpPatchSlider'),
    patchVal:    $('vpPatchVal'),
    scaleSlider: $('vpScaleSlider'),
    scaleVal:    $('vpScaleVal'),
    genBtn:      $('vpGenBtn'),
    animBtn:     $('vpAnimBtn'),
    info:        $('vpInfo'),
    capText:     $('vpCapText'),
    sourceCanvas:$('vpSourceCanvas'),
    middleCanvas:$('vpMiddleCanvas'),
    outputCanvas:$('vpOutputCanvas'),
    middleTitle: $('vpMiddleTitle'),
    middleSub:   $('vpMiddleSub'),
    outputSub:   $('vpOutputSub'),
    sourceSub:   $('vpSourceSub'),
  };

  const sCtx = els.sourceCanvas.getContext('2d');
  const mCtx = els.middleCanvas.getContext('2d');
  const oCtx = els.outputCanvas.getContext('2d');

  // ── Caches ──
  const sourceImgs = {};          // key → HTMLImageElement
  const cnnImgs = {};             // "imgKey/layer/idx" → HTMLImageElement
  const varImgs = {};             // "imgKey/r{scale}" or "imgKey/full" → HTMLImageElement
  const vitData = {};             // imgKey → { vals: Uint8Array, rowMax: Float32Array }

  // ── Utilities ──
  function loadImg(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function b64Bytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function b64Float16(b64) {
    // Decode a base64-encoded little-endian float16 array to Float32Array.
    const bytes = b64Bytes(b64);
    const n = bytes.length >> 1;
    const out = new Float32Array(n);
    const dv = new DataView(bytes.buffer);
    for (let i = 0; i < n; i++) {
      const h = dv.getUint16(i * 2, true);
      out[i] = float16ToFloat32(h);
    }
    return out;
  }

  function float16ToFloat32(h) {
    const s = (h & 0x8000) >> 15;
    const e = (h & 0x7C00) >> 10;
    const f = h & 0x03FF;
    if (e === 0)      return (s ? -1 : 1) * Math.pow(2, -14) * (f / 1024);
    if (e === 0x1F)   return f ? NaN : ((s ? -1 : 1) * Infinity);
    return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / 1024);
  }

  // ── Asset loaders ──
  function getSource(key) {
    if (sourceImgs[key]) return Promise.resolve(sourceImgs[key]);
    return loadImg(D.images[key].src).then(img => (sourceImgs[key] = img));
  }

  function getCnnImg(key, layerIdx, ch) {
    const id = key + '/' + layerIdx + '/' + ch;
    if (cnnImgs[id]) return Promise.resolve(cnnImgs[id]);
    const layer = LAYER_NAMES[layerIdx];
    const b64 = D.images[key].cnn[layer].maps[ch];
    return loadImg('data:image/png;base64,' + b64).then(img => (cnnImgs[id] = img));
  }

  function getVarImg(key, scaleIdx) {
    const id = key + '/' + scaleIdx;
    if (varImgs[id]) return Promise.resolve(varImgs[id]);
    if (scaleIdx >= VAR_SCALES.length) {
      const b64 = D.images[key].var.full;
      return loadImg('data:image/jpeg;base64,' + b64).then(img => (varImgs[id] = img));
    }
    const s = VAR_SCALES[scaleIdx];
    const b64 = D.images[key].var['r' + s];
    return loadImg('data:image/png;base64,' + b64).then(img => (varImgs[id] = img));
  }

  function getVit(key) {
    if (vitData[key]) return vitData[key];
    const v = D.images[key].vit;
    const vals = b64Bytes(v.attn_b64);
    const rowMax = b64Float16(v.row_max_f16_b64);
    vitData[key] = { vals, rowMax };
    return vitData[key];
  }

  // ── Canvas helpers ──
  function clear(ctx, color) {
    ctx.fillStyle = color || '#f4f4f4';
    ctx.fillRect(0, 0, IMG, IMG);
  }

  function drawImage(ctx, img) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, IMG, IMG);
  }

  function drawNearest(ctx, img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, IMG, IMG);
  }

  // ── Stage 0: random pixels ──
  function renderStage0() {
    clear(sCtx);
    sCtx.fillStyle = '#bbb';
    sCtx.font = '11px ' + getComputedStyle(root).getPropertyValue('--vp-font-sans');
    sCtx.textAlign = 'center';
    sCtx.fillText('— no input used —', IMG / 2, IMG / 2);

    // Middle: noise distribution sketch — 3 flat lines
    clear(mCtx, '#fff');
    drawFlatRgbBars(mCtx);

    // Output: pure noise
    const data = oCtx.createImageData(IMG, IMG);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i]   = (Math.random() * 256) | 0;
      data.data[i+1] = (Math.random() * 256) | 0;
      data.data[i+2] = (Math.random() * 256) | 0;
      data.data[i+3] = 255;
    }
    oCtx.putImageData(data, 0, 0);

    els.middleTitle.textContent = 'Distribution';
    els.middleSub.textContent = 'uniform RGB';
    els.sourceSub.textContent = '—';
    els.outputSub.textContent = 'i.i.d. U(0,255)';
    els.info.textContent = 'Television static. No structure, no neighbours.';
    els.capText.textContent = 'Nothing — pure entropy.';
  }

  function drawFlatRgbBars(ctx) {
    ctx.save();
    const h = IMG, w = IMG, base = h - 40;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    const channels = [
      { color: 'rgba(239,68,68,0.55)' },   // R
      { color: 'rgba(34,197,94,0.55)' },   // G
      { color: 'rgba(59,130,246,0.55)' },  // B
    ];
    for (const c of channels) {
      ctx.fillStyle = c.color;
      ctx.fillRect(20, base - 90, w - 40, 90);
    }
    ctx.fillStyle = '#888';
    ctx.font = '10px ' + getComputedStyle(root).getPropertyValue('--vp-font-sans');
    ctx.textAlign = 'left';
    ctx.fillText('0', 20, base + 14);
    ctx.textAlign = 'right';
    ctx.fillText('255', w - 20, base + 14);
    ctx.restore();
  }

  // ── Stage 1: color histogram sampling ──
  function renderStage1() {
    return getSource(state.imgKey).then(img => {
      drawImage(sCtx, img);
      // Compute histogram from the just-drawn source.
      const src = sCtx.getImageData(0, 0, IMG, IMG).data;
      const hr = new Uint32Array(256);
      const hg = new Uint32Array(256);
      const hb = new Uint32Array(256);
      for (let i = 0; i < src.length; i += 4) {
        hr[src[i]]++; hg[src[i+1]]++; hb[src[i+2]]++;
      }
      drawHistogram(mCtx, hr, hg, hb);
      // Build CDFs and sample.
      const cR = cdf(hr), cG = cdf(hg), cB = cdf(hb);
      const out = oCtx.createImageData(IMG, IMG);
      for (let i = 0; i < out.data.length; i += 4) {
        out.data[i]   = sampleCdf(cR);
        out.data[i+1] = sampleCdf(cG);
        out.data[i+2] = sampleCdf(cB);
        out.data[i+3] = 255;
      }
      oCtx.putImageData(out, 0, 0);

      els.middleTitle.textContent = 'Color histogram';
      els.middleSub.textContent = 'R / G / B over 256 bins';
      els.sourceSub.textContent = D.images[state.imgKey].label;
      els.outputSub.textContent = 'i.i.d. ~ p(R)·p(G)·p(B)';
      els.info.textContent = 'Each pixel sampled independently from per-channel frequencies — palette without structure.';
      els.capText.textContent = 'Mood and palette. Every pixel ignores its neighbours.';
    });
  }

  function cdf(hist) {
    const out = new Float64Array(256);
    let s = 0;
    for (let i = 0; i < 256; i++) s += hist[i];
    let c = 0;
    for (let i = 0; i < 256; i++) {
      c += hist[i] / Math.max(s, 1);
      out[i] = c;
    }
    return out;
  }
  function sampleCdf(c) {
    const r = Math.random();
    // Linear scan is fine for 256 entries.
    for (let i = 0; i < 256; i++) if (r <= c[i]) return i;
    return 255;
  }

  function drawHistogram(ctx, hr, hg, hb) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, IMG, IMG);
    const pad = 14;
    const w = IMG - pad * 2;
    const baseY = IMG - pad - 18;
    const maxH = baseY - pad;
    let mx = 0;
    for (let i = 0; i < 256; i++) {
      if (hr[i] > mx) mx = hr[i];
      if (hg[i] > mx) mx = hg[i];
      if (hb[i] > mx) mx = hb[i];
    }
    mx = Math.max(mx, 1);
    const colors = [
      ['rgba(239,68,68,0.6)', hr],
      ['rgba(34,197,94,0.6)', hg],
      ['rgba(59,130,246,0.6)', hb],
    ];
    for (const [col, h] of colors) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(pad, baseY);
      for (let i = 0; i < 256; i++) {
        const x = pad + (i / 255) * w;
        const y = baseY - (h[i] / mx) * maxH;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(pad + w, baseY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(pad, baseY); ctx.lineTo(pad + w, baseY);
    ctx.stroke();
    ctx.fillStyle = '#888';
    ctx.font = '10px ' + getComputedStyle(root).getPropertyValue('--vp-font-sans');
    ctx.textAlign = 'left';  ctx.fillText('0',   pad, baseY + 12);
    ctx.textAlign = 'right'; ctx.fillText('255', pad + w, baseY + 12);
    ctx.restore();
  }

  // ── Stage 2: local filters + texture-tile output ──
  function renderStage2() {
    return getSource(state.imgKey).then(img => {
      drawImage(sCtx, img);
      const src = sCtx.getImageData(0, 0, IMG, IMG);
      const gray = toGray(src);
      const filtered = applyFilter(gray, IMG, IMG, state.filterType);
      drawGrayHeatmap(mCtx, filtered, IMG, IMG);
      drawTextureTile(oCtx, img);

      els.middleTitle.textContent = 'Filter response';
      els.middleSub.textContent = filterLabel(state.filterType);
      els.sourceSub.textContent = D.images[state.imgKey].label;
      els.outputSub.textContent = 'random 16-px patches';
      els.info.textContent = 'Edges and textures emerge locally. Output tiles random source patches — locally plausible, globally meaningless.';
      els.capText.textContent = 'Textures and edges. No mechanism to form objects.';
    });
  }

  function toGray(imgData) {
    const out = new Float32Array(imgData.width * imgData.height);
    const d = imgData.data;
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      out[j] = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
    }
    return out;
  }

  function applyFilter(gray, w, h, kind) {
    const gx = new Float32Array(w * h);
    const gy = new Float32Array(w * h);
    // Sobel kernels: x = [-1 0 1; -2 0 2; -1 0 1]; y = [-1 -2 -1; 0 0 0; 1 2 1]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const tl = gray[i - w - 1], t = gray[i - w], tr = gray[i - w + 1];
        const l  = gray[i - 1],     r = gray[i + 1];
        const bl = gray[i + w - 1], b = gray[i + w], br = gray[i + w + 1];
        gx[i] = -tl - 2*l - bl + tr + 2*r + br;
        gy[i] = -tl - 2*t - tr + bl + 2*b + br;
      }
    }
    const out = new Float32Array(w * h);
    if (kind === 'hedge') {
      for (let i = 0; i < out.length; i++) out[i] = Math.abs(gy[i]);
    } else if (kind === 'vedge') {
      for (let i = 0; i < out.length; i++) out[i] = Math.abs(gx[i]);
    } else if (kind === 'diag') {
      for (let i = 0; i < out.length; i++) out[i] = Math.abs(gx[i] + gy[i]) / Math.SQRT2;
    } else { // 'mag'
      for (let i = 0; i < out.length; i++) out[i] = Math.hypot(gx[i], gy[i]);
    }
    return out;
  }

  function filterLabel(k) {
    return { hedge: 'horizontal edges', vedge: 'vertical edges',
             diag: 'diagonal edges', mag: '|∇I|' }[k];
  }

  function drawGrayHeatmap(ctx, vals, w, h) {
    let mx = 0;
    for (let i = 0; i < vals.length; i++) if (vals[i] > mx) mx = vals[i];
    mx = Math.max(mx, 1);
    const img = ctx.createImageData(w, h);
    for (let i = 0, j = 0; i < img.data.length; i += 4, j++) {
      const v = Math.min(255, (vals[j] / mx) * 255) | 0;
      img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function drawTextureTile(ctx, img) {
    // Tile 16-px random patches sampled from the source image.
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, IMG, IMG);
    const tile = 16;
    const maxSrc = IMG - tile;
    for (let y = 0; y < IMG; y += tile) {
      for (let x = 0; x < IMG; x += tile) {
        const sx = (Math.random() * maxSrc) | 0;
        const sy = (Math.random() * maxSrc) | 0;
        ctx.drawImage(img, sx, sy, tile, tile, x, y, tile, tile);
      }
    }
  }

  // ── Stage 3: CNN feature maps ──
  function renderStage3() {
    const key = state.imgKey;
    const layerIdx = state.cnnLayer;
    const ch = state.cnnChannel;
    return Promise.all([getSource(key), getCnnImg(key, layerIdx, ch)]).then(([img, feat]) => {
      // Source faded with feature heatmap overlaid.
      sCtx.globalAlpha = 1.0;
      drawImage(sCtx, img);

      mCtx.fillStyle = '#000';
      mCtx.fillRect(0, 0, IMG, IMG);
      mCtx.globalAlpha = 0.45;
      drawImage(mCtx, img);
      mCtx.globalAlpha = 0.75;
      mCtx.imageSmoothingEnabled = true;
      mCtx.drawImage(feat, 0, 0, IMG, IMG);
      mCtx.globalAlpha = 1.0;

      // Output: 4x2 montage of the 8 feature maps at this layer.
      drawFeatureMontage(oCtx, key, layerIdx, ch);

      const layerName = LAYER_NAMES[layerIdx];
      const caption = D.images[key].cnn[layerName].caption;
      els.middleTitle.textContent = layerName + ' · ch ' + (ch + 1);
      els.middleSub.textContent = caption;
      els.sourceSub.textContent = D.images[key].label;
      els.outputSub.textContent = '8 feature maps';
      els.info.textContent = layerDescription(layerIdx);
      els.capText.textContent = layerSurvives(layerIdx);
    });
  }

  function layerDescription(idx) {
    return [
      'Early layers fire on edges and colour gradients — close to hand-designed Sobel/Gabor.',
      'Middle layers combine edges into textures and simple parts.',
      'Deep layers detect parts and object-like patterns invariant to colour and small shifts.',
    ][idx];
  }
  function layerSurvives(idx) {
    return [
      'Edges and colour blobs. Position-precise, semantics-blind.',
      'Textures and simple parts. Local structure with rough invariance.',
      'Parts and objects. Position-loose, identity-strong.',
    ][idx];
  }

  function drawFeatureMontage(ctx, key, layerIdx, focusCh) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, IMG, IMG);
    const cols = 4, rows = 2;
    const cellW = IMG / cols, cellH = IMG / rows;
    const layerName = LAYER_NAMES[layerIdx];
    const maps = D.images[key].cnn[layerName].maps;
    // Lazy load each map; we already loaded one via getCnnImg, others may
    // need a fetch. Use Promise.all but the function returns void — we just
    // schedule the draws.
    maps.forEach((b64, i) => {
      getCnnImg(key, layerIdx, i).then(img => {
        const cx = (i % cols) * cellW, cy = ((i / cols) | 0) * cellH;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, cx + 2, cy + 2, cellW - 4, cellH - 4);
        if (i === focusCh) {
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx + 1, cy + 1, cellW - 2, cellH - 2);
        }
      });
    });
  }

  // ── Stage 4: ViT attention ──
  function renderStage4() {
    const key = state.imgKey;
    const p = state.vitPatch;
    return getSource(key).then(img => {
      drawImage(sCtx, img);
      drawPatchGrid(sCtx, p);

      const vit = getVit(key);
      drawAttentionMap(mCtx, img, vit, p);
      drawAttentionRecon(oCtx, img, vit, p);

      const px = p % GRID, py = (p / GRID) | 0;
      els.middleTitle.textContent = 'Attention from patch';
      els.middleSub.textContent = '(' + px + ',' + py + ') · last block, mean head';
      els.sourceSub.textContent = D.images[key].label;
      els.outputSub.textContent = 'attention-weighted mix';
      els.info.textContent = 'Click any patch in the source. ViT-S/16 attention is global from layer 1 — every patch sees every other patch.';
      els.capText.textContent = 'Spatial relationships. Distant patches can talk in a single step.';
    });
  }

  function drawPatchGrid(ctx, focal) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      const k = i * PATCH + 0.5;
      ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, IMG); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(IMG, k); ctx.stroke();
    }
    const fx = (focal % GRID) * PATCH;
    const fy = ((focal / GRID) | 0) * PATCH;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.strokeRect(fx + 1, fy + 1, PATCH - 2, PATCH - 2);
    ctx.restore();
  }

  function drawAttentionMap(ctx, img, vit, p) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, IMG, IMG);
    ctx.globalAlpha = 0.35;
    drawImage(ctx, img);
    ctx.globalAlpha = 1.0;

    const offset = p * N_PATCH;
    const rowMax = vit.rowMax[p] || 1e-6;
    // Each patch gets coloured by its attention weight.
    for (let j = 0; j < N_PATCH; j++) {
      const v = vit.vals[offset + j] / 255 * rowMax;
      // Normalise across the row for display dynamic range.
      const a = Math.min(1, v / rowMax);
      ctx.fillStyle = 'rgba(249,115,22,' + (a * 0.85).toFixed(3) + ')';
      const x = (j % GRID) * PATCH, y = ((j / GRID) | 0) * PATCH;
      ctx.fillRect(x, y, PATCH, PATCH);
    }
    // Highlight focal patch.
    const fx = (p % GRID) * PATCH, fy = ((p / GRID) | 0) * PATCH;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.strokeRect(fx + 1, fy + 1, PATCH - 2, PATCH - 2);
  }

  function drawAttentionRecon(ctx, img, vit, p) {
    // For each output patch position, blend a fixed grey with each source
    // patch weighted by attention. We pre-rasterise patches to a temp canvas.
    const tmp = document.createElement('canvas');
    tmp.width = IMG; tmp.height = IMG;
    const tctx = tmp.getContext('2d');
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(img, 0, 0, IMG, IMG);
    const src = tctx.getImageData(0, 0, IMG, IMG).data;

    const out = ctx.createImageData(IMG, IMG);
    const offset = p * N_PATCH;
    const rowMax = vit.rowMax[p] || 1e-6;

    // Pre-compute per-patch mean colour and normalised attention weight.
    const meanR = new Float32Array(N_PATCH);
    const meanG = new Float32Array(N_PATCH);
    const meanB = new Float32Array(N_PATCH);
    const attn  = new Float32Array(N_PATCH);
    let attnSum = 0;
    for (let j = 0; j < N_PATCH; j++) {
      attn[j] = (vit.vals[offset + j] / 255) * rowMax;
      attnSum += attn[j];
      const px = (j % GRID) * PATCH, py = ((j / GRID) | 0) * PATCH;
      let r = 0, g = 0, b = 0, n = PATCH * PATCH;
      for (let y = 0; y < PATCH; y++) {
        let row = ((py + y) * IMG + px) * 4;
        for (let x = 0; x < PATCH; x++) {
          r += src[row]; g += src[row+1]; b += src[row+2];
          row += 4;
        }
      }
      meanR[j] = r / n; meanG[j] = g / n; meanB[j] = b / n;
    }
    if (attnSum > 0) for (let j = 0; j < N_PATCH; j++) attn[j] /= attnSum;

    // The "reconstruction" we draw: each patch is filled with the
    // attention-weighted mix of all source patches' mean colours. Patches
    // with strong attention dominate; weak ones contribute little.
    let mixR = 0, mixG = 0, mixB = 0;
    for (let j = 0; j < N_PATCH; j++) {
      mixR += attn[j] * meanR[j];
      mixG += attn[j] * meanG[j];
      mixB += attn[j] * meanB[j];
    }
    for (let j = 0; j < N_PATCH; j++) {
      // Blend each output patch's own mean toward the global attention-mix
      // by amount (1 - attention weight). Patches the focal sees clearly
      // keep their own colour; ignored patches fade to the mix.
      const a = Math.min(1, attn[j] * N_PATCH);
      const r = a * meanR[j] + (1 - a) * mixR;
      const g = a * meanG[j] + (1 - a) * mixG;
      const b = a * meanB[j] + (1 - a) * mixB;
      const px = (j % GRID) * PATCH, py = ((j / GRID) | 0) * PATCH;
      for (let y = 0; y < PATCH; y++) {
        let row = ((py + y) * IMG + px) * 4;
        for (let x = 0; x < PATCH; x++) {
          out.data[row]   = r;
          out.data[row+1] = g;
          out.data[row+2] = b;
          out.data[row+3] = 255;
          row += 4;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
  }

  // ── Stage 5: VAR scales ──
  function renderStage5() {
    const key = state.imgKey;
    const idx = state.varScale;
    return Promise.all([getSource(key), getVarImg(key, idx)]).then(([src, scaleImg]) => {
      drawImage(sCtx, src);
      // Middle: current scale upscaled with nearest neighbour.
      mCtx.fillStyle = '#000'; mCtx.fillRect(0, 0, IMG, IMG);
      drawNearest(mCtx, scaleImg);

      // Output: reveal full image only at the last scale; otherwise show
      // a "still planning" hint.
      if (idx === VAR_SCALES.length) {
        getVarImg(key, VAR_SCALES.length).then(full => drawImage(oCtx, full));
        els.outputSub.textContent = 'final 224×224';
      } else {
        oCtx.fillStyle = '#fafafa'; oCtx.fillRect(0, 0, IMG, IMG);
        oCtx.fillStyle = '#bbb';
        oCtx.font = '12px ' + getComputedStyle(root).getPropertyValue('--vp-font-sans');
        oCtx.textAlign = 'center';
        oCtx.fillText('next scale →', IMG / 2, IMG / 2);
        els.outputSub.textContent = 'revealed at full scale';
      }

      const label = (idx < VAR_SCALES.length) ? (VAR_SCALES[idx] + '×' + VAR_SCALES[idx]) : 'full';
      els.middleTitle.textContent = 'Scale ' + (idx + 1) + '/' + N_VAR;
      els.middleSub.textContent = label;
      els.sourceSub.textContent = D.images[key].label;
      els.info.textContent = varStageDescription(idx);
      els.capText.textContent = 'Coarse plan first, fine details last. Every scale is conditioned on all coarser ones.';
    });
  }

  function varStageDescription(idx) {
    if (idx === 0) return '1×1: one token holds the global colour and mood of the whole image.';
    if (idx === 1) return '2×2: rough layout — sky on top, ground on bottom, or similar.';
    if (idx === 2) return '4×4: composition starts to take shape.';
    if (idx === 3) return '8×8: scene is usually identifiable.';
    if (idx === 4) return '16×16: main objects are clear.';
    if (idx === 5) return '32×32: textures and edges appear.';
    if (idx === 6) return '64×64: fine detail — the plan is now fully populated.';
    return 'Full 224×224 — VAR reveals the final image after the last scale.';
  }

  // ── Stage dispatch ──
  function render() {
    updateStageLabel();
    switch (state.stage) {
      case 0: return renderStage0();
      case 1: return renderStage1();
      case 2: return renderStage2();
      case 3: return renderStage3();
      case 4: return renderStage4();
      case 5: return renderStage5();
    }
  }

  function updateStageLabel() {
    const tags = ['Random', 'Histogram', 'Filters', 'CNN', 'ViT', 'VAR'];
    els.stageTag.textContent = tags[state.stage];
    // Hide/show stage-specific controls.
    root.querySelectorAll('.vp-stage-only').forEach(el => {
      const stages = (el.getAttribute('data-show') || '').split(',').map(Number);
      el.hidden = !stages.includes(state.stage);
    });
    // Source canvas is clickable only in Stage 4.
    els.sourceCanvas.classList.toggle('vp-clickable', state.stage === 4);
    // Generate button is meaningful only for stochastic stages (0, 1, 2).
    els.genBtn.hidden = ![0, 1, 2].includes(state.stage);
  }

  // ── Event wiring ──
  els.stageSelect.addEventListener('change', e => {
    state.stage = +e.target.value;
    render();
  });
  els.imgSelect.addEventListener('change', e => {
    state.imgKey = e.target.value;
    render();
  });
  els.filterSelect.addEventListener('change', e => {
    state.filterType = e.target.value;
    if (state.stage === 2) render();
  });
  els.layerSlider.addEventListener('input', e => {
    state.cnnLayer = +e.target.value;
    state.cnnChannel = 0;
    els.channelSlider.value = 0;
    els.layerVal.textContent = ['Early', 'Middle', 'Deep'][state.cnnLayer];
    els.channelVal.textContent = '1/' + D.channels_per_layer;
    if (state.stage === 3) render();
  });
  els.channelSlider.addEventListener('input', e => {
    state.cnnChannel = +e.target.value;
    els.channelVal.textContent = (state.cnnChannel + 1) + '/' + D.channels_per_layer;
    if (state.stage === 3) render();
  });
  els.patchSlider.addEventListener('input', e => {
    state.vitPatch = +e.target.value;
    const px = state.vitPatch % GRID, py = (state.vitPatch / GRID) | 0;
    els.patchVal.textContent = px + ',' + py;
    if (state.stage === 4) render();
  });
  els.scaleSlider.addEventListener('input', e => {
    state.varScale = +e.target.value;
    const lbl = (state.varScale < VAR_SCALES.length)
      ? (VAR_SCALES[state.varScale] + '×' + VAR_SCALES[state.varScale])
      : 'full';
    els.scaleVal.textContent = lbl;
    if (state.stage === 5) render();
  });
  // Scale slider max = number of scales (last index = "full").
  els.scaleSlider.max = String(VAR_SCALES.length);

  els.genBtn.addEventListener('click', () => render());

  els.animBtn.addEventListener('click', () => {
    if (state.animating) return;
    state.animating = true;
    state.varScale = 0;
    els.scaleSlider.value = 0;
    const step = () => {
      els.scaleVal.textContent = (state.varScale < VAR_SCALES.length)
        ? (VAR_SCALES[state.varScale] + '×' + VAR_SCALES[state.varScale])
        : 'full';
      render().then(() => {
        if (state.varScale >= VAR_SCALES.length) {
          state.animating = false;
          return;
        }
        state.varScale += 1;
        els.scaleSlider.value = state.varScale;
        setTimeout(step, 700);
      });
    };
    step();
  });

  // Click-to-pick patch in Stage 4.
  els.sourceCanvas.addEventListener('click', (e) => {
    if (state.stage !== 4) return;
    const rect = els.sourceCanvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width * IMG;
    const cy = (e.clientY - rect.top)  / rect.height * IMG;
    const px = Math.min(GRID - 1, Math.max(0, (cx / PATCH) | 0));
    const py = Math.min(GRID - 1, Math.max(0, (cy / PATCH) | 0));
    state.vitPatch = py * GRID + px;
    els.patchSlider.value = state.vitPatch;
    els.patchVal.textContent = px + ',' + py;
    render();
  });

  // ── Init ──
  els.layerVal.textContent = 'Middle';
  els.channelVal.textContent = '1/' + D.channels_per_layer;
  render();
})();
</script>

---

## References

Alain, G. and Bengio, Y. (2017). Understanding intermediate layers using linear classifier probes. *ICLR Workshop*.

Canny, J. (1986). A computational approach to edge detection. *IEEE TPAMI*, 8(6), 679-698.

Dieleman, S. (2023). Diffusion is spectral autoregression. *Blog post*, sander.ai.

Dosovitskiy, A. et al. (2020). An image is worth 16x16 words: Transformers for image recognition at scale. *ICLR 2021*.

Efros, A. A. and Leung, T. K. (1999). Texture synthesis by non-parametric sampling. *ICCV*, 1033-1038.

Goodfellow, I. et al. (2014). Generative adversarial nets. *NeurIPS*, 27.

Ho, J., Jain, A., and Abbeel, P. (2020). Denoising diffusion probabilistic models. *NeurIPS*, 33.

Hubel, D. H. and Wiesel, T. N. (1962). Receptive fields, binocular interaction and functional architecture in the cat's visual cortex. *Journal of Physiology*, 160(1), 106-154.

Karras, T., Laine, S., and Aila, T. (2019). A style-based generator architecture for generative adversarial networks. *CVPR*, 4401-4410.

Karras, T. et al. (2020). Analyzing and improving the image quality of StyleGAN. *CVPR*, 8110-8119.

Krizhevsky, A., Sutskever, I., and Hinton, G. E. (2012). ImageNet classification with deep convolutional neural networks. *NeurIPS*, 25.

LeCun, Y. et al. (1989). Backpropagation applied to handwritten zip code recognition. *Neural Computation*, 1(4), 541-551.

Li, D. et al. (2024). Infinity: Scaling bitwise autoregressive modeling for high-resolution image synthesis. *arXiv:2412.04431*.

Portilla, J. and Simoncelli, E. P. (2000). A parametric texture model based on joint statistics of complex wavelet coefficients. *IJCV*, 40(1), 49-71.

Ramesh, A. et al. (2021). Zero-shot text-to-image generation. *ICML*, 8821-8831.

Rombach, R. et al. (2022). High-resolution image synthesis with latent diffusion models. *CVPR*, 10684-10695.

Sobel, I. (1968). An isotropic 3x3 image gradient operator. *Stanford AI Laboratory*.

Sohl-Dickstein, J. et al. (2015). Deep unsupervised learning using nonequilibrium thermodynamics. *ICML*, 2256-2265.

Swain, M. J. and Ballard, D. H. (1991). Color indexing. *IJCV*, 7(1), 11-32.

Tang, Y. et al. (2024). HART: Efficient visual generation with hybrid autoregressive transformer. *arXiv:2410.10812*.

Tian, K. et al. (2024). Visual autoregressive modeling: Scalable image generation via next-scale prediction. *NeurIPS*, 37.

van den Oord, A., Kalchbrenner, N., and Kavukcuoglu, K. (2016). Pixel recurrent neural networks. *ICML*, 1747-1756.

Vaswani, A. et al. (2017). Attention is all you need. *NeurIPS*, 30.

Zeiler, M. D. and Fergus, R. (2014). Visualizing and understanding convolutional networks. *ECCV*, 818-833.

---

## Citation

If you find this work useful, please cite:

```bibtex
@article{levonyan2026pixelhistograms,
  title={From Pixel Histograms to Visual Autoregression: How Images Learn to See Themselves},
  author={Levonyan, Karine},
  year={2026},
  url={https://karinelevonyan.github.io/blog/2026/from-pixel-histograms-to-visual-autoregression/}
}
```


