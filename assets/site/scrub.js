/* The latm footage behind the homepage hero, playing on a loop.
   Source: Crane.mp4, 00:18:15.03 → 00:18:16.13, cropped to the crowd only: one chest → raised → chest
   cycle, 33 frames at 30 fps. The cycle starts and ends at the chest, so it loops without a jump.

   LatmLoop(canvas, { fps, focusY }) → { setEnabled(on), isEnabled(), reduced }
   - It plays at about half the filmed speed (14 fps, one cycle every 2.4 s) and blends each frame into the
     next, so the slower motion stays smooth. Each tick is at most two drawImage calls of <img> frames
     (no ImageBitmaps: see the note at the loader). A longer clip needs the original Crane.mp4.
   - It only runs while the hero is on screen and the tab is visible.
   - Reduced motion: shows the still at the top of the movement until someone presses Play. */
(function () {
  var COUNT = 33, PEAK = 15, BASE = (window.MAWKEB_BASE || '/') + 'assets/media/latm/f';
  function pad(n) { return ('00' + n).slice(-3); }

  window.LatmLoop = function (canvas, opts) {
    opts = opts || {};
    var fps = opts.fps || 28, focusY = opts.focusY == null ? .5 : opts.focusY;
    var ctx = canvas.getContext('2d', { alpha: false });
    var frames = new Array(COUNT);           // loaded <img> elements
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var enabled = !reduce, visible = true, raf = 0, shown = null, startAt = 0, offset = PEAK;

    function ready(f) { return f && (f.width || f.naturalWidth); }
    function near(i) {
      var f = frames[i];
      for (var k = 1; k < COUNT && !ready(f); k++) f = frames[(i + k) % COUNT];
      return ready(f) ? f : null;
    }
    function put(f) {
      var cw = canvas.width, ch = canvas.height, iw = f.naturalWidth || f.width, ih = f.naturalHeight || f.height;
      var s = Math.max(cw / iw, ch / ih), w = iw * s, h = ih * s;
      ctx.drawImage(f, (cw - w) / 2, (ch - h) * focusY, w, h);
    }
    // draw position p (frames, may be fractional): frame floor(p), with the next frame blended in by the
    // fraction, so the footage stays smooth even when played slower than it was filmed
    function draw(p) {
      var i = Math.floor(p) % COUNT, t = p - Math.floor(p);
      var a = near(i), b = t > .02 ? near((i + 1) % COUNT) : null;
      if (!a) return;
      var key = i + ':' + (b && b !== a ? Math.round(t * 20) : 0);
      if (key === shown) return;
      shown = key;
      ctx.globalAlpha = 1; put(a);
      if (b && b !== a) { ctx.globalAlpha = t; put(b); ctx.globalAlpha = 1; }
    }
    function size() {
      // the frames are 1600px wide, so drawing above 1.25x only costs time
      var r = canvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 1.25);
      var w = Math.round(r.width * d), h = Math.round(r.height * d);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w; canvas.height = h; shown = null;
      draw(enabled ? current() : PEAK);
    }
    function current(t) { return (offset + ((t || performance.now()) - startAt) * fps / 1000) % COUNT; }
    function loop(t) {
      raf = 0;
      if (!enabled || !visible || document.hidden) return;
      draw(current(t));
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && enabled && visible && !document.hidden) { startAt = performance.now(); raf = requestAnimationFrame(loop); } }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; offset = current(); }

    // load the peak first so a strong still appears immediately
    var order = [PEAK]; for (var i = 0; i < COUNT; i++) if (i !== PEAK) order.push(i);
    order.forEach(function (i) {
      var img = new Image(); img.decoding = 'async';
      // plain <img> frames: the browser keeps their decoded pixels in a cache it can free under memory
      // pressure. Holding 33 ImageBitmaps instead pinned ~190 MB and could crash the tab.
      img.onload = function () { frames[i] = img; if (i === PEAK) draw(PEAK); };
      img.src = BASE + pad(i + 1) + '.jpg';
    });

    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting; if (visible) start(); else stop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(canvas); else addEventListener('resize', size);
    size(); start();

    return {
      setEnabled: function (on) { enabled = on; if (on) start(); else stop(); },
      isEnabled: function () { return enabled; },
      reduced: reduce
    };
  };
})();
