---
layout: post
title: "Why the Drift Field Finds the Right Distribution: A Bochner Proof. Part 2: Practice"
date: 2026-03-14 12:00:00 -0700
tags: Physical-AI Drifting-Models
math: true
published: false
---

*Companion to [Part 1: Theory](/blog/2026/why-the-drift-field-finds-the-right-distribution-a-bochner-proof-part-1-theory/)*

---

## The Yukawa Principle: How to Choose $\tau$

Liu's electrostatic picture makes the role of $\tau$ concrete. In screened electrostatics, a charge at the origin creates a potential:

$$\phi(r) = \frac{e^{-r/\tau}}{r}$$

The **screening length** $\tau$ is the distance at which the exponential factor has decayed to $1/e$ of its peak. But the relevant question for training is: *at what distance does the signal become negligible?*

The kernel signal at distance $r$ is:

$$\text{signal}(r) = e^{-r/\tau}$$

Setting a threshold:
- At $r = \tau$: signal = $e^{-1} \approx 37\%$
- At $r = 2.3\tau$: signal = $e^{-2.3} \approx 10\%$
- At $r = 3\tau$: signal = $e^{-3} \approx 5\%$

**Beyond $\sim 3\tau$, the drift force is effectively zero.** A generated point at distance $d \gg 3\tau$ from all data receives no meaningful gradient signal — it is screened out and freezes in place.

<img src="/assets/img/yukawa_tau_design.png" alt="Yukawa screening length and tau design" style="float: right; width: 30%; margin-left: 1rem; margin-bottom: 1rem;">

This gives a principled design rule. For a generated point at distance $d$ from the nearest data to receive at least 30% of peak signal ($e^{-1.2} \approx 0.30$):

$$\boxed{\tau_k \approx \frac{r_k}{1.2}}$$

where $r_k$ is the $k$-th spatial scale you want $\tau_k$ to cover.

**Concrete example: Nested Rings** (radii 3.0, 1.0, 0.3; Gaussian prior $\sigma = 1$):

| Scale | Distance to bridge | Prescribed $\tau$ |
|-------|-------------------|-------------------|
| Prior → outer ring | $d \approx 1.8$ | $\tau_1 = 4.0$ |
| Outer → mid ring gap | $d \approx 2.1$ | $\tau_2 = 1.5$ |
| Mid → inner ring gap | $d \approx 0.7$ | $\tau_3 = 0.5$ |
| Within inner ring | $d \approx 0.4$ | $\tau_4 = 0.18$ |

You need at least one $\tau$ per decade of spatial scale, plus one large $\tau$ to bridge the prior-to-data gap. Without the bridging temperature, the theorem still guarantees the equilibrium *exists* — but Yukawa screening makes it **unreachable** from a distant initialization.

---

## The Complete Picture

**Theorem (complete).** Let $k$ be any strictly positive definite kernel (Laplace, Gaussian, or Matérn). For distributions $p$, $q$ with full support:

$$\mathbf{V}_{p,q}(x) = 0 \; \forall x \quad \Longleftrightarrow \quad p = q$$

The $(\Leftarrow)$ direction is the paper's Proposition 3.1. The $(\Rightarrow)$ direction follows from Bochner's theorem: SPD kernels have injective integral operators, so the only zero of $\mathcal{K}[p-q]$ is $p = q$.

**Practical corollaries:**
- Non-SPD kernels (linear, compact, inverse-offset) can fail catastrophically even when training loss converges to zero.
- The paper's choice of the Laplace kernel is not arbitrary — it is the SPD property that makes the training objective well-founded.
- Choose $\tau_k \approx r_k / 1.2$ where $r_k$ is the $k$-th gap distance in the data, with at least one $\tau$ large enough to reach from the prior to the outermost data structure.

---

## Experimental Validation

*Coming soon: experiments on Multiscale GMM, Nested Rings, and Swiss Roll distributions.*

### Experiment 1: SPD vs Non-SPD (Laplace vs Linear)

*Coming soon...*

### Experiment 2: Infinite Support vs Compact (Laplace vs Wendland)

*Coming soon...*

### Experiment 3: Two SPD Kernels (Gaussian vs Laplace)

*Coming soon...*

### Experiment 4: Temperature Schedule Ablation

*Coming soon...*

---

## Code

All experiments: `bochner_kernel_experiments.py` (CPU, 2D distributions). Figures save to `./figures/`.

---

## References

- Deng, M., Li, H., Li, T., Du, Y., He, K. (2026). *Generative Modeling via Drifting*. arXiv:2602.04770
- Liu, Z. (2026). *On the physical interpretation of drifting generative models*. [Blog post](https://kindxiaoming.github.io/blog/2026/diffusion-3/)

---

## Citation

If you find this work useful, please cite:

```bibtex
@article{levonyan2026bochner,
  title={Why the Drift Field Finds the Right Distribution: A Bochner Proof},
  author={Levonyan, Karine},
  journal={Blog post},
  year={2026},
  url={https://karinelevonyan.github.io/blog/2026/drifting-models-bochner-proof-part-2-practice/}
}
```
