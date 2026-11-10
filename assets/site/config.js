/* Mawkeb website settings: the one file to edit when an account, link or payment service is confirmed.
   Leave a value empty ('') while it is unknown; the site then shows an honest "not connected yet" message
   instead of a broken link. Nothing secret belongs here: this file is public. See SETUP.md. */
window.MAWKEB = {

  // Official accounts. Paste the full address once confirmed (e.g. 'https://www.instagram.com/<handle>/').
  social: {
    instagram: '',
    youtube: '',
    soundcloud: '',
    // Instagram story highlights for each program, if the account has them
    highlights: {
      'abna-al-batoul': '',
      'layali-al-qadr': '',
      'year-round': '',
      'madheef': '',
      'arbaeen': ''
    }
  },

  contact: {
    email: '',            // the team's public address, once confirmed
    area: 'Detroit area, Michigan'
  },

  // Member registration already runs on the live site (Forminator, with analytics behind sign-in).
  membershipUrl: 'https://themawkeb.com/join',

  // Where each form sends its answers. Use a form service the Mawkeb controls (see SETUP.md):
  // a Forminator or Google Apps Script endpoint, Formspree, Basin, etc. Empty = not connected yet.
  forms: {
    volunteer: '',
    sponsor: '',
    contact: ''
  },

  // Online giving. Use a hosted checkout from an established provider; this site never handles card numbers.
  // One link per fund (Stripe Payment Links, Zeffy, PayPal Giving, Givebutter...). '{amount}' and
  // '{frequency}' are filled in if the provider accepts them in the address; otherwise leave them out.
  donations: {
    presets: [25, 50, 100, 250],          // suggested amounts on the donate page; edit freely
    currency: 'USD',
    funds: {
      general:          { name: 'Where it is needed most', link: '' },
      'abna-al-batoul': { name: 'Abna Al-Batoul',          link: '' },
      'layali-al-qadr': { name: 'Layali Al-Qadr',          link: '' },
      madheef:          { name: 'Madheef Sahib Al-Zaman',  link: '' },
      arbaeen:          { name: 'Arbaeen',                 link: '' }
    },
    // Zelle: only the organisation's verified Zelle email or phone. Gifts by Zelle are confirmed by hand.
    zelle: { recipient: '', name: 'Mawkeb Saheb al-Zaman' }
  },

  // The store's checkout (Shopify, Square Online, Stripe...). Empty = cart works, checkout says "not open yet".
  store: {
    checkoutUrl: '',
    open: false
  }
};
