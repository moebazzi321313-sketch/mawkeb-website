# Mawkeb Saheb al-Zaman website: setup and handover

The site is plain HTML, CSS and JavaScript with no build step to run it. It works on any static web host.

## Run it on your computer

From this folder:

```
python -m http.server 8080
```

Then open http://localhost:8080/. Open it through a small server like this rather than by double-clicking a file, because browsers block some features for files opened directly.

## What is where

| Path | What it is |
| --- | --- |
| `index.html` | The homepage: the backlit logo intro, the latm footage that follows the scroll, this season, the trail of years, and the summaries. Edited by hand. |
| `programs/` | The programs landing page and one page per program: Abna Al-Batoul, Layali Al-Qadr, Year-Round Activities, Madheef Sahib Al-Zaman, Arbaeen. |
| `get-involved/` | The Get Involved landing page, Donate, Become a member, Volunteer, Sponsor the Madheef. |
| `store/`, `social/` | The store and the social media page. |
| `about.html`, `contact.html`, `faq.html`, `privacy.html` | The other pages. |
| `causes.html`, `impact.html`, `blog.html`, `donate.html`, `volunteer.html`, `abna-al-batul.html` | Redirects from the old addresses to the new pages. |
| `assets/site/config.js` | **The settings file**: social links, form addresses, donation links, Zelle, store checkout. |
| `assets/site/site.css`, `home.css` | The styles. |
| `assets/site/site.js` | The header, footer, menus, photo viewer and forms. |
| `assets/site/scrub.js`, `trail.js` | The scroll-driven footage and the trail map. |
| `assets/site/store.js` | The store's products and cart. |
| `assets/media/` | Footage frames, photos, emblems, the mark and the contour texture. |
| `tools/pages/` | The content of the inner pages (see below). |

## Editing content

- **The homepage** (`index.html`) is edited directly.
- **Inner pages** are written by `tools/pages/build.py` from `tools/pages/programs.py`, `involved.py` and `other.py`. Change the text there, then run:

  ```
  python tools/pages/build.py
  ```

  Editing a generated page directly also works, but the next build overwrites it.
- **Links and services** live in `assets/site/config.js`. Nothing in that file is secret; it is public like the rest of the site.

For a content management screen that non-technical admins can use, the recommended next step is [Decap CMS](https://decapcms.org/) or moving the program and event text into WordPress on themawkeb.com, which already has the Mawkeb's logins.

## Switching things on

Each of these shows an honest "not connected yet" message until it is set, so nothing breaks while you wait.

### Social media accounts

Paste the official addresses into `social` in `config.js` (Instagram, YouTube, SoundCloud), and each program's Instagram highlight under `social.highlights`. Every Instagram, YouTube and SoundCloud link on the site fills in automatically.

### Contact email

Set `contact.email`. It appears in the footer and on the contact page, and forms offer it as a fallback.

### Forms (volunteer, sponsor the Madheef, contact)

Each form posts its answers as a normal web form to the address in `forms`. Use a service the Mawkeb controls, where only authorised admins can read the answers:

- **Google Apps Script** (the Mawkeb already runs an Apps Script relay for the planning calendar): a `doPost(e)` that writes to a private Google Sheet and emails the team.
- **Forminator on themawkeb.com**, which already runs the member form.
- **Formspree** or **Basin**: paste the form's endpoint address.

The forms validate every answer, show what needs fixing, show a sending state, and confirm when sent. A hidden field catches spam bots.

### Membership

`membershipUrl` points to the live member form at https://themawkeb.com/join, where answers are reviewed behind a sign-in.

### Donations

The site never handles card numbers. Each fund in `donations.funds` takes a link to a hosted checkout page:

| Option | Fit | Notes |
| --- | --- | --- |
| **Zeffy** | Recommended for a nonprofit | No platform fee, receipts by email, one-time and monthly, one form per fund. |
| **Stripe Payment Links** | Good | Standard card fees, receipts, one-time and monthly; connects to QuickBooks. |
| **Chase merchant services** | Possible | Needs a Chase merchant account and its hosted checkout; worth it only if the Mawkeb already banks with Chase for card processing. |
| **PayPal Giving / Givebutter** | Possible | Well known, with their own fees. |

- **Zelle** is not a checkout. Fill in `donations.zelle.recipient` only with the Mawkeb's verified Zelle email or phone; the donate page then shows it with a copy button and explains that Zelle gifts are confirmed by hand.
- **QuickBooks**: connect it through the payment provider (Stripe and Square both sync to QuickBooks), and only once the Mawkeb authorises it.
- `donations.presets` sets the suggested amounts. Visitors can always type their own.

No real payment has been set up or tested. Test each link in the provider's test mode before publishing.

### Store

The two products in `assets/site/store.js` are **sample listings**. They are marked as samples on the page and cannot be bought. To open the store:

1. Replace them with the Sales team's real products, with name, description, `price` in dollars, sizes and a photo, and set `sample: false`.
2. Set `store.checkoutUrl` to a Shopify, Square Online or Stripe checkout, and `store.open: true`.

Shopify or Square Online is recommended if the Sales team wants to manage stock and orders themselves; the cart page can then link straight to that store.

## Publishing

Every address in the site is relative, so it works at a domain's root and inside a folder.

### GitHub Pages

1. Create an empty repository on GitHub (no README, so it doesn't clash with this one).
2. From this folder, push it (replace the address with your repository's):

   ```
   git remote add origin https://github.com/<your-account>/<repository>.git
   git push -u origin main
   ```

3. On GitHub, open **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. The site appears at `https://<your-account>.github.io/<repository>/` within a minute or two. To use themawkeb.com or a subdomain instead, add it under **Custom domain** and point the domain's DNS at GitHub, as GitHub's instructions show.

### Other hosts

The site also runs on GoDaddy, Cloudflare Pages or Netlify. themawkeb.com currently runs WordPress for the planning boards, member form and lessons, so decide with whoever manages the domain where this site goes, so that `/join` and the planning site keep working.

## Before going live

- **Photos**: the site uses every photo from the Abna Al-Batoul archive and the 1447 reel. Make sure the Mawkeb has permission to publish them; the privacy page offers removal on request.
- **Year descriptions**: the text for each year describes what the photos show. Please check it reads right.
- **Release schedule**: the latmiya release order (days 8, 11 and 15) comes from the Media plan. Confirm it can be public.
- **Privacy notice**: `privacy.html` is a draft for the Mawkeb to review.
- **Dates**: the "This season" strip on the homepage lists the Sayyida Fatima program (26 September 2026) and the second Fatimiyya riwaya (23 October 2026). Update it as new programs are announced.

## The footage

The homepage footage is from `Crane.mp4`, 18:15.03 to 18:16.13, cropped to the crowd only. It is one complete cycle of hands rising from the chest and returning, chosen by measuring every cycle in the 23-minute video. It is stored as 33 frames in `assets/media/latm/` so it can follow the scroll exactly, and it starts and ends at the chest so it loops without a jump. Visitors who prefer reduced motion see a still of the raised hands, and everyone has a pause button.
