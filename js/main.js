document.getElementById('year').textContent = new Date().getFullYear();

fetch('version.json')
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById('fwVersion');
    if (el && data.version) el.textContent = data.version;
  })
  .catch(() => {});

(function () {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, R, angle = -Math.PI / 2;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    R  = Math.min(W, H) * 0.38;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const C = 'rgba(0,200,255,';

  function frame() {
    ctx.clearRect(0, 0, W, H);

    [1, 0.6].forEach((scale, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * scale, 0, Math.PI * 2);
      ctx.strokeStyle = C + (i === 0 ? '0.25)' : '0.12)');
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.strokeStyle = C + '0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

    for (let i = 4; i >= 1; i--) {
      const a = angle - i * 0.09;
      const alpha = (5 - i) / 14;
      const g = ctx.createLinearGradient(cx, cy, cx + R * Math.cos(a), cy + R * Math.sin(a));
      g.addColorStop(0, C + '0)');
      g.addColorStop(1, C + alpha + ')');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const g = ctx.createLinearGradient(cx, cy, cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    g.addColorStop(0, C + '0.05)');
    g.addColorStop(1, C + '0.9)');
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const d = new Date(), day = d.getDate(), mon = d.getMonth() + 1;
    [
      { a: (day * 53 + mon * 107) * Math.PI / 180, r: (42 + (day * 7  + mon) % 28) / 84 },
      { a: (day * 89 + mon *  41 + 130) * Math.PI / 180, r: (50 + (day * 11 + mon) % 24) / 84 },
    ].forEach(b => {
      const bx = cx + R * b.r * Math.cos(b.a);
      const by = cy + R * b.r * Math.sin(b.a);
      let diff = angle - b.a;
      while (diff < 0)            diff += Math.PI * 2;
      while (diff >= Math.PI * 2) diff -= Math.PI * 2;
      const alpha  = diff < Math.PI ? (1 - diff / Math.PI) * 0.85 + 0.1 : 0.1;
      const radius = diff < Math.PI / 6 ? 5 : diff < Math.PI / 3 ? 3.5 : diff < Math.PI ? 2 : 1.5;
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fillStyle = C + alpha + ')';
      ctx.fill();
    });

    angle += 0.012;
    if (angle > Math.PI * 1.5) angle -= Math.PI * 2;

    requestAnimationFrame(frame);
  }
  frame();
})();
