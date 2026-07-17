(function() {
    const container = document.getElementById('vortexContainer');
    if(!container) return;

    const cards = container.querySelectorAll('.vortex-card');
    const totalCards = cards.length;

    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startAngle = 0;
    let hoveredCard = null;
    let autoRotateSpeed = 0;
    let velocity = 0;
    let hasInteracted = false;
    let introBlend = 0;

    const config = {
        radius: 200,
        cardSpacing: (Math.PI * 2) / totalCards,
        tilt: -8,
        dragSensitivity: 0.005,
        friction: 0.95,
        introGap: 210,
        introSlant: 6,
    };

    if (window.innerWidth < 600) { config.radius = 120; config.introGap = 140; }
    else if (window.innerWidth < 900) { config.radius = 160; config.introGap = 170; }

    cards.forEach((card, i) => {
        card.dataset.index = i;
        card.dataset.baseAngle = (i * config.cardSpacing).toString();

        card.addEventListener('click', (e) => {
            if (hasDragged) { e.preventDefault(); return; }
            onFirstInteraction();

            const baseAngle = parseFloat(card.dataset.baseAngle);
            const angle = baseAngle + currentAngle;
            const z = Math.cos(angle) * config.radius;
            const depthRatio = (z + config.radius) / (config.radius * 2);

            if (depthRatio <= 0.5) {
                const cardIndex = parseInt(card.dataset.index);
                const currentRot = ((currentAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
                const targetRot = (Math.PI * 2) - (cardIndex * config.cardSpacing);
                targetAngle += targetRot - currentRot;
                return;
            }
        });

        card.addEventListener('mouseenter', () => { hoveredCard = card; autoRotateSpeed = 0; });
        card.addEventListener('mouseleave', () => { hoveredCard = null; if (hasInteracted) autoRotateSpeed = 0.0003; });
    });

    function onFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            autoRotateSpeed = 0.0003;
        }
    }

    container.addEventListener('mousedown', (e) => {
        onFirstInteraction();
        isDragging = true; hasDragged = false;
        startX = e.clientX; startAngle = targetAngle;
        velocity = 0; container.style.cursor = 'grabbing'; autoRotateSpeed = 0;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false; container.style.cursor = 'default';
        targetAngle += velocity * 20;
        if (hasInteracted) autoRotateSpeed = 0.0003;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        if (Math.abs(delta) > 10) hasDragged = true;
        const newAngle = startAngle + (delta * config.dragSensitivity);
        velocity = newAngle - targetAngle; targetAngle = newAngle;
    });

    container.addEventListener('touchstart', (e) => {
        onFirstInteraction();
        isDragging = true; hasDragged = false;
        startX = e.touches[0].clientX; startAngle = targetAngle;
        velocity = 0; autoRotateSpeed = 0;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!isDragging) return; isDragging = false;
        targetAngle += velocity * 20;
        if (hasInteracted) autoRotateSpeed = 0.0003;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientX - startX;
        if (Math.abs(delta) > 10) hasDragged = true;
        const newAngle = startAngle + (delta * config.dragSensitivity);
        velocity = newAngle - targetAngle; targetAngle = newAngle;
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { onFirstInteraction(); e.preventDefault(); targetAngle -= 0.5; }
        else if (e.key === 'ArrowRight') { onFirstInteraction(); e.preventDefault(); targetAngle += 0.5; }
    });

    let swayTime = 0;

    function animate() {
        swayTime += 0.02;

        if (hasInteracted && introBlend < 1) {
            introBlend += 0.02;
            if (introBlend > 1) introBlend = 1;
        }

        if (!isDragging && !hoveredCard) targetAngle += autoRotateSpeed;
        if (!isDragging) { velocity *= config.friction; targetAngle += velocity; }
        currentAngle += (targetAngle - currentAngle) * 0.1;

        cards.forEach((card, i) => {
            const baseAngle = parseFloat(card.dataset.baseAngle);
            const angle = baseAngle + currentAngle;
            const swayOff = i * 0.8;
            const swayY = Math.sin(swayTime + swayOff) * 8;
            const swayRZ = Math.sin(swayTime * 0.5 + swayOff) * 1.5;

            const introOffset = i - (totalCards - 1) / 2;
            const introX = introOffset * config.introGap;
            const introSlant = introOffset * config.introSlant;
            const introZ = introOffset === 0 ? 40 : 0;

            const orbX = Math.sin(angle) * config.radius;
            const orbZ = Math.cos(angle) * config.radius;
            const orbRotY = -angle * (180 / Math.PI);
            const depthRatio = (orbZ + config.radius) / (config.radius * 2);
            const isFront = depthRatio > 0.5;
            const orbOpacity = isFront ? 1 : 0.35 + (depthRatio * 0.3);
            const orbScale = isFront ? 1 : 0.75 + (depthRatio * 0.15);

            const t = introBlend;
            const x = introX * (1 - t) + orbX * t;
            const z = introZ * (1 - t) + orbZ * t;
            const rotY = introSlant * (1 - t) + orbRotY * t;
            const opacity = 1 * (1 - t) + orbOpacity * t;
            const scale = 1 * (1 - t) + orbScale * t;

            card.style.zIndex = Math.floor(z + config.radius);
            card.style.transform = `translateX(${x}px) translateY(${swayY}px) translateZ(${z}px) rotateY(${rotY}deg) rotateX(${config.tilt}deg) rotateZ(${swayRZ}deg)`;
            card.style.opacity = opacity;
            card.style.pointerEvents = 'auto';

            const face = card.querySelector('.card-face');
            if (face) face.style.transform = `scale(${scale})`;
        });

        requestAnimationFrame(animate);
    }

    animate();
    document.addEventListener('visibilitychange', () => {
        if (hasInteracted) autoRotateSpeed = document.hidden ? 0 : 0.0003;
    });
})();
