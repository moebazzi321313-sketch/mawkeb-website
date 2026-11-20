"""Get Involved: the landing page and the four pathways (donate, membership, volunteer, sponsor the Madheef)."""
from shell import page, hero

PRIVACY = ('<p class="privacy">Your answers go only to the Mawkeb team members who organise volunteers and sponsors. '
           'They are not shared, sold or used for anything else, and you can ask for them to be deleted at any time. '
           '<a class="text-link" href="/privacy.html">Privacy</a></p>')
HONEYPOT = '<div class="sr" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off"></label></div>'


def landing():
    body = hero('Get involved',
                'Give, join, volunteer or sponsor a meal. Every program night is made by people from this community.',
                [('/', 'Home'), ('/get-involved/', 'Get involved')])
    body += '''<section class="sec"><div class="wrap">
 <div class="paths" style="margin-top:0">
  <a class="path" href="/get-involved/donate.html"><h3>Donate</h3><p>Give to a specific program or where it's needed most, once or monthly.</p><span class="go">Donate</span></a>
  <a class="path" href="/get-involved/membership.html"><h3>Become a member</h3><p>Register with the Mawkeb so we know who we serve and who can serve with us.</p><span class="go">Become a member</span></a>
  <a class="path" href="/get-involved/volunteer.html"><h3>Volunteer</h3><p>Join one of the nine teams that run every program night.</p><span class="go">Volunteer</span></a>
  <a class="path" href="/get-involved/sponsor-the-madheef.html"><h3>Sponsor the Madheef</h3><p>Sponsor a meal, contribute food, or help in the kitchen.</p><span class="go">Sponsor the Madheef</span></a>
 </div>
 <div class="strip"><p>The Mawkeb's merchandise supports its programs. The online store is being set up.</p><a class="btn btn-green" href="/store/">Visit the store</a></div>
</div></section>
'''
    return page('Get involved | Mawkeb Saheb al-Zaman',
                'Donate, become a member, volunteer with one of nine teams, or sponsor the Madheef at Mawkeb Saheb al-Zaman.', body)


