function calcAngle(p1, p2) {
	var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	return radToDegree(angle);
}

function radToDegree(rad) {
	return ((rad > 0 ? rad : 2 * Math.PI + rad) * 360) / (2 * Math.PI);
}

// Calculate container size and create stars inside #starfield
let scw, sch, scx, scy;
let centerBounds = 40;
let starfield;

function calcCenter() {
	// place center marker inside starfieldd (hidden)
	let center = document.createElement("div");
	center.setAttribute("class", "center");
	center.style.top = scy + "px";
	center.style.left = scx + "px";
	// append to starfield container
	if (starfield) {
		starfield.appendChild(center);
	} else {
		document.body.appendChild(center);
	}
}

function clearStars() {
	if (!starfield) return;
	starfield.innerHTML = '';
}

function buildStars(count = 1200) { // increased default count to fill expanded area
	if (!starfield) return;
	clearStars();
	// Create stars inside the starfield element's local coordinates
	for (let i = 0; i < count; i++) {
		let div = document.createElement("div");
		let top = Math.floor(Math.random() * sch);
		let left = Math.floor(Math.random() * scw);
		let angle = calcAngle({ x: left, y: top }, { x: scx, y: scy });
		div.setAttribute("class", "star");
		div.style.top = top + "px";
		div.style.left = left + "px";
		div.style.transform = "rotate(" + (angle + 180) + "deg)";
		div.style.animationDuration = (2 + Math.random() * 5) + "s";
		div.style.animationDelay = (Math.random() * 1.5) + "s";
		if (
			top >= scy - centerBounds &&
			top <= scy + centerBounds &&
			left >= scx - centerBounds &&
			left <= scx + centerBounds
		) {
			div.style.maxWidth = "1px";
			div.style.width = "1px";
		}
		starfield.appendChild(div);
	}
}

function init() {
	starfield = document.getElementById('starfield') || document.body;
	// compute starfield bounding box (so stars live inside the reduced center box)
	let rect = starfield.getBoundingClientRect();
	sch = Math.max(1, Math.floor(rect.height));
	scw = Math.max(1, Math.floor(rect.width));
	scx = scw / 2;
	scy = sch / 2;
	// ensure children use local coordinates: starfield should be positioned in CSS (relative)
	// do not override its positioning here to avoid breaking layout
	starfield.style.overflow = 'hidden';
	calcCenter();
	buildStars(800);
}

// Rebuild on resize (use the starfield's size)
window.addEventListener('resize', function () {
	clearTimeout(window._starResize);
	window._starResize = setTimeout(function () {
		if (!starfield) return;
		let rect = starfield.getBoundingClientRect();
		sch = Math.max(1, Math.floor(rect.height));
		scw = Math.max(1, Math.floor(rect.width));
		scx = scw / 2;
		scy = sch / 2;
		buildStars(800);
	}, 150);
});

// Initialize after DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}