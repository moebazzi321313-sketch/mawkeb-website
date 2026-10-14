# Mawkeb Saheb al-Zaman website

This version uses the original website from `../nonprofit-colorlib-inspired.zip`, with Themawkeb branding applied to its existing layout.

The original hero layout, diagonal section edges, service icons, program cards, volunteer banner and footer remain. The homepage centers the official Mawkeb logo, organisation name and introduction over an Ink/Green background. All children's photos have been removed from the active site, including page backgrounds, the homepage feature, program cards and blog. The homepage feature uses one text column, and cards close up around their remaining content.

## Preview and compare

Open `index.html` with VS Code Live Server and refresh the browser.

The earlier redesign is saved as a complete copy in `versions/msz-redesign/`. Open `versions/msz-redesign/index.html` to compare it with the restored layout. The original ZIP is unchanged.

## Brand and copy

`styles.css` starts with the shared Themawkeb palette:

- Ink: `#121309`
- Green: `#427D46`; deep: `#336137`; wash: `#ECF2EC`
- Muted: `#6D7169`
- Line: `#E4E6E1`
- Canvas: `#F1F2EF`
- Maroon: `#751A1A`; wash: `#FBEDED`
- Ochre: `#8A6A1F`; wash: `#FBF3DF`

The original CSS names (`--wine`, `--red`, `--blush`, etc.) are compatibility aliases for the new palette. They retain the original component code while changing its colours. New layout changes are limited to centering the hero branding and keeping narrow screens readable.

Latin typography uses Montserrat. Arabic uses Dubai when installed, with Tahoma/Arial fallbacks; no Dubai webfont was found in the supplied repository. Dates use `America/Detroit`.

Names and program descriptions are updated for the Mawkeb. The six original program-card layouts remain, with real Themawkeb areas replacing the sample charity campaigns. The original fundraising boxes now show program information instead of invented amounts.

## Images

The transparent official logo used in the hero and header is copied unchanged from:

`C:\Users\Owner\OneDrive\mawkeb-event-planning-main\event-planning\wordpress\msz-dashboard\assets\logo.png`

It is saved as `assets/brand/logo-transparent.png`. Other official logo/icon assets remain in `assets/brand/`.

The Programs page uses the user-supplied `Mawkeb Group Ashura photo.jpeg` as a full-width header background with a straight lower edge and a thin green rule. The unmodified photo is copied to `assets/mawkeb-ashura-group.jpeg`. CSS keeps the middle of the photo brighter, adds shading at the top and bottom for readable navigation and text, and places the heading below the group's faces.

The reference repository contains official logos and planning diagrams. The Programs header uses the separately supplied Ashura group photo. References to deleted template photos have been removed from the active pages and shared styles, with the affected sections using text layouts.

## Current forms

The original contact and newsletter form layouts and email-draft behavior are restored. They open a draft in the visitor's email app with an empty recipient. Add the team's confirmed public address before sending. They do not send messages, save registrations or subscribe visitors to a mailing list.

The support page does not collect payments. Public contact details, donation instructions and future gathering details remain to be confirmed.

## Local checks

```powershell
node --check script.js
node .tmp/verify-site.mjs
```

The browser check visits all nine pages at desktop, tablet and phone widths. It checks that the original sections remain, the homepage logo is centered, cards stack below 860px, inputs stay at least 16px, and there is no sideways scrolling. It also checks links, images, navigation, form validation, Detroit date conversion and opening the homepage directly as a file. Reports and screenshots are saved under `.tmp/`.
