
// Clock code
const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const RADIUS = canvas.width / 2 - 10;

// Clock draw function
function drawClock() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a radial gradient
    // The gradient's center (cx, cy) and its end radius (r) depend on the clock's position and size.
    var gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
    gradient.addColorStop(0, 'darkred');
    gradient.addColorStop(1, 'red');
    ctx.shadowColor = gradient;

    // Set shadow properties
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";  // semi-transparent black shadow
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;



    // Draw the circle
    ctx.strokeStyle = 'black';
    ctx.fillStyle = '#ecf0f1';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Draw hour hand
    drawHand((hours % 12 + minutes / 60) * (2 * Math.PI / 12) - Math.PI / 2, RADIUS * 0.5, 6, '#2980b9');

    // Draw minute hand
    drawHand((minutes + seconds / 60) * (2 * Math.PI / 60) - Math.PI / 2, RADIUS * 0.75, 4, '#c0392b');

    // Draw second hand
    drawHand(seconds * (2 * Math.PI / 60) - Math.PI / 2, RADIUS * 0.9, 2, '#27ae60');

    // Draw hour numbers
    for (let hour = 1; hour <= 12; hour++) {
        const angle = hour * (2 * Math.PI / 12) - Math.PI / 2; // -Math.PI/2 to start from the top
        const x = CENTER_X + (RADIUS * 0.85) * Math.cos(angle);
        const y = CENTER_Y + (RADIUS * 0.85) * Math.sin(angle);
        ctx.font = (hour === 12 || hour === 3 || hour === 6 || hour === 9) ? "bold 28px Roboto" : "18px Roboto";
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hour.toString(), x, y);
    }

    // Draw minute indicators (every 5 minutes)
    for (let min = 1; min <= 60; min++) {
        const angle = min * (2 * Math.PI / 60) - Math.PI / 2;
        const x1 = CENTER_X + (RADIUS * 0.95) * Math.cos(angle);
        const y1 = CENTER_Y + (RADIUS * 0.95) * Math.sin(angle);
        const x2 = CENTER_X + RADIUS * Math.cos(angle);
        const y2 = CENTER_Y + RADIUS * Math.sin(angle);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#34495e';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

function drawHand(angle, length, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#333';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X + length * Math.cos(angle), CENTER_Y + length * Math.sin(angle));
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow after drawing
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// Update the clock every second
document.addEventListener('DOMContentLoaded', function () {
    // Clock code here...

    // Update the clock every second
    setInterval(drawClock, 1000);
});