'use strict';

/* ═══════════════════════════════════════════════
   RADAR CHART
══════════════════════════════════════════════════ */
const RADAR_SKILLS = [
  { label: 'Business\nAnalysis', value: 95 },
  { label: 'Data\nVisualization', value: 92 },
  { label: 'ML /\nData Sci.', value: 75 },
  { label: 'Project\nMgmt', value: 85 },
  { label: 'Tech\nStack', value: 88 },
  { label: 'Communic-\nation', value: 90 },
];

function buildRadar() {
  const cx = 130, cy = 130, r = 90;
  const n = RADAR_SKILLS.length;
  const svg = document.getElementById('radarSvg');
  const gridG = document.getElementById('radarGrid');
  const axesG = document.getElementById('radarAxes');
  const dotsG = document.getElementById('radarDots');
  const labsG = document.getElementById('radarLabels');
  const shape = document.getElementById('radarShape');

  if (!svg) return;

  function point(angle, radius) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  function angle(i) { return (Math.PI * 2 * i) / n - Math.PI / 2; }

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(t => {
    const pts = Array.from({ length: n }, (_, i) => {
      const p = point(angle(i), r * t);
      return `${p.x},${p.y}`;
    }).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', '#D6E8E5');
    poly.setAttribute('stroke-width', t === 1 ? '1.5' : '1');
    gridG.appendChild(poly);
  });

  // Axes
  for (let i = 0; i < n; i++) {
    const end = point(angle(i), r);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', end.x); line.setAttribute('y2', end.y);
    line.setAttribute('stroke', '#D6E8E5');
    line.setAttribute('stroke-width', '1');
    axesG.appendChild(line);
  }

  // Shape (starts at 0)
  const finalPts = Array.from({ length: n }, (_, i) => {
    const p = point(angle(i), r * (RADAR_SKILLS[i].value / 100));
    return `${p.x},${p.y}`;
  }).join(' ');
  shape.setAttribute('points', Array.from({ length: n }, (_, i) => `${cx},${cy}`).join(' '));

  // Dots & labels
  for (let i = 0; i < n; i++) {
    const end = point(angle(i), r * (RADAR_SKILLS[i].value / 100));

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', end.x);
    circle.setAttribute('cy', end.y);
    circle.setAttribute('r', '3.5');
    circle.setAttribute('fill', 'var(--teal)');
    circle.setAttribute('opacity', '0');
    dotsG.appendChild(circle);

    const labelPos = point(angle(i), r + 18);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelPos.x);
    text.setAttribute('y', labelPos.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '9');
    text.setAttribute('fill', '#4D7874');
    text.setAttribute('font-family', 'Inter, sans-serif');
    text.setAttribute('font-weight', '500');

    RADAR_SKILLS[i].label.split('\n').forEach((line, li) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', labelPos.x);
      tspan.setAttribute('dy', li === 0 ? '0' : '11');
      tspan.textContent = line;
      text.appendChild(tspan);
    });

    labsG.appendChild(text);
  }

  // Store final points for animation
  shape._finalPts = finalPts;
  shape._dots = dotsG.querySelectorAll('circle');
}

function animateRadar() {
  const shape = document.getElementById('radarShape');
  if (!shape || !shape._finalPts) return;
  shape.style.transition = 'none';
  setTimeout(() => {
    shape.style.transition = 'points 1.2s cubic-bezier(.4,0,.2,1)';
    shape.setAttribute('points', shape._finalPts);
    shape._dots.forEach((d, i) => {
      setTimeout(() => { d.setAttribute('opacity', '1'); }, 300 + i * 80);
    });
  }, 50);
}

/* ═══════════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1200;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })(t0);
}

/* ═══════════════════════════════════════════════
   GANTT BARS
══════════════════════════════════════════════════ */
function animateGantt() {
  document.querySelectorAll('.gantt-bar').forEach((bar, i) => {
    const w = bar.dataset.width;
    setTimeout(() => {
      bar.style.width = w + '%';
    }, i * 120);
  });
  // Seniority line
  const line = document.querySelector('.sen-line');
  if (line) setTimeout(() => line.classList.add('animated'), 400);
}

/* ═══════════════════════════════════════════════
   DONUT — animated on enter
══════════════════════════════════════════════════ */
function animateDonut() {
  const circumference = 2 * Math.PI * 70; // r=70 → 439.82

  const healthcare = 0.429 * circumference;
  const fmcg       = 0.444 * circumference;
  const eng        = 0.127 * circumference;

  const gap = circumference;

  const segs = [
    { el: document.querySelector('.seg-healthcare'), dash: healthcare, offset: 0 },
    { el: document.querySelector('.seg-fmcg'),       dash: fmcg,       offset: -healthcare },
    { el: document.querySelector('.seg-engineering'), dash: eng,        offset: -(healthcare + fmcg) },
  ];

  segs.forEach(({ el, dash, offset }, i) => {
    if (!el) return;
    setTimeout(() => {
      el.style.strokeDasharray  = `${dash} ${circumference - dash}`;
      el.style.strokeDashoffset = offset;
    }, i * 200);
  });
}

/* ═══════════════════════════════════════════════
   SKILL / TENURE FILLS
══════════════════════════════════════════════════ */
function animateFills(section) {
  section.querySelectorAll('.skill-fill, .tenure-fill').forEach(el => {
    el.style.width = (el.dataset.w || 0) + '%';
  });
}

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER
══════════════════════════════════════════════════ */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const s = entry.target;
    s.classList.add('visible');

    if (s.id === 'overview') {
      s.querySelectorAll('.kpi-num').forEach(animateCounter);
      animateFills(s);
    }
    if (s.id === 'timeline') animateGantt();
    if (s.id === 'analytics') {
      animateDonut();
      animateRadar();
      animateFills(s);
    }

    sectionObserver.unobserve(s);
  });
}, { threshold: 0.06 });

document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════
   ACTIVE NAV
══════════════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-link');
const topbarPage = document.getElementById('topbar-page');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const target = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
    if (target) {
      target.classList.add('active');
      if (topbarPage) topbarPage.textContent = target.textContent.trim();
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.section').forEach(s => navObserver.observe(s));

/* ═══════════════════════════════════════════════
   MOBILE SIDEBAR
══════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');

hamburger?.addEventListener('click', () => sidebar.classList.toggle('open'));

navLinks.forEach(l => l.addEventListener('click', () => sidebar.classList.remove('open')));

document.addEventListener('click', e => {
  if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ═══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
buildRadar();
