"""Store, Social media, About, Contact, Questions and Privacy."""
from shell import page, hero, gallery

A = '/assets/media/archive/'
Y = '/assets/media/years/'
HONEYPOT = '<div class="sr" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div>'


def store():
    body = hero('Store',
                'Mawkeb merchandise, with every sale supporting the programs. The online store is being set up; the listings below are samples.',
                [('/', 'Home'), ('/store/', 'Store')])
    body += '''<section class="sec"><div class="wrap">
 <div class="shop-bar"><p class="note" style="margin:0;max-width:640px">These are sample listings to show how the store will work. They are not on sale yet, and prices will be set by the Sales team.</p>
  <button class="btn btn-line cart-btn" type="button" id="cart-open" aria-haspopup="dialog">Cart <b id="cart-count">0</b></button></div>
 <div class="products" id="products"></div>
</div></section>
<div class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-h"><div class="scrim"></div><aside>
 <header><h2 id="cart-h">Your cart</h2><button class="x" type="button" aria-label="Close cart">&times;</button></header>
 <div class="items"></div>
 <footer><div class="total"><span>Total</span><span></span></div><button class="btn btn-green" type="button" id="checkout">Check out</button><p id="checkout-status" class="privacy" role="status"></p></footer>
</aside></div>
'''
    return page('Store | Mawkeb Saheb al-Zaman', 'Mawkeb Saheb al-Zaman merchandise.', body,
                scripts='<script src="/assets/site/store.js"></script>\n')


