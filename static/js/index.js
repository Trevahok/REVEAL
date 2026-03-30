/* ── Collapsible results table inside stat bar ── */
function toggleModeTable(statEl) {
  statEl.classList.toggle('open');
}

/* ── Copy BibTeX ── */
function copyBibTeX() {
  var el = document.getElementById('bibtex-code');
  var btn = document.querySelector('.copy-bibtex-btn');
  var txt = btn.querySelector('.copy-text');
  if (!el) return;

  navigator.clipboard.writeText(el.textContent).then(function () {
    btn.classList.add('copied');
    txt.textContent = 'Copied!';
    setTimeout(function () {
      btn.classList.remove('copied');
      txt.textContent = 'Copy';
    }, 2000);
  }).catch(function () {
    var ta = document.createElement('textarea');
    ta.value = el.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.classList.add('copied');
    txt.textContent = 'Copied!';
    setTimeout(function () {
      btn.classList.remove('copied');
      txt.textContent = 'Copy';
    }, 2000);
  });
}

/* ── Scroll to top ── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
  var btn = document.querySelector('.scroll-to-top');
  if (!btn) return;
  if (window.pageYOffset > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

/* ── Animated stat counters ── */
function animateCounters() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(function (counter) {
    var target = parseInt(counter.getAttribute('data-target'), 10);
    var duration = 1200;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  });
}

var statsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

document.addEventListener('DOMContentLoaded', function () {
  var strip = document.querySelector('.stats-strip');
  if (strip) statsObserver.observe(strip);

  // Open the first stat table by default
  var first = document.querySelector('.mode-stat');
  if (first) first.classList.add('open');

  /* ── Ticker: drag-to-scroll + arrow buttons ── */
  var track = document.querySelector('.ticker-track');
  var wrap  = document.querySelector('.ticker-wrap');
  var btnL  = document.querySelector('.ticker-btn-left');
  var btnR  = document.querySelector('.ticker-btn-right');
  if (!track || !wrap || !btnL || !btnR) return;

  var ANIM_DURATION = 50; // seconds — must match CSS
  var STEP_PX = 320;      // pixels shifted per arrow click
  var isDragging = false;
  var startX = 0;
  var startTX = 0;
  var currentTX = 0;

  function getTranslateX() {
    var t = window.getComputedStyle(track).transform;
    if (!t || t === 'none') return 0;
    var m = t.match(/matrix\(([^)]+)\)/);
    return m ? parseFloat(m[1].split(', ')[4]) : 0;
  }

  function halfWidth() {
    return track.scrollWidth / 2;
  }

  function wrapTX(x) {
    var hw = halfWidth();
    if (x > 0)   x -= hw;
    if (x < -hw) x += hw;
    return x;
  }

  function pauseAndCapture() {
    currentTX = wrapTX(getTranslateX());
    track.style.animationName  = 'none';
    track.style.animationDelay = '0s';
    track.style.transform      = 'translateX(' + currentTX + 'px)';
  }

  function resumeAnimation() {
    currentTX = wrapTX(currentTX);
    var hw    = halfWidth();
    var delay = -(Math.abs(currentTX) / hw) * ANIM_DURATION;
    track.style.transform      = '';
    track.style.animationDelay = delay + 's';
    track.style.animationName  = 'ticker-scroll';
  }

  /* drag */
  wrap.addEventListener('mousedown', function (e) {
    isDragging = true;
    startX  = e.clientX;
    pauseAndCapture();
    startTX = currentTX;
    wrap.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    currentTX = wrapTX(startTX + (e.clientX - startX));
    track.style.transform = 'translateX(' + currentTX + 'px)';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove('is-dragging');
    resumeAnimation();
  });

  /* touch */
  wrap.addEventListener('touchstart', function (e) {
    isDragging = true;
    startX  = e.touches[0].clientX;
    pauseAndCapture();
    startTX = currentTX;
  }, { passive: true });

  wrap.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    currentTX = wrapTX(startTX + (e.touches[0].clientX - startX));
    track.style.transform = 'translateX(' + currentTX + 'px)';
  }, { passive: true });

  wrap.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    resumeAnimation();
  });

  /* arrow buttons */
  function shiftBy(px) {
    pauseAndCapture();
    currentTX = wrapTX(currentTX + px);
    track.style.transition = 'transform 0.35s ease';
    track.style.transform  = 'translateX(' + currentTX + 'px)';
    setTimeout(function () {
      track.style.transition = '';
      resumeAnimation();
    }, 370);
  }

  btnL.addEventListener('click', function () { shiftBy(+STEP_PX); });
  btnR.addEventListener('click', function () { shiftBy(-STEP_PX); });
});