def donate():
    body = hero('Donate',
                'Choose where your gift goes. Payment is taken on a secure page run by our payment provider; this website never sees your card.',
                [('/', 'Home'), ('/get-involved/', 'Get involved'), ('', 'Donate')])
    body += '''<section class="sec"><div class="wrap give-box">
 <form class="form" id="give" novalidate>
  <div class="field"><label for="fund">Give to</label><select id="fund" name="fund"></select></div>
  <fieldset class="field"><legend>How often</legend>
   <div class="seg" role="radiogroup"><label><input type="radio" name="frequency" value="once" checked> Once</label><label><input type="radio" name="frequency" value="monthly"> Monthly</label></div></fieldset>
  <fieldset class="field" id="amt-field"><legend>Amount</legend>
   <div class="amounts" id="amounts"></div>
   <div class="money" style="margin-top:8px"><span>$</span><input type="number" id="custom" name="custom" min="1" step="1" inputmode="numeric" placeholder="Another amount" aria-label="Another amount in dollars" style="width:100%;min-height:50px;padding:12px 14px;border:1px solid #c9cdc4;font-size:16px"></div>
   <span class="err">Choose an amount or type one of at least $1.</span></fieldset>
  <p id="summary" class="lead" style="margin-top:0;font-size:17px" aria-live="polite"></p>
  <div class="actions"><button class="btn btn-green" type="submit">Continue to secure checkout</button></div>
  <p class="form-status" id="give-status" role="status"></p>
 </form>
 <div>
  <div class="side-card"><h3>Give by Zelle</h3><div id="zelle"></div></div>
  <div class="side-card"><h3>Receipts</h3><p>Card and bank gifts get a receipt by email from the payment provider straight away. Zelle gifts are confirmed by the team by hand, and a receipt follows by email.</p></div>
  <div class="side-card"><h3>Other ways to give</h3><ul><li><a class="text-link" href="/get-involved/sponsor-the-madheef.html">Sponsor a meal or bring food</a></li><li><a class="text-link" href="/store/">Buy from the Mawkeb store</a></li><li><a class="text-link" href="/get-involved/volunteer.html">Give your time</a></li></ul></div>
 </div>
</div></section>
'''
    script = '''<script>
(function(){
  var D = (window.MAWKEB || {}).donations || {}, funds = D.funds || {}, q = new URLSearchParams(location.search);
  var sel = document.getElementById('fund'), box = document.getElementById('amounts'), custom = document.getElementById('custom');
  Object.keys(funds).forEach(function(k){ var o = document.createElement('option'); o.value = k; o.textContent = funds[k].name; sel.appendChild(o); });
  if (q.get('fund') && funds[q.get('fund')]) sel.value = q.get('fund');
  (D.presets || [25,50,100,250]).forEach(function(v, i){
    var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="preset" value="' + v + '"' + (i === 1 ? ' checked' : '') + '> $' + v; box.appendChild(l);
  });
  function amount(){ var c = parseFloat(custom.value); if (c >= 1) return Math.round(c); var p = document.querySelector('[name=preset]:checked'); return p ? +p.value : 0; }
  function freq(){ return document.querySelector('[name=frequency]:checked').value; }
  function sum(){ var a = amount(); document.getElementById('summary').textContent = a ? 'You are giving $' + a + (freq() === 'monthly' ? ' every month' : ' once') + ' to ' + funds[sel.value].name + '.' : ''; }
  custom.addEventListener('input', function(){ if (custom.value) document.querySelectorAll('[name=preset]').forEach(function(r){ r.checked = false; }); sum(); });
  box.addEventListener('change', function(){ custom.value = ''; sum(); });
  document.querySelectorAll('[name=frequency]').forEach(function(r){ r.addEventListener('change', sum); }); sel.addEventListener('change', sum); sum();

  var z = D.zelle || {}, zb = document.getElementById('zelle');
  zb.innerHTML = z.recipient
    ? '<p>Send to the Mawkeb\\'s Zelle and put the fund name in the memo. Zelle gifts are confirmed by hand.</p><div class="zelle-id"><span>' + z.recipient + '</span><button class="btn btn-line btn-sm" type="button" id="zcopy">Copy</button></div><p style="margin-top:8px;font-size:13px">Recipient name: ' + (z.name || '') + '</p>'
    : '<p>Zelle details will appear here once the Mawkeb has confirmed its account. Please don\\'t send money to any Zelle address that isn\\'t shown on this page.</p>';
  var zc = document.getElementById('zcopy'); if (zc) zc.addEventListener('click', function(){ navigator.clipboard && navigator.clipboard.writeText(z.recipient); zc.textContent = 'Copied'; });

  document.getElementById('give').addEventListener('submit', function(e){
    e.preventDefault(); var a = amount(), st = document.getElementById('give-status'), f = document.getElementById('amt-field');
    if (!a) { f.classList.add('invalid'); custom.focus(); return; } f.classList.remove('invalid');
    var link = (funds[sel.value] || {}).link;
    if (!link) { st.dataset.kind = 'error'; st.textContent = 'Online giving to ' + funds[sel.value].name + ' is not open yet, so no payment was taken. ' + (z.recipient ? 'You can give by Zelle in the meantime.' : 'Please check back soon.'); return; }
    location.href = link.replace('{amount}', a).replace('{frequency}', freq());
  });
})();
</script>
'''
    return page('Donate | Mawkeb Saheb al-Zaman',
                'Give to Abna Al-Batoul, Layali Al-Qadr, the Madheef, Arbaeen or the general fund of Mawkeb Saheb al-Zaman, once or monthly.',
                body, scripts=script)


def membership():
    body = hero('Become a member',
                'Membership is how the Mawkeb knows who it serves and who can serve with it. Registration takes a few minutes on our secure form.',
                [('/', 'Home'), ('/get-involved/', 'Get involved'), ('', 'Become a member')],
                ctas='<a class="btn btn-green" data-link="membership" href="https://themawkeb.com/join">Register as a member</a>')
    body += '''<section class="sec"><div class="wrap split">
 <h2>What registration asks</h2>
 <div class="prose">
  <p>The form asks for your name and how to reach you, a little about you, and which parts of the Mawkeb's work you'd like to take part in. There is space for anything else you want the team to know.</p>
  <h3>Who sees your answers</h3>
  <p>Answers are kept on the Mawkeb's own website. Only Mawkeb administrators can review them, behind a sign-in, and they are used only to organise programs and volunteers.</p>
  <p style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px"><a class="btn btn-green" data-link="membership" href="https://themawkeb.com/join">Register as a member</a><a class="btn btn-line" href="/get-involved/volunteer.html">Volunteer instead</a></p>
 </div>
</div></section>
'''
    return page('Become a member | Mawkeb Saheb al-Zaman', 'Register as a member of Mawkeb Saheb al-Zaman.', body)