def social():
    hl = [('abna-al-batoul', 'Abna Al-Batoul', A + '1448-latm.jpg'), ('layali-al-qadr', 'Layali Al-Qadr', None),
          ('year-round', 'Year-Round Activities', None), ('madheef', 'Madheef Sahib Al-Zaman', None), ('arbaeen', 'Arbaeen', None)]
    tiles = ''.join('<a class="path" data-social="highlight:%s" style="padding:0;overflow:hidden">%s<div style="padding:18px 20px"><h3 style="font-size:19px">%s</h3><span class="go">Open the highlight</span></div></a>'
                    % (k, ('<img src="%s" alt="" loading="lazy" style="width:100%%;aspect-ratio:16/9;object-fit:cover">' % img) if img else '<div style="aspect-ratio:16/9;background:var(--ink);display:grid;place-items:center;color:var(--on-ink-2);font-size:13px">Highlight cover to come</div>', n)
                    for k, n, img in hl)
    body = hero('Social media',
                'Follow the Mawkeb for program dates, photos from each night, and every latmiya release.',
                [('/', 'Home'), ('/social/', 'Social media')],
                ctas='<a class="btn btn-green" data-social="instagram">Instagram</a><a class="btn btn-ghost" data-social="youtube">YouTube</a><a class="btn btn-ghost" data-social="soundcloud">SoundCloud</a>')
    body += '''<section class="sec"><div class="wrap">
 <h2>Our accounts</h2>
 <ul class="facts-list">
  <li><b>Instagram</b><span>Announcements, photos from each night, reels, and highlights for every program. <a class="text-link" data-social="instagram">Follow on Instagram</a></span></li>
  <li><b>YouTube</b><span>The full video of each latmiya, released eight days after the night. <a class="text-link" data-social="youtube">Subscribe on YouTube</a></span></li>
  <li><b>SoundCloud</b><span>The audio of each latmiya, fifteen days after the night. <a class="text-link" data-social="soundcloud">Listen on SoundCloud</a></span></li>
 </ul>
 <p class="note" id="accounts-note">Only accounts listed on this page are official Mawkeb accounts.</p>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>Highlights by program</h2>
 <div class="paths" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">''' + tiles + '''</div>
</div></section>

<section class="sec"><div class="wrap">
 <h2>Latest from our gatherings</h2>
 <p class="lead">Abna Al-Batoul 1448, Sons of Batoul 4.</p>
 ''' + gallery([(A + '1448-majlis-2.jpg', '1448: the majlis'), (A + '1448-latm.jpg', '1448: latm'), (A + '1448-khutba.jpg', '1448: the khutba'),
                (A + '1448-khutba-2.jpg', '1448: the khutba, another night'), (A + '1448-majlis.jpg', '1448: the majlis, in black and white'), (A + '1448-majlis-3.jpg', '1448: the full hall')]) + '''
 <div class="reel-row" style="margin-top:48px"><video src="''' + A + '''1447-reel.mp4" poster="''' + A + '''1447-reel-poster.jpg" controls playsinline preload="none" aria-label="Abna Al-Batoul 1447 latmiya reel"></video>
  <div><h3 style="font-size:24px;letter-spacing:-.02em">The 1447 latmiya</h3><p class="lead" style="margin-top:8px">Released as a reel with English subtitles. Every latmiya follows the same release order:</p>
   <ol class="release"><li><b>Day 8</b><span>The full video on YouTube, with the first reel.</span></li><li><b>Day 11</b><span>The second reel.</span></li><li><b>Day 15</b><span>The third reel, SoundCloud and Instagram Music.</span></li></ol></div></div>
</div></section>

<section class="sec canvas"><div class="wrap split">
 <h2>Share the Mawkeb</h2>
 <div><p class="lead" style="margin-top:0">Know someone who should come to the next program? Send them this site.</p>
  <p style="margin-top:20px;display:flex;flex-wrap:wrap;gap:12px"><button class="btn btn-green" type="button" id="share">Share</button><button class="btn btn-line" type="button" id="copy">Copy the link</button></p><p class="privacy" id="share-status" role="status"></p></div>
</div></section>
'''
    script = '''<script>
(function(){
  var url = window.MAWKEB_BASE || (location.origin + '/'), st = document.getElementById('share-status');
  document.getElementById('share').addEventListener('click', function(){
    if (navigator.share) navigator.share({ title:'Mawkeb Saheb al-Zaman', text:'A Shia community in the Detroit area.', url:url }).catch(function(){});
    else { navigator.clipboard && navigator.clipboard.writeText(url); st.textContent = 'Link copied.'; }
  });
  document.getElementById('copy').addEventListener('click', function(){ navigator.clipboard && navigator.clipboard.writeText(url); st.textContent = 'Link copied.'; });
})();
</script>
'''
    return page('Social media | Mawkeb Saheb al-Zaman',
                'Follow Mawkeb Saheb al-Zaman on Instagram, YouTube and SoundCloud: program dates, photos and every latmiya release.', body, scripts=script)


def about():
    body = hero('About the Mawkeb',
                'Mawkeb Saheb al-Zaman, also known as Themawkeb or simply the Mawkeb, is a Shia community organisation in the Detroit area.',
                [('/', 'Home'), ('', 'About')], img=A + '1448-majlis-3.jpg', img_pos='50% 40%')
    body += '''<section class="sec"><div class="wrap split">
 <h2>Faith, learning and service</h2>
 <div class="prose">
  <p>We gather in remembrance of Ahl al-Bayt (AS), learn together, and give our time to serving our community.</p>
  <p>Our work includes Abna Al-Batoul in remembrance of Lady Fatima al-Zahra (AS), Layali Al-Qadr, the Madheef, a year-round Activities unit, lessons, and campaigns with The Ashura Project.</p>
  <p>Saheb al-Zaman, the Master of the Age, is a title of the twelfth Imam, al-Mahdi (AJ). The Mawkeb carries his name.</p>
 </div>
</div></section>

<section class="sec canvas"><div class="wrap">
 <h2>How the Mawkeb is run</h2>
 <p class="lead">Every program is planned by nine volunteer teams, each with its own lead, plan and checklist, from the first meeting to the last box packed into storage.</p>
 <ul class="facts-list">
  <li><b>Setup</b><span>Builds the hall before the night and breaks it down after.</span></li>
  <li><b>Logistics</b><span>Flyers, the night's program, supplies and the storage room.</span></li>
  <li><b>Latm</b><span>The latmiya, the reciters and the recording.</span></li>
  <li><b>Madheef</b><span>Cooks and serves the food for everyone who attends.</span></li>
  <li><b>Security</b><span>Doors, parking and a safe hall.</span></li>
  <li><b>Media</b><span>Cameras, lighting and sound, and the releases afterwards.</span></li>
  <li><b>Sisters</b><span>Runs the sisters' side of the program.</span></li>
  <li><b>Sales</b><span>The Mawkeb's merchandise table.</span></li>
  <li><b>Cleaning</b><span>Leaves the hall the way we found it.</span></li>
 </ul>
 <p style="margin-top:20px">The Activities team runs the Mawkeb's year-round activities, with its own lead.</p>
</div></section>

<section class="sec"><div class="wrap split">
 <h2>Our story so far</h2>
 <div class="prose">
  <p>The Mawkeb's archive of Abna Al-Batoul begins in 1445, and each year since has had its own emblem, stage and latmiya. You can walk the four years on the <a class="text-link" href="/#trail">homepage trail</a> or read them on the <a class="text-link" href="/programs/abna-al-batoul.html">Abna Al-Batoul page</a>.</p>
  <p style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px"><a class="btn btn-green" href="/get-involved/">Get involved</a><a class="btn btn-line" href="/contact.html">Contact us</a></p>
 </div>
</div></section>
'''
    return page('About | Mawkeb Saheb al-Zaman',
                'Mawkeb Saheb al-Zaman is a Shia community organisation in the Detroit area, built on faith, learning and service, and run by nine volunteer teams.',
                body, og=A + '1448-majlis-3.jpg')


def contact():
    topics = ['General question', 'Abna Al-Batoul', 'Layali Al-Qadr', 'Year-Round Activities and lessons', 'The Ashura Project', 'Volunteering', 'Donations', 'The Madheef', 'Partnerships', 'The website']
    body = hero('Contact us',
                'A question, an idea, or a way you would like to help: send us a message and the right person will reply.',
                [('/', 'Home'), ('', 'Contact')])
    body += '''<section class="sec"><div class="wrap give-box">
 <form class="form" data-form="contact" data-subject="Website message" data-done-title="Thank you, your message has been sent." data-done="Someone from the Mawkeb will reply by email." novalidate>
  ''' + HONEYPOT + '''
  <div class="two">
   <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" autocomplete="name" required><span class="err">Please enter your name.</span></div>
   <div class="field"><label for="c-email">Email address</label><input id="c-email" name="email" type="email" autocomplete="email" required><span class="err">Please enter an email address like name@example.com.</span></div>
  </div>
  <div class="field"><label for="c-topic">What is it about?</label><select id="c-topic" name="topic">''' + ''.join('<option>%s</option>' % t for t in topics) + '''</select></div>
  <div class="field"><label for="c-msg">Your message</label><textarea id="c-msg" name="message" required></textarea><span class="err">Please write a message.</span></div>
  <p class="privacy">Your message goes only to the Mawkeb team. <a class="text-link" href="/privacy.html">Privacy</a></p>
  <div class="actions"><button class="btn btn-green" type="submit">Send message</button></div>
  <p class="form-status" role="status"></p>
 </form>
 <div>
  <div class="side-card"><h3>Where we are</h3><p>Detroit area, Michigan. Each program's venue is announced before the night; the Sayyida Fatima program in September 2026 was at the Taha Building.</p></div>
  <div class="side-card"><h3>Email</h3><p data-contact-email>The team's public email address is being confirmed.</p></div>
  <div class="side-card"><h3>Social media</h3><p class="platforms" style="margin-top:8px"><a data-social="instagram">Instagram <small></small></a></p></div>
 </div>
</div></section>
'''
    return page('Contact | Mawkeb Saheb al-Zaman', 'Contact Mawkeb Saheb al-Zaman in the Detroit area.', body)


