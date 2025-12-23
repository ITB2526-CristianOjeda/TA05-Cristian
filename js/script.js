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

/* =========================================
   ANIMACIÓN HIPERESPACIO (Añadido al final)
   ========================================= */

(function() {
    // Buscamos el canvas
    const canvas = document.getElementById('hyperspace-canvas');

    // IMPORTANTE: Si no estamos en la página del canvas (index), detenemos la ejecución
    // para evitar errores en otras páginas.
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    const numStars = 800; // Cantidad de estrellas
    const speed = 0.5;    // Velocidad de viaje
    let mouseX = 0;
    let mouseY = 0;

    // Clase para crear cada estrella
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * width * 2;
            this.y = (Math.random() - 0.5) * height * 2;
            this.z = Math.random() * width; // Profundidad
            this.pz = this.z; // Guardamos posición anterior para la estela
        }

        update() {
            // Mover la estrella hacia la pantalla (reducir Z)
            this.z = this.z - 10 * speed;

            // Si la estrella pasa la pantalla, la enviamos al fondo de nuevo
            if (this.z < 1) {
                this.reset();
                this.z = width;
                this.pz = this.z;
            }
        }

        draw() {
            // Calcular posición 2D basada en perspectiva 3D
            // El mouseX/Y afecta el punto de fuga (efecto de pilotaje)
            let offsetX = (mouseX - width / 2) * (width - this.z) / width * 0.5;
            let offsetY = (mouseY - height / 2) * (width - this.z) / width * 0.5;

            let sx = (this.x / this.z) * width + width / 2 + offsetX;
            let sy = (this.y / this.z) * height + height / 2 + offsetY;

            // Calcular tamaño basado en cercanía
            let r = (1 - this.z / width) * 4;

            // Calcular posición anterior para dibujar la estela (efecto velocidad)
            let px = (this.x / this.pz) * width + width / 2 + offsetX;
            let py = (this.y / this.pz) * height + height / 2 + offsetY;

            this.pz = this.z; // Actualizar Z anterior

            // Dibujar la línea de velocidad (estela)
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);

            // Color brillante cian/blanco tipo Jedi
            let alpha = (1 - this.z / width);
            ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
            ctx.lineWidth = r;
            ctx.stroke();
        }
    }

    // Inicializar el sistema
    function init() {
        resize();
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
        loop();
    }

    // Bucle de animación infinito
    function loop() {
        // Limpiar el canvas en cada frame
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(loop);
    }

    // Ajustar al tamaño de pantalla si se cambia la ventana
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Escuchar eventos
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Arrancar motores
    init();
})();