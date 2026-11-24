---
name: Crumbs
description: Drop any thought. Once a week, one comes back.
colors:
  inkwell: "#24224A"
  marigold: "#F0A23B"
  marigold-tint: "#FCEBD2"
  marigold-edge: "#F0C27E"
  amber: "#8F5400"
  dusk-mist: "#EEEFF9"
  lamplit-page: "#FBFBFE"
  mist-deep: "#E4E5F4"
  hairline: "#D6D7EC"
  slate-ink: "#5A5880"
  ember-red: "#B3261E"
typography:
  display:
    fontFamily: "Bricolage Grotesque"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "33px"
  headline:
    fontFamily: "Bricolage Grotesque"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "28px"
  title:
    fontFamily: "Bricolage Grotesque"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  label:
    fontFamily: "Bricolage Grotesque"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  button:
    fontFamily: "Bricolage Grotesque"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "Bricolage Grotesque"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22px"
  meta:
    fontFamily: "Bricolage Grotesque"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  caption:
    fontFamily: "Bricolage Grotesque"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  crumb-lg:
    fontFamily: "Literata"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "42px"
  crumb:
    fontFamily: "Literata"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "34px"
  crumb-md:
    fontFamily: "Literata"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
  crumb-sm:
    fontFamily: "Literata"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  sm: "12px"
  md: "14px"
  lg: "16px"
  field: "12px"
  card: "18px"
  dialog: "24px"
  sheet: "28px"
  full: "9999px"
spacing:
  gutter: "20px"
  touch: "44px"
  cta: "56px"
components:
  button-primary:
    backgroundColor: "{colors.inkwell}"
    textColor: "{colors.lamplit-page}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "{spacing.cta}"
    width: "100%"
  button-outline:
    backgroundColor: "{colors.lamplit-page}"
    textColor: "{colors.inkwell}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "{spacing.cta}"
  button-tonal:
    backgroundColor: "{colors.dusk-mist}"
    textColor: "{colors.inkwell}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "{spacing.cta}"
  button-destructive:
    textColor: "{colors.ember-red}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "{spacing.cta}"
    width: "100%"
  button-text:
    textColor: "{colors.inkwell}"
    typography: "{typography.button}"
    height: "{spacing.touch}"
  button-pill:
    backgroundColor: "{colors.inkwell}"
    textColor: "{colors.lamplit-page}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "{spacing.touch}"
    padding: "0 20px"
  button-pill-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.full}"
  chip-count:
    textColor: "{colors.slate-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  badge-layers:
    backgroundColor: "{colors.marigold-tint}"
    textColor: "{colors.amber}"
    typography: "{typography.meta}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-status:
    textColor: "{colors.slate-ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  return-banner:
    backgroundColor: "{colors.marigold-tint}"
    textColor: "{colors.inkwell}"
    rounded: "{rounded.card}"
    padding: "16px"
  card:
    backgroundColor: "{colors.lamplit-page}"
    textColor: "{colors.inkwell}"
    rounded: "{rounded.card}"
    padding: "16px"
  option-card:
    backgroundColor: "{colors.lamplit-page}"
    textColor: "{colors.inkwell}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "16px"
  sheet:
    backgroundColor: "{colors.lamplit-page}"
    textColor: "{colors.inkwell}"
    rounded: "{rounded.sheet}"
    padding: "24px 20px"
  input-capture:
    textColor: "{colors.inkwell}"
    typography: "{typography.crumb}"
  input-layer:
    backgroundColor: "{colors.dusk-mist}"
    textColor: "{colors.inkwell}"
    typography: "{typography.crumb-md}"
    rounded: "{rounded.field}"
    padding: "16px"
  composer-bar:
    backgroundColor: "{colors.lamplit-page}"
    textColor: "{colors.slate-ink}"
    typography: "{typography.meta}"
    padding: "8px 20px"
  list-row:
    textColor: "{colors.inkwell}"
    typography: "{typography.crumb-sm}"
    padding: "12px 0"
---

# Design System: Crumbs

## Overview

**Creative North Star: "The Lamplit Notebook"**

Crumbs is a private notebook read by one warm lamp. The page is Dusk Mist and Lamplit Page, the ink is Inkwell, and the only warm light is marigold: it falls on a crumb when it comes back, and almost nowhere else. The user's own words are set in a book serif and given the most space on every screen; everything the app says is a small, plain grotesque that stays out of the way.

The mood is warm, unhurried, calm, and private. Screens are sparse and single-column, with generous vertical space and one obvious next step. Components are quiet and tactile: soft corners, hairline borders, and tonal surfaces that read as paper and pencil rather than chrome. Nothing pulses, counts up, or competes for attention.

Crumbs must never look like a gamified habit app. There are no streaks, flames, confetti, progress rings, or reward badges.

**Key Characteristics:**
- Two voices: Literata for the user's words, Bricolage Grotesque for the app's.
- One lamp: marigold appears once per screen, on the returned-crumb moment or a crumb marker.
- Flat paper: depth comes from tone and hairlines, never shadows. Only bottom sheets float.
- Decisive ink: primary actions are solid Inkwell; everything else is outline, tonal, or text.
- Soft corners on a ladder from fields to sheets; pills for compact actions and chips.

## Colors

A cool indigo-and-lavender paper palette with a single warm marigold light.

### Primary
- **Inkwell** (`inkwell`): body text, headings, primary button fills, selected borders, switch track, and the jar outline in the logo. It is the app's voice and its decisions.

### Secondary
- **Marigold** (`marigold`): the warm light. The crumb dots in the logo mark, the dot beside a layer, the numbered steps in onboarding, and the trailing crumb dots under a returned crumb. Never used for text or primary fills.
- **Marigold Tint** (`marigold-tint`) and **Marigold Edge** (`marigold-edge`): the fill and border of the "A crumb is back" banner, and the fill of the "2 layers" badge.
- **Amber** (`amber`): marigold-family text that passes contrast, such as "From 3 months ago" and "First crumb dropped".

### Neutral
- **Dusk Mist** (`dusk-mist`): the app background, the fill of tonal buttons ("Let go"), and the fill of the layer input.
- **Lamplit Page** (`lamplit-page`): cards, sheets, the composer bar, and text on Inkwell buttons.
- **Mist Deep** (`mist-deep`): secondary and muted surfaces.
- **Hairline** (`hairline`): borders, dividers, input outlines, the sheet grabber, and the disabled Drop pill.
- **Slate Ink** (`slate-ink`): secondary text, timestamps, placeholders, helper lines, and let-go crumbs in the jar.
- **Ember Red** (`ember-red`): destructive only: "Delete everything" and the trash icon.

### Dark mode (proposal)
Dark screens are not designed yet. The runtime proposal in `global.css` inverts the roles: background #16152E, cards #262450, secondary #37346A, text #EEEFF9, primary buttons #C4C2E8 with #24224A text, borders #6E6C9A, muted text #ABAACB, amber #F5BE6E, marigold tint #3A2C17 with edge #A87A30, destructive #F2847C. Marigold itself stays #F0A23B. Treat these as provisional until dark screens exist.

### Named Rules
**The One Lamp Rule.** One marigold element per screen, besides the logo mark. Its rarity is what makes a returned crumb feel like a gift.

**The Amber Text Rule.** Marigold is never text. Warm text uses Amber, which passes contrast in light and dark.

**The Tinted Extremes Rule.** No pure black or pure white. The darkest ink is Inkwell, and the lightest surface is Lamplit Page.

## Typography

**Display Font:** Bricolage Grotesque (system sans fallback)
**Body Font:** Bricolage Grotesque
**Crumb Font:** Literata (system serif fallback), regular and italic

**Character:** A friendly, slightly quirky grotesque for the app's short instructions, against a warm book serif that makes each crumb feel like a handwritten line in a notebook.

### Hierarchy
- **Display** (`display`): the onboarding headline, "Drop any thought. Once a week, one comes back."
- **Headline** (`headline`): sheet titles, such as "When should crumbs come back?"
- **Title** (`title`): screen titles in the header row: "Your jar", "Settings".
- **Label** (`label`): section headers ("This week", "Weekly crumb"), option titles, and "Your thought today".
- **Button** (`button`): all button text.
- **Body** (`body`): helper copy, settings rows, and privacy lines.
- **Meta** (`meta`): timestamps, badges, the composer status ("Draft saved").
- **Caption** (`caption`): footnotes under actions, such as "Kept crumbs can come back after 90 days."
- **Crumb Large** (`crumb-lg`): the returned crumb in Rediscovery and on the crumb detail screen.
- **Crumb** (`crumb`): the capture field. Its placeholder, "A half-idea…", is Literata italic in Slate Ink.
- **Crumb Medium** (`crumb-md`): the returned crumb above the layer field, and layer text.
- **Crumb Small** (`crumb-sm`): crumb previews in the jar list.

### Named Rules
**The Two Voices Rule.** Literata is only for the user's own words: crumbs and layers. Every label, button, heading, and helper line the app writes is Bricolage Grotesque.

**The Family-Name Rule.** React Native selects weight by font family, not `fontWeight`. Use the weight-specific families (`font-sans-semibold`, `font-serif-italic`), never `font-bold` alone.

## Layout

Single column on every screen, with a 20px side gutter (`gutter`). Content starts under a header row: on the capture screen, the crumb mark and "Crumbs" wordmark sit on the left, and the jar count chip and settings icon sit on the right. Secondary screens use a back chevron followed by the title.

Primary actions are full width and 56px tall (`cta`), anchored near the bottom of the screen or sheet. Secondary actions sit below as a text button, or beside each other as two equal halves ("Keep" and "Let go"). Every touch target is at least 44px (`touch`).

On capture, the composer bar docks directly above the keyboard: a status line on the left ("Stays on this phone", "Draft saved") and the Drop pill on the right. The capture field fills the space between the header and the composer bar.

Lists group under a label header with an optional trailing text action ("Resting" and "Hide"). Rows are separated by hairline dividers, not boxed. Settings use inset grouped cards whose rows are split by hairlines.

The returned crumb is given the whole middle of its sheet, with empty space above and below. Space, not decoration, signals importance.

Navigation and system controls follow each OS's conventions (back gesture, sheets, switches) under the shared Crumbs look.

## Elevation & Depth

The system is flat. Depth comes from tonal layering: Lamplit Page cards and bars sit on a Dusk Mist background, edged with Hairline borders. Bottom sheets are the only floating layer. They rise over a scrim of Inkwell at 45% opacity, with a 28px top radius and a grabber.

### Named Rules
**The Paper Rule.** No shadows on buttons, cards, chips, or bars. If a surface must separate, change its tone or add a hairline border.

## Shapes

Corners are soft and follow a ladder that grows with the surface: fields 12px (`field`), cards and banners 18px (`card`), dialogs 24px (`dialog`), and sheets 28px (`sheet`). Full-width buttons use 16px (`lg`). Compact actions (Drop, Open, Pull one), count chips, badges, and status chips are full pills.

Borders are hairline or 1px in Hairline. Selected option cards and outline buttons use a heavier 1.5px Inkwell border.

The recurring geometry is the crumb: a cluster of three marigold dots of different sizes (the crumb mark) and a trailing row of shrinking dots under a returned crumb. The jar silhouette from the logo appears in onboarding and as the outline icon in the count chip.

## Components

### Buttons
Quiet, tactile, and never shadowed.
- **Shape:** gently rounded blocks (16px) for full-width actions; full pills for compact actions.
- **Primary:** Inkwell fill with Lamplit Page text, 56px tall, full width. One per region: "Drop your first crumb", "Turn on weekly crumb", "Add a thought", "Add to this crumb".
- **Pill:** Inkwell fill, 44px tall, for compact actions inside bars and banners: "Drop", "Open", "Pull one". The disabled Drop pill is Hairline with Slate Ink text.
- **Outline:** Lamplit Page fill, 1.5px Inkwell border, Inkwell text ("Keep").
- **Tonal:** Dusk Mist fill, no border, Inkwell text ("Let go").
- **Destructive:** transparent fill, 1.5px Ember Red border and Ember Red text ("Delete everything").
- **Text:** Inkwell text only ("Not now", "Cancel", "Hide").
- **Pressed / Focus:** pressed state dims the fill to 90%. Focus uses a ring in Marigold.

### Chips and Badges
- **Count chip:** transparent with a Hairline border, a jar outline icon, and Slate Ink text ("42 crumbs", "Empty jar"). It opens the jar.
- **Layers badge:** Marigold Tint fill with Amber text ("2 layers").
- **Status chip:** transparent with a Hairline border and Slate Ink text ("Let go", "Resting until Feb 22").

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** Lamplit Page on Dusk Mist.
- **Shadow Strategy:** none (see The Paper Rule).
- **Border:** 1px Hairline.
- **Internal Padding:** 16px.
- Used for the "Pull one" prompt, inset settings groups, and the sealed-crumb info note.

### Inputs / Fields
- **Capture field:** borderless, directly on Dusk Mist, Literata at `crumb` size. The placeholder is Literata italic in Slate Ink.
- **Layer field:** Dusk Mist fill inside a Lamplit Page sheet, 1px Hairline border, 12px corners, Literata at `crumb-md` size.
- **Focus:** the caret and keyboard are the focus signal; there is no glow.

### Option cards (radio)
Lamplit Page cards with a Hairline border, a radio on the left, and a Label title above a Body description in Slate Ink. The selected card switches to a 1.5px Inkwell border and a filled Inkwell radio.

### Navigation
A header row, not a tab bar. The capture screen is home; the jar and settings are pushed screens with a back chevron and a Title. Sheets present Rediscovery, the layer composer, and the weekly-crumb choice.

### Return banner (signature)
The "A crumb is back" moment on the capture screen: Marigold Tint fill, Marigold Edge border, 18px corners, the crumb mark on the left, a Label title with an Amber subline ("From 3 months ago"), and an Open pill on the right. It is the screen's one marigold element.

### Composer bar
A Lamplit Page strip with a top hairline, docked above the keyboard. The left side shows a Meta status in Slate Ink, and the right side holds the Drop pill.

### Crumb list row
Crumb text in Literata `crumb-sm`, a Meta timestamp in Slate Ink below, and an optional badge beside the timestamp. Rows are divided by hairlines. Let-go crumbs render their text in Slate Ink.

### Implementation status
`components/ui/button.tsx` and `components/ui/text.tsx` are still React Native Reusables defaults (40px height, `text-sm`, `font-medium`, `shadow-sm`). They do not match this system yet. Adapt them to the specs above before building screens.

## Do's and Don'ts

### Do:
- **Do** set crumbs and layers in Literata, and everything the app says in Bricolage Grotesque.
- **Do** keep one marigold element per screen, besides the logo mark.
- **Do** use Amber (#8F5400) for warm text, never Marigold.
- **Do** separate surfaces with tone (Lamplit Page on Dusk Mist) and Hairline borders.
- **Do** make primary actions full width and 56px tall, and every touch target at least 44px.
- **Do** select font weights by family name (`font-sans-semibold`), not `fontWeight`.

### Don't:
- **Don't** add streaks, flames, confetti, progress rings, or reward badges. Crumbs is not a gamified habit app.
- **Don't** add shadows to buttons, cards, chips, or bars.
- **Don't** set UI labels, buttons, or headings in Literata, or crumbs in Bricolage Grotesque.
- **Don't** fill primary actions with Marigold; actions are Inkwell.
- **Don't** use pure black (#000000) or pure white (#FFFFFF).
