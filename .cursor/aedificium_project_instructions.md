# AEDIFICIUM.DESIGN — Cursor Project Instructions

## 1. PROJECT OVERVIEW

**Brand:** AEDIFICIUM — Execution infrastructure for professional design (architects & interior designers)
**Client:** Friend's project, managed/developed by Bakos Attila
**Goal:** Rebuild existing WordPress/custom HTML site in Next.js 15 — same visual design, stable modern foundation
**Language:** English (all UI copy, all content)
**Repo:** https://github.com/zynaidev/aedificium_web
**Local dev:** localhost:3000 (no domain integration yet — VPS/Coolify deploy is the final step)
**OS:** Windows PowerShell — use `Remove-Item -Recurse -Force .next` instead of `rm -rf .next`

---

## 2. DESIGN SYSTEM

### Color Palette
```css
:root {
  /* Backgrounds — warm dark, NOT cold zinc */
  --bg-base:      #0a0806;   /* near-black with warm brown undertone */
  --bg-elevated:  #111009;   /* cards, elevated surfaces */
  --bg-glass:     rgba(255,255,255,0.03);
  --bg-glass-strong: rgba(255,255,255,0.05);

  /* Accent — terracotta/amber gold */
  --accent:       #c17a4a;   /* primary accent — used for italic hero word, CTAs */
  --accent-light: #d4956a;   /* hover states */
  --accent-glow:  rgba(193,122,74,0.15);

  /* Text */
  --text-primary:   #f5f0eb;  /* warm white, not pure #fff */
  --text-secondary: #9a9188;  /* muted warm gray */
  --text-tertiary:  #5c5650;  /* very muted */

  /* Borders */
  --border-hairline: rgba(255,255,255,0.06);
  --border-default:  rgba(255,255,255,0.10);
  --border-accent:   #c17a4a;

  /* Spacing */
  --space-section-desktop: 120px;
  --space-section-mobile:  64px;
  --container-max: 1280px;
}
```

### Typography
```
Display / H1: Cormorant Garamond — 500 weight, display size
  → clamp(48px, 7vw, 80px), line-height 1.0, letter-spacing -0.02em
  → Accent italic word: font-style: italic, color: var(--accent)

H2 Section: Cormorant Garamond — 500
  → clamp(36px, 4.5vw, 60px), line-height 1.1

Body: Inter — 400
  → clamp(14px, 1.1vw, 16px), line-height 1.7

Nav / Labels / Mono: Inter — 500, uppercase, letter-spacing 0.12em, 11-12px

Logo wordmark: "AEDIFICIUM" — Inter or custom, all caps, letter-spacing 0.2em, ~13px
```

**Google Fonts import** (in globals.css or layout):
```
Cormorant Garamond: weights 400, 500, 500 italic
Inter: weights 400, 500
```

### Visual Language
- Luxury editorial, **not** tech startup / glassmorphism
- Warm dark backgrounds (brownish black), NOT cold dark
- Photo grid with warm/reddish overlay (duotone: dark base + warm amber tint)
- Serif headline + thin sans body = high-end print magazine feel
- Minimal decorative elements — typography and whitespace carry the design
- Dividers: thin `border-top: 1px solid var(--border-hairline)`
- Section numbers: `01`, `02`, `03` — Inter mono, --text-tertiary, small uppercase label

---

## 3. SITE STRUCTURE

### Pages
```
/           — Main landing (single-page, all sections)
```
*(No subpages in v1 — everything is one long scroll)*

### Sections (in order)
```
01  Header / Nav
02  Hero
03  The Problem
04  Manifesto Quote
05  The Platform
06  What We Believe
07  Brand Marquee (brand list scroll)
08  Final CTA
09  Footer
```

### File Structure
```
app/
  (marketing)/
    layout.tsx     — Header + Footer + SmoothScrollProvider
    page.tsx       — all sections composed here
  globals.css      — design tokens, resets, keyframes
  layout.tsx       — root layout, fonts, metadata

components/
  layout/
    Header.tsx
    Footer.tsx
  sections/
    Hero.tsx
    TheProblem.tsx
    Manifesto.tsx
    ThePlatform.tsx
    WhatWeBelieve.tsx
    BrandMarquee.tsx
    FinalCTA.tsx
  animations/
    FadeIn.tsx
    ScrollReveal.tsx
    CountUp.tsx
  providers/
    SmoothScrollProvider.tsx
  ui/
    Button.tsx
    SectionLabel.tsx
    Container.tsx

public/
  images/
    hero/          — interior design photos (placeholder → real later)
  brand/
    logo.svg (if needed)
```

