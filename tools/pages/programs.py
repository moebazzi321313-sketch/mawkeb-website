"""Programs: the landing page and the five program pages.
Facts come from the Mawkeb's planning documents and its photo archive. Anything not yet confirmed is
marked "to be confirmed" on the page rather than filled in."""
from shell import page, hero, gallery, pager

A = '/assets/media/archive/'
Y = '/assets/media/years/'

TEAMS_SHORT = '''<ul class="facts-list">
<li><b>Setup</b><span>Builds the hall before the night and breaks it down after.</span></li>
<li><b>Logistics</b><span>Flyers, the night's program, supplies and storage.</span></li>
<li><b>Latm</b><span>The latmiya, the reciters and the recording.</span></li>
<li><b>Madheef</b><span>Cooks and serves the food.</span></li>
<li><b>Security</b><span>Doors, parking and a safe hall.</span></li>
<li><b>Media</b><span>Cameras, lighting, sound, and the releases afterwards.</span></li>
<li><b>Sisters</b><span>Runs the sisters' side of the program.</span></li>
<li><b>Sales</b><span>The merchandise table.</span></li>
<li><b>Cleaning</b><span>Leaves the hall the way we found it.</span></li>
</ul>'''


def landing():
    body = hero('Our programs',
                'Five programs through the year, each set up, served and cleared away by the same nine volunteer teams.',
                [('/', 'Home'), ('/programs/', 'Programs')])
    body += '''<section class="sec"><div class="wrap">
<div class="progs" style="margin-top:0">
 <a class="prog" href="/programs/abna-al-batoul.html"><div><h3>Abna Al-Batoul</h3><span class="ar" lang="ar" dir="rtl">أبناء البتول</span></div>
  <div><p>An annual gathering in remembrance of Lady Fatima al-Zahra (AS): majalis, lectures and latm, with a new emblem and a recorded latmiya each year.</p><div class="tags"><span class="tag">Since 1445</span><span class="tag">Four years in the archive</span></div><span class="go">See the program</span></div>
  <div class="pic"><img loading="lazy" src="''' + A + '''1446-latm.jpg" alt="Abna Al-Batoul 1446: latm under the arch"></div></a>
 <a class="prog" href="/programs/layali-al-qadr.html"><div><h3>Layali Al-Qadr</h3><span class="ar" lang="ar" dir="rtl">ليالي القدر</span></div>
  <div><p>The Nights of Qadr: a nightly program, a dua schedule, a kids program, and meals for everyone attending.</p><div class="tags"><span class="tag tbc">Dates to be announced</span></div><span class="go">See the program</span></div></a>
 <a class="prog" href="/programs/year-round-activities.html"><div><h3>Year-Round Activities</h3></div>
  <div><p>Mawalid, commemorations of Imam Musa al-Kadhim (AS), community activities, Usul ad-Din lessons and campaigns with The Ashura Project.</p><div class="tags"><span class="tag">All year</span></div><span class="go">See the program</span></div></a>
 <a class="prog" href="/programs/madheef-sahib-al-zaman.html"><div><h3>Madheef Sahib Al-Zaman</h3><span class="ar" lang="ar" dir="rtl">مضيف صاحب الزمان</span></div>
  <div><p>The Mawkeb's kitchen and table. On every program night the Madheef team cooks and serves for everyone who comes.</p><div class="tags"><span class="tag">Open to sponsors</span></div><span class="go">See the program</span></div></a>
 <a class="prog" href="/programs/arbaeen.html"><div><h3>Arbaeen</h3><span class="ar" lang="ar" dir="rtl">الأربعين</span></div>
  <div><p>The Mawkeb's Arbaeen services and activities.</p><div class="tags"><span class="tag tbc">Details to be confirmed</span></div><span class="go">See the program</span></div></a>
</div></div></section>
<section class="sec canvas"><div class="wrap split">
 <h2>Every program, the same nine teams</h2>
 <div><p class="lead" style="margin-top:0">Whatever the program, the night is planned and run by the Mawkeb's nine volunteer teams, each with its own lead.</p>''' + TEAMS_SHORT + '''
 <p style="margin-top:24px"><a class="btn btn-green" href="/get-involved/volunteer.html">Volunteer with a team</a></p></div>
</div></section>
'''
    return page('Programs | Mawkeb Saheb al-Zaman',
                'Abna Al-Batoul, Layali Al-Qadr, Year-Round Activities, Madheef Sahib Al-Zaman and Arbaeen: the five programs of Mawkeb Saheb al-Zaman in Detroit.',
                body)


def abna():
    body = hero('Abna Al-Batoul',
                'An annual gathering in remembrance of Lady Fatima al-Zahra (AS). Majalis, lectures, khutbas and latm, with a new emblem and a recorded latmiya each year.',
                [('/', 'Home'), ('/programs/', 'Programs'), ('', 'Abna Al-Batoul')],
                img=A + '1446-latm.jpg', ar='أبناء البتول', img_pos='50% 35%', img_alt='',
                ctas='<a class="btn btn-green" href="/get-involved/volunteer.html?program=Abna%20Al-Batoul">Volunteer for Abna Al-Batoul</a><a class="btn btn-ghost" href="/get-involved/donate.html?fund=abna-al-batoul">Give to Abna Al-Batoul</a>')
    body += '''<section class="sec"><div class="wrap split">
 <h2>Remembrance, made together</h2>
 <div class="prose">
  <p>Al-Batoul is one of the titles of Lady Fatima al-Zahra (AS), and Abna Al-Batoul, "the sons of al-Batoul", is the Mawkeb's annual gathering in her remembrance.</p>
  <p>Each year has its own emblem, its own stage and its own latmiya. The nights bring together a majlis, a lecture or khutba, and latm, and the Madheef team serves food for everyone who comes.</p>
  <p>The archive below shows how each year was marked. It describes only what the photographs and recordings show.</p>
 </div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>What a night includes</h2>
 <ul class="facts-list">
  <li><b>The majlis</b><span>Remembrance and recitation, in a hall staged for that year.</span></li>
  <li><b>A lecture or khutba</b><span>A talk from the minbar; the archive has one in 1446 and khutbas in 1448.</span></li>
  <li><b>Latm</b><span>The gathering performs latm together to the year's latmiya.</span></li>
  <li><b>The Madheef</b><span>Food cooked and served by the Madheef team.</span></li>
  <li><b>The release</b><span>The latmiya is filmed and released on YouTube, SoundCloud and Instagram in the weeks after.</span></li>
 </ul>
</div></section>

<section class="sec" id="years"><div class="wrap">
 <h2>Year by year</h2>
 <p class="lead">Four years in the Mawkeb's archive, each with its emblem and photographs.</p>
 <nav class="years-nav" aria-label="Years"><a href="#y1445">1445</a><a href="#y1446">1446</a><a href="#y1447">1447</a><a href="#y1448">1448</a></nav>

 <article class="chapter" id="y1445" style="margin-top:40px">
  <div><div class="emb"><img src="''' + Y + '''1445.png" alt="Abna Al-Batoul 1445 emblem"></div><div class="yr">1445</div><div class="sub">The first year in our archive</div></div>
  <div><p>A hall with the name of Allah on every tile of the wall, red headbands and black shirts. Latm in the round, and a majlis that brought the room to tears.</p>
   ''' + gallery([(A + '1445-latm-wide.jpg', '1445: latm in the hall'), (A + '1445-latm-close.jpg', '1445: hands raised in front of the emblem'), (A + '1445-majlis.jpg', '1445: the majlis')]) + '''</div>
 </article>

 <article class="chapter" id="y1446">
  <div><div class="emb"><img src="''' + Y + '''1446.png" alt="Sons of Batoul 2 emblem"></div><div class="yr">1446</div><div class="sub">Sons of Batoul 2</div></div>
  <div><p>A stage built as an arch, with the emblem at its crown and on the back of every shirt. A lecture, a majlis and latm under red light.</p>
   ''' + gallery([(A + '1446-latm.jpg', '1446: latm under the arch'), (A + '1446-lecture.jpg', '1446: the lecture'), (A + '1446-majlis.jpg', '1446: the majlis')]) + '''</div>
 </article>

 <article class="chapter" id="y1447">
  <div><div class="emb"><img src="''' + Y + '''1447.png" alt="Abna Al-Batoul 1447 emblem"></div><div class="yr">1447</div><div class="sub">The year's latmiya, filmed and released</div></div>
  <div><p>A green stage, a full hall, and a latmiya produced as a reel with English subtitles.</p>
   <div class="reel-row"><video src="''' + A + '''1447-reel.mp4" poster="''' + A + '''1447-reel-poster.jpg" controls playsinline preload="none" aria-label="Abna Al-Batoul 1447 latmiya reel"></video>
   <p class="prose">The reel runs 1 minute 23 seconds and plays with sound. More from 1447 is on our <a class="text-link" data-social="highlight:abna-al-batoul">Instagram highlights</a>.</p></div></div>
 </article>

 <article class="chapter" id="y1448">
  <div><div class="emb"><img src="''' + Y + '''1448.png" alt="Sons of Batoul 4 emblem"></div><div class="yr">1448</div><div class="sub">Sons of Batoul 4, this year</div></div>
  <div><p>Black and white roses across the backdrop, the emblem in gold. Khutbas, majalis and latm, photographed night by night; some nights were photographed in black and white.</p>
   ''' + gallery([(A + '1448-majlis-2.jpg', '1448: the majlis'), (A + '1448-latm.jpg', '1448: latm'), (A + '1448-khutba.jpg', '1448: the khutba'),
                  (A + '1448-khutba-2.jpg', '1448: the khutba, another night'), (A + '1448-majlis.jpg', '1448: the majlis, in black and white'), (A + '1448-majlis-3.jpg', '1448: the full hall')]) + '''</div>
 </article>
</div></section>

<section class="sec on-ink"><div class="wrap split">
 <h2>Carried by volunteers</h2>
 <div><p class="lead" style="margin-top:0">Every night of Abna Al-Batoul is run by the Mawkeb's nine teams. Choose one and you'll be placed with its lead.</p>
 <p style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px"><a class="btn btn-green" href="/get-involved/volunteer.html?program=Abna%20Al-Batoul">Volunteer for Abna Al-Batoul</a><a class="btn btn-line" href="/get-involved/donate.html?fund=abna-al-batoul">Give to Abna Al-Batoul</a></p></div>
</div></section>
'''
    body += pager(('/programs/arbaeen.html', 'Arbaeen'), ('/programs/layali-al-qadr.html', 'Layali Al-Qadr'))
    return page('Abna Al-Batoul | Mawkeb Saheb al-Zaman',
                'Abna Al-Batoul is the Mawkeb\'s annual gathering in remembrance of Lady Fatima al-Zahra (AS): majalis, lectures and latm, 1445 to 1448.',
                body, og=A + '1446-latm.jpg')


