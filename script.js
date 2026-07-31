// ハンバーガーメニュー（〜1080px）
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('gnav');
  if (!btn || !nav) return;
  var setOpen = function (open) {
    nav.classList.toggle('is-open', open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.documentElement.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-open', open);
  };
  btn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
})();

// ヒーローのキービジュアル・スライドショー
// スライドの枚数は DOM から数えるので、HTML 側で .hero__slide を増減するだけで動く
// （インジケーターの .hero__dot も同数にすること）。
(function () {
  var wrap = document.getElementById('heroSlides');
  if (!wrap) return;
  var slides = [].slice.call(wrap.querySelectorAll('.hero__slide'));
  var dots = [].slice.call(document.querySelectorAll('#heroNav .hero__dot'));
  if (slides.length < 2) return;

  var INTERVAL = 6000;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var timer = 0;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
  }
  function start() {
    if (reduced) return;
    stop();
    timer = setInterval(function () { show(index + 1); }, INTERVAL);
  }
  function stop() { if (timer) { clearInterval(timer); timer = 0; } }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { show(i); start(); });
  });
  // タブが非表示のあいだは止める（無駄な再描画を避ける）
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  show(0);
  start();
})();

// スクロールリビール（--d で時差）
(function () {
  var targets = document.querySelectorAll('.rise');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach(function (el) { io.observe(el); });
})();
