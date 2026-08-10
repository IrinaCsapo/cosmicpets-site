/* Cosmic Pets, site behaviour. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── mobile nav ──────────────────────────────────────────────────────── */

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ── sticky nav shadow ───────────────────────────────────────────────── */

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── scroll reveal ───────────────────────────────────────────────────── */

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── portrait lightbox ─────────────────────────────────────────────────

     Scoped to a container so a page can hold more than one independent
     gallery. With no [data-lightbox-group] on the page, which is the normal
     case, the whole document is one group.
     ------------------------------------------------------------------- */

  var groups = document.querySelectorAll('[data-lightbox-group]');
  Array.prototype.forEach.call(groups.length ? groups : [document], initLightbox);

  function initLightbox(root) {
  var portraits = Array.prototype.slice.call(root.querySelectorAll('[data-portrait]'));

  if (portraits.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Portrait viewer');
    box.hidden = false;
    box.innerHTML =
      '<div class="lightbox-bar">' +
        '<div><span class="lightbox-title"></span> <span class="lightbox-count"></span></div>' +
        '<button class="lb-btn lb-close" type="button" aria-label="Close viewer">✕</button>' +
      '</div>' +
      '<div class="lightbox-stage">' +
        '<button class="lb-btn lb-nav lb-prev" type="button" aria-label="Previous portrait">‹</button>' +
        '<img alt="">' +
        '<button class="lb-btn lb-nav lb-next" type="button" aria-label="Next portrait">›</button>' +
      '</div>' +
      '<p class="lightbox-foot"></p>';
    document.body.appendChild(box);

    var lbImg = box.querySelector('img');
    var lbTitle = box.querySelector('.lightbox-title');
    var lbCount = box.querySelector('.lightbox-count');
    var lbFoot = box.querySelector('.lightbox-foot');
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + portraits.length) % portraits.length;
      var el = portraits[index];
      lbImg.classList.remove('is-ready');
      var full = el.getAttribute('data-full');
      var name = el.getAttribute('data-name') || '';
      var story = el.getAttribute('data-story') || '';

      var loader = new Image();
      loader.onload = function () {
        lbImg.src = full;
        lbImg.alt = name + ', a Cosmic Pet portrait';
        lbImg.classList.add('is-ready');
      };
      loader.src = full;

      lbTitle.textContent = name;
      lbCount.textContent = (index + 1) + ' / ' + portraits.length;
      lbFoot.textContent = story;
      lbFoot.style.display = story ? '' : 'none';

      // warm the neighbours
      [portraits[(index + 1) % portraits.length],
       portraits[(index - 1 + portraits.length) % portraits.length]]
        .forEach(function (n) { if (n) { new Image().src = n.getAttribute('data-full'); } });
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
      box.querySelector('.lb-close').focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      if (lastFocus) { lastFocus.focus(); }
    }

    portraits.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox-stage')) { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { close(); }
      if (e.key === 'ArrowRight') { show(index + 1); }
      if (e.key === 'ArrowLeft') { show(index - 1); }
      if (e.key === 'Tab') {
        var focusables = box.querySelectorAll('button');
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // swipe
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { show(index + (dx < 0 ? 1 : -1)); }
      startX = null;
    }, { passive: true });
  }
  }

  /* ── preselect a package from ?package=… ─────────────────────────────── */

  var pkg = document.querySelector('[data-package-select]');
  if (pkg) {
    var wanted = new URLSearchParams(window.location.search).get('package');
    if (wanted) {
      Array.prototype.forEach.call(pkg.options, function (opt) {
        if (opt.value.toLowerCase() === wanted.toLowerCase()) { pkg.value = opt.value; }
      });
    }
  }

  /* ── contact form ─────────────────────────────────────────────────────

     Posts to FormSubmit (free, no account, no submission cap). If that ever
     fails, or the endpoint goes away entirely, the same answers are turned
     into a pre-filled email instead, so a message is never lost.
     ------------------------------------------------------------------- */

  var form = document.querySelector('[data-ajax-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var submitLabel = submit ? submit.textContent : '';
    var inbox = form.getAttribute('data-inbox') || 'hello@cosmicpets.co.uk';

    // Turn the answers into a mailto: the visitor can send by hand.
    function mailtoLink() {
      var get = function (n) {
        var f = form.querySelector('[name="' + n + '"]');
        return f && f.value ? f.value.trim() : '';
      };
      var body = [
        'Hello Irina,', '',
        'My name: ' + (get('name') || '(not given)'),
        'My email: ' + (get('email') || '(not given)'),
        'My pet: ' + (get('pet') || '(not given)'),
        'Package: ' + (get('package') || '(not chosen)'),
        '', 'About them:', get('message') || '', ''
      ].join('\n');
      return 'mailto:' + inbox +
             '?subject=' + encodeURIComponent('Cosmic Pet Portrait enquiry') +
             '&body=' + encodeURIComponent(body).slice(0, 1800);
    }

    function fallback(reason) {
      status.className = 'form-status is-visible is-err';
      status.innerHTML = reason + ' Your answers are safe, nothing was lost. ' +
        '<a class="text-link" href="' + mailtoLink() + '">Send them to me as an email instead</a>, ' +
        'or write to <a class="text-link" href="mailto:' + inbox + '">' + inbox + '</a>.';
    }

    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      e.preventDefault();

      if (!action || action.indexOf('YOUR_') !== -1) {
        fallback('This form is not connected to an inbox yet.');
        return;
      }

      status.className = 'form-status';
      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) { throw new Error('http ' + res.status); }
        return res.json().catch(function () { return {}; });
      }).then(function (data) {
        if (data && data.success === 'false') { throw new Error('rejected'); }
        form.reset();
        status.className = 'form-status is-visible is-ok';
        status.textContent = 'Thank you! Your message is on its way. ' +
          'I will get back to you as soon as I can, usually within a day or two.';
      }).catch(function () {
        fallback('That did not send.');
      }).then(function () {
        if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
      });
    });
  }

  /* ── hero cinema carousel ─────────────────────────────────────────────────

     Bends the flat marquee into a curved panorama. The horizontal travel is
     still the CSS animation, untouched, so the seamless loop is preserved. All
     this adds is depth: each frame it reads where every card currently sits and
     sets that card's rotateY, push-back and scale from its distance to centre.
     Cards near the middle face you; cards toward the edges angle away.

     It measures the .marquee-item (which never transforms) and writes to the
     .marquee-card inside it, so a card's own tilt can't pollute the reading it
     is computed from. Under reduced motion it does nothing and the CSS leaves a
     plain scrollable row.
     --------------------------------------------------------------------- */

  (function () {
    if (reduced) { return; }
    var marquee = document.querySelector('.marquee');
    if (!marquee) { return; }

    var cards = Array.prototype.map.call(
      marquee.querySelectorAll('.marquee-item'),
      function (el) { return { el: el, card: el.querySelector('.marquee-card') }; }
    ).filter(function (c) { return c.card; });
    if (!cards.length) { return; }

    marquee.classList.add('is-3d');

    var MAX_ROT = 40;    // degrees of turn at the edge
    var DEPTH   = 150;   // px a card is pushed back at the edge
    var MIN_SC  = 0.82;  // how small an edge card shrinks to
    var FADE    = 0.26;  // how much an edge card dims
    var SPREAD  = 1.15;  // <1 tightens the curve toward centre, >1 widens it

    var raf = 0, running = false;

    function frame() {
      var r = marquee.getBoundingClientRect();
      var mid = r.left + r.width / 2;
      var half = (r.width / 2) * SPREAD || 1;

      for (var i = 0; i < cards.length; i++) {
        var b = cards[i].el.getBoundingClientRect();
        var d = ((b.left + b.width / 2) - mid) / half;      // signed, ~ -1..1 on screen
        var cl = d < -1 ? -1 : d > 1 ? 1 : d;               // clamp for rot/scale
        var ad = cl < 0 ? -cl : cl;

        var st = cards[i].card.style;
        st.transform =
          'translateZ(' + (-ad * DEPTH).toFixed(1) + 'px) ' +
          'rotateY(' + (cl * MAX_ROT).toFixed(2) + 'deg) ' +
          'scale(' + (1 - (1 - MIN_SC) * ad).toFixed(3) + ')';
        st.opacity = (1 - FADE * ad).toFixed(3);
        st.zIndex = String(1000 - Math.round(ad * 1000));
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }

    // Only spend frames on it while it is actually on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[entries.length - 1].isIntersecting) { start(); } else { stop(); }
      }, { threshold: 0 }).observe(marquee);
    } else {
      start();
    }
  })();

  /* ── current year ────────────────────────────────────────────────────── */

  var year = document.querySelector('[data-year]');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