def volunteer():
    teams = [('Setup', 'Builds and breaks down the hall'), ('Logistics', 'Flyers, program, supplies, storage'), ('Latm', 'The latmiya and the recording'),
             ('Madheef', 'Cooks and serves the food'), ('Security', 'Doors, parking, a safe hall'), ('Media', 'Cameras, lighting, sound, releases'),
             ('Sisters', "The sisters' side of the program"), ('Sales', 'The merchandise table'), ('Cleaning', 'Leaves the hall as we found it'),
             ('Not sure yet', 'Place me where help is needed')]
    progs = ['Abna Al-Batoul', 'Layali Al-Qadr', 'Year-Round Activities', 'Madheef Sahib Al-Zaman', 'Arbaeen']
    avail = ['Weeknight evenings', 'Weekends', 'Program nights', 'Setup and breakdown days']
    ch = lambda name, v, small='': '<label class="choice"><input type="checkbox" name="%s" value="%s"><span>%s%s</span></label>' % (name, v, v, ('<small>%s</small>' % small) if small else '')
    body = hero('Volunteer',
                'Every program night is run by nine volunteer teams, each with a lead. Tell us where you would like to help and the team will be in touch.',
                [('/', 'Home'), ('/get-involved/', 'Get involved'), ('', 'Volunteer')])
    body += '''<section class="sec"><div class="wrap">
 <form class="form" data-form="volunteer" data-subject="Volunteer sign-up" data-done-title="Thank you for signing up." data-done="A team lead will contact you before the next program." novalidate>
  ''' + HONEYPOT + '''
  <div class="two">
   <div class="field"><label for="v-name">Full name</label><input id="v-name" name="name" type="text" autocomplete="name" required><span class="err">Please enter your name.</span></div>
   <div class="field"><label for="v-phone">Phone number</label><input id="v-phone" name="phone" type="tel" autocomplete="tel" required><span class="err">Please enter a phone number we can reach you on.</span></div>
  </div>
  <div class="field"><label for="v-email">Email address</label><input id="v-email" name="email" type="email" autocomplete="email" required><span class="err">Please enter an email address like name@example.com.</span></div>
  <fieldset class="field" data-required-group><legend>Which programs would you like to help with?</legend><div class="choices">''' + ''.join(ch('program', p) for p in progs) + '''</div><span class="err">Choose at least one program.</span></fieldset>
  <fieldset class="field" data-required-group><legend>Which team?</legend><span class="hint">Choose one or more. Each team has a lead who will train you.</span><div class="choices">''' + ''.join(ch('team', t, d) for t, d in teams) + '''</div><span class="err">Choose at least one team, or "Not sure yet".</span></fieldset>
  <fieldset class="field" data-required-group><legend>When are you usually free?</legend><div class="choices">''' + ''.join(ch('availability', a) for a in avail) + '''</div><span class="err">Choose at least one.</span></fieldset>
  <div class="field"><label for="v-exp">Relevant experience <span style="font-weight:400;color:var(--muted)">(optional)</span></label><span class="hint">Cooking for large groups, photography, sound, first aid, anything useful.</span><textarea id="v-exp" name="experience"></textarea></div>
  <div class="field"><label for="v-notes">Anything else? <span style="font-weight:400;color:var(--muted)">(optional)</span></label><textarea id="v-notes" name="comments"></textarea></div>
  ''' + PRIVACY + '''
  <div class="actions"><button class="btn btn-green" type="submit">Send my sign-up</button></div>
  <p class="form-status" role="status"></p>
 </form>
</div></section>
'''
    return page('Volunteer | Mawkeb Saheb al-Zaman',
                'Volunteer with one of the nine teams that run Mawkeb Saheb al-Zaman program nights: Setup, Logistics, Latm, Madheef, Security, Media, Sisters, Sales and Cleaning.', body)