def faq():
    qa = [
        ('Who can come to a program?', 'Everyone. Programs are open to the community; the sisters\' side is run by the Sisters team.'),
        ('Where are programs held?', 'It depends on the program. The Sayyida Fatima program in September 2026 was at the Taha Building. Each program\'s venue is announced on our social media before the night.'),
        ('How do I hear about the next program?', 'Follow the Mawkeb on <a class="text-link" href="/social/">social media</a>. Dates, times and flyers are posted there first.'),
        ('How can I volunteer?', 'Fill in the <a class="text-link" href="/get-involved/volunteer.html">volunteer form</a> and choose a team. Every team has a lead, and new volunteers work alongside people who have done it before.'),
        ('What is the difference between volunteering and membership?', 'Membership registers you with the Mawkeb so we know who we serve; volunteering puts you on a team for program nights. Many people do both.'),
        ('How do I donate?', 'On the <a class="text-link" href="/get-involved/donate.html">donate page</a> you can choose a program to support, once or monthly. Payment happens on our payment provider\'s secure page.'),
        ('Can I give by Zelle?', 'Yes, once the Mawkeb\'s Zelle details are published on the donate page. Only send to the details shown there; Zelle gifts are confirmed by hand.'),
        ('How do I sponsor a meal at the Madheef?', 'Use the <a class="text-link" href="/get-involved/sponsor-the-madheef.html">sponsor the Madheef</a> form. The Madheef team will contact you with what the night needs.'),
        ('When does a latmiya come out after the night?', 'The full video is released about eight days after the night, followed by reels on day 11 and day 15, with the audio on SoundCloud and Instagram Music on day 15.'),
        ('Can I use photos from this website?', 'Please ask first through the <a class="text-link" href="/contact.html">contact form</a>.'),
    ]
    body = hero('Questions people ask', 'If your question is not here, send it to us and we will answer.', [('/', 'Home'), ('', 'Questions')])
    body += '<section class="sec"><div class="wrap"><div class="faq-list" style="margin-top:0">' + ''.join(
        '<details><summary>%s</summary><p>%s</p></details>' % x for x in qa) + '</div><p style="margin-top:24px"><a class="btn btn-green" href="/contact.html">Ask a question</a></p></div></section>\n'
    return page('Questions | Mawkeb Saheb al-Zaman', 'Answers to common questions about Mawkeb Saheb al-Zaman programs, volunteering, membership and giving.', body)


def privacy():
    body = hero('Privacy', 'How the Mawkeb looks after what you send through this website.', [('/', 'Home'), ('', 'Privacy')])
    body += '''<section class="sec"><div class="wrap"><div class="prose">
 <p class="note" style="margin-top:0">This notice is a draft for the Mawkeb to review before the site goes live.</p>
 <h3>What we collect</h3><p>Only what you type into a form: for example your name, email, phone number and how you would like to help. The site does not use advertising trackers.</p>
 <h3>Why</h3><p>To organise volunteers, sponsors and members, and to answer your messages. Nothing else.</p>
 <h3>Who sees it</h3><p>Only the Mawkeb team members responsible for that area. We never sell or share your details.</p>
 <h3>Payments</h3><p>Donations and store payments are handled by our payment provider on their own secure page. Your card details never reach this website.</p>
 <h3>Your choices</h3><p>You can ask us to show you, correct or delete what you have sent at any time through the <a class="text-link" href="/contact.html">contact form</a>.</p>
 <h3>Photos</h3><p>Photos on this site are from Mawkeb programs. If you appear in one and would like it removed, let us know and we will take it down.</p>
</div></div></section>
'''
    return page('Privacy | Mawkeb Saheb al-Zaman', 'How Mawkeb Saheb al-Zaman handles information sent through its website.', body)


PAGES = {
    'store/index.html': store,
    'social/index.html': social,
    'about.html': about,
    'contact.html': contact,
    'faq.html': faq,
    'privacy.html': privacy,
}
