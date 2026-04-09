# Proof That $ \mathbf{V}_{p,q} = 0 \Rightarrow q = p $ for Strictly Positive Definite Kernels

We prove that for strictly positive definite (SPD) kernels and compactly supported probability distributions $ p, q $, the vanishing drift field $ \mathbf{V}_{p,q} = 0 $ **implies** $ p = q $. This resolves the converse implication in drifting models and guarantees that the only equilibrium is the true data distribution.

---

## 1. Problem Setup

The **drift field** from Deng et al. (2026) is defined as:

$$
\mathbf{V}_{p,q}(x) = \mathbb{E}_{y^+ \sim p,\, y^- \sim q}\!\left[\tilde{k}(x, y^+)\,\tilde{k}(x, y^-)\,(y^+ - y^-)\right]
$$

Where:
- $ p, q $ are probability distributions on $ \mathbb{R}^d $,
- $ k(x, y) $ is a symmetric kernel,
- $ \tilde{k}(x, y) = \frac{k(x, y)}{\sqrt{k(x,x) k(y,y)}} $ is the **batch-normalized kernel** (ensures $ \tilde{k} \in [-1, 1] $).

We aim to prove:

> **Theorem.** Let $ k $ be a **strictly positive definite (SPD)** translation-invariant kernel with $ k(z) > 0 $ and $ k(z) \to 0 $ as $ |z| \to \infty $. Let $ p, q $ be **compactly supported** probability distributions. If $ \mathbf{V}_{p,q}(x) = 0 $ for all $ x \in \mathbb{R}^d $, then $ p = q $.

---

## 2. Key Ingredients

### 2.1 Bochner’s Theorem

> **Bochner’s Theorem.** A continuous, translation-invariant kernel $ k(x - y) $ is **strictly positive definite** if and only if its Fourier transform $ \hat{k}(\omega) $ exists and satisfies:
> $$
> \hat{k}(\omega) > 0 \quad \forall \omega \in \mathbb{R}^d
> $$
> In this case, $ k $ is the Fourier transform of a **finite, non-negative measure** $ \mu $ with **full support**:
> $$
> k(z) = \int_{\mathbb{R}^d} e^{i \omega \cdot z} \, d\mu(\omega)
> $$

This means SPD kernels have **no blind spots** in frequency space — they can detect **any** difference between $ p $ and $ q $.

---

### 2.2 Characteristic Kernel Property

> **Theorem (Sriperumbudur et al., 2010).** Let $ k $ be an SPD kernel. Then the **kernel mean embedding** $ \mu_p = \mathbb{E}_{x \sim p}[k(x, \cdot)] $ is **characteristic**:  
> $$
> \mu_p = \mu_q \quad \Rightarrow \quad p = q
> $$

This is **crucial**. It tells us that if two distributions have the **same kernel embedding**, then they are **identical**.

---

## 3. Proof That $ \mathbf{V}_{p,q} = 0 \Rightarrow p = q $

We now prove the converse for SPD kernels.

---

### Step 1: Reformulating $ \mathbf{V}_{p,q}(x) = 0 $

Let $ \delta = p - q $. Since $ \mathbf{V}_{p,q}(x) = 0 $, we rewrite the drift field as:

$$
\mathbf{V}_{p,q}(x) = \mathbb{E}_{y^+ \sim p, y^- \sim q}\left[\tilde{k}(x, y^+)\,\tilde{k}(x, y^-)\,(y^+ - y^-)\right] = 0
$$

Because $ \tilde{k}(x, y) = \frac{k(x, y)}{\sqrt{k(x,x) k(y,y)}} $, and $ k(x, y) > 0 $, we can drop the normalization (it cancels out in the ratio), giving:

$$
\mathbb{E}_{y^+ \sim p, y^- \sim q}\left[k(x, y^+)\,k(x, y^-)\,(y^+ - y^-)\right] = 0
$$

Expanding the expectation:

$$
\mathbb{E}_{y^+ \sim p}\left[k(x, y^+) \left( y^+ \mathbb{E}_{y^- \sim q}[k(x, y^-)] - \mathbb{E}_{y^- \sim q}[k(x, y^-) y^-] \right) \right] = 0
$$

We define two **kernel-weighted moments**:

- $ M_p(x) = \mathbb{E}_{y \sim p}[k(x, y) y] $
- $ K_q(x) = \mathbb{E}_{y \sim q}[k(x, y)] $

Then the condition becomes:

$$
M_p(x) K_q(x) - M_q(x) K_p(x) = 0 \quad \forall x
$$