def sponsor():
    progs = ['Abna Al-Batoul', 'Layali Al-Qadr', 'Year-Round Activities', 'Arbaeen', 'Any program']
    body = hero('Sponsor the Madheef',
                'Sponsor a night\'s meal, contribute food, or help in the kitchen. The Madheef team will reply with what each night needs.',
                [('/', 'Home'), ('/get-involved/', 'Get involved'), ('', 'Sponsor the Madheef')],
                ctas='<a class="btn btn-green" href="#form">Start a sponsorship</a><a class="btn btn-ghost" href="/get-involved/donate.html?fund=madheef">Give money to the Madheef</a>')
    body += '''<section class="sec"><div class="wrap">
 <h2>Five ways to support the Madheef</h2>
 <ul class="facts-list">
  <li id="meal"><b>Sponsor a meal</b><span>Cover the food for a program night, or part of one. Use the form below and the team will tell you what that night needs.</span></li>
  <li id="food"><b>Contribute food</b><span>Bring or send food for a night, arranged with the team so it fits the menu and the number of guests.</span></li>
  <li><b>Give money</b><span>A gift of any amount to the Madheef, once or monthly. <a class="text-link" href="/get-involved/donate.html?fund=madheef">Give to the Madheef</a></span></li>
  <li><b>Volunteer</b><span>Cook, serve and clear with the Madheef team. <a class="text-link" href="/get-involved/volunteer.html?team=Madheef">Join the Madheef team</a></span></li>
  <li><b>Ask about sponsorship</b><span>For a family, business or group sponsorship, or anything else, use the form below.</span></li>
 </ul>
 <p class="note">There are no fixed prices or packages: meal costs and quantities depend on the night, and the Madheef team sets them for each program.</p>
</div></section>
<section class="sec canvas" id="form"><div class="wrap">
 <h2>Start a sponsorship</h2>
 <form class="form" data-form="sponsor" data-subject="Madheef sponsorship" data-done-title="Thank you. Your offer has been sent." data-done="The Madheef team will contact you to arrange it." novalidate style="margin-top:32px">
  ''' + HONEYPOT + '''
  <fieldset class="field" data-required-group><legend>What would you like to do?</legend><div class="choices">
   <label class="choice"><input type="radio" name="type" value="Sponsor a meal"><span>Sponsor a meal</span></label>
   <label class="choice"><input type="radio" name="type" value="Contribute food"><span>Contribute food</span></label>
   <label class="choice"><input type="radio" name="type" value="Help in the kitchen"><span>Help in the kitchen</span></label>
   <label class="choice"><input type="radio" name="type" value="Sponsorship question"><span>Ask a question</span></label>
  </div><span class="err">Choose one.</span></fieldset>
  <div class="two">
   <div class="field"><label for="s-name">Full name</label><input id="s-name" name="name" type="text" autocomplete="name" required><span class="err">Please enter your name.</span></div>
   <div class="field"><label for="s-phone">Phone number</label><input id="s-phone" name="phone" type="tel" autocomplete="tel" required><span class="err">Please enter a phone number.</span></div>
  </div>
  <div class="field"><label for="s-email">Email address</label><input id="s-email" name="email" type="email" autocomplete="email" required><span class="err">Please enter an email address like name@example.com.</span></div>
  <div class="field"><label for="s-prog">For which program?</label><select id="s-prog" name="program" required><option value="">Choose a program</option>''' + ''.join('<option>%s</option>' % p for p in progs) + '''</select><span class="err">Choose a program.</span></div>
  <div class="field"><label for="s-details">Tell us more</label><span class="hint">For example, which night, what food, or on whose behalf the meal is sponsored.</span><textarea id="s-details" name="details" required></textarea><span class="err">Please add a few words so the team knows what you have in mind.</span></div>
  ''' + PRIVACY + '''
  <div class="actions"><button class="btn btn-green" type="submit">Send to the Madheef team</button></div>
  <p class="form-status" role="status"></p>
 </form>
</div></section>
'''
    return page('Sponsor the Madheef | Mawkeb Saheb al-Zaman',
                'Sponsor a meal, contribute food, give money or volunteer with the Madheef team at Mawkeb Saheb al-Zaman.', body)


PAGES = {
    'get-involved/index.html': landing,
    'get-involved/donate.html': donate,
    'get-involved/membership.html': membership,
    'get-involved/volunteer.html': volunteer,
    'get-involved/sponsor-the-madheef.html': sponsor,
}
