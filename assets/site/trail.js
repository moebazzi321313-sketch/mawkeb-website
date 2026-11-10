/* The trail of years: a contour map (d3-contour over a seeded noise field) with Abna Al-Batoul's
   years as stops on one route that climbs from 1445 to 1448. On desktop the section is pinned:
   scrolling draws the route, the camera follows the walker, and the panel shows each year.
   MawkebTrail(svg, { onYear(i), reduce }) */
(function () {
  var W = 1600, H = 1000;
  var STOPS = [
    { x: 300, y: 820, year: '1445', sub: 'The first year in our archive' },
    { x: 560, y: 600, year: '1446', sub: 'Sons of Batoul 2' },
    { x: 760, y: 410, year: '1447', sub: 'The latmiya, released' },
    { x: 1010, y: 250, year: '1448', sub: 'Sons of Batoul 4', now: true }
  ];
  var NEXT = { x: 1240, y: 150 };
  // the path between stops wanders like a real trail
  var WAY = [[300, 820], [350, 760], [420, 735], [470, 680], [560, 600], [610, 560], [600, 505], [660, 470], [760, 410],
             [820, 380], [860, 320], [930, 300], [1010, 250]];

  function rng(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function noiseField(nx, ny, PX, PY) {
    var r = rng(1445), oct = [];
    for (var o = 0; o < 5; o++) {
      var gx = 4 * Math.pow(2, o) + 1, gy = Math.round(gx * ny / nx) + 1, g = [];
      for (var i = 0; i < gx * gy; i++) g.push(r());
      oct.push({ gx: gx, gy: gy, g: g, amp: Math.pow(.52, o) });
    }
    function smooth(t) { return t * t * (3 - 2 * t); }
    var v = new Float64Array(nx * ny);
    for (var y = 0; y < ny; y++) for (var x = 0; x < nx; x++) {
      var s = 0;
      oct.forEach(function (O) {
        var fx = x / (nx - 1) * (O.gx - 1), fy = y / (ny - 1) * (O.gy - 1), ix = Math.min(O.gx - 2, Math.floor(fx)), iy = Math.min(O.gy - 2, Math.floor(fy));
        var tx = smooth(fx - ix), ty = smooth(fy - iy), g = O.g, w = O.gx;
        var a = g[iy * w + ix], b = g[iy * w + ix + 1], c = g[(iy + 1) * w + ix], d = g[(iy + 1) * w + ix + 1];
        s += O.amp * (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty);
      });
      // the land rises from the lower left toward the upper right, so the route climbs
      var px = x / (nx - 1) * (W + 2 * PX) - PX, py = y / (ny - 1) * (H + 2 * PY) - PY, rise = (px / W) * .9 + (1 - py / H) * .9;
      v[y * nx + x] = s * 1.1 + rise;
    }
    return v;
  }

  window.MawkebTrail = function (svg, opts) {
    opts = opts || {};
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; }
    var world = el('g', { id: 'world' });

    // terrain
    // the terrain reaches well past the frame so the camera never finds an edge
    var PAD_X = 700, PAD_Y = 500;
    if (window.d3) {
      var nx = 260, ny = 160, vals = noiseField(nx, ny, PAD_X, PAD_Y);
      var ext = d3.extent(vals), step = (ext[1] - ext[0]) / 70, th = d3.range(ext[0] + step, ext[1], step);
      var cs = d3.contours().size([nx, ny]).thresholds(th)(vals);
      var path = d3.geoPath(d3.geoIdentity().scale((W + 2 * PAD_X) / (nx - 1)).translate([-PAD_X, -PAD_Y]));
      var g = el('g', {}, world);
      cs.forEach(function (c, i) {
        var k = i / cs.length, idx = i % 5 === 0;
        el('path', { d: path(c), class: 'contour' + (idx ? ' idx' : ''), 'stroke-width': idx ? 1.4 : .8,
          'stroke-opacity': (idx ? .2 : .1) + k * (idx ? .35 : .22) }, g);
      });
    }
    // grid, like a survey sheet
    var grid = el('g', { class: 'grid' }, world);
    for (var gx = -600; gx < W + 700; gx += 200) el('line', { x1: gx, y1: -PAD_Y, x2: gx, y2: H + PAD_Y }, grid);
    for (var gy = -400; gy < H + 500; gy += 200) el('line', { x1: -PAD_X, y1: gy, x2: W + PAD_X, y2: gy }, grid);

    // route
    var line = window.d3 ? d3.line().curve(d3.curveCatmullRom.alpha(.5)) : function (p) { return 'M' + p.join('L'); };
    var d = line(WAY);
    el('path', { d: d, class: 'route-bg' }, world);
    el('path', { d: d, class: 'route-dash' }, world);
    var done = el('path', { d: d, class: 'route-done' }, world);
    el('path', { d: line([[1010, 250], [1090, 215], [1160, 190], [1240, 150]]), class: 'route-next' }, world);
    var nextLbl = el('text', { x: NEXT.x + 14, y: NEXT.y + 5, fill: '#cfd6cc', 'font-size': 15, 'font-style': 'italic', 'font-family': 'Montserrat, Arial' }, world);
    nextLbl.textContent = '1449, next year';
    var L = done.getTotalLength();

    // where each stop sits along the route
    function lengthAt(pt) {
      var best = 0, bd = 1e9;
      for (var s = 0; s <= L; s += 2) { var q = done.getPointAtLength(s), dd = (q.x - pt.x) * (q.x - pt.x) + (q.y - pt.y) * (q.y - pt.y); if (dd < bd) { bd = dd; best = s; } }
      return best;
    }
    var at = STOPS.map(lengthAt); at[0] = 0; at[at.length - 1] = L;

    // stops
    // on phones the whole route is shown at once, so labels are drawn larger to stay readable
    var LS = matchMedia('(max-width: 860px)').matches ? 2.1 : 1;
    if (LS > 1) svg.querySelectorAll('.route-bg,.route-dash,.route-done,.route-next').forEach(function (p) { p.setAttribute('vector-effect', 'non-scaling-stroke'); });
    nextLbl.style.fontSize = (15 * LS) + 'px';
    var stopEls = STOPS.map(function (s, i) {
      var g = el('g', { class: 'stop' + (s.now ? ' now' : ''), tabindex: 0, role: 'button', 'aria-label': s.year + ', ' + s.sub }, world);
      el('circle', { class: 'halo', cx: s.x, cy: s.y, r: 10 * LS }, g);
      el('circle', { class: 'pt', cx: s.x, cy: s.y, r: 9 * LS }, g);
      var tag = el('g', { class: 'tag' }, g);
      var title = s.now ? 'This year: ' + s.year : s.year;
      var w = (Math.max(title.length * 10.5, s.sub.length * 8.2) + 32) * LS, tx = s.x + 18 * LS, ty = s.y - 66 * LS;
      if (LS > 1 && tx + w > 1500) tx = s.x - 18 * LS - w;   // keep the last label on the screen
      el('rect', { x: tx, y: ty, width: w, height: 54 * LS, rx: 2 }, tag);
      var t1 = el('text', { x: tx + 14 * LS, y: ty + 23 * LS }, tag); t1.textContent = title; t1.style.fontSize = (17 * LS) + 'px';
      var t2 = el('text', { x: tx + 14 * LS, y: ty + 43 * LS, class: 'sub' }, tag); t2.textContent = s.sub; t2.style.fontSize = (14 * LS) + 'px';
      function pick() { if (opts.onYear) opts.onYear(i); set(i); jumpTo(i); }
      g.addEventListener('click', pick);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      return g;
    });

    var current = -1;
    function set(i) {
      if (i === current) return; current = i;
      stopEls.forEach(function (g, k) { g.classList.toggle('on', k <= i); });
      if (opts.onYear) opts.onYear(i);
    }

    // camera: keep the walker left of centre so the panel never covers it
    var cam = { x: 0, y: 0, z: 1 };
    function aim(pt, z) {
      var wide = svg.clientWidth > 860;
      var fx = wide ? .27 : .5, fy = .6;
      cam.z = z; cam.x = W * fx - pt.x * z; cam.y = H * fy - pt.y * z;
      world.setAttribute('transform', 'translate(' + cam.x.toFixed(1) + ' ' + cam.y.toFixed(1) + ') scale(' + z.toFixed(3) + ')');
    }
    function draw(len) { done.style.strokeDasharray = L; done.style.strokeDashoffset = Math.max(0, L - len); }

    var ST = null;
    function jumpTo(i) {
      if (ST) {
        var y = ST.start + (ST.end - ST.start) * (.08 + .84 * i / (STOPS.length - 1));
        if (window.lenis) window.lenis.scrollTo(y, { duration: 1.4 }); else window.scrollTo({ top: y, behavior: 'smooth' });
      }
      else { draw(at[i]); }
    }

    var wide = matchMedia('(min-width: 861px)').matches;
    if (opts.reduce || !wide || !window.gsap || !window.ScrollTrigger) {
      draw(L); set(STOPS.length - 1);
      if (wide) aim({ x: 760, y: 520 }, 1);
      else { // fit the route (with its labels) into the phone's frame
        var visW = H * svg.clientWidth / Math.max(1, svg.clientHeight);
        var z = Math.min(1, visW / 1250); cam.z = z;
        cam.x = W / 2 - 790 * z; cam.y = H / 2 - 470 * z;
        world.setAttribute('transform', 'translate(' + cam.x.toFixed(1) + ' ' + cam.y.toFixed(1) + ') scale(' + z.toFixed(3) + ')');
      }
      return { set: set };
    }

    draw(0); set(0); aim(STOPS[0], 1.25);
    ST = ScrollTrigger.create({
      trigger: svg.closest('.trail'), start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: function (self) {
        // hold briefly at each stop: progress → stop index + fraction
        var p = Math.min(1, Math.max(0, (self.progress - .08) / .84)) * (STOPS.length - 1);
        var i = Math.floor(p), f = p - i; if (i >= STOPS.length - 1) { i = STOPS.length - 1; f = 0; }
        var hold = .35, t = f < hold ? 0 : (f - hold) / (1 - hold);            // pause at a stop, then walk
        t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        var len = i < STOPS.length - 1 ? at[i] + (at[i + 1] - at[i]) * t : L;
        draw(len);
        var pt = done.getPointAtLength(len);
        aim(pt, 1.25);
        set(t > .5 && i < STOPS.length - 1 ? i + 1 : i);
      }
    });
    return { set: set };
  };
})();