def qadr():
    body = hero('Layali Al-Qadr',
                'The Nights of Qadr, in the last ten nights of Ramadan. A nightly program of dua and remembrance, a kids program, and a meal for everyone who comes.',
                [('/', 'Home'), ('/programs/', 'Programs'), ('', 'Layali Al-Qadr')], ar='ليالي القدر',
                ctas='<a class="btn btn-green" href="/get-involved/volunteer.html?program=Layali%20Al-Qadr">Volunteer for Layali Al-Qadr</a><a class="btn btn-ghost" href="/get-involved/donate.html?fund=layali-al-qadr">Give to Layali Al-Qadr</a>')
    body += '''<section class="sec"><div class="wrap split">
 <h2>The nights</h2>
 <div class="prose">
  <p>Laylat al-Qadr, the Night of Power, is sought on the nights of the 19th, 21st and 23rd of Ramadan. The Mawkeb opens its doors on these nights for worship, remembrance and a shared meal.</p>
  <span class="note">This year's dates, times and venue will be announced before Ramadan. <a class="text-link" href="/social/">Follow the Mawkeb</a> to hear first.</span>
 </div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>Each night includes</h2>
 <ul class="facts-list">
  <li><b>The nightly program</b><span>The order of the night, published in advance on a flyer.</span></li>
  <li><b>The dua schedule</b><span>Which supplications are read and when, also published for each night.</span></li>
  <li><b>A kids program</b><span>A program for children alongside the main gathering.</span></li>
  <li><b>A meal</b><span>Cooked and served by the Madheef team for everyone attending.</span></li>
 </ul>
</div></section>

<section class="sec"><div class="wrap split">
 <h2>Volunteering on Layali Al-Qadr</h2>
 <div><p class="lead" style="margin-top:0">The nights need every team: Setup to prepare the hall, the Madheef team for the meals, Security for doors and parking, the Sisters team for the sisters' side, Media for the cameras, and Cleaning after.</p>
 <p style="margin-top:24px"><a class="btn btn-green" href="/get-involved/volunteer.html?program=Layali%20Al-Qadr">Volunteer for Layali Al-Qadr</a></p></div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>Photos and past nights</h2>
 <p class="empty-media">Photos and videos from Layali Al-Qadr will be added here after the next program. Until then, see our <a class="text-link" data-social="highlight:layali-al-qadr">Instagram highlights</a>.</p>
</div></section>
'''
    body += pager(('/programs/abna-al-batoul.html', 'Abna Al-Batoul'), ('/programs/year-round-activities.html', 'Year-Round Activities'))
    return page('Layali Al-Qadr | Mawkeb Saheb al-Zaman',
                'Layali Al-Qadr at Mawkeb Saheb al-Zaman: a nightly program, a dua schedule, a kids program and meals on the Nights of Qadr.',
                body)


