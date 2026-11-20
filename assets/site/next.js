/* The next program card, the latmiyat player and the Zelle copy button (homepage).
   PROGRAMS: add the next program at the TOP of this list. The card shows the next upcoming one;
   if none is upcoming it shows the most recent one and points people to Instagram.
   date: "YYYY-MM-DD", time: "HH:MM" (24h, Detroit time). */
var PROGRAMS = [
  {
    title: "Sons of Al-Batoul 4",
    series: "Fatimiyya",
    description: "Lecture, majlis and latmiya commemorating the martyrdom of Lady Fatima (a).",
    date: "2026-10-23",
    time: "20:00",
    venue: "Taha Foundation Community Center",
    address: "7506 Inkster Rd, Dearborn Heights, MI 48127",
    who: "Open for brothers & sisters · Food served in honor of Sayeda Fatima (a)"
  }
];

(function () {
  var INSTAGRAM = ((window.MAWKEB || {}).social || {}).instagram || "https://www.instagram.com/themawkeb/";
  function $(s) { return document.querySelector(s); }

  /* ---------- next / latest program ---------- */
  (function renderProgram() {
    if (!$("#next")) return;
    var now = new Date();
    var list = PROGRAMS.map(function (p) { var o = Object.assign({}, p); o.start = new Date(p.date + "T" + p.time + ":00"); return o; })
      .sort(function (a, b) { return a.start - b.start; });
    // a program counts as upcoming until 4 hours after it starts
    var upcoming = list.find(function (p) { return p.start.getTime() + 4 * 3600e3 > now.getTime(); });
    var p = upcoming || list[list.length - 1];
    if (!p) return;

    var d = p.start;
    var maps = "https://maps.google.com/?q=" + encodeURIComponent(p.address);
    $("#dt-month").textContent = d.toLocaleString("en-US", { month: "short" });
    $("#dt-day").textContent = d.getDate();
    $("#dt-wday").textContent = d.toLocaleString("en-US", { weekday: "short" });
    $("#next-title").textContent = p.title.replace(/-/g, "‑"); // keep "Al-Batoul" on one line
    $("#next-series").textContent = p.series;
    $("#next-desc").textContent = p.description;
    $("#next-when").textContent = d.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
    $("#next-where").textContent = p.venue + ", " + p.address;
    $("#next-who").textContent = p.who;

    var primary = $("#next-primary"), secondary = $("#next-secondary"), note = $("#next-note");
    if (upcoming) {
      var days = Math.round((new Date(p.date + "T00:00:00") - new Date(now.toDateString())) / 864e5);
      $("#next-status").classList.add("upcoming");
      $("#next-status-text").textContent = days <= 0 ? "Tonight" : days === 1 ? "Tomorrow" : "Next program · in " + days + " days";
      primary.href = maps;
      primary.querySelector("span").textContent = "Get directions";
      primary.querySelector("use").setAttribute("href", "#i-pin");
      secondary.removeAttribute("target");
      secondary.href = "#";
      secondary.querySelector("span").textContent = "Add to calendar";
      secondary.querySelector("use").setAttribute("href", "#i-cal");
      secondary.addEventListener("click", function (e) { e.preventDefault(); downloadICS(p); });
    } else {
      $("#next-status-text").textContent = "Latest program";
      note.hidden = false;
      note.textContent = "The next program's date is announced on Instagram first. Follow @themawkeb so you don't miss it.";
      primary.href = INSTAGRAM;
      secondary.href = maps;
    }
  })();

  function downloadICS(p) {
    function pad(n) { return String(n).padStart(2, "0"); }
    function fmt(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z"; }
    var end = new Date(p.start.getTime() + 2.5 * 3600e3);
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mawkeb Saheb al-Zaman//EN", "BEGIN:VEVENT",
      "UID:" + p.date + "-" + p.title.replace(/\W+/g, "") + "@themawkeb", "DTSTAMP:" + fmt(new Date()),
      "DTSTART:" + fmt(p.start), "DTEND:" + fmt(end),
      "SUMMARY:" + p.title + " | Mawkeb Saheb al-Zaman", "LOCATION:" + p.venue + "\\, " + p.address.replace(/,/g, "\\,"),
      "DESCRIPTION:" + p.description, "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "mawkeb-program.ics";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- latmiyat player: the video loads only when someone presses play ---------- */
  var player = $("#player");
  if (player) {
    var current = document.querySelector('.track[aria-pressed="true"]');
    var playVideo = function (id) {
      player.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + current.dataset.title +
        '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    };
    var selectTrack = function (btn, autoplay) {
      document.querySelectorAll(".track").forEach(function (t) { t.setAttribute("aria-pressed", String(t === btn)); });
      current = btn;
      $("#now-ar").textContent = btn.dataset.ar;
      $("#now-title").textContent = btn.dataset.title;
      $("#now-by").textContent = btn.dataset.by;
      $("#now-yt").href = "https://www.youtube.com/watch?v=" + btn.dataset.id;
      if (autoplay) { playVideo(btn.dataset.id); return; }
      player.innerHTML = '<button class="player-poster" type="button" aria-label="Play ' + btn.dataset.title + '"><img src="' + btn.dataset.img +
        '" alt=""><span class="play-btn" aria-hidden="true"><svg class="ic"><use href="#i-play"/></svg></span></button>';
      player.querySelector(".player-poster").addEventListener("click", function () { playVideo(btn.dataset.id); });
    };
    $("#player-poster").addEventListener("click", function () { playVideo(current.dataset.id); });
    document.querySelectorAll(".track").forEach(function (t) {
      t.addEventListener("click", function () {
        selectTrack(t, player.querySelector("iframe") !== null);
        if (innerWidth < 860) player.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  /* ---------- copy the Zelle email ---------- */
  var copy = $("#zelle-copy");
  if (copy) copy.addEventListener("click", function () {
    var done = function (t) { copy.textContent = t; setTimeout(function () { copy.textContent = "Copy email"; }, 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(copy.dataset.copy).then(function () { done("Copied"); }, function () { done("Press and hold the email to copy"); });
    else done("Press and hold the email to copy");
  });
})();
