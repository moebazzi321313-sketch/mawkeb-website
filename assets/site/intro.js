/* Intro: the Mawkeb's logo animation (mawkeb-intro-color-left-to-right_1.mp4, 3 s), on every page load.
   The <head> script adds html.intro-on before first paint (skipped only with ?y= or ?nointro= for reviews),
   so nothing of the page shows before the intro. It is a plain video in a fixed overlay, faded out with
   opacity only. If the video can't start within 4 s (very slow network, autoplay blocked), the page shows. */
(function () {
  var root = document.documentElement, box = document.getElementById('intro');
  if (!box) return;
  if (!root.classList.contains('intro-on')) { box.remove(); return; }

  var v = document.getElementById('intro-video'), done = false;
  function end() {
    if (done) return; done = true;
    root.classList.remove('intro-on');
    box.classList.add('out');
    setTimeout(function () { box.remove(); }, 650);
    removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') end(); }

  box.querySelector('.intro-skip').addEventListener('click', end);
  addEventListener('keydown', onKey);
  v.addEventListener('ended', end);
  v.addEventListener('error', end);
  var slow = setTimeout(end, 4000);
  function started() { clearTimeout(slow); setTimeout(end, 4500); }
  if (!v.paused && v.currentTime > 0) started(); else v.addEventListener('playing', started, { once: true });
  var p = v.play();
  if (p && p.catch) p.catch(end);
})();
