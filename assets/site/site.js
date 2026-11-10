/* Mawkeb Saheb al-Zaman: shared header, footer, navigation, lightbox and forms. Settings live in config.js. */
(function () {
  var C = window.MAWKEB || {};
  // The site may live at a domain's root or in a folder (e.g. GitHub Pages: user.github.io/repo/).
  // Work out where it starts from this script's own address, and keep every link relative to that.
  var me = (document.currentScript && document.currentScript.src) || '';
  var BASE = me ? me.replace(/assets\/site\/site\.js(\?.*)?$/, '') : location.origin + '/';
  window.MAWKEB_BASE = BASE;
  var basePath = new URL(BASE, location.href).pathname;
  var path = '/' + location.pathname.slice(basePath.length).replace(/index\.html$/, '');
  function rel(html) { return html.replace(/(href|src)="\/(?!\/)/g, '$1="' + BASE); }
  var chev = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  var PROGRAMS = [
    ['/programs/abna-al-batoul.html', 'Abna Al-Batoul'],
    ['/programs/layali-al-qadr.html', 'Layali Al-Qadr'],
    ['/programs/year-round-activities.html', 'Year-Round Activities'],
    ['/programs/madheef-sahib-al-zaman.html', 'Madheef Sahib Al-Zaman'],
    ['/programs/arbaeen.html', 'Arbaeen']
  ];
  var INVOLVED = [
    ['/get-involved/donate.html', 'Donate'],
    ['/get-involved/membership.html', 'Become a Member'],
    ['/get-involved/volunteer.html', 'Volunteer'],
    ['/get-involved/sponsor-the-madheef.html', 'Sponsor the Madheef']
  ];
  function cur(href) { return path === href ? ' aria-current="page"' : ''; }
  function list(items) { return items.map(function (p) { return '<li><a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a></li>'; }).join(''); }

  /* ---------- header ---------- */
  var hdr = document.getElementById('site-header');
  if (hdr) {
    var inPrograms = path.indexOf('/programs/') === 0, inInvolved = path.indexOf('/get-involved/') === 0;
    hdr.className = 'hdr';
    hdr.innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="/"' + (path === '/' ? ' aria-current="page"' : '') + ' aria-label="Mawkeb Saheb al-Zaman, home"><span class="m" id="brandMark"></span><span>Mawkeb Saheb al-Zaman<small>Detroit</small></span></a>' +
      '<ul class="nav" id="nav">' +
      '<li><a href="/"' + cur('/') + '>Home</a></li>' +
      '<li' + (inPrograms ? ' class="current"' : '') + '><button type="button" aria-expanded="false" aria-controls="m-programs">Programs ' + chev + '</button><ul class="menu" id="m-programs"><li><a href="/programs/"' + cur('/programs/') + '>All programs</a></li><li class="sep" role="separator"></li>' + list(PROGRAMS) + '</ul></li>' +
      '<li' + (inInvolved ? ' class="current"' : '') + '><button type="button" aria-expanded="false" aria-controls="m-involved">Get Involved ' + chev + '</button><ul class="menu" id="m-involved"><li><a href="/get-involved/"' + cur('/get-involved/') + '>Ways to help</a></li><li class="sep" role="separator"></li>' + list(INVOLVED) + '</ul></li>' +
      '<li><a href="/store/"' + cur('/store/') + '>Store</a></li>' +
      '<li><a href="/social/"' + cur('/social/') + '>Social Media</a></li>' +
      '<li class="m-only"><a class="btn btn-green" href="/get-involved/donate.html">Donate</a></li>' +
      '</ul>' +
      '<a class="btn btn-ghost btn-sm" href="/get-involved/volunteer.html">Get Involved</a>' +
      '<a class="btn btn-green btn-sm" href="/get-involved/donate.html">Donate</a>' +
      '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>' +
      '</div>';
    hdr.innerHTML = rel(hdr.innerHTML);

    hdr.querySelectorAll('.nav>li>button').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.parentElement, open = !li.classList.contains('open');
        hdr.querySelectorAll('.nav>li.open').forEach(function (o) { o.classList.remove('open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); });
        li.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
      });
    });
    document.addEventListener('click', function (e) { if (!hdr.contains(e.target)) hdr.querySelectorAll('.nav>li.open').forEach(function (o) { o.classList.remove('open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var o = hdr.querySelector('.nav>li.open'); if (o) { o.classList.remove('open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); o.firstElementChild.focus(); }
      if (hdr.classList.contains('menu-open')) { hdr.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
    });
    var burger = hdr.querySelector('.burger');
    burger.addEventListener('click', function () { var o = hdr.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', String(o)); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); });

    // over a full-screen hero the header starts clear; elsewhere it is solid
    var heroSel = document.body.getAttribute('data-hero');
    if (!heroSel) document.body.classList.add('solid-header');
    else {
      var heroEl = document.querySelector(heroSel);
      var solid = function () { hdr.classList.toggle('solid', !heroEl || heroEl.getBoundingClientRect().bottom < innerHeight * .5 + 80 && scrollY > 40); };
      addEventListener('scroll', solid, { passive: true }); solid();
    }
  }

  /* ---------- footer ---------- */
  var ft = document.getElementById('site-footer');
  if (ft) {
    var s = C.social || {};
    function social(key, label) { return s[key] ? '<li><a href="' + s[key] + '" rel="noopener" target="_blank">' + label + '</a></li>' : '<li class="pending">' + label + ' (link to come)</li>'; }
    ft.className = 'foot';
    ft.innerHTML =
      '<div class="wrap"><div class="cols">' +
      '<div><img src="/assets/brand/logo-on-dark.png" alt="Mawkeb Saheb al-Zaman" width="110" height="116" loading="lazy"><p style="margin-top:14px">A Shia community in the ' + ((C.contact && C.contact.area) || 'Detroit area') + '.</p>' +
      (C.contact && C.contact.email ? '<p style="margin-top:8px"><a href="mailto:' + C.contact.email + '">' + C.contact.email + '</a></p>' : '') + '</div>' +
      '<div><h4>Programs</h4><ul>' + list(PROGRAMS) + '</ul></div>' +
      '<div><h4>Get involved</h4><ul>' + list(INVOLVED) + '<li><a href="/store/">Store</a></li></ul></div>' +
      '<div><h4>The Mawkeb</h4><ul><li><a href="/about.html">About us</a></li><li><a href="/contact.html">Contact</a></li><li><a href="/faq.html">Questions</a></li><li><a href="/social/">Social media</a></li></ul></div>' +
      '<div><h4>Follow</h4><ul>' + social('instagram', 'Instagram') + social('youtube', 'YouTube') + social('soundcloud', 'SoundCloud') + '</ul></div>' +
      '</div><div class="legal"><span>© ' + new Date().getFullYear() + ' Mawkeb Saheb al-Zaman</span><span><a href="/privacy.html">Privacy</a></span></div></div>';
    ft.innerHTML = rel(ft.innerHTML);
  }

  /* ---------- links filled from config ---------- */
  document.querySelectorAll('[data-social]').forEach(function (a) {
    var k = a.getAttribute('data-social'), url = k.indexOf('highlight:') === 0 ? ((C.social || {}).highlights || {})[k.slice(10)] || (C.social || {}).instagram : (C.social || {})[k];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.removeAttribute('href'); a.classList.add('pending'); a.setAttribute('aria-disabled', 'true'); var sm = a.querySelector('small'); if (sm) sm.textContent = 'link to come'; }
  });
  document.querySelectorAll('[data-link="membership"]').forEach(function (a) { if (C.membershipUrl) a.href = C.membershipUrl; });
  document.querySelectorAll('[data-contact-email]').forEach(function (el) {
    if (C.contact && C.contact.email) el.innerHTML = '<a href="mailto:' + C.contact.email + '">' + C.contact.email + '</a>';
  });

  /* ---------- lightbox (any [data-full] inside a [data-gallery]) ---------- */
  var lb = null, group = [], gi = 0, opener = null;
  function lbShow() { var b = group[gi]; lb.querySelector('img').src = b.dataset.full; lb.querySelector('img').alt = b.dataset.cap || ''; lb.querySelector('p').textContent = b.dataset.cap || ''; }
  function lbClose() { lb.classList.remove('open'); document.documentElement.style.overflow = ''; if (window.lenis) window.lenis.start(); if (opener) opener.focus(); }
  document.querySelectorAll('[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!lb) {
        lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo');
        lb.innerHTML = '<div><img alt=""><p></p></div><button class="x" type="button">Close</button><button class="nav-btn prev" type="button" aria-label="Previous photo">&lsaquo;</button><button class="nav-btn next" type="button" aria-label="Next photo">&rsaquo;</button>';
        document.body.appendChild(lb);
        lb.querySelector('.x').addEventListener('click', lbClose);
        lb.querySelector('.prev').addEventListener('click', function () { gi = (gi - 1 + group.length) % group.length; lbShow(); });
        lb.querySelector('.next').addEventListener('click', function () { gi = (gi + 1) % group.length; lbShow(); });
        lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
        document.addEventListener('keydown', function (e) {
          if (!lb.classList.contains('open')) return;
          if (e.key === 'Escape') lbClose();
          if (e.key === 'ArrowRight') { gi = (gi + 1) % group.length; lbShow(); }
          if (e.key === 'ArrowLeft') { gi = (gi - 1 + group.length) % group.length; lbShow(); }
        });
      }
      var g = b.closest('[data-gallery]') || document;
      group = Array.prototype.slice.call(g.querySelectorAll('[data-full]')); gi = group.indexOf(b); opener = b;
      lb.querySelectorAll('.nav-btn').forEach(function (n) { n.hidden = group.length < 2; });
      lbShow(); lb.classList.add('open'); document.documentElement.style.overflow = 'hidden'; if (window.lenis) window.lenis.stop(); lb.querySelector('.x').focus();
    });
  });

  /* ---------- forms ---------- */
  function fieldOf(el) { return el.closest('.field'); }
  function check(form) {
    var bad = [];
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio' || el.name === 'company') return;
      if (!el.checkValidity()) { var f = fieldOf(el); if (f) { f.classList.add('invalid'); bad.push(f); } }
    });
    form.querySelectorAll('[data-required-group]').forEach(function (fs) {
      if (!fs.querySelector('input:checked')) { fs.classList.add('invalid'); bad.push(fs); }
    });
    form.querySelectorAll('input[type=checkbox][required]').forEach(function (el) {
      if (!el.checked) { var f = fieldOf(el); if (f) { f.classList.add('invalid'); bad.push(f); } }
    });
    return bad;
  }
  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === 'company') return;
      if (data[k] === undefined) data[k] = v; else if (Array.isArray(data[k])) data[k].push(v); else data[k] = [data[k], v];
    });
    data.form = form.getAttribute('data-form'); data.page = location.pathname; data.sent = new Date().toISOString();
    return data;
  }
  function asText(data) {
    return Object.keys(data).filter(function (k) { return ['form', 'page', 'sent'].indexOf(k) < 0; })
      .map(function (k) { return k.replace(/_/g, ' ') + ': ' + (Array.isArray(data[k]) ? data[k].join(', ') : data[k]); }).join('\n');
  }
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var name = form.getAttribute('data-form'), status = form.querySelector('.form-status'), btn = form.querySelector('[type=submit]');
    // prefill from the address, e.g. volunteer.html?team=Madheef
    var q = new URLSearchParams(location.search);
    q.forEach(function (v, k) {
      form.querySelectorAll('[name="' + k + '"]').forEach(function (el) {
        if (el.type === 'checkbox' || el.type === 'radio') { if (el.value.toLowerCase() === v.toLowerCase()) el.checked = true; }
        else if (!el.value) el.value = v;
      });
    });
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener(el.type === 'checkbox' || el.type === 'radio' ? 'change' : 'blur', function () {
        var f = el.closest('.field.invalid'); if (!f) return;
        if (f.hasAttribute('data-required-group') ? f.querySelector('input:checked') : el.checkValidity()) f.classList.remove('invalid');
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = check(form);
      if (bad.length) {
        status.dataset.kind = 'error'; status.textContent = bad.length === 1 ? 'One answer needs attention.' : bad.length + ' answers need attention.';
        var first = bad[0].querySelector('input,select,textarea'); if (first) first.focus();
        return;
      }
      if (form.company && form.company.value) { done(); return; } // spam trap
      var data = collect(form), endpoint = (C.forms || {})[name];
      if (!endpoint) {
        status.dataset.kind = 'error';
        status.innerHTML = 'Online sending is not switched on yet, so nothing was sent. ' +
          (C.contact && C.contact.email ? '<a href="mailto:' + C.contact.email + '?subject=' + encodeURIComponent(form.getAttribute('data-subject') || 'Website form') + '&body=' + encodeURIComponent(asText(data)) + '">Send your answers by email instead</a>.'
            : 'Please message the Mawkeb on Instagram for now; your answers are still on this page.');
        return;
      }
      btn.disabled = true; var label = btn.innerHTML; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending';
      status.dataset.kind = ''; status.textContent = '';
      // sent as an ordinary form post (no preflight), which Formspree, Basin, Google Apps Script and Forminator all accept
      var body = new URLSearchParams();
      Object.keys(data).forEach(function (k) { body.append(k, Array.isArray(data[k]) ? data[k].join(', ') : data[k]); });
      fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: body })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () { btn.disabled = false; btn.innerHTML = label; status.dataset.kind = 'error'; status.textContent = 'Your answers could not be sent. Check your connection and try again.'; });
    });
    function done() {
      var box = document.createElement('div'); box.className = 'form-done'; box.setAttribute('role', 'status'); box.tabIndex = -1;
      box.innerHTML = '<h3>' + (form.getAttribute('data-done-title') || 'Thank you, it has been sent.') + '</h3><p>' + (form.getAttribute('data-done') || 'The team will be in touch.') + '</p>';
      form.replaceWith(box); box.focus();
    }
  });
})();
