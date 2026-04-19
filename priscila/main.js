const container = document.getElementById('heart-container');
const text = "priscilla";
const totalElements = 90;
const elements = [];

let width = window.innerWidth / 2;
let height = window.innerHeight / 2;

function init() {
    container.innerHTML = '';
    for (let i = 0; i < totalElements; i++) {
        const span = document.createElement('span');
        span.className = 'text-unit';
        span.innerText = text;
        container.appendChild(span);
        elements.push({
            el: span,
            angle: (i / totalElements) * Math.PI * 2
        });
    }
}

let rotation = 0;

function draw() {
    rotation += 0.004; 

    elements.forEach((item) => {
        const t = item.angle + rotation;
        
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        x *= 18;
        y *= 18;

        const perspectiveAngle = -0.7;
        const xFinal = x * Math.cos(perspectiveAngle); 
        const zFinal = x * Math.sin(perspectiveAngle); 
        const yFinal = y;

        const depthEffect = (zFinal + 200) / 400; 
        
        item.el.style.transform = `
            translate3d(${width + xFinal}px, ${height + yFinal}px, ${zFinal}px)
            rotateY(${-perspectiveAngle}rad)
            scale(${0.7 + depthEffect * 0.5})
        `;
        item.el.style.opacity = 0.2 + depthEffect * 0.8;
    });
    
    requestAnimationFrame(draw);
}

function createExplosion(x, y) {
    const numberOfHearts = 15;

    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('span');
        heart.className = 'explosion-heart';
        heart.innerText = '<3';
        
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity;

        heart.style.transition = 'transform 1s cubic-bezier(0.1, 0.5, 0.3, 1), opacity 1s ease-out';
        
        document.body.appendChild(heart);

        void heart.offsetHeight; 

        const finalScale = 0.3 + Math.random() * 0.7;
        heart.style.transform = `translate(-50%, -50%) translate3d(${destinationX}px, ${destinationY}px, 0px) scale(${finalScale})`;
        heart.style.opacity = '0';

        setTimeout(() => heart.remove(), 1000);
    }
}

document.body.addEventListener('click', (event) => {
    createExplosion(event.clientX, event.clientY);
});

window.addEventListener('resize', () => {
    width = window.innerWidth / 2;
    height = window.innerHeight / 2;
});

init();
draw();