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
