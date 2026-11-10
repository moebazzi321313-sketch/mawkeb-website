/* The Mawkeb store: products, cart and checkout hand-off.
   PRODUCTS below are SAMPLE listings to show how the store works. They are marked as samples on the page
   and cannot be bought. Replace them with the Sales team's real products (name, description, price in
   dollars, sizes, photo) and set `sample: false`. Checkout opens MAWKEB.store.checkoutUrl. See SETUP.md. */
(function () {
  var PRODUCTS = [
    { id: 'abna-1448-tee', name: 'Abna Al-Batoul 1448 shirt', sample: true, price: null,
      desc: 'Black shirt with the Sons of Batoul 4 emblem.', image: (window.MAWKEB_BASE || '/') + 'assets/media/years/1448.png', options: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'abna-1446-tee', name: 'Sons of Batoul 2 shirt', sample: true, price: null,
      desc: 'Black shirt with the Sons of Batoul 2 emblem.', image: (window.MAWKEB_BASE || '/') + 'assets/media/years/1446.png', options: ['S', 'M', 'L', 'XL', 'XXL'] }
  ];

  var C = (window.MAWKEB || {}).store || {}, KEY = 'msz-cart';
  var grid = document.getElementById('products'), drawer = document.getElementById('cart'), count = document.getElementById('cart-count');
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} render(); }
  function money(v) { return v == null ? 'Price to be set' : '$' + v.toFixed(2); }
  function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }

  grid.innerHTML = PRODUCTS.map(function (p) {
    return '<article class="product"><div class="img">' + (p.sample ? '<span class="flag">Sample listing</span>' : '') +
      '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div><div class="bd"><h3>' + p.name + '</h3>' +
      '<span class="price">' + money(p.price) + '</span><p>' + p.desc + '</p>' +
      (p.options.length ? '<label class="sr" for="opt-' + p.id + '">Size</label><select id="opt-' + p.id + '">' + p.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>' : '') +
      '<button class="btn btn-ink btn-sm" type="button" data-add="' + p.id + '">Add to cart</button></div></article>';
  }).join('');

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var id = b.dataset.add, sel = document.getElementById('opt-' + id), opt = sel ? sel.value : '';
    var c = load(), line = c.filter(function (l) { return l.id === id && l.opt === opt; })[0];
    if (line) line.qty++; else c.push({ id: id, opt: opt, qty: 1 });
    save(c); b.textContent = 'Added'; setTimeout(function () { b.textContent = 'Add to cart'; }, 1200);
  });

  function render() {
    var c = load(), n = c.reduce(function (s, l) { return s + l.qty; }, 0);
    count.textContent = n;
    var items = drawer.querySelector('.items'), total = 0, known = true;
    items.innerHTML = c.length ? c.map(function (l, i) {
      var p = find(l.id) || { name: 'Removed item', price: null }; if (p.price == null) known = false; else total += p.price * l.qty;
      return '<div class="item"><div><b>' + p.name + '</b>' + (l.opt ? '<br><small>Size ' + l.opt + '</small>' : '') + '<br><small>' + money(p.price) + '</small></div>' +
        '<div class="qty"><button type="button" data-q="' + i + '" data-d="-1" aria-label="One fewer">&minus;</button><span>' + l.qty + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="One more">+</button></div></div>';
    }).join('') : '<p style="padding:24px 0;color:var(--muted)">Your cart is empty.</p>';
    drawer.querySelector('.total span:last-child').textContent = c.length ? (known ? '$' + total.toFixed(2) : 'Set when the store opens') : '$0.00';
  }
  drawer.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    var c = load(), l = c[+b.dataset.q]; l.qty += +b.dataset.d; if (l.qty < 1) c.splice(+b.dataset.q, 1); save(c);
  });

  var opener = null;
  function open() { opener = document.activeElement; drawer.classList.add('open'); drawer.querySelector('.x').focus(); }
  function close() { drawer.classList.remove('open'); if (opener) opener.focus(); }
  document.getElementById('cart-open').addEventListener('click', open);
  drawer.querySelector('.x').addEventListener('click', close);
  drawer.querySelector('.scrim').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

  document.getElementById('checkout').addEventListener('click', function () {
    var st = document.getElementById('checkout-status'), c = load();
    if (!c.length) { st.textContent = 'Add something to your cart first.'; return; }
    var sample = c.some(function (l) { return (find(l.id) || {}).sample; });
    if (!C.open || !C.checkoutUrl || sample) { st.textContent = 'The online store is not open yet, so nothing was charged. The Mawkeb\'s merchandise is sold at the Sales table on program nights.'; return; }
    location.href = C.checkoutUrl;
  });
  render();
})();