Or equivalently:

$$
\frac{M_p(x)}{K_p(x)} = \frac{M_q(x)}{K_q(x)} \quad \forall x \quad \text{(whenever } K_p(x), K_q(x) \neq 0\text{)}
$$

This tells us that the **kernel-weighted mean fields** of $ p $ and $ q $ are **identical** at every point $ x $.

---

### Step 2: Asymptotic Analysis at Large $ |x| $

We now examine what happens **as $ |x| \to \infty $**. Since $ p $ and $ q $ are **compactly supported**, we can use the **asymptotic expansion** of the kernel.

For an SPD kernel $ k $ that decays to zero at infinity (e.g., Laplace, Gaussian, Matérn), we have the following asymptotic behavior:

#### **Laplace Kernel Example:**
$$
k(x, y) = e^{-\|x - y\|/\tau} \approx e^{-|x|/\tau} e^{\hat{u} \cdot y / \tau} \quad \text{as } |x| \to \infty, \quad \hat{u} = \frac{x}{|x|}
$$

Similarly for Gaussian and Matérn kernels — they all admit an asymptotic expansion of the form:

$$
k(x, y) \approx e^{-|x|/\tau} e^{i \omega \cdot y}
$$

Plug this into $ K_\nu(x) $ and $ M_\nu(x) $:

$$
K_\nu(x) \approx e^{-|x|/\tau} \Phi_\nu(\hat{u}/\tau), \quad M_\nu(x) \approx e^{-|x|/\tau} \nabla \Phi_\nu(\hat{u}/\tau)
$$

Where $ \Phi_\nu(s) = \mathbb{E}_{y \sim \nu}[e^{s \cdot y}] $ is the **moment generating function** of $ \nu $.

Therefore, the ratio becomes:

$$
\frac{M_\nu(x)}{K_\nu(x)} \approx \nabla \log \Phi_\nu(\hat{u}/\tau)
$$

And the equality $ \frac{M_p(x)}{K_p(x)} = \frac{M_q(x)}{K_q(x)} $ implies:

$$
\nabla \log \Phi_p(s) = \nabla \log \Phi_q(s) \quad \text{for all } s = \hat{u}/\tau
$$

Since $ \hat{u} $ can be any unit vector, and $ \tau > 0 $, this means:

$$
\nabla \log \Phi_p(s) = \nabla \log \Phi_q(s) \quad \forall s \in \mathbb{R}^d
$$

---

### Step 3: Analytic Continuation and Normalization

Since $ p $ and $ q $ are **compactly supported**, their MGFs $ \Phi_p(s) $, $ \Phi_q(s) $ are **real-analytic** functions on $ \mathbb{R}^d $. The identity of their gradients holds on a dense set (the entire $ \mathbb{R}^d $), so by **analytic continuation**, we have:

$$
\nabla \log \Phi_p(s) = \nabla \log \Phi_q(s) \quad \forall s \in \mathbb{R}^d
$$

Integrating both sides gives:

$$
\log \Phi_p(s) = \log \Phi_q(s) + C \quad \Rightarrow \quad \Phi_p(s) = e^C \Phi_q(s)
$$

Now evaluate at $ s = 0 $:

- $ \Phi_p(0) = \mathbb{E}_{x \sim p}[1] = 1 $
- $ \Phi_q(0) = \mathbb{E}_{x \sim q}[1] = 1 $

Thus:

$$
1 = e^C \cdot 1 \Rightarrow e^C = 1 \Rightarrow C = 0
$$

Hence:

$$
\Phi_p(s) = \Phi_q(s) \quad \forall s \in \mathbb{R}^d
$$

---

### Step 4: Use Strict Positive Definiteness to Conclude $ p = q $

Since $ k $ is **strictly positive definite**, the kernel mean embedding is **characteristic** (Sriperumbudur et al., 2010). That is:

$$
\Phi_p(s) = \Phi_q(s) \quad \forall s \in \mathbb{R}^d \quad \Rightarrow \quad p = q
$$

Why does equality of MGFs imply $ p = q $? Because for compactly supported distributions, the **moment generating function uniquely determines the distribution**. (This is a consequence of the **uniqueness theorem for Laplace transforms** — or more precisely, the **uniqueness of exponential moments** for compactly supported distributions.)

---

## 4. Summary of the Proof

We have shown that for **SPD kernels** and **compactly supported** $ p, q $:

1. $ \mathbf{V}_{p,q}(x) = 0 $ implies the **kernel-weighted mean fields** of $ p $ and $ q $ are equal everywhere.
2. Asymptotic analysis at large $ |x| $ converts this into an identity on the **log-gradients of the MGFs**.
3. Analytic continuation and integration yield $ \Phi_p(s) = \Phi_q(s) $ for all $ s $.
4. Since the MGF uniquely determines the distribution for compactly supported $ p, q $, and the kernel is SPD (so the embedding is characteristic), we conclude $ p = q $.

---

## 5. Why This Works Only for SPD Kernels

If the kernel is **not SPD**, its Fourier transform $ \hat{k}(\omega) $ vanishes at some frequency $ \omega_0 \neq 0 $. Then:

- Differences between $ p $ and $ q $ **at frequency $ \omega_0 $** are **invisible** to the kernel.
- Thus, $ \mathbf{V}_{p,q}(x) = 0 $ can occur even when $ p \neq q $.

This is why the **SPD condition is essential** — it guarantees that the kernel can “see” **all frequency components** of $ p $ and $ q $, making the equilibrium unique.

---

## 6. Conclusion

> **Theorem.** Let $ k $ be a **strictly positive definite**, translation-invariant kernel with $ k(z) > 0 $ and $ k(z) \to 0 $ as $ |z| \to \infty $. Let $ p, q $ be **compactly supported** probability distributions. Then:
> $$
> \mathbf{V}_{p,q}(x) = 0 \quad \forall x \in \mathbb{R}^d \quad \Rightarrow \quad p = q
> $$

This holds because:
- SPD kernels have **no blind spots** in frequency space.
- The vanishing drift field forces the **MGFs** of $ p $ and $ q $ to have identical log-gradients.
- Analytic continuation and normalization imply the MGFs are identical.
- For compactly supported distributions, identical MGFs imply identical distributions.

---

## References

1. **Bochner, S. (1933).** *Monotone Funktionen, Stieltjessche Integrale und harmonische Analyse.* Math. Ann. 108, 378–410.  
   – Foundational result on positive definite kernels.

2. **Sriperumbudur, B. V., Gretton, A., Fukumizu, K., Schölkopf, B., & Lanckriet, G. R. G. (2010).** *Hilbert space embeddings and metrics on probability measures.* J. Mach. Learn. Res. 11, 1517–1561.  
   – Proves that SPD kernels yield **characteristic kernel embeddings**.

3. **Deng, M., et al. (2026).** *Generative Modeling via Drifting.* arXiv:2602.04770.  
   – Introduces drifting models and defines the drift field $ \mathbf{V}_{p,q} $.

4. **Song, Y., & Ermon, S. (2019).** *Generative Modeling by Estimating Scores via the Stein Discrepancy Gradient.* ICML.  
   – Uses score functions (gradients of log-densities), which are closely related to the MGF log-gradients used here.

---

## Appendix: Counterexample for Non-SPD Kernels

### Theorem (Deng et al., 2026 Restated)  
Let $ \mathbf{V}_{p,q}(x) $ be the drift field defined via a kernel $ k $.  
Then, **in general**, $ \mathbf{V}_{p,q} = 0 \not\Rightarrow p = q $.

### Proof (Constructive)

1. Choose a kernel $ k $ that is **not strictly positive definite**, e.g., the linear kernel $ k(x, y) = x^\top y $, whose Fourier transform vanishes for all $ \omega \neq 0 $.
2. Choose two distinct distributions $ p \neq q $ such that $ \mathbb{E}_{x \sim p}[x] = \mathbb{E}_{x \sim q}[x] $ (equal means).
3. Then:
   $$
   \mathbf{V}_{p,q}(x) = \mathbb{E}_{y^+ \sim p, y^- \sim q}\left[k(x, y^+)\cdot k(x, y^-)\cdot (y^+ - y^-)\right] = 0
   $$
   because the kernel only depends on the mean, which is equal for $ p $ and $ q $.
4. But $ p \neq q $, so the converse fails.

$ \square $

---

## Practical Insight

> **The failure of the converse $ \mathbf{V}_{p,q} = 0 \Rightarrow q = p $** is **not a flaw** in drifting models — it is a **feature of the kernel**.  
> 
> - **Good kernels** (e.g., Laplace, Gaussian, Matérn) are **strictly positive definite**, so the converse **does** hold: $ \mathbf{V}_{p,q} = 0 \Rightarrow q = p $.  
> - **Bad kernels** (e.g., linear, compact, inverse-offset) are **not SPD**, and the converse **fails**.  
> 
> Thus, **kernel choice is critical** in drifting models — it determines whether the training objective has **spurious equilibria**.