---

## 4. TECH STACK

### Core
- **Next.js 15** App Router + TypeScript
- **Tailwind CSS v4**
- **shadcn/ui** (new-york preset, dark mode forced)

### Animation
- **Framer Motion** — mount animations, scroll reveals, header transforms
- **GSAP + ScrollTrigger** — sticky stacking cards, scroll-linked effects
- **Lenis** — smooth scroll

### Performance Rules
- NO Three.js / React Three Fiber (not needed for this design)
- Dynamic import + `ssr: false` for heavy animation components
- `priority` prop on hero images (above fold)
- `loading="lazy"` on all below-fold images
- Photo grid: Next.js `<Image>` with `sizes` prop

### Next.js Config (required)
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',   // required for Docker/VPS deploy
};
```

---

## 5. KEY COMPONENTS

### Header
```
Layout: fixed top, full width
Left:   "AEDIFICIUM" wordmark — Inter, all-caps, letter-spacing 0.2em
Right:  nav links (PLATFORM / BRAND LIBRARY / OS / PARTNER LOGIN) + "REQUEST ACCESS" pill button
Mobile: hamburger menu

Behavior:
- Background: transparent on load → rgba(10,8,6,0.85) + backdrop-blur on scroll
- Use Framer Motion useScroll + useTransform (NOT scroll event listeners)
- "REQUEST ACCESS" button: var(--accent) background, dark text
```

### Hero Section
```
Layout: full viewport height, two columns
Left (55%):
  - Eyebrow: "Est. Budapest — Europe" (small caps, --text-secondary)
  - H1: "Design without limits." + "We handle" + italic-accent "everything" + "behind it."
  - Subtext paragraph
  - Two CTA buttons: "Start a Project" (accent filled) + "Explore the Platform" (ghost)

Right (45%):
  - Masonry/grid of 5-6 interior design photos
  - Warm amber/reddish color overlay on photos (CSS mix-blend-mode or overlay div)
  - Subtle entrance animation (stagger from right)

Background: --bg-base, possibly faint radial gradient warm glow bottom-left
```

### Photo Grid (Hero)
```typescript
// Warm photo overlay
<div className="relative overflow-hidden rounded-sm">
  <Image ... />
  <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(to bottom, rgba(80,30,10,0.3), rgba(10,8,6,0.5))",
      mixBlendMode: "multiply",
    }}
  />
</div>
```

### Section Label
```typescript
// Reusable component
<p className="text-xs uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
  {number && <span className="mr-2">{number}</span>}
  {label}
