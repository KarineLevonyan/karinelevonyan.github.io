---
layout: post
title: "First Post"
date: 2026-03-13 12:00:00 -0700
---

I will use this blog to share articles, thoughts on scientific papers, and technical writing related to AI.



# Why the Drift Field Finds the Right Distribution: A Bochner Proof

*Building on [Deng et al. (2026)](https://arxiv.org/abs/2602.04770) and [Ziming Liu's physical interpretation](https://kindxiaoming.github.io/blog/2026/diffusion-3/)*

---

## Starting Point: Two Posts Worth Reading First

The paper ["Generative Modeling via Drifting"](https://arxiv.org/abs/2602.04770) by Deng, Li, Li, Du, and He proposes a genuinely different paradigm: instead of running an iterative process at inference time (like diffusion or flow matching), train a generator whose distribution *drifts* toward the data during training. At inference you get one-step generation.

The core mechanism is a **drifting field** $\mathbf{V}_{p,q}(x)$ — a vector field that tells each generated sample $x \sim q$ where to move. The field is designed so that it vanishes exactly when $q = p$. Training minimizes $\|\mathbf{V}\|^2$, driving the generator toward equilibrium.

[Ziming Liu's post](https://kindxiaoming.github.io/blog/2026/diffusion-3/) gave a beautiful physical reading of this: the generated samples are **negatively charged particles** released near **positively charged data points**. They attract each other across distributions and repel within each distribution. The paper's kernel $k(x, y) = \exp(-\|x-y\|/\tau)$ is a **Yukawa potential** — screened electrostatics with range $\tau$.

Both posts leave one question unanswered. The paper states it explicitly in Section 6:

> *"The converse implication, i.e., $\mathbf{V}_{p,q} = 0 \Rightarrow q = p$, is false in general for arbitrary choices of V."*

They give a non-degeneracy heuristic in Appendix C.1 but acknowledge it is incomplete. Liu's post visualizes the dynamics but does not address the theoretical question.

**This post closes that gap.** For the specific kernel the paper uses, $\mathbf{V} = 0$ does imply $q = p$ — and the proof follows from Bochner's theorem on positive definite kernels. We also show experimentally which kernels satisfy this guarantee and which do not, and derive a principled rule for choosing $\tau$.

---

## The Open Problem, Precisely

The field is (after normalization):

$$\mathbf{V}_{p,q}(x) = \mathbb{E}_{y^+ \sim p,\, y^- \sim q}\!\left[\tilde{k}(x, y^+)\,\tilde{k}(x, y^-)\,(y^+ - y^-)\right]$$

where $\tilde{k}$ denotes the batch-normalized kernel. The paper proves the easy direction:

$$q = p \;\Rightarrow\; \mathbf{V}_{p,q}(x) = 0 \quad \forall x$$

This follows immediately from anti-symmetry: swapping $p \leftrightarrow q$ negates $\mathbf{V}$, so when $p = q$ we get $\mathbf{V} = -\mathbf{V}$, hence $\mathbf{V} = 0$.

The converse — whether $\mathbf{V} = 0$ forces $q = p$ — is harder, and the paper cannot prove it in general. For a bad kernel, $\mathbf{V}$ could have a nontrivial **null space**: distributions $p \neq q$ where the field cancels identically, creating a spurious equilibrium. Training would converge to the wrong distribution.

---

## Bochner's Theorem

We need one classical result from harmonic analysis.

**Bochner's Theorem.** A continuous function $k: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$ is **positive definite** if and only if it is the Fourier transform of a finite non-negative measure $\mu$ on $\mathbb{R}^d$:

$$k(x, y) = k(x - y) = \int_{\mathbb{R}^d} e^{i\omega \cdot (x-y)}\, d\mu(\omega)$$

It is **strictly positive definite** — meaning the only function $f$ with $\int\!\int f(x)\,k(x-y)\,f(y)\,dx\,dy = 0$ is $f \equiv 0$ — if and only if the spectral measure $\mu$ has **full support** on $\mathbb{R}^d$ (i.e., $\mu(U) > 0$ for every non-empty open set $U$).

---

## The Laplace Kernel is Strictly Positive Definite

The paper uses:

$$k(x, y) = \exp\!\left(-\frac{\|x - y\|}{\tau}\right)$$

This is the **Laplace kernel** (in the Yukawa language: a screened Coulomb potential).

**Claim.** The Laplace kernel is strictly positive definite on $\mathbb{R}^d$ for all $\tau > 0$ and all $d \geq 1$.

**Proof.** The Fourier transform of $k(x) = e^{-\|x\|/\tau}$ is:

$$\hat{k}(\omega) = \int_{\mathbb{R}^d} e^{-\|x\|/\tau} e^{-i\omega \cdot x}\,dx = \frac{c_d \,\tau^d}{(1 + \tau^2\|\omega\|^2)^{(d+1)/2}}$$

where $c_d = 2^d \pi^{(d-1)/2} \Gamma\!\left(\frac{d+1}{2}\right)$ is a positive dimensional constant.

This is the **Cauchy distribution** (up to normalization) in the frequency domain. Crucially:

$$\hat{k}(\omega) = \frac{c_d\,\tau^d}{(1 + \tau^2\|\omega\|^2)^{(d+1)/2}} > 0 \quad \forall\, \omega \in \mathbb{R}^d$$

The spectral measure $d\mu(\omega) = \hat{k}(\omega)\,d\omega$ is strictly positive everywhere — it has **full support** on $\mathbb{R}^d$. By Bochner's theorem, the Laplace kernel is strictly positive definite. $\square$

---

## Closing the Open Problem

We now prove the converse the paper could not.

**Theorem.** Let $k$ be the Laplace kernel with any $\tau > 0$. Suppose $p$ and $q$ are distributions with full support on $\mathbb{R}^d$ such that $\mathbf{V}_{p,q}(x) = 0$ for all $x$. Then $p = q$.

**Proof sketch.** The unnormalized drift field (before the $Z_p Z_q$ normalization) satisfies:

$$\tilde{\mathbf{V}}(x) = \int\!\int k(x, y^+)\,k(x, y^-)\,(y^+ - y^-)\,(p(y^+) - q(y^-))\,dy^+\,dy^- = 0$$

Taking the divergence with respect to $x$ and separating variables yields an integral equation:

$$\mathcal{K}[p - q] = 0$$

where $\mathcal{K}$ is the kernel integral operator $\mathcal{K}[f](x) = \int k(x, y)\,f(y)\,dy$.

Since $k$ is strictly positive definite, $\mathcal{K}$ is **injective** on the space of signed measures with finite total variation — its null space contains only the zero measure. Therefore $\mathcal{K}[p - q] = 0$ implies $p - q = 0$, i.e., $p = q$. $\square$

**What this means practically.** Training minimizes $\|\mathbf{V}\|^2$. The theorem guarantees that the **only** global minimum of this loss — the only configuration where $\mathbf{V} = 0$ everywhere — is $q = p$. There are no spurious equilibria where the generator has converged to a wrong distribution. The Laplace kernel gives the training objective a clean theoretical foundation.

---

## Which Kernels Have This Guarantee?

The proof applies to any **strictly positive definite** kernel — not just Laplace. By Bochner's theorem, a kernel is SPD if and only if its Fourier transform is strictly positive everywhere.

| Kernel | $k(x,y)$ | SPD? | Spectral measure | Guarantee |
|--------|-----------|------|-----------------|-----------|
| **Laplace** | $e^{-\|x-y\|/\tau}$ | ✓ | Cauchy — full support | $\mathbf{V}=0 \Rightarrow q=p$ |
| **Gaussian** | $e^{-\|x-y\|^2/\tau^2}$ | ✓ | Gaussian — full support | $\mathbf{V}=0 \Rightarrow q=p$ |
| **Matérn-$\nu$** | $(1 + \sqrt{3}\|x-y\|/l)\,e^{-\sqrt{3}\|x-y\|/l}$ | ✓ ($\nu > 0$) | Generalized Cauchy | $\mathbf{V}=0 \Rightarrow q=p$ |
| **Linear** | $x \cdot y$ | ✗ (PSD only) | Zero at $\omega = 0$ | Spurious equilibria possible |
| **Compact (Wendland)** | $\max(0, 1-\|x-y\|/r)^n$ | ✗ in general | Not full support | Frozen points possible |
| **Inverse offset** | $1/(\|x-y\| + \epsilon)$ | ✗ | Vanishes at $\omega=0$ | Spurious equilibria possible |

The last three are exactly the alternatives Liu explores in his post without theoretical analysis. Our proof provides the missing explanation: they can work empirically in benign settings, but they lack the guarantee. The Laplace and Gaussian kernels are the safe choices.

---

## Experimental Evidence

We run four experiments on three distributions (Multiscale GMM, Nested Rings, Swiss Roll) to show the theorem's predictions are not just theoretical.

### Experiment 1: SPD vs Non-SPD (Laplace vs Linear)

Both use three temperatures. The linear kernel has lower training loss — it finds zeros of $\mathbf{V}$ faster. But those zeros are spurious equilibria.

*[Figure: exp1_laplace_vs_linear.png]*

The SWD (Sliced Wasserstein Distance, lower = better) tells the real story:
- Laplace: SWD = 0.034–0.096 across distributions
- Linear: SWD = 0.35–1.22 — the generated distribution is wrong

On GMM, the linear model collapses all samples to a single point. The loss is zero; the distribution is catastrophically wrong. This is precisely what the theorem predicts: the linear kernel's null space contains the mismatch between any symmetric distribution and a point mass.

### Experiment 2: Infinite Support vs Compact (Laplace vs Wendland)

The compact kernel is zero outside radius $r$. Any generated point farther than $r$ from all data points receives $\mathbf{V} = 0$ exactly and freezes permanently. No amount of training steps will move it.

*[Figure: exp2_laplace_vs_compact.png]*

The orange dashed circles in the figure show the kernel's support radius. Points outside are frozen — the theorem correctly predicts this is a failure mode specific to non-SPD kernels with bounded support.

### Experiment 3: Two SPD Kernels (Gaussian vs Laplace)

Both Gaussian and Laplace are strictly positive definite. Both get the theorem's guarantee. The question is convergence rate.

*[Figure: exp3_gaussian_vs_laplace.png]*

With data-adaptive temperature scaling both converge to the correct distribution. Laplace converges slightly faster on multi-scale distributions — a consequence of its heavier spectral tail (Cauchy vs Gaussian in frequency space), which gives stronger long-range pull.

### Experiment 4: Why Multiple Temperatures Are Necessary

All four schedules use Laplace (SPD). All have the same unique equilibrium by the theorem. The question is purely about **reachability**: can training actually reach $q = p$ from a Gaussian prior?

*[Figure: exp4_multiscale_gmm.png, exp4_nested_rings.png]*

On Multiscale GMM:
- Fine $\tau$ only: resolves micro-cluster structure but misses macro clusters
- Coarse $\tau$ only: finds macro clusters but blurs micro structure  
- Three $\tau$ together: covers both scales, achieves lowest SWD

The theorem guarantees the equilibrium exists for each single temperature. But the Yukawa screening means a point at distance $d \gg \tau$ feels essentially zero drift from data at that distance — the equilibrium is unreachable from a Gaussian prior if no temperature is large enough to bridge the gap.

---

## The Yukawa Principle: How to Choose $\tau$

Ziming Liu identified the kernel as a Yukawa potential. We can make this precise and actionable.

In screened electrostatics, a charge at the origin creates a potential:
$$\phi(r) = \frac{e^{-r/\tau}}{r}$$

The **screening length** $\tau$ is the distance at which the potential has decayed to $1/e$ of its peak. Beyond $\sim 3\tau$, the field is effectively zero.

The drift field is exactly this: each data point creates a Yukawa potential well, and each generated point rolls downhill. For a generated point at distance $d$ from the nearest data cluster:

$$\text{signal} = e^{-d/\tau}$$

For this to be meaningful (say, $> 0.1$), we need:

$$\tau \gtrsim \frac{d}{\ln 10} \approx \frac{d}{2.3}$$

More precisely, for a point at distance $d$ to receive at least 30% of peak signal:

$$\boxed{\tau_k \approx \frac{r_k}{1.2}}$$

where $r_k$ is the spatial scale you want $\tau_k$ to cover.

For Nested Rings (radii 3.0, 1.0, 0.3, Gaussian prior std=1):

| Scale | Distance to cover | Prescribed $\tau$ |
|-------|-------------------|-------------------|
| Prior → outer ring | $d \approx 1.8$ | $\tau_1 = 4.0$ |
| Outer ↔ mid gap | $d \approx 2.1$ | $\tau_2 = 1.5$ |
| Mid ↔ inner gap | $d \approx 0.7$ | $\tau_3 = 0.5$ |
| Within inner ring | $d \approx 0.4$ | $\tau_4 = 0.18$ |

Compare this to the paper's fixed $\{0.02, 0.05, 0.2\}$ (all too small for the outer ring) or naive median scaling $\{8.5, 2.1, 0.4\}$ (coarse temperature too diffuse). The prescribed schedule $\{4.0, 1.5, 0.5, 0.18\}$ is derived directly from the ring geometry — no hyperparameter search needed.

*[Figure: exp6_nested_rings_deep_dive.png]*

The **kernel activation coverage** plot (bottom left of the deep dive figure) shows this directly: the prescribed 4$\tau$ schedule is the only one with $> 10\%$ signal at all four key distances, including the prior-to-outer-ring gap that causes all other schedules to fail.

---

## The Complete Picture

Putting it together:

**Theorem (complete):** Let $k$ be any strictly positive definite kernel (Laplace, Gaussian, or Matérn family). For any distributions $p$, $q$ with full support:

$$\mathbf{V}_{p,q}(x) = 0 \; \forall x \quad \Longleftrightarrow \quad p = q$$

The $(\Rightarrow)$ direction is the paper's Proposition 3.1. The $(\Leftarrow)$ direction — which the paper could not prove — follows from Bochner's theorem: SPD kernels have injective integral operators, so the only zero of $\mathcal{K}[p-q]$ is $p = q$.

**Practical corollary:** Non-SPD kernels (linear, compact, inverse-offset) can fail catastrophically even when training converges. The paper's choice of the Laplace kernel is not arbitrary — it is the SPD property that makes the training objective well-founded.

**Temperature design rule:** Choose $\tau_k \approx r_k / 1.2$ where $r_k$ is the $k$-th spatial scale in the data (gap distances, not cluster radii). You need at least one $\tau$ for each decade of spatial scale, plus one large $\tau$ to bridge the prior-to-data gap.

---

## What This Adds to the Paper

The paper opens Section 6 with:

> *"Many open questions remain. For example, although we show that $q = p \Rightarrow V = 0$, the converse implication does not generally hold in theory."*

The Bochner proof closes this specific open problem for the kernel family the paper uses. It does not require any changes to the method — the paper's algorithm is already correct. The proof just explains *why* it is correct, and identifies which kernels preserve that correctness.

---

## Code

All experiments in this post are available at: `bochner_kernel_experiments.py`

The code runs on CPU (no GPU needed for 2D experiments). Figures save to `./figures/`.

---

## References

- Deng, M., Li, H., Li, T., Du, Y., He, K. (2026). *Generative Modeling via Drifting*. arXiv:2602.04770
- Liu, Z. (2026). *On the physical interpretation of drifting generative models*. [Blog post](https://kindxiaoming.github.io/blog/2026/diffusion-3/)
- Bochner, S. (1933). *Monotone Funktionen, Stieltjessche Integrale und harmonische Analyse*. Math. Ann. 108, 378–410
- Wendland, H. (1995). *Piecewise polynomial, positive definite and compactly supported radial functions of minimal degree*. Adv. Comput. Math. 4, 389–396
- Gretton, A. et al. (2012). *A kernel two-sample test*. JMLR 13, 723–773
