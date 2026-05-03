# VotePilot AI — Frontend Design Specification
### Design Style: Neo-Brutalist Light Mode
### Reference: uupm.cc/demo/educational-platform
### Last Updated: Day 0

---

## Design Philosophy

**"Civic but Alive"**

VotePilot AI is built for first-time Indian voters — 18–22 year olds who are mobile-first,
used to apps like CRED, Groww, and Zepto. They are not used to government portals.
They might be nervous about voting for the first time.

The design has one job: **make something that feels civic but not boring.
Serious but not intimidating. Indian but not literal.**

Every screen should feel like it was designed for someone who has never voted
and might be slightly anxious. Nothing cluttered. Nothing that requires reading.
Everything obvious on first glance.

### Three Core Principles

**1. One thing per screen**
Every page has one primary action. Dashboard → your next step.
Simulator → one stage at a time. Ask VotePilot → one question, one answer.
No sidebars. No information overload. The voter is already overwhelmed —
VotePilot is the calm guide.

**2. Progress feels tangible**
The readiness ring is not decoration — it's the emotional spine of the app.
Every interaction should make the user feel like they moved forward.
Animations matter. The ring filling up, a checklist item checking off,
a simulator stage completing — these micro-moments build confidence.

**3. India-rooted but modern**
Not saffron-white-green nationalism. Not government portal grey.
Warm cream background. Saffron orange accent. Deep navy structure.
Feels premium, feels Indian without being a flag.

---

## Color System

### Base Palette

```css
/* Backgrounds */
--color-bg:              #F5F0E8;   /* warm cream — main app background */
--color-surface:         #FFFFFF;   /* white — cards, panels */
--color-surface-raised:  #FAF7F2;   /* slightly warm — hover states */

/* Borders */
--color-border:          #1A1A2E;   /* deep navy — ALL borders, outlines */
--color-border-light:    #E5E0D8;   /* light — subtle dividers inside cards */

/* Primary — Saffron Orange */
--color-primary:         #FF6B2B;   /* main CTA, active states, accents */
--color-primary-dark:    #CC4A10;   /* hover on primary buttons */
--color-primary-light:   #FFF0E8;   /* tinted backgrounds, soft highlights */
--color-primary-muted:   #FFD5BC;   /* disabled states, tags */

/* Secondary — Deep Navy */
--color-secondary:       #1A1A2E;   /* headings, dark elements, borders */
--color-secondary-mid:   #2D2D44;   /* secondary text elements */

/* Semantic Colors */
--color-success:         #22C55E;   /* completion, correct, verified */
--color-success-light:   #DCFCE7;   /* success card backgrounds */
--color-success-border:  #86EFAC;   /* success card borders */

--color-warning:         #F59E0B;   /* caution, ongoing, alerts */
--color-warning-light:   #FEF3C7;   /* warning card backgrounds */
--color-warning-border:  #FCD34D;   /* warning card borders */

--color-danger:          #EF4444;   /* dead ends, errors, myths */
--color-danger-light:    #FEE2E2;   /* danger card backgrounds */
--color-danger-border:   #FCA5A5;   /* danger card borders */

--color-info:            #3B82F6;   /* information, upcoming, tips */
--color-info-light:      #DBEAFE;   /* info card backgrounds */
--color-info-border:     #93C5FD;   /* info card borders */

/* Text */
--color-text-primary:    #1A1A2E;   /* main body text */
--color-text-secondary:  #6B7280;   /* supporting text */
--color-text-muted:      #9CA3AF;   /* timestamps, metadata */
--color-text-on-primary: #FFFFFF;   /* text on orange buttons */
```

### Color Usage Rules
- **Never** use pure black (`#000000`) or pure white (`#FFFFFF`) as background
- **Always** use `--color-border` (`#1A1A2E`) for all card borders and button borders
- **Only one** primary orange CTA per screen — don't dilute it
- Background is always `--color-bg` (`#F5F0E8`) — warm cream, never white

---

## Typography

### Font Stack
```css
/* Import in layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

--font-heading: 'Plus Jakarta Sans', sans-serif;   /* all headings */
--font-body:    'Inter', sans-serif;               /* all body text */
```