/* ── Carousel init (jQuery-dependent) ── */
if (typeof jQuery !== 'undefined') {
  $(document).ready(function () {
    var options = {
      slidesToScroll: 1,
      slidesToShow: 1,
      loop: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
    };
    if (typeof bulmaCarousel !== 'undefined') {
      bulmaCarousel.attach('.carousel', options);
    }
    if (typeof bulmaSlider !== 'undefined') {
      bulmaSlider.attach();
    }
  });
} else {
  document.addEventListener('DOMContentLoaded', function () {
    var waitForJQ = setInterval(function () {
      if (typeof jQuery !== 'undefined') {
        clearInterval(waitForJQ);
        var options = {
          slidesToScroll: 1,
          slidesToShow: 1,
          loop: true,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 5000,
        };
        if (typeof bulmaCarousel !== 'undefined') {
          bulmaCarousel.attach('.carousel', options);
        }
        if (typeof bulmaSlider !== 'undefined') {
          bulmaSlider.attach();
        }
      }
    }, 100);
  });
}

/* ── Demo Carousel + Expand Modal ── */
(function () {
  function init() {
    var track        = document.getElementById('demo-track');
    var prevBtn      = document.getElementById('demo-prev');
    var nextBtn      = document.getElementById('demo-next');
    var overlay      = document.getElementById('demo-modal-overlay');
    var modalContent = document.getElementById('demo-modal-content');
    var closeBtn     = document.getElementById('demo-modal-close');

    if (!track || !prevBtn || !nextBtn || !overlay || !modalContent || !closeBtn) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.demo-slide'));
    var offset = 0;

    /* inject a .demo-card-header above the video-wrap in each collapsed card:
       [badge title centred] then [Sample Video chip centred] */
    slides.forEach(function (slide) {
      var card  = slide.querySelector('.demo-card');
      var vwrap = slide.querySelector('.demo-video-wrap');
      var badge = slide.querySelector('.demo-badge');
      if (!card || !vwrap) return;

      var header = document.createElement('div');
      header.className = 'demo-card-header';

      var titleEl = document.createElement('div');
      /* inherit the badge's colour class (badge-blue / badge-purple / badge-red)
         so the pill uses the same palette as the original badge */
      var badgeColourClass = badge ? (badge.className.match(/badge-\w+/) || [])[0] : '';
      titleEl.className = 'demo-card-title demo-badge ' + (badgeColourClass || '');
      titleEl.textContent = badge ? badge.textContent.trim() : '';

      var chip = document.createElement('div');
      chip.className = 'demo-slide-chip';
      chip.innerHTML = '<i class="fas fa-video"></i> Sample Video';

      header.appendChild(titleEl);
      header.appendChild(chip);
      card.insertBefore(header, vwrap);
    });

    /* use getBoundingClientRect for reliable post-layout dimensions */
    function slideW() {
      if (!slides.length) return 300;
      return slides[0].getBoundingClientRect().width + 16; /* +1rem gap */
    }

    function viewW() {
      return track.parentElement.getBoundingClientRect().width;
    }

    function maxOff() {
      var total = slides.length * slideW() - 16;
      return Math.max(0, total - viewW());
    }

    function applyOffset(val) {
      var max = maxOff();
      offset = Math.max(0, Math.min(val, max));
      track.style.transform = 'translateX(-' + offset + 'px)';
      prevBtn.disabled = offset <= 0;
      nextBtn.disabled = max <= 0 || offset >= max - 1;
    }

    applyOffset(0);

    prevBtn.addEventListener('click', function () { applyOffset(offset - slideW()); });
    nextBtn.addEventListener('click', function () { applyOffset(offset + slideW()); });

    /* ── Modal open ── */
    function openModal(slide) {
      var card  = slide.querySelector('.demo-card');
      if (!card) return;
      var clone = card.cloneNode(true);

      /* show caption */
      var cap = clone.querySelector('.demo-caption');
      if (cap) { cap.style.cssText = 'display:block !important; font-size:1rem;'; }

      /* prepare video */
      var vid = clone.querySelector('video');
      if (vid) {
        vid.removeAttribute('preload');
        vid.muted    = true;
        vid.loop     = true;
        vid.controls = true;
      }

      /* hide expand hint */
      var hint = clone.querySelector('.demo-expand-hint');
      if (hint) hint.style.display = 'none';

      modalContent.innerHTML = '';
      modalContent.appendChild(clone);

      /* show overlay */
      overlay.style.display = 'flex';
      requestAnimationFrame(function () {
        overlay.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';

      /* spring-peek: two-phase animation.
         Phase 1 — slow eased descent to peak (independently timed).
         Phase 2 — spring physics from rest at peak back to 0,
                   with elastic floor reflections (unchanged timing). */
      var box = overlay.querySelector('.demo-modal-box');
      if (box) {
        setTimeout(function () {
          var PEAK          = 220;   /* how far down to reveal (px)      */
          var DESCENT_MS    = 620;   /* phase 1 duration — tune this     */
          var stiffness     = 110;   /* phase 2 spring constant          */
          var drag          = 7;     /* phase 2 damping                  */
          var restitution   = 0.52;  /* energy kept on each floor bounce */

          /* ease-in-out curve */
          function eio(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

          /* ── Phase 1: smooth descent ── */
          var p1Start = null;
          function phase1(ts) {
            if (!p1Start) p1Start = ts;
            var p = Math.min((ts - p1Start) / DESCENT_MS, 1);
            box.scrollTop = PEAK * eio(p);
            if (p < 1) { requestAnimationFrame(phase1); return; }
            /* hand off to spring */
            phase2();
          }

          /* ── Phase 2: spring from rest at PEAK → 0 ── */
          function phase2() {
            var pos    = PEAK;
            var vel    = 0;
            var lastTs = null;

            function physicsStep(ts) {
              if (!lastTs) { lastTs = ts; requestAnimationFrame(physicsStep); return; }
              var dt = Math.min((ts - lastTs) / 1000, 0.033);
              lastTs = ts;

              vel += (-stiffness * pos - drag * vel) * dt;
              pos += vel * dt;

              if (pos < 0) {
                pos = 0;
                if (vel < 0) vel = -vel * restitution;
              }

              box.scrollTop = pos;

              if (pos > 0.4 || Math.abs(vel) > 2) {
                requestAnimationFrame(physicsStep);
              } else {
                box.scrollTop = 0;
              }
            }
            requestAnimationFrame(physicsStep);
          }

          requestAnimationFrame(phase1);
        }, 300);
      }

      /* play video after insert */
      var mv = modalContent.querySelector('video');
      if (mv) {
        mv.load();
        mv.play().catch(function () {});
      }
    }

    slides.forEach(function (slide) {
      slide.addEventListener('click', function () { openModal(slide); });
      slide.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(slide); }
      });
    });

    /* ── Modal close ── */
    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      var mv = modalContent.querySelector('video');
      if (mv) mv.pause();
      setTimeout(function () {
        overlay.style.display = 'none';
        modalContent.innerHTML = '';
      }, 260);
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
  }

  window.addEventListener('load', init);
}());
