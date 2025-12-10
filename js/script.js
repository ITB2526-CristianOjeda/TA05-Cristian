// Old starfield code removed — loader uses pure CSS now.
// Kept minimal script to avoid errors if other code expects script.js to exist.

(function () {
  // No-op: page loader animation is handled by CSS inside .starbox
})();

// Add CSS keyframes/styles and enable animations for the Jedi logo loader.
// Kept minimal and respectful of prefers-reduced-motion.

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Respect user's reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Inject CSS for loader/icon animations (if not already injected)
    if (!document.getElementById('jedi-animations')) {
      var css = `
/* Jedi loader & icon animations (injected by script) */
@keyframes loader {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes iconGlow {
  0%, 20%, 100% { box-shadow: 0 0 0 rgba(173,216,230,0); transform: translate(-50%, -50%) scale(1); opacity: 0.0; }
  40%, 60%      { box-shadow: 0 10px 30px rgba(173,216,230,0.45); transform: translate(-50%, -50%) scale(1.02); opacity: 1; }
  50%           { transform: translate(-50%, -50%) scale(1.06); }
}
.loading-wrapper.animate {
  animation: loader 1.5s linear infinite;
  transform-origin: center center;
  will-change: transform;
}
.icon.animate {
  animation: iconGlow 3s ease-in-out infinite;
  will-change: box-shadow, transform, opacity;
  -webkit-font-smoothing: antialiased;
}
/* Ensure dots are GPU-accelerated for smooth motion */
.loading-wrapper .dot,
.loading-wrapper .dot-two {
  will-change: transform, box-shadow;
}
`;
      var style = document.createElement('style');
      style.id = 'jedi-animations';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }

    // Grab elements
    var wrapper = document.querySelector('.loading-wrapper');
    var icon = document.querySelector('.icon');
    var dot = document.querySelector('.dot');
    var dotTwo = document.querySelector('.dot-two');

    // Add animation classes (do not change layout/size)
    if (wrapper) wrapper.classList.add('animate');
    if (icon) icon.classList.add('animate');

    // Subtle vertical micro-movement for the two dots using Web Animations API
    // (lightweight and smooth on modern browsers, falls back silently if not supported)
    try {
      if (dot && dot.animate) {
        dot.animate(
          [
            { transform: 'translate(-50%, -6px)' },
            { transform: 'translate(-50%, 2px)' },
            { transform: 'translate(-50%, -6px)' }
          ],
          { duration: 1300, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
      if (dotTwo && dotTwo.animate) {
        dotTwo.animate(
          [
            { transform: 'translate(-50%, 6px)' },
            { transform: 'translate(-50%, -2px)' },
            { transform: 'translate(-50%, 6px)' }
          ],
          { duration: 1400, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
    } catch (e) {
      // silent fallback for older browsers
      // no-op
    }

    // Pause/resume animations on visibility change to save resources
    document.addEventListener('visibilitychange', function () {
      var isHidden = document.hidden;
      if (wrapper) {
        wrapper.style.animationPlayState = isHidden ? 'paused' : 'running';
      }
      if (icon) {
        icon.style.animationPlayState = isHidden ? 'paused' : 'running';
      }
      // Web Animations pause/resume handled by browser automatically when page hidden,
      // but we keep the above for CSS-animation fallback.
    }, false);
  });
})();