### Type Scale
```css
/* Headings — Plus Jakarta Sans */
--text-hero:     clamp(36px, 5vw, 56px);   font-weight: 800;  line-height: 1.1;
--text-h1:       clamp(28px, 4vw, 40px);   font-weight: 700;  line-height: 1.2;
--text-h2:       clamp(22px, 3vw, 32px);   font-weight: 700;  line-height: 1.25;
--text-h3:       20px;                      font-weight: 700;  line-height: 1.3;
--text-h4:       18px;                      font-weight: 600;  line-height: 1.35;

/* Body — Inter */
--text-lg:       18px;   font-weight: 400;  line-height: 1.6;
--text-base:     16px;   font-weight: 400;  line-height: 1.6;
--text-sm:       14px;   font-weight: 400;  line-height: 1.5;
--text-xs:       12px;   font-weight: 500;  line-height: 1.4;
```

### Typography Rules
- Hero heading always has one word or phrase in `--color-primary` (orange)
- Never go below 16px on mobile for body text
- Headings use Plus Jakarta Sans, everything else uses Inter
- Letter spacing on headings: `-0.02em` (slightly tight, feels premium)
- No text-transform uppercase on body copy — only on small labels/badges

---

## Spacing System

```css
/* Base unit: 4px */
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
```

### Spacing Rules
- Card internal padding: `--space-6` (24px) desktop, `--space-5` (20px) mobile
- Section vertical gap: `--space-20` (80px) desktop, `--space-12` (48px) mobile
- Between cards in a grid: `--space-5` (20px)
- Form field gap: `--space-4` (16px)
- Button internal padding: `12px 24px` (vertical horizontal)

---

## The Signature Card Style

This is the defining visual element of VotePilot AI.
Every card uses this exact treatment — copy it faithfully.

```css
.card {
  background: #FFFFFF;
  border: 2px solid #1A1A2E;
  border-radius: 20px;
  box-shadow: 6px 6px 0px #1A1A2E;   /* offset shadow, NO blur, NO spread */
  padding: 24px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px #1A1A2E;
}
```

### Card Variants

**Default Card** — white background, navy border, offset shadow
```css
/* as above */
```

**Info Card** (tips, guidance)
```css
background: #DBEAFE;
border-color: #93C5FD;
box-shadow: 6px 6px 0px #93C5FD;
```

**Success Card** (completion, correct)
```css
background: #DCFCE7;
border-color: #86EFAC;
box-shadow: 6px 6px 0px #86EFAC;
```

**Warning Card** (caution, alerts)
```css
background: #FEF3C7;
border-color: #FCD34D;
box-shadow: 6px 6px 0px #FCD34D;
```

**Danger Card** (dead ends, errors)
```css
background: #FEE2E2;
border-color: #FCA5A5;
box-shadow: 6px 6px 0px #FCA5A5;
```

**Primary Card** (highlighted, featured)
```css
background: #FFF0E8;
border-color: #FF6B2B;
box-shadow: 6px 6px 0px #FF6B2B;
```

---

## Button System

### Primary Button
```css
.btn-primary {
  background: #FF6B2B;
  color: #FFFFFF;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #1A1A2E;
  padding: 12px 24px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1A1A2E;
}

.btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1A1A2E;
}
```

### Secondary Button
```css
.btn-secondary {
  background: #FFFFFF;
  color: #1A1A2E;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #1A1A2E;
  padding: 12px 24px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.btn-secondary:hover {
  background: #F5F0E8;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1A1A2E;
}
```

### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #1A1A2E;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  box-shadow: none;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
}

.btn-ghost:hover {
  background: #F5F0E8;
  box-shadow: 3px 3px 0px #1A1A2E;
  transform: translate(-1px, -1px);
}
```

### Button Rules
- Minimum height: 44px (mobile tap target)
- Full width on mobile for all primary CTAs
- Never more than one primary (orange) button per screen
- Use secondary for alternative actions, ghost for tertiary
- Always include the dark border — never a borderless button

---

## Badge & Tag System

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 2px solid currentBorderColor;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.01em;
}

/* Variants */
.badge-new        { background: #FF6B2B; color: #fff; border-color: #1A1A2E; }
.badge-upcoming   { background: #DBEAFE; color: #1E40AF; border-color: #93C5FD; }
.badge-ongoing    { background: #FEF3C7; color: #92400E; border-color: #FCD34D; }
.badge-completed  { background: #DCFCE7; color: #166534; border-color: #86EFAC; }
.badge-info       { background: #F5F0E8; color: #1A1A2E; border-color: #1A1A2E; }
```

---

## Form Elements