def yearround():
    body = hero('Year-Round Activities',
                'Between the major programs, the Mawkeb keeps the community together: mawalid, commemorations, lessons, community activities and campaigns.',
                [('/', 'Home'), ('/programs/', 'Programs'), ('', 'Year-Round Activities')],
                ctas='<a class="btn btn-green" href="/get-involved/volunteer.html?program=Year-Round%20Activities">Help with activities</a><a class="btn btn-ghost" href="/social/">See what\'s coming up</a>')
    body += '''<section class="sec"><div class="wrap">
 <h2>Through the year</h2>
 <ul class="facts-list">
  <li><b>Mawalid</b><span>Celebrations of the births of the Prophet and the Ahl al-Bayt (AS).</span></li>
  <li><b>Commemorations</b><span>Including the commemoration of Imam Musa al-Kadhim (AS).</span></li>
  <li><b>Lessons</b><span>Usul ad-Din lessons on the foundations of the faith.</span></li>
  <li><b>Community activities</b><span>Planned and run by the Mawkeb's Activities team, which has its own lead.</span></li>
  <li><b>The Ashura Project</b><span>Campaigns run with The Ashura Project.</span></li>
 </ul>
</div></section>

<section class="sec canvas"><div class="wrap split">
 <h2>Upcoming</h2>
 <div class="prose">
  <p>Upcoming activities are announced on our social media first, with the date, place and how to sign up.</p>
  <p class="platforms"><a data-social="instagram">Instagram <small></small></a><a data-social="youtube">YouTube <small></small></a></p>
 </div>
</div></section>

<section class="sec"><div class="wrap">
 <h2>Past activities</h2>
 <p class="empty-media">Photos from mawalid, commemorations and activities will be added here as each event happens. See our <a class="text-link" data-social="highlight:year-round">Instagram highlights</a> for the latest.</p>
</div></section>
'''
    body += pager(('/programs/layali-al-qadr.html', 'Layali Al-Qadr'), ('/programs/madheef-sahib-al-zaman.html', 'Madheef Sahib Al-Zaman'))
    return page('Year-Round Activities | Mawkeb Saheb al-Zaman',
                'Mawalid, commemorations of Imam Musa al-Kadhim (AS), Usul ad-Din lessons, community activities and The Ashura Project at Mawkeb Saheb al-Zaman.',
                body)


