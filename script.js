// =========================================================
// Utkarsh Verma — Site Interactions
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar scroll state ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- Hero terminal: simulated spam-scan typing sequence ---- */
  const body = document.getElementById('terminalBody');
  if (body) {
    if (reduceMotion) {
      body.innerHTML = staticTerminalHTML();
    } else {
      runTerminalSequence(body);
    }
  }
});

function staticTerminalHTML() {
  return `
    <div><span class="ln">1</span><span class="t-comment">// analyzing inbox for phishing &amp; spam patterns</span></div>
    <div><span class="ln">2</span><span class="t-key">from</span> <span class="t-fn">spam_checker</span> <span class="t-key">import</span> analyze</div>
    <div><span class="ln">3</span></div>
    <div><span class="ln">4</span>result = <span class="t-fn">analyze</span>(<span class="t-str">"Claim your free prize now!!"</span>)</div>
    <div><span class="ln">5</span><span class="t-out">>>> verdict: <span class="verdict-chip spam">SPAM</span> (98% confidence)</span></div>
  `;
}

function runTerminalSequence(body) {
  const lines = [
    { html: '<span class="t-comment">// booting inbox scanner...</span>' },
    { html: '<span class="t-key">from</span> <span class="t-fn">spam_checker</span> <span class="t-key">import</span> analyze' },
    { html: '' },
    { html: 'msg = <span class="t-str">"You\\u2019ve won a free iPhone \\u2014 claim now"</span>' },
    { html: 'result = <span class="t-fn">analyze</span>(msg)' },
    { html: '<span class="t-out">&gt;&gt;&gt; scanning message content...</span>' },
    { verdict: 'spam', label: '&gt;&gt;&gt; verdict:', tag: 'SPAM', conf: '97% confidence' },
    { html: '' },
    { html: 'msg = <span class="t-str">"Reminder: assignment due Friday"</span>' },
    { html: 'result = <span class="t-fn">analyze</span>(msg)' },
    { verdict: 'safe', label: '&gt;&gt;&gt; verdict:', tag: 'SAFE', conf: '99% confidence' },
  ];

  let lineNum = 1;
  let i = 0;

  function typeLine(html, cb) {
    const row = document.createElement('div');
    const lnSpan = document.createElement('span');
    lnSpan.className = 'ln';
    lnSpan.textContent = lineNum++;
    const content = document.createElement('span');
    row.appendChild(lnSpan);
    row.appendChild(content);
    body.appendChild(row);

    // Strip tags for a lightweight char-by-char type effect, then swap in real HTML
    const plain = html.replace(/<[^>]*>/g, '');
    let idx = 0;
    const speed = 14;
    function step() {
      idx++;
      content.textContent = plain.slice(0, idx);
      if (idx < plain.length) {
        setTimeout(step, speed);
      } else {
        content.innerHTML = html; // restore syntax coloring
        cb && cb();
      }
    }
    if (plain.length === 0) { cb && cb(); return; }
    step();
  }

  function typeVerdict(entry, cb) {
    const row = document.createElement('div');
    const lnSpan = document.createElement('span');
    lnSpan.className = 'ln';
    lnSpan.textContent = lineNum++;
    const content = document.createElement('span');
    content.className = 't-out';
    content.innerHTML = entry.label + ' ';
    const chip = document.createElement('span');
    chip.className = 'verdict-chip ' + entry.verdict;
    chip.textContent = entry.tag;
    row.appendChild(lnSpan);
    row.appendChild(content);
    row.appendChild(chip);
    body.appendChild(row);
    setTimeout(cb, 550);
  }

  function next() {
    if (i >= lines.length) {
      // add blinking cursor at the end, then loop after a pause
      const cursorRow = document.createElement('div');
      cursorRow.innerHTML = `<span class="ln">${lineNum}</span><span class="t-cursor"></span>`;
      body.appendChild(cursorRow);
      setTimeout(() => {
        body.innerHTML = '';
        lineNum = 1;
        i = 0;
        next();
      }, 3200);
      return;
    }
    const entry = lines[i++];
    if (entry.verdict) {
      typeVerdict(entry, next);
    } else {
      typeLine(entry.html, () => setTimeout(next, 180));
    }
  }

  next();
}