```css
.input {
  width: 100%;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1A1A2E;
  outline: none;
  transition: box-shadow 0.15s ease;
}

.input:focus {
  box-shadow: 4px 4px 0px #FF6B2B;
  border-color: #FF6B2B;
}

.input::placeholder {
  color: #9CA3AF;
}

.select {
  /* same as .input */
  appearance: none;
  background-image: url("data:image/svg+xml,...");  /* custom chevron */
  padding-right: 40px;
}

.label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #1A1A2E;
  margin-bottom: 8px;
  display: block;
}
```

### Toggle / Switch (for yes/no fields in onboarding)
```css
/* Custom toggle pill — not a checkbox */
.toggle-group {
  display: flex;
  gap: 8px;
}

.toggle-option {
  flex: 1;
  padding: 10px;
  text-align: center;
  border: 2px solid #1A1A2E;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: #FFFFFF;
  transition: all 0.15s ease;
}

.toggle-option.active {
  background: #FF6B2B;
  color: #FFFFFF;
  box-shadow: 3px 3px 0px #1A1A2E;
  transform: translate(-1px, -1px);
}
```

---

## Specific Component Specs

### Readiness Score Ring
```css
/* SVG circular progress — the hero component */
Ring size:         160px desktop / 120px mobile
Ring stroke width: 12px
Track color:       #E5E0D8
Progress color:    dynamic based on score:
  0–30:   #EF4444  (red)
  31–60:  #F59E0B  (amber)
  61–100: #22C55E  (green)
Center number:     Plus Jakarta Sans 800, 36px desktop / 28px mobile
Center label:      Inter 400, 12px, --color-text-muted
Animation:         stroke-dashoffset transition 1.2s ease-out on mount
Container:         .card with primary variant (orange border)
```

### Response Card (Ask VotePilot)
Four sections, each as a distinct sub-card inside the main card:

```css
/* Main wrapper */
.response-card {
  /* standard .card styles */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Each section */
.response-section {
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid currentBorderColor;
  border-left-width: 4px;   /* thicker left accent */
}

/* Section variants */
.response-answer        { border-color: #93C5FD; background: #DBEAFE; }
.response-why           { border-color: #FCD34D; background: #FEF3C7; }
.response-what          { border-color: #86EFAC; background: #DCFCE7; }
.response-keep-in-mind  { border-color: #FF6B2B; background: #FFF0E8; }

/* Section label */
.response-label {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
  opacity: 0.7;
}

/* Source citation */
.response-source {
  font-size: 12px;
  color: #6B7280;
  border-top: 1px solid #E5E0D8;
  padding-top: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Stagger animation on sections */
.response-section:nth-child(1) { animation-delay: 0.05s; }
.response-section:nth-child(2) { animation-delay: 0.10s; }
.response-section:nth-child(3) { animation-delay: 0.15s; }
.response-section:nth-child(4) { animation-delay: 0.20s; }
```

### Explain Level + Language Toggle
```css
/* Pill toggle group — used for both toggles */
.pill-toggle {
  display: flex;
  background: #FFFFFF;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}

.pill-option {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #6B7280;
}

.pill-option.active {
  background: #FF6B2B;
  color: #FFFFFF;
  box-shadow: 2px 2px 0px #1A1A2E;
}
```

### Simulator Stage Card
```css
.simulator-card {
  /* standard .card */
  text-align: center;
  padding: 32px 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.simulator-illustration {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 16px;
}

.simulator-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 24px;
}

.simulator-choice-btn {
  /* .btn-secondary styles */
  text-align: left;
  padding: 14px 18px;
}

/* Stage type variants */
.simulator-card.dead-end {
  background: #FEE2E2;
  border-color: #FCA5A5;
  box-shadow: 6px 6px 0px #FCA5A5;
}

.simulator-card.completion {
  background: #DCFCE7;
  border-color: #86EFAC;
  box-shadow: 6px 6px 0px #86EFAC;
}

.simulator-card.info {
  background: #DBEAFE;
  border-color: #93C5FD;
  box-shadow: 6px 6px 0px #93C5FD;
}
```

### Myth Card (Flip)
```css
.myth-card-container {
  perspective: 1000px;
  height: 200px;
  cursor: pointer;
}

.myth-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}

.myth-card-container.flipped .myth-card-inner {
  transform: rotateY(180deg);
}

.myth-card-front,
.myth-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  border: 2px solid #1A1A2E;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.myth-card-front {
  background: #FEE2E2;
  box-shadow: 6px 6px 0px #FCA5A5;
}

.myth-card-back {
  background: #DCFCE7;
  box-shadow: 6px 6px 0px #86EFAC;
  transform: rotateY(180deg);
}
```

### Election Card
```css
.election-card {
  /* standard .card */
  position: relative;
  overflow: hidden;
}

.election-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.election-state {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: #1A1A2E;
}

.election-type {
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
}

.election-phases {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
}

.election-phase-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 6px 10px;
  background: #F5F0E8;
  border-radius: 8px;
  border: 1px solid #E5E0D8;
}
```

### Checklist Item
```css
.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 2px solid #1A1A2E;
  border-radius: 12px;
  box-shadow: 3px 3px 0px #1A1A2E;
  transition: all 0.2s ease;
}

.checklist-item.done {
  background: #DCFCE7;
  border-color: #86EFAC;
  box-shadow: 3px 3px 0px #86EFAC;
}

.checklist-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #1A1A2E;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #FFFFFF;
  transition: all 0.2s ease;
}

.checklist-item.done .checklist-checkbox {
  background: #22C55E;
  border-color: #22C55E;
}
```

---

## Animation Spec

```css
/* All animations — purposeful, never decorative */

/* Page fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: fadeIn 0.2s ease forwards; }

/* Card stagger (response card sections) */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.stagger { animation: slideUp 0.25s ease forwards; opacity: 0; }

/* Readiness ring fill */
/* Handled via stroke-dashoffset CSS transition: 1.2s ease-out */

/* Checklist check */
@keyframes checkPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.check-animate { animation: checkPop 0.25s ease; }

/* Simulator stage transition */
/* Fade out current → fade in next: 0.2s each */

/* Myth card flip: 0.4s rotateY */

/* Button press: transform translate(2px, 2px) + reduced shadow */
```

### Animation Rules
- Nothing longer than 0.5s (feels sluggish on low-end Android)
- No scroll-triggered animations
- No parallax
- Skeleton loaders — never infinite spinners
- Simulator transitions: fade, not slide (less distracting)

---

## Skeleton Loader

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #E5E0D8 25%,
    #EDE8E0 50%,
    #E5E0D8 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Usage */
.skeleton-text-lg  { height: 24px; width: 60%; }
.skeleton-text     { height: 16px; width: 100%; }
.skeleton-text-sm  { height: 14px; width: 40%; }
.skeleton-card     { height: 120px; width: 100%; border-radius: 20px; }
```

---

## Page-by-Page Layout Spec

### Landing Page (`/`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR                                     │
│  [Logo: VotePilot AI]        [Get Started →]│
├─────────────────────────────────────────────┤
│  HERO SECTION                               │
│                                             │
│  🟠 New: AI-Powered Civic Education  ←badge │
│                                             │
│  Vote with            [FLOATING CARD]       │
│  Confidence,          ┌──────────────────┐  │
│  Not                  │ 🗳️ Readiness: 85%│  │
│  Confusion.           │ ✅ ID verified   │  │
│                       │ ✅ Booth found   │  │
│  [Get Started Free →] └──────────────────┘  │
│  [See How It Works]                         │
│                                             │
│  1.2M+ Voters  |  3 Languages  |  Free      │
├─────────────────────────────────────────────┤
│  3 PERSONA CARDS (horizontal on desktop,   │
│  stacked on mobile)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 🆕 First │ │ 📦 Moved │ │ ⚡ Last  │    │
│  │  Time    │ │ Recently │ │ Minute   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────┤
│  HOW IT WORKS (3 numbered cards)            │
├─────────────────────────────────────────────┤
│  FEATURES STRIP                             │
└─────────────────────────────────────────────┘
```

**Hero orange word:** "Confidence" in `--color-primary`
**Floating card:** animated entrance, slight bob on hover

---

### Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR                                     │
├─────────────────────────────────────────────┤
│  HEADER: "Welcome, Voter 👋"                │
│  subtitle: "Here's your readiness summary"  │
├──────────────┬──────────────────────────────┤
│ READINESS    │  YOUR NEXT ACTION            │
│ RING CARD    │  ┌────────────────────────┐  │
│              │  │ 🎯 Start the Booth     │  │
│   [ 45% ]    │  │    Day Simulator       │  │
│              │  │ [Launch Simulator →]   │  │
│  Primary     │  └────────────────────────┘  │
│  card style  │                              │
│              │  WARNINGS (if any)           │
│              │  ⚠️ warning card style       │
├──────────────┴──────────────────────────────┤
│  PREPARATION CHECKLIST                      │
│  (stacked checklist items)                  │
├─────────────────────────────────────────────┤
│  QUICK NAV (3 cards in a row)               │
│  [Ask VotePilot] [Simulator] [Myth Buster]  │
└─────────────────────────────────────────────┘
```

---

### Ask VotePilot (`/ask`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR                                     │
├─────────────────────────────────────────────┤
│  "Ask VotePilot AI"  heading                │
│  subtitle: "Get answers grounded in         │
│  official ECI documents"                    │
├─────────────────────────────────────────────┤
│  TOGGLES ROW                                │
│  [🧒 Simple | 🧑 Standard | 🎓 Detailed]   │
│  [🇬🇧 English | 🇮🇳 Hindi | 🏔️ Assamese]  │
├─────────────────────────────────────────────┤
│  EXAMPLE QUESTIONS (horizontal scroll)      │
│  [What docs do I need?] [What is EVM?] ...  │
├─────────────────────────────────────────────┤
│  TEXT INPUT + SUBMIT BUTTON                 │
│  ┌────────────────────────────────────┐     │
│  │ Ask anything about voting...       │     │
│  └────────────────────────────────────┘     │
│                    [Ask VotePilot →]        │
├─────────────────────────────────────────────┤
│  RESPONSE CARD (appears after submit)       │
│  ┌──────────────────────────────────────┐   │
│  │ 🔵 ANSWER                            │   │
│  │ ...                                  │   │
│  ├──────────────────────────────────────┤   │
│  │ 🟡 WHY IT MATTERS                    │   │
│  │ ...                                  │   │
│  ├──────────────────────────────────────┤   │
│  │ 🟢 WHAT YOU SHOULD DO               │   │
│  │ ...                                  │   │
│  ├──────────────────────────────────────┤   │
│  │ 🟠 KEEP IN MIND                      │   │
│  │ ...                                  │   │
│  ├──────────────────────────────────────┤   │
│  │ 📄 Source: ECI Voter Guide 2024      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

### Simulator (`/simulator`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR                                     │
├─────────────────────────────────────────────┤
│  Progress: Stage 3 of ~12    [← Back]       │
│  ████████░░░░░░░░░░  (progress bar)          │
├─────────────────────────────────────────────┤
│                                             │
│  STAGE CARD (fills most of screen)          │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │           🪪                          │  │
│  │                                       │  │
│  │   Identity Verification               │  │
│  │                                       │  │
│  │   The polling officer asks for your   │  │
│  │   Voter ID to verify your name on    │  │
│  │   the electoral roll.                 │  │
│  │                                       │  │
│  │  [I have my Voter ID          →]      │  │
│  │  [I forgot my Voter ID        →]      │  │
│  │  [My name isn't on the list   →]      │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Dead end card:** red variant, shows restart button
**Completion card:** green variant, confetti-style dots animation, big 🎉

---

### Elections (`/elections`)

```
┌─────────────────────────────────────────────┐
│  "Upcoming & Recent Elections"  heading     │
├─────────────────────────────────────────────┤
│  [Upcoming] [Ongoing] [Completed]  ← tabs   │
│  (active tab = orange background)           │
├─────────────────────────────────────────────┤
│  GRID: 2 cols desktop / 1 col mobile        │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ Bihar            │ │ Assam            │  │
│  │ State Assembly   │ │ Panchayat        │  │
│  │ [UPCOMING] badge │ │ [UPCOMING] badge │  │
│  │ Phase 1: Oct 15  │ │ Dec 3            │  │
│  │ Phase 2: Oct 25  │ │                  │  │
│  │ Result: Oct 28   │ │ Result: Dec 5    │  │
│  └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────┘
```

---

### Myth Buster (`/mythbuster`)

```
┌─────────────────────────────────────────────┐
│  "Myth Buster" heading                      │
│  "Tap a card to reveal the truth"           │
├─────────────────────────────────────────────┤
│  GRID: 2 cols desktop / 1 col mobile        │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ FRONT (red)      │ │ FRONT (red)      │  │
│  │ 🚫 MYTH          │ │ 🚫 MYTH          │  │
│  │ "EVMs can be     │ │ "You need Voter  │  │
│  │  hacked easily"  │ │  ID to vote"     │  │
│  │                  │ │                  │  │
│  │ [Tap to reveal]  │ │ [Tap to reveal]  │  │
│  └──────────────────┘ └──────────────────┘  │
│                                             │
│  (after flip — green back)                  │
│  ┌──────────────────┐                       │
│  │ ✅ FACT          │                       │
│  │ ECI explanation  │                       │
│  │ with citation    │                       │
│  └──────────────────┘                       │
└─────────────────────────────────────────────┘
```

---

## Mobile-Specific Rules

```
Breakpoints:
  mobile:  < 640px
  tablet:  640px – 1024px
  desktop: > 1024px

Mobile rules:
- All primary CTAs: width: 100%
- Card grid: single column
- Simulator choices: full width stacked
- Toggle groups: full width, equal flex
- Minimum font size: 16px
- Minimum tap target: 44px height
- Horizontal padding on all pages: 16px
- Navbar: hamburger menu or simplified
- Floating hero elements: hidden on mobile (too cluttered)
- Response card sections: full width stacked
```

---

## Tailwind Config

Add this to `tailwind.config.js` to register all custom tokens:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg:        '#F5F0E8',
        surface:   '#FFFFFF',
        border:    '#1A1A2E',
        primary: {
          DEFAULT: '#FF6B2B',
          dark:    '#CC4A10',
          light:   '#FFF0E8',
          muted:   '#FFD5BC',
        },
        secondary: '#1A1A2E',
        navy:      '#1A1A2E',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card:   '20px',
        btn:    '12px',
        input:  '10px',
      },
      boxShadow: {
        card:    '6px 6px 0px #1A1A2E',
        'card-hover': '8px 8px 0px #1A1A2E',
        btn:     '4px 4px 0px #1A1A2E',
        'btn-hover': '6px 6px 0px #1A1A2E',
        'btn-active': '2px 2px 0px #1A1A2E',
        'card-success': '6px 6px 0px #86EFAC',
        'card-danger':  '6px 6px 0px #FCA5A5',
        'card-warning': '6px 6px 0px #FCD34D',
        'card-info':    '6px 6px 0px #93C5FD',
        'card-primary': '6px 6px 0px #FF6B2B',
      },
    },
  },
}
```

---

## What to Tell Antigravity (Full Design Prompt)

Paste this at the start of EVERY UI session:

```
Design system for VotePilot AI:

Style: Neo-brutalist light mode. Reference: uupm.cc/demo/educational-platform.

Colors:
- Background: #F5F0E8 (warm cream)
- Cards: #FFFFFF with 2px solid #1A1A2E border
- Card shadow: 6px 6px 0px #1A1A2E (offset, no blur)
- Primary accent: #FF6B2B (saffron orange)
- Text: #1A1A2E (deep navy)

Typography:
- Headings: Plus Jakarta Sans 700/800
- Body: Inter 400/500
- Hero heading has one word in orange (#FF6B2B)

Buttons:
- Primary: orange background, navy border, 4px 4px offset shadow
- Secondary: white background, navy border, 4px 4px offset shadow
- Hover: translate(-2px, -2px), shadow increases to 6px 6px
- Active: translate(2px, 2px), shadow decreases to 2px 2px
- All buttons: 2px solid #1A1A2E border, 12px border-radius

Cards: 20px border-radius, 2px solid #1A1A2E, 6px 6px 0px #1A1A2E shadow
Card hover: translate(-2px, -2px), shadow 8px 8px

Spacing: generous — 24px card padding, 80px section gaps desktop
Mobile: full-width buttons, single column, 44px min tap targets

Animations: fast (0.15–0.25s), purposeful only, skeleton loaders not spinners

Vibe: CRED meets civic duty. Premium, warm, trustworthy. Not government portal.
Not generic SaaS. Confident and approachable for a first-time Indian voter.
```

---

## What NOT to Do

- ❌ No dark mode (even if Antigravity defaults to it — override explicitly)
- ❌ No pure white (#FFFFFF) backgrounds — always use cream (#F5F0E8)
- ❌ No soft drop shadows (box-shadow with blur) — only hard offset shadows
- ❌ No gradient backgrounds on full pages — hero section only, subtle
- ❌ No icon library overload — use emojis for illustrations, Lucide for UI icons only
- ❌ No pill-shaped buttons — pills are for badges only
- ❌ No blue (#3B82F6) as primary — that's generic SaaS, we use orange
- ❌ No animations longer than 0.5s
- ❌ No horizontal scroll on any page
- ❌ No font size below 16px on mobile

---

*Design system version: 1.0*
*Project: VotePilot AI*
*Style reference: uupm.cc/demo/educational-platform*