def madheef():
    body = hero('Madheef Sahib Al-Zaman',
                'The Mawkeb\'s kitchen and table. On every program night the Madheef team cooks and serves for everyone who attends, and anyone can sponsor a meal or bring food.',
                [('/', 'Home'), ('/programs/', 'Programs'), ('', 'Madheef Sahib Al-Zaman')], ar='مضيف صاحب الزمان',
                ctas='<a class="btn btn-green" href="/get-involved/sponsor-the-madheef.html">Sponsor the Madheef</a><a class="btn btn-ghost" href="/get-involved/volunteer.html?team=Madheef">Cook and serve with us</a>')
    body += '''<section class="sec"><div class="wrap split">
 <h2>Hospitality in the name of the Imam</h2>
 <div class="prose">
  <p>A madheef is a place of hospitality. Along the road to Karbala, mawakib feed every visitor freely, and the Mawkeb carries that tradition home: no one leaves a program night hungry.</p>
  <p>The Madheef team plans the food for each night, cooks, serves, and packs everything away again, with its own lead, plan and supplies.</p>
 </div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>Ways to contribute</h2>
 <div class="paths">
  <a class="path" href="/get-involved/sponsor-the-madheef.html#meal"><h3>Sponsor a meal</h3><p>Cover the food for a program night, or part of it. The Madheef team will tell you what a night needs.</p><span class="go">Sponsor a meal</span></a>
  <a class="path" href="/get-involved/sponsor-the-madheef.html#food"><h3>Contribute food</h3><p>Bring or send food for a night, arranged with the team so it fits the menu.</p><span class="go">Offer food</span></a>
  <a class="path" href="/get-involved/donate.html?fund=madheef"><h3>Give to the Madheef</h3><p>A gift of any amount toward the Madheef, once or monthly.</p><span class="go">Give to the Madheef</span></a>
  <a class="path" href="/get-involved/volunteer.html?team=Madheef"><h3>Volunteer in the kitchen</h3><p>Cook, serve and clear with the Madheef team on program nights.</p><span class="go">Join the Madheef team</span></a>
 </div>
 <p class="note">Meal costs and quantities depend on the night and are set with the Madheef team for each program, so there are no fixed packages here.</p>
</div></section>

<section class="sec"><div class="wrap">
 <h2>Photos from the Madheef</h2>
 <p class="empty-media">Photos of the Madheef will be added here after the next program. See our <a class="text-link" data-social="highlight:madheef">Instagram highlights</a> in the meantime.</p>
</div></section>
'''
    body += pager(('/programs/year-round-activities.html', 'Year-Round Activities'), ('/programs/arbaeen.html', 'Arbaeen'))
    return page('Madheef Sahib Al-Zaman | Mawkeb Saheb al-Zaman',
                'The Madheef is the Mawkeb\'s kitchen and table. Sponsor a meal, contribute food, give to the Madheef or volunteer in the kitchen.',
                body)


def arbaeen():
    body = hero('Arbaeen',
                'Arbaeen marks forty days after the martyrdom of Imam Husayn (AS). Millions walk to Karbala, and the mawakib along the road serve them.',
                [('/', 'Home'), ('/programs/', 'Programs'), ('', 'Arbaeen')], ar='الأربعين',
                ctas='<a class="btn btn-green" href="/get-involved/volunteer.html?program=Arbaeen">Volunteer for Arbaeen</a><a class="btn btn-ghost" href="/get-involved/donate.html?fund=arbaeen">Give to Arbaeen</a>')
    body += '''<section class="sec"><div class="wrap split">
 <h2>The Mawkeb's Arbaeen</h2>
 <div class="prose">
  <p>The word mawkeb is best known from Arbaeen, when mawakib line the road to Karbala to feed and shelter the visitors of Imam Husayn (AS). That spirit of service runs through everything the Mawkeb does.</p>
  <span class="note">The Mawkeb's Arbaeen services and activities, and photos from previous years, are being gathered and will be published here once confirmed.</span>
 </div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>Photos and videos</h2>
 <p class="empty-media">Photos and videos from Arbaeen will appear here. See our <a class="text-link" data-social="highlight:arbaeen">Instagram highlights</a> for what has been shared so far.</p>
</div></section>
'''
    body += pager(('/programs/madheef-sahib-al-zaman.html', 'Madheef Sahib Al-Zaman'), ('/programs/abna-al-batoul.html', 'Abna Al-Batoul'))
    return page('Arbaeen | Mawkeb Saheb al-Zaman',
                'Arbaeen at Mawkeb Saheb al-Zaman: services, activities and how to take part.',
                body)


PAGES = {
    'programs/index.html': landing,
    'programs/abna-al-batoul.html': abna,
    'programs/layali-al-qadr.html': qadr,
    'programs/year-round-activities.html': yearround,
    'programs/madheef-sahib-al-zaman.html': madheef,
    'programs/arbaeen.html': arbaeen,
}
