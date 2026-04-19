class HeartAnimation {
    constructor() {
        this.container = document.getElementById('heart-container');
        this.text = "priscilla";
        this.elements = [];
        this.rotation = 0;
        
        this.updateConfig();
        this.init();
        this.bindEvents();
        this.animate();
    }

    updateConfig() {
        this.width = window.innerWidth / 2;
        this.height = window.innerHeight / 2;
        this.isMobile = window.innerWidth < 768;
        this.totalElements = this.isMobile ? 60 : 90;
        this.scaleFactor = this.isMobile ? 12 : 18;
    }

    init() {
        this.container.innerHTML = '';
        this.elements = [];

        for (let i = 0; i < this.totalElements; i++) {
            const span = document.createElement('span');
            span.className = 'text-unit';
            span.innerText = this.text;
            this.container.appendChild(span);

            this.elements.push({
                el: span,
                angle: (i / this.totalElements) * Math.PI * 2
            });
        }
    }

    animate = () => {
        this.rotation += 0.004;
        
        const perspectiveAngle = -0.7;
        const cosP = Math.cos(perspectiveAngle);
        const sinP = Math.sin(perspectiveAngle);

        this.elements.forEach(({ el, angle }) => {
            const t = angle + this.rotation;

            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            x *= this.scaleFactor;
            y *= this.scaleFactor;

            const xFinal = x * cosP;
            const zFinal = x * sinP;
            const depthEffect = (zFinal + 200) / 400; // Normalizado 0 a 1

            el.style.transform = `
                translate3d(${this.width + xFinal}px, ${this.height + y}px, ${zFinal}px)
                rotateY(${-perspectiveAngle}rad)
                scale(${0.6 + depthEffect * 0.4})
            `;
            el.style.opacity = 0.2 + depthEffect * 0.8;
        });

        requestAnimationFrame(this.animate);
    }

    createExplosion(x, y) {
        const fragment = document.createDocumentFragment();
        const count = 15;

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.className = 'explosion-heart';
            heart.innerText = '<3';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 40 + Math.random() * 80;
            const destX = Math.cos(angle) * velocity;
            const destY = Math.sin(angle) * velocity;

            Object.assign(heart.style, {
                left: `${x}px`,
                top: `${y}px`,
                transition: 'transform 1s cubic-bezier(0.1, 0.5, 0.3, 1), opacity 1s ease-out'
            });

            fragment.appendChild(heart);

            setTimeout(() => {
                heart.style.transform = `translate(-50%, -50%) translate3d(${destX}px, ${destY}px, 0px) scale(${Math.random() * 0.6 + 0.3})`;
                heart.style.opacity = '0';
            }, 10);

            setTimeout(() => heart.remove(), 1000);
        }
        document.body.appendChild(fragment);
    }

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
            
            const hue = Math.floor(Math.random() * 360);
            const color = `hsl(${hue}, 100%, 60%)`;
            
            document.documentElement.style.setProperty('--primary-color', color);
            document.documentElement.style.setProperty('--glow-color', `${color}80`);
        });

        window.addEventListener('resize', () => {
            const oldTotal = this.totalElements;
            this.updateConfig();
            if (oldTotal !== this.totalElements) this.init();
        });
    }
}

new HeartAnimation();