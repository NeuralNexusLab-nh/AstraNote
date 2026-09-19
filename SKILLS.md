# AstraNote design and interface guide

Use this guide whenever changing AstraNote's visual design, front-end copy, layout, or interaction. The goal is a calm, polished online notebook: fast enough for a tiny piece of information, capable enough for private and important text. It must feel like one considered product, not a collection of generic SaaS screens.

## Product feeling

- **Quiet confidence.** The interface is refined, useful, and private without looking like a crypto product, a hacker dashboard, or a space-themed toy.
- **Fast before complicated.** Prioritize finding, writing, saving, and returning to short text. Advanced capability must stay discoverable but never dominate the main task.
- **Four equal strengths.** Present AstraNote as a capable notebook, strong optional encryption, fast cross-device access, and useful supporting tools. Do not let one of these erase the others.
- **Plain language.** Use friendly, specific sentences. Avoid needless technical detail, mixed-language jargon, dramatic slogans, and claims that overstate security.
- **Titles identify; content is protected.** Explain this distinction clearly wherever encryption is discussed. Never imply that a title is encrypted when it is not.

## Visual language

- Preserve the existing color tokens, typography, page width, card system, border system, and dark/light themes. Add tokens rather than hard-coding ad hoc colors.
- Use the primary AstraNote accent, not Bitcoin orange, metallic gold, loud gradients, or Web3 visual clichés.
- Cards should have restrained rounded corners, a clear border, balanced internal padding, and a visible purpose. Do not nest decorative cards without a hierarchy reason.
- Maintain a deliberate spacing rhythm. A grid row should look intentionally full: three related items should be three equal cards on wide screens, not two above one. When a feature is removed, rebalance the remaining grid rather than leaving a full-width orphan or dead area.
- Keep titles, values, labels, and units on sensible baselines. Never make a unit visually larger than its number, and do not force awkward line breaks such as a number on one line and its unit on the next.
- Use the existing monospace treatment only for technical data such as IDs, addresses, or storage values—not for ordinary UI copy.

## Icons, buttons, and controls

- Use locally served Font Awesome for interface icons. Icons belong to the **left** of a button label in normal desktop controls.
- Important controls need a clear hierarchy: primary action, ordinary action, and destructive action. The destructive state is reserved for genuinely irreversible actions.
- Keep a visible `:focus-visible` state and at least a roughly 44 px touch target for important controls.
- Button text may collapse to an icon on narrow screens only when the icon is unambiguous and an accessible label remains. Do not sacrifice essential actions merely to preserve desktop wording.
- Action areas must stay compact and aligned. On narrow widths, convert crowded horizontal actions to a clean equal-width grid or a sensible vertical stack; do not permit overlap, tiny targets, or a drifting action button.
- Filters must unmistakably look interactive. Avoid controls that look like plain metadata or passive text.
- Every clickable note card must be clickable across its entire visual area, except its own explicit destructive or utility controls.

## Layout and responsiveness

- Start from the shared `.shell`, page, card, form, navbar, and responsive patterns; do not introduce a second layout system for one page.
- Test wide desktop, laptop/tablet, portrait tablet, standard phones, narrow phones, and landscape phone. At minimum consider 1440×900, 1024×768, 768×1024, 430×932, 390×844, 360×740, 320×568, and 844×390.
- There must be no horizontal overflow. Long URLs, addresses, Japanese, Chinese, English labels, technical values, and button groups must remain usable.
- On mobile, reduce padding, icon/text density, and secondary detail before shrinking everything blindly. Preserve visual hierarchy and comfortable tap areas.
- Do not use unnecessary `100vh` layouts. Footers follow page content naturally.
- Navbar desktop and mobile menus must use the same navigation, active state, locale behavior, and focus treatment. Do not create an unrelated mobile-only navigation model.

## Theme, plan, and status treatment

- Dark mode is the default; light mode must be equally legible. Check accents, borders, logo marks, outlined plan labels, and muted text in both themes.
- The signed-in plan badge aligns vertically with the AstraNote wordmark and is an outlined rounded rectangle, not a detached decorative sticker.
- Visual plan hierarchy: Free is restrained; Plus is refined green; Pro is a clear featured blue treatment; Ultra is a premium purple treatment; Admin is the strongest premium treatment. These colors must still work in dark and light mode.
- Use color together with text and iconography for statuses. Errors and irreversible limits deserve a clear custom dialog or inline error state; do not hide important failures in a fleeting corner message.

## Motion

- Keep AstraNote's existing reveal and transition language: short, subtle, purposeful motion that confirms a change without delaying work.
- The home starfield may respond gently to scrolling, but must not reduce readability or compete with the message.
- Do not add decorative spinning coins, 3D objects, intrusive animations, or repeated motion that distracts from notes.
- Loading states must be unambiguous. A long-running action, especially Astra AI, needs visible progress or a spinner plus clear status—not only a warning message.

## Forms, CAPTCHA, and dialogs

- Use custom dialogs for normal confirmations, errors, sharing links, and destructive actions. The only acceptable browser alert is the unsaved-editing warning when leaving a note editor.
- CAPTCHA should appear only for the current security-sensitive policy. Do not wrap a CAPTCHA in multiple visual boxes. Its dynamic remote frame must live in a bounded responsive container so it cannot create blank vertical space or overflow a modal.
- A dialog's action buttons must remain stable. Do not use sticky offsets, auto-growing remote content, or mobile layouts that make a delete button drift below empty space.
- Show input requirements directly beneath the relevant field, especially for registration and PIN forms. Prevent browser password autofill for PIN inputs.
- Never use a modal, popup, dropdown, or new tab when the intended feature is a full page.

## Notes and document pages

- Notes remain the visual centre: lined content, readable line height, restrained metadata, and compact page actions. Avoid oversized note-page buttons.
- Pinned notes are visibly first. Search and filtering should be simple and direct; do not recreate folders or dense workspace controls.
- Locked notes retain their title and size but make prohibited actions clearly unavailable. Explain the upgrade path without pretending the content disappeared.
- Documentation uses the same navbar, palette, spacing, card system, and footer as the main product. The home, article pages, left sidebar, previous/next links, and utility links must be coherent.
- Documentation comparisons must label every row clearly. When using a table-like grid, verify that the column headers and product names render after localization.
- The docs home right arrow starts with **Getting started**, not contact. Article navigation advances through the documentation; only the final article may end at Contact us.

## Copy and localization

- All visible product copy must exist in English, Traditional Chinese, and Japanese through the existing localization system. Do not build parallel per-page language logic.
- English should be direct and polished. Traditional Chinese should sound natural rather than mechanically translated. Japanese should keep the same intent and rhythm without forcing literal wording.
- Prefer clear product names: **Normal encryption (AES-256-GCM)**, **Secret (AstraSecret)**, **Confidential (AstraConfidential)**, and **Top Secret (AstraZero)**. Keep legacy labels only where needed to open old notes.
- Avoid unexplained internal names, environment variable names, implementation details, and security promises that a user cannot evaluate.

## Review before shipping

- Inspect the changed page in both themes and each supported locale.
- Check the visual result at representative viewport sizes, including at least one narrow phone.
- Confirm all button labels, Font Awesome icons, focus rings, modal actions, and text wrapping are intact.
- Confirm responsive grids are balanced after additions or deletions.
- Run syntax checks and the relevant UI tests. A passing test is not a substitute for visual review.
