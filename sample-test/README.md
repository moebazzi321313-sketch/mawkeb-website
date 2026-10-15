# Temporary Mawkeb motion sample

Open `index.html` directly in Chrome or Edge and click **Play sample**. Drag the timeline to inspect any frame. Delete this entire `sample-test` folder when finished; the main website is untouched.

20 seconds, 1920×1080, 120 BPM reference grid. This photo-based sample uses copies of the existing official logo, Ashura group photo, and real website screenshots. All repeated imagery is a crop of the same supplied photo. No generated footage, invented impact numbers, or soundtrack is included.

`await window.seek(seconds)` renders any time independently of earlier frames and awaits image decoding. `?render=1` hides controls and fixes the viewport at 1920×1080 for capture. Only the optional playback transport uses requestAnimationFrame; scene rendering has no CSS animations, timers, or accumulated frame state.

This is an interactive silent HTML sample, not an exported motion-blurred video. Song analysis, JPEG video sequences, sound effects, audio mastering, and video encoding require the corresponding media and rendering tools.
