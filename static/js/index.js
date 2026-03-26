window.HELP_IMPROVE_VIDEOJS = false;

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