</p>
```

### Brand Marquee
```
Three rows of brand names, alternating scroll directions
Separator: ◆ (diamond character)
Speed: slow (30-40s per loop)
NO images — text only (brand names)
CSS animation only (no JS library needed)
Pause on hover: animation-play-state: paused
```

### Stat Cards (Platform Section)
```
Three key stats: "300+" / "1" / "0"
Display: large number + label below
No card border — just whitespace + typography
CountUp animation on scroll into view
```

---

## 6. ANIMATION PATTERNS

### Scroll Reveal (standard)
```typescript
// FadeIn.tsx — use on every section's content
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
>
```

### Stagger Children
```typescript
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};
```

### Hydration-Safe State
```typescript
// ALWAYS use this pattern for client-side initial state
const [active, setActive] = useState(-1);
useEffect(() => { setActive(0); }, []);
```

### Reduced Motion (required)
```typescript
const shouldReduce = useReducedMotion();
const variants = {
  hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

---

## 7. CURSOR PROMPT STRUCTURE

Every prompt must follow this format:

```
SCOPE — STRICT: Modify ONLY [file(s)].
Do not modify any other file.

DIAGNOSTIC FIRST:
Read the file and report its current state before making any changes.

[Changes described in detail, with exact copy if content-related]

DO NOT MODIFY:
- [list every other file explicitly]

CRITICAL: All copy must be in English — exact text provided below. Do not change wording.

npm run build must pass.
Report what you changed.
```

### Slicing Rule
Break every large feature into 2-3 prompts:
- **A.1** — static layout + copy
- **A.2** — styling + visual effects
- **B** — animations + interactions

### Content Guard
Always provide exact copy in the prompt. Never let Cursor generate or paraphrase content.

---

## 8. ALL PAGE COPY

### Header Nav
```
PLATFORM  |  BRAND LIBRARY  |  OS  |  PARTNER LOGIN  |  REQUEST ACCESS
```

### Hero
```
Eyebrow: Est. Budapest  —  Europe

H1: Design without limits.
    We handle everything [italic, accent color] behind it.

Subtext: AEDIFICIUM is the execution infrastructure for professional design.
         We provide the operating layer that connects creative intent with physical reality.

CTA 1: Start a Project
CTA 2: Explore the Platform
```

### The Problem
```
Label: The Problem

H2: Every beautiful project begins the same way.
    Then reality enters.

Body: The vision is never the problem. The infrastructure behind it always is. A designer
who envisioned every detail is now writing follow-up emails about shipping palettes. An
architect who understood exactly how light should fall at 4pm is renegotiating lead times
with a supplier who does not pick up the phone.

This is not a minor inefficiency. It is a structural failure — and it has been accepted
for too long as simply the way things are.

Problem 01: Fragmented sourcing
            Twelve suppliers. Twelve contacts. Twelve separate negotiations for a single project.

Problem 02: Shifting timelines
            Lead times that change after the order is placed. Clients waiting. Deadlines missed.

Problem 03: Wasted creative hours
            The designer who should be designing is now coordinating logistics. The work suffers.

Problem 04: The gap between vision and room
            What was specified and what arrives are not always the same. The project pays the difference.
```

### Manifesto Quote
```
Quote: "Those who can dream beautifully should be embraced — not exhausted."

Attribution: AEDIFICIUM — The Manifesto
```

### The Platform
```
Label: The Platform

H2: You plug in.
    Your project becomes deliverable.

Body: AEDIFICIUM is not a showroom. Not a supplier. Not a marketplace. It is execution
infrastructure — the layer between your vision and its full realisation, built entirely
around the professional needs of architects and interior designers.

Feature 01: Brand access
            300+ European design brands, available through a single point of contact. From Milan
            to Copenhagen. Including what isn't in any catalogue — we source it.

Feature 02: End-to-end execution
            We manage the entire lifecycle — negotiation, order, logistics, delivery, guarantees,
            post-sales. You have one contact. We have two hundred relationships working on your behalf.

Feature 03: Logistics and delivery
            End-to-end. Budapest to any European site. Coordinated, tracked, and followed through.
            The complexity moves to our side so the creative work stays on yours.

Feature 04: Technical support
            Specification queries. Installation notes. Regulation questions. Real answers — not
            referrals. Every concern handled by people who know the products and the projects.

Stats:
  300+    European design brands
  1       Point of contact per project
  0       Logistics headaches on your side
```

### What We Believe
```
Label: What we believe

H2: Luxury is not about price.
    It is about access.

Body: Nothing has to be unattainable. Fairly priced. Properly sourced. Precisely delivered.
These are not ideals — they are operational decisions.

The spaces we inhabit shape who we become. A home done right is the physical expression
of a better version of yourself — every surface chosen with intention, every detail
executed knowing it will matter to the person who lives with it.

Point 01: Absolute alignment. We work for the project, not the supplier.
Point 02: Protected time. You design. We handle the friction.
Point 03: Borderless access. If it exists in Europe, we can specify it.
Point 04: Flawless delivery. The gap between the spec sheet and the room is zero.
```

### Brand Marquee
```
Label: Selected brands in the AEDIFICIUM network

[Full brand list — marquee, 3 rows, ◆ separator — see brands array in BrandMarquee.tsx]
```

### Final CTA
```
Label: For architects and interior designers

H2: Your talent.
    Our infrastructure.

Body: AEDIFICIUM is a professional platform. Access is by application — not as a barrier,
but as a standard. We are building something worth protecting.

CTA 1: Start a Project
CTA 2: Explore the Platform
```

### Footer
```
Left: AEDIFICIUM wordmark
      Est. Budapest — Europe
      © 2025 Aedificium. All rights reserved.

Links: Platform / Brand Library / OS / Contact
```

---

## 9. BRANDS ARRAY (for BrandMarquee.tsx)

```typescript
export const BRANDS = [
  "101 Copenhagen", "41Zero42", "A-N-D", "ABK Group", "Adea", "Adriani e Rossi",
  "Agape", "Agape Casa", "Albed", "Alice Ceramica", "Alivar", "Almalight",
  "Alonpi", "Altrenotti", "Antique Mirror", "Antrax IT", "Aquaelite", "Armony",
  "Aromas del Campo", "Artelinea", "Aster Cucine", "Atelier Alain Ellouz",
  "Atelier Bowy C.D.", "Atelier Luxus", "Atlas Concorde", "Atmopshera", "Axolight",
  "Bagnara", "Bang&Olufsen", "Barausse", "Barovier&Toso", "Belarte Studio",
  "Bertocci", "Besana Carpet Lab", "Birex", "Bizzotto", "Bizzotto Italia",
  "Boca do Lobo", "Boln", "BOMMA", "Bosa", "Botteganove", "BRABBU", "Braid",
  "Brokis", "Bulbo", "BuzziSpace", "By-Boo", "Caccaro", "Caffé Latte", "Caimi",
  "Caleido", "Calligaris", "Caos Creativo", "Capital Collection", "Cappellini",
  "Carpet Edition", "Carpyen", "Casabath", "Casalgrande Padana", "Cattelan Italia",
  "CEA Design", "Celsius Panel", "Ceramica Cielo", "Ceramica Flaminia",
  "Ceramica Galassia", "Ceramica Sant'Agostino", "Cerasarda", "Cercom",
  "Cierre 1972", "Cinca", "Cinier", "Circu Magical Furniture", "Cizeta",
  "Composit", "COMPREX", "Connubia", "Cosentino", "Cotto Manetti", "CP Parquet",
  "CPRN Homood", "Creativemary", "Cristina Rubinetterie", "CTO Lighting",
  "Cucinesse", "Dallagnese", "Dante - Goods and Bads", "Davani Group", "DEDAR",
  "DelightFULL", "Desalto", "Devina Nais", "Diabla", "District Eight", "Driade",
  "Drigani", "Eclettis", "Edizioni Design", "Edra", "Effe", "eForma", "Eleonora",
  "Élitis", "EMIL Group", "Emporium", "Ennerev", "Enrico Pellizzoni",
  "Essential Home", "Estiluz", "Estro Collezioni", "Ethimo", "Etruria", "Euphoria",
  "Expormim", "Fantini", "FASEM", "FDB Mobler", "Ferri1956", "Filix Lighting",
  "FIMA", "Flexa Lighting", "Flexteam", "Florim Ceramiche", "FLOS", "Flou",
  "Fontana Arte", "FonteAlta", "Forestier", "Formitalia Glamour",
  "Fredericia Furniture", "Frezza", "Frigerio", "Gaber", "Gaggenau", "GAN Rugs",
  "Gandia Blasco", "Garda Furniture", "Gazzotti", "Gentry Home", "Geopietra",
  "Gervasoni", "Ghidini 1961", "Giardino di Corten", "Giessegi", "Giorgio Casa",
  "Glass Design", "Gloster", "Goes", "Greenapple", "Gruppo Geromin", "Gypsum",
  "Henge Kitchens", "Horm/Casamania", "Hotbath", "House Nordic", "i4Mariani",
  "ICF Office", "IdeaGroup", "Ideal Lux", "Il Fanale", "ILTI Luce",
  "Imola Ceramiche", "Inbani Design", "Inkiostro Bianco", "iSimar", "ITALGRANITI",
  "ITLAS", "JAB", "John Richmond", "K-3", "KARMAN", "Kartell", "Kave Home",
  "KICO", "KN Industrie", "La Boite Concept", "La Cividina", "La Fenice Marmi",
  "La Palma", "La Seggiola", "Laborlegno", "Lafaenza", "LAMINAM", "Lando",
  "Layer Stone", "Leliévre", "LEMA Mobili", "Leonardo Ceramics", "Les Jardins",
  "Linie Design", "Listone Giordano", "LITHOS", "Luce&Light", "LUXXU",
  "Lyxo Design", "Maison Valentina", "Malabar Artistic Furniture", "Matteo Brioni",
  "Mattiazzi", "Maxdivani", "Mazzega 1946", "MDC", "Meridiani", "Meroni&Colzani",
  "Mestre", "Micadoni", "Midsummer Milano", "Milano Bedding", "MIPA", "Mirabili",
  "Missoni Home Collection", "Misuraemme", "Modulnova", "Moooi", "Mosaico Micro",
  "Musa", "Muuto", "My Home Collection", "Nature Design", "NEMO Lighting",
  "Nero Sicilia", "Noorth", "Nordic Knots", "Norr11", "Novabell", "Nuura",
  "OASIS", "Olivelab", "Ondarreta", "One A", "Ottiu", "Pablo Designs", "Paola C",
  "Paola Lenti", "Pataviumart", "Pedrali", "Penta Light", "Peronda",
  "Petite Friture", "Petracer", "Pietra Pece", "Point.", "Pollini",
  "Popham Design", "PORUS Studio", "Potocco", "Prado", "Prof Office",
  "Pujol Illuminacion", "PVD Concept", "Q de Bouteilles", "Quadro Design",
  "Quare", "Quarella", "Quintessenza Ceramiche", "Rakumba Lighting",
  "Reggiani Luce", "Relax Design", "RES Italia", "Rex Kralj", "Rexa Design",
  "Röshults", "Rubelli", "Rug' Society", "Rugvista", "Saba Italia", "Sancal",
  "Santa&Cole", "Sartoris", "Sbordoni", "SCAB Design", "Scarabeo Ceramiche",
  "Scavolini", "Seletti", "Seyvaa", "Sichenia", "SICIS", "Studioart",
  "Systemtronic", "Talenti", "Targetti", "Terzofoco", "THG Paris", "Todobarro",
  "Tonelli Design", "Treemme Rubinetterie", "Trone", "TUBES", "Urban Cotton",
  "Urban Nature Collection", "VEGEA", "Vermobil", "Very Wood", "Vibia",
  "Viccarbe", "Visionnaire", "Vismaravetro", "Vitage", "Vittoria Frigerio",
  "Voltra Lighting", "Warm Nordic", "Wayne Enterprises", "Wendelbo",
  "Wood Tailors Club", "Zafferano", "Zampieri Cucine", "Zanotta", "Zucchetti"
];
```

---

## 10. GIT WORKFLOW

```bash
git checkout main
git pull origin main
git checkout -b feat/[feature-name]

# develop...

git add -A
git commit -m "feat: [what you built]"
git push

# GitHub PR → merge → delete branch

git checkout main
git pull origin main
```

Commit prefixes: `feat:` / `fix:` / `style:` / `perf:` / `refactor:`

---

## 11. KNOWN WINDOWS GOTCHAS

- Use `Remove-Item -Recurse -Force .next` instead of `rm -rf .next`
- Run commands one at a time, not chained with `&&`
- File renames: always use `git mv OldName.tsx NewName.tsx` (case sensitivity for Linux/Vercel)
- Never rename files via Windows Explorer

---

## 12. LIGHTHOUSE TARGETS

```
Performance:    90+
Accessibility:  100
SEO:            100
Best Practices: 100
```

Common killers: missing `priority` on hero image, no explicit `width`/`height` on `<Image>`, too much JS on main thread.

---

## 13. DEPLOY (FINAL STEP — DO LATER)

VPS infrastructure is already running:
- Hetzner CPX22 (Ubuntu 24.04)
- Docker + Caddy reverse proxy (`n8n-caddy-1`)
- Coolify on port 8000 (proxy: None — Caddy handles SSL)
- ZynAI Next.js already deployed as separate app

Steps when ready:
1. Add new Coolify app from `zynaidev/aedificium_web`
2. Build pack: Dockerfile
3. Port: 3000
4. Network alias: `aedificium-web`
5. Add Caddyfile block: `aedificium.design { reverse_proxy aedificium-web:3000 }`
6. Connect Caddy to coolify network (if not already)
7. Update Hostinger DNS: A record → 204.168.146.182
8. GitHub webhook → Coolify endpoint

---

*Document version: May 2026 — aedificium.design rebuild*
