/* Scroll-scrubbed latm footage.
   Source: Crane.mp4, 00:18:15.03 → 00:18:16.13, cropped to the crowd only (no banner, screens or stage):
   one chest → raised → chest cycle, 33 frames at 30 fps, chosen by measuring every cycle in the 23-minute video.
   The cycle starts and ends at the chest, so repeating it while scrolling has no jump.

   LatmScrub(canvas, { progress: fn() -> number })
     progress() returns how many cycles have elapsed (any real number; the fractional part picks the frame).
   Reduced motion: shows the still at the top of the movement and never scrubs. */
(function () {
  var COUNT = 33, PEAK = 15, BASE = (window.MAWKEB_BASE || '/') + 'assets/media/latm/f';
  function pad(n) { return ('00' + n).slice(-3); }

  window.LatmScrub = function (canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var frames = new Array(COUNT), loaded = 0;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var enabled = !reduce, current = PEAK, target = PEAK, raf = 0;
    var focusY = opts.focusY == null ? 0.55 : opts.focusY;

    function size() {
      var r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
      draw(Math.round(current));
    }
    function draw(i) {
      var img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) {
        for (var k = 1; k < COUNT; k++) { // nearest loaded frame
          var a = frames[(i + k) % COUNT]; if (a && a.complete && a.naturalWidth) { img = a; break; }
        }
        if (!img) return;
      }
      var cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
      var s = Math.max(cw / iw, ch / ih), w = iw * s, h = ih * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) * focusY, w, h);
    }
    function compute() {
      if (!enabled) { target = PEAK; return; }
      var c = opts.progress ? opts.progress() : window.scrollY / 700;
      var f = c - Math.floor(c);
      target = f * (COUNT - 1);
    }
    function tick() {
      raf = 0;
      // ease toward the target, taking the short way round the loop
      var d = target - current;
      if (d > COUNT / 2) d -= COUNT; if (d < -COUNT / 2) d += COUNT;
      current += d * 0.35;
      current = (current + COUNT) % COUNT;
      draw(Math.round(current) % COUNT);
      if (Math.abs(d) > 0.3) raf = requestAnimationFrame(tick);
    }
    function onScroll() { compute(); if (!raf) raf = requestAnimationFrame(tick); }

    // load the peak first so something meaningful appears immediately
    var order = [PEAK]; for (var i = 0; i < COUNT; i++) if (i !== PEAK) order.push(i);
    order.forEach(function (i) {
      var img = new Image(); img.decoding = 'async';
      img.onload = function () { loaded++; if (i === PEAK || Math.round(current) === i) draw(Math.round(current)); };
      img.src = BASE + pad(i + 1) + '.jpg'; frames[i] = img;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(canvas);
    else window.addEventListener('resize', size);
    size(); compute(); current = target; draw(Math.round(current));

    return {
      setEnabled: function (on) { enabled = on; onScroll(); },
      isEnabled: function () { return enabled; },
      reduced: reduce,
      refresh: onScroll
    };
  };

  /* Wire a "Motion: on/off" button to a scrubber */
  window.LatmToggle = function (btn, scrub) {
    function label() { btn.textContent = scrub.isEnabled() ? 'Pause motion' : 'Play motion'; btn.setAttribute('aria-pressed', String(!scrub.isEnabled())); }
    btn.addEventListener('click', function () { scrub.setEnabled(!scrub.isEnabled()); label(); });
    label();
  };
})();
