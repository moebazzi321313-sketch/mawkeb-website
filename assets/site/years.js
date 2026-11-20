/* Our programs on the map.
   One road through everything the Mawkeb has done, in date order, drawn over a ready-made terrain image
   (tools/map/render_terrain.py) in the same world coordinates. Programs with no dated event (the Kids
   Program, Ashura and the Madheef) sit on short side paths. Picking a program lights up its stops, fades the rest,
   and makes previous / next / play step through that program only.

   Moving the map is one CSS transform (the compositor does the work, nothing is redrawn).
   So people can tell the map is interactive: it walks the road by itself the first time it is in view,
   a hint says what to do, the stops pulse until someone uses the map, and it can be dragged.
   Any touch, click or key press stops the walk-through. Nothing here listens to scrolling. */
(function () {
  var sec = document.getElementById('years');
  if (!sec) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // world coordinates, shared with render_terrain.py
  var X0 = -700, Y0 = -500, EW = 3000, EH = 1841.7;
  // in date order; `spur` = drawn on a side path off that stop. Panel ids are "ev-" + id.
  var EV = [
    { id: '1445', prog: 'abna', x: -250, y: 860, name: '1445', sub: 'Abna Al‑Batoul' },
    { id: '1446', prog: 'abna', x: 100, y: 700, name: '1446', sub: 'Sons of Batoul 2' },
    { id: '1447', prog: 'abna', x: 420, y: 560, name: '1447', sub: 'Sons of Batoul 3' },
    { id: 'kids', prog: 'kids', x: 560, y: 800, name: 'Kids Program', sub: 'The Firmest Bond', spur: '1447' },
    { id: 'fiqh', prog: 'fiqh', x: 780, y: 620, name: 'Fiqh Course', sub: 'February 2026' },
    { id: 'qadr', prog: 'qadr', x: 1080, y: 430, name: 'Laylat Al‑Qadr', sub: 'The Best of Leaders 3' },
    { id: 'ashura', prog: 'ashura', x: 1270, y: 250, name: 'Ashura', sub: 'Muharram', spur: 'qadr' },
    { id: 'arbaeen', prog: 'arbaeen', x: 1400, y: 540, name: 'Arbaeen', sub: 'August 2026' },
    { id: 'madheef', prog: 'madheef', x: 1500, y: 790, name: 'Madheef', sub: 'Every program night', spur: 'arbaeen' },
    { id: '1448', prog: 'abna', x: 1700, y: 330, name: '1448', sub: 'Sons of Batoul 4', now: true }
  ];
  var byId = {}; EV.forEach(function (e, i) { e.i = i; byId[e.id] = e; });

  // a smooth curve through the points (Catmull-Rom as cubic Béziers)
  function curve(p, upto) {
    var n = upto == null ? p.length - 1 : upto, d = 'M' + p[0][0] + ' ' + p[0][1];
    for (var i = 0; i < n; i++) {
      var a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
      d += ' C' + (b[0] + (c[0] - a[0]) / 6).toFixed(1) + ' ' + (b[1] + (c[1] - a[1]) / 6).toFixed(1) + ' ' +
           (c[0] - (e[0] - b[0]) / 6).toFixed(1) + ' ' + (c[1] - (e[1] - b[1]) / 6).toFixed(1) + ' ' + c[0] + ' ' + c[1];
    }
    return d;
  }
  // a gentle bend between two stops, alternating sides, so the road wanders like a path
  function bend(a, b, k) {
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return [mx - dy / l * k, my + dx / l * k];
  }

  var view = sec.querySelector('.map-view'), world = document.getElementById('world');
  view.removeAttribute('aria-hidden'); world.setAttribute('aria-hidden', 'true');
  var svg = world.querySelector('svg');
  var base = document.getElementById('route-base'), done = document.getElementById('route-done'), next = document.getElementById('route-next');

  // the main road: every stop that is not on a side path
  var main = EV.filter(function (e) { return !e.spur; }), WAY = [];
  main.forEach(function (e, k) {
    if (k) WAY.push(bend(main[k - 1], e, k % 2 ? 55 : -55));
    e.at = WAY.length; WAY.push([e.x, e.y]);
  });
  var last = main[main.length - 1];
  next.setAttribute('d', curve([[last.x, last.y], [last.x + 120, last.y - 70], [last.x + 260, last.y - 110]]));
  base.setAttribute('d', curve(WAY)); done.setAttribute('d', curve(WAY));
  var L = done.getTotalLength();
  var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.appendChild(tmp);
  main.forEach(function (e) { if (!e.at) { e.len = 0; return; } tmp.setAttribute('d', curve(WAY, e.at)); e.len = tmp.getTotalLength(); });
  tmp.remove();
  done.style.strokeDasharray = L + ' ' + L;
  // side paths
  EV.forEach(function (e) {
    if (!e.spur) return;
    var p = byId[e.spur], path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'route-spur');
    path.setAttribute('d', curve([[p.x, p.y], bend(p, e, 40), [e.x, e.y]]));
    svg.insertBefore(path, done);
    e.path = path;
  });

  // stops: HTML on top of the map so the labels stay sharp at any size
  var stopsBox = document.getElementById('stops');
  EV.forEach(function (e) {
    var el = document.createElement('button');
    el.type = 'button'; el.tabIndex = -1;          // keyboard users have the program buttons and the controls below
    el.className = 'stop' + (e.now ? ' now' : '') + (e.spur ? ' side' : '');
    el.style.left = ((e.x - X0) / EW * 100) + '%';
    el.style.top = ((e.y - Y0) / EH * 100) + '%';
    el.innerHTML = '<i class="pt"></i><span class="lbl"><b>' + (e.now ? 'This year: ' : '') + e.name + '</b>' + e.sub + '</span>';
    el.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse' && !drag) peekAt(e); });
    el.addEventListener('pointerleave', function () { peekOff(); });
    el.addEventListener('click', function () {
      peekOff();
      if (dragged) return;
      used();
      if (prog !== 'all' && prog !== e.prog) setProg('all', e.i); else select(e.i, true);
    });
    stopsBox.appendChild(el);
    e.el = el;
    e.panel = document.getElementById('ev-' + e.id);
  });
  var nextLbl = document.createElement('div');
  nextLbl.className = 'stop-next'; nextLbl.textContent = '1449, next year';
  nextLbl.style.left = ((last.x + 260 - X0) / EW * 100) + '%'; nextLbl.style.top = ((last.y - 110 - Y0) / EH * 100) + '%';
  stopsBox.appendChild(nextLbl);

  // controls on the map
  var ui = document.createElement('div');
  ui.className = 'map-ui';
  ui.innerHTML =
    '<p class="map-hint"><span class="map-hint-dot"></span>Tap a point, drag the map, or zoom with + and −</p>' +
    '<div class="map-peek" aria-hidden="true"></div>' +
    '<div class="map-zoom">' +
      '<button type="button" class="map-btn" data-zoom="1" aria-label="Zoom in"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg></button>' +
      '<button type="button" class="map-btn" data-zoom="-1" aria-label="Zoom out"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10"/></svg></button>' +
    '</div>' +
    '<div class="map-steps">' +
      '<button type="button" class="map-btn" data-step="-1" aria-label="Previous"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg></button>' +
      '<span class="map-now" aria-live="polite"></span>' +
      '<button type="button" class="map-btn" data-step="1" aria-label="Next"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg></button>' +
      '<button type="button" class="map-play"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11L13 8z"/></svg><span>Play the road</span></button>' +
    '</div>';
  view.appendChild(ui);
  var nowEl = ui.querySelector('.map-now'), playBtn = ui.querySelector('.map-play'), steps = ui.querySelector('.map-steps');
  var zin = ui.querySelector('[data-zoom="1"]'), zout = ui.querySelector('[data-zoom="-1"]');
  zin.addEventListener('click', function () { used(); var c = centre(); zoomAnim(zoom * 1.5, c[0], c[1]); });
  zout.addEventListener('click', function () { used(); var c = centre(); zoomAnim(zoom / 1.5, c[0], c[1]); });
  var prevBtn = ui.querySelector('[data-step="-1"]'), nextBtn = ui.querySelector('[data-step="1"]');
  prevBtn.addEventListener('click', function () { used(); step(-1); });
  nextBtn.addEventListener('click', function () { used(); step(1); });
  playBtn.addEventListener('click', function () { var on = !!tour; used(); if (!on) playTour(); });

  var picks = [].slice.call(sec.querySelectorAll('.prog-pick [data-prog]'));
  picks.forEach(function (b) {
    b.addEventListener('click', function () { used(); setProg(b.getAttribute('data-prog')); });
  });

  var prog = 'all', set = EV.slice(), current = byId['1448'].i, scale = 1, tx = 0, ty = 0;
  var fit = 1, zoom = 1, ZMAX = 3;   // scale = fit (the default view for this screen) × zoom

  function clampX(x) { return Math.min(0, Math.max(view.clientWidth - EW * scale, x)); }   // never show the map's edge
  function clampY(y) { return Math.min(0, Math.max(view.clientHeight - EH * scale, y)); }
  function place(x, y, animate) {
    tx = clampX(x); ty = clampY(y);
    world.classList.toggle('still', !animate);
    world.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
  }
  // the most you can zoom out: the map still fills the whole view
  function zmin() { return Math.max(view.clientWidth / (EW * fit), view.clientHeight / (EH * fit)); }
  function layout(animate) {
    var vw = view.clientWidth, vh = view.clientHeight, wide = innerWidth > 860;
    // show about 820 world units of height on desktop; on phones about 1150 units of width
    fit = wide ? vh / 820 : Math.min(vw / 1150, vh / 620);
    zoom = Math.min(ZMAX, Math.max(zmin(), zoom));
    size();
    aim(animate);
  }
  function size() {
    scale = fit * zoom;
    zin.disabled = zoom >= ZMAX - .001; zout.disabled = zoom <= zmin() + .001;
    world.style.width = (EW * scale) + 'px';
    world.style.height = (EH * scale) + 'px';
    // line widths are in map units, so divide by the scale to keep the same on-screen weight
    done.style.strokeWidth = (4.5 / scale) + 'px';
    base.style.strokeWidth = (2.5 / scale) + 'px';
    next.style.strokeWidth = (2.5 / scale) + 'px';
    base.style.strokeDasharray = (9 / scale) + ' ' + (8 / scale);
    next.style.strokeDasharray = (2 / scale) + ' ' + (9 / scale);
    EV.forEach(function (e) { if (e.path) { e.path.style.strokeWidth = (2.5 / scale) + 'px'; e.path.style.strokeDasharray = (9 / scale) + ' ' + (8 / scale); } });
  }
  // zoom to z, keeping the map point under (cx, cy) (view pixels) where it is
  function zoomTo(z, cx, cy) {
    z = Math.min(ZMAX, Math.max(zmin(), z));
    if (Math.abs(z - zoom) < .001) return;
    var wx = (cx - tx) / scale, wy = (cy - ty) / scale;
    zoom = z; size();
    place(cx - wx * scale, cy - wy * scale, false);
  }
  // a short eased zoom for the buttons and double-click
  var zt = 0;
  function zoomAnim(z, cx, cy) {
    cancelAnimationFrame(zt);
    var z0 = zoom, z1 = Math.min(ZMAX, Math.max(zmin(), z)), t0 = performance.now();
    (function tick(now) {
      var k = Math.min(1, (now - t0) / 260), e = 1 - Math.pow(1 - k, 3);
      zoomTo(z0 * Math.pow(z1 / z0, e), cx, cy);
      if (k < 1) zt = requestAnimationFrame(tick);
    })(t0);
  }
  function centre() { return [view.clientWidth / 2, view.clientHeight / 2]; }
  function aim(animate) {
    var vw = view.clientWidth, vh = view.clientHeight, wide = innerWidth > 860, e = EV[current];
    // the card has its own column now, so the chosen stop goes in the middle of the map
    var fx = .5, fy = wide ? .52 : .55;
    place(fx * vw - (e.x - X0) * scale, fy * vh - (e.y - Y0) * scale, animate);
  }

  function select(i, animate) {
    current = i;
    var e = EV[i], k = set.indexOf(e);
    EV.forEach(function (o) {
      o.el.classList.toggle('on', o === e);
      o.el.classList.toggle('past', !o.spur && !e.spur && o.i < e.i || !o.spur && e.spur && o.i <= byId[e.spur].i);
      if (o.path) o.path.classList.toggle('on', o === e);
      if (o.panel) o.panel.hidden = o !== e;
    });
    // draw the road up to this stop (for a side stop, up to where its path leaves the road)
    var r = e.spur ? byId[e.spur] : e;
    done.style.strokeDashoffset = String(L - r.len);
    sec.classList.toggle('is-now', !!e.now);
    nowEl.innerHTML = '<b>' + e.name + '</b>' + (set.length > 1 ? ' ' + (k + 1) + ' of ' + set.length : '');
    prevBtn.disabled = k <= 0; nextBtn.disabled = k >= set.length - 1;
    aim(animate);
  }
  function step(d) { var k = set.indexOf(EV[current]) + d; if (k >= 0 && k < set.length) select(set[k].i, true); }

  // pick a program: light up its stops, step only through them, go to its latest one (or `to`)
  function setProg(p, to) {
    prog = p;
    picks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-prog') === p)); });
    set = EV.filter(function (e) { return p === 'all' || e.prog === p; });
    EV.forEach(function (e) { e.el.classList.toggle('dim', set.indexOf(e) < 0); });
    sec.classList.toggle('single', set.length < 2);
    select(to != null ? to : set[set.length - 1].i, true);
  }

  // a person chose something: stop the walk-through and retire the hint
  function used() { stopTour(); sec.classList.add('used'); }

  // the walk-through: every stop in the current choice, one every 1.6 s
  var tour = 0;
  function stopTour() { clearTimeout(tour); tour = 0; sec.classList.remove('touring'); playBtn.lastChild.textContent = 'Play the road'; }
  function playTour() {
    stopTour();
    sec.classList.add('touring'); playBtn.lastChild.textContent = 'Stop';
    var k = 0; select(set[0].i, true);
    (function go() {
      tour = setTimeout(function () {
        if (++k >= set.length) { stopTour(); return; }
        select(set[k].i, true); go();
      }, 1600);
    })();
  }

  // drag to look around (mouse: any direction; touch: sideways, so the page still scrolls)
  // hover preview: a small card at the stop with the program, its picture and date, built from its panel
  var peek = ui.querySelector('.map-peek'), peekFor = null;
  function peekAt(e) {
    var pn = e.panel; if (!pn) return;
    var img = pn.querySelector('.yr-top img, .yr-photo img'), prog = pn.querySelector('.yr-prog');
    var fact = pn.querySelector('.yr-facts li'), title = pn.querySelector('.yr-top b, .yr-title b'), sub = pn.querySelector('.yr-top span, .yr-title span');
    peek.innerHTML = (img ? '<img src="' + img.getAttribute('src') + '" alt="">' : '') +
      '<div><small></small><b></b><span></span>' + (fact ? '<em></em>' : '') + '<i>' + (e.i === current ? 'Showing now' : 'Click to open') + '</i></div>';
    peek.querySelector('small').textContent = prog ? prog.textContent : '';
    peek.querySelector('b').textContent = title ? title.textContent : e.name;
    peek.querySelector('span').textContent = sub ? sub.textContent : e.sub;
    if (fact) peek.querySelector('em').textContent = fact.textContent;
    peek.classList.toggle('logo', !!(img && /\/years\//.test(img.getAttribute('src'))));
    // above the stop when there is room, otherwise below; never past the map's sides
    var v = view.getBoundingClientRect(), s = e.el.getBoundingClientRect();
    var x = s.left - v.left, y = s.top - v.top;
    peek.classList.add('on'); e.el.classList.add('peeking'); peekFor = e;
    var w = peek.offsetWidth, h = peek.offsetHeight;
    var left = Math.min(v.width - w - 12, Math.max(12, x - 28));
    var top = y - h - 20 < 12 ? y + 22 : y - h - 20;
    peek.style.transform = 'translate3d(' + Math.round(left) + 'px,' + Math.round(top) + 'px,0)';
  }
  function peekOff() { peek.classList.remove('on'); if (peekFor) peekFor.el.classList.remove('peeking'); peekFor = null; }

  // two fingers pinch to zoom (phones, and trackpads send ctrl + wheel below)
  var drag = null, dragged = false, pts = {}, pinch = null;
  function local(x, y) { var r = view.getBoundingClientRect(); return [x - r.left, y - r.top]; }
  function twoPts() { var k = Object.keys(pts); return k.length === 2 ? [pts[k[0]], pts[k[1]]] : null; }
  view.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || ui.contains(e.target)) return;
    pts[e.pointerId] = [e.clientX, e.clientY];
    var two = twoPts();
    if (two) {
      drag = null; dragged = true; used();
      pinch = { d: Math.hypot(two[0][0] - two[1][0], two[0][1] - two[1][1]) || 1, z: zoom };
      return;
    }
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, tx: tx, ty: ty, touch: e.pointerType !== 'mouse' };
    dragged = false;
  });
  view.addEventListener('pointermove', function (e) {
    if (pts[e.pointerId]) pts[e.pointerId] = [e.clientX, e.clientY];
    if (pinch) {
      var two = twoPts(); if (!two) return;
      var d = Math.hypot(two[0][0] - two[1][0], two[0][1] - two[1][1]);
      var c = local((two[0][0] + two[1][0]) / 2, (two[0][1] + two[1][1]) / 2);
      zoomTo(pinch.z * d / pinch.d, c[0], c[1]);
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = drag.touch ? 0 : e.clientY - drag.y;
    if (!dragged) {
      if (Math.abs(dx) + Math.abs(dy) < 6) return;
      dragged = true; used(); peekOff(); view.classList.add('dragging');
      try { view.setPointerCapture(e.pointerId); } catch (_) {}
    }
    place(drag.tx + dx, drag.ty + dy, false);
  });
  function endDrag(e) {
    delete pts[e.pointerId];
    if (pinch) { if (!twoPts()) { pinch = null; setTimeout(function () { dragged = false; }, 0); } return; }
    if (!drag || (e && e.pointerId !== drag.id)) return;
    drag = null; view.classList.remove('dragging');
    setTimeout(function () { dragged = false; }, 0);   // let the click that follows a drag be ignored
  }
  view.addEventListener('pointerup', endDrag);
  view.addEventListener('pointercancel', endDrag);
  view.addEventListener('keydown', function (e) { if (e.key !== 'Tab') used(); });
  // ctrl/⌘ + wheel, and trackpad pinch (which browsers report as ctrl + wheel), zoom at the pointer.
  // A plain wheel still scrolls the page.
  view.addEventListener('wheel', function (e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault(); used();
    var c = local(e.clientX, e.clientY);
    zoomTo(zoom * Math.exp(-e.deltaY * .01), c[0], c[1]);
  }, { passive: false });
  view.addEventListener('dblclick', function (e) {
    if (ui.contains(e.target)) return;
    used(); var c = local(e.clientX, e.clientY);
    zoomAnim(zoom * 1.6, c[0], c[1]);
  });

  sec.classList.add('ready');
  layout(false);
  select(current, false);
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(false); }, 120); });

  // first time the map is properly in view, walk the road once
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      if (!sec.classList.contains('used')) tour = setTimeout(playTour, 500);
    }, { threshold: .45 });
    io.observe(view);
  }
})();
