import { camera, scene } from './scene.js';
import { cube } from './cube.js';
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';

let isDragging = false;
export { isDragging };
let dragThreshold = 0; // Records the total movement during dragging
let targetZoom = camera.position.z; // The zoom position we want to reach
const zoomSpeed = 0.1; // Zoom sensitivity
const smoothingFactor = 0.1; // Determines how smooth the zooming is (lower is smoother)
const maxClickThreshold = 5; // Maximum movement (in pixels) to still consider as a click


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let lastTouchX = 0;
let lastTouchY = 0;

function onMouseDown() {
    isDragging = true; // Start dragging
    dragThreshold = 0;
}

function onMouseMove(event) {
    if (!isDragging) return;

    const rotationSpeed = 0.005; // Adjust rotation speed

    // Use event.movementX/movementY (mouse movement) OR default to 0 if unavailable
    const deltaX = event.movementX || event.deltaX || 0; // Horizontal movement
    const deltaY = event.movementY || event.deltaY || 0; // Vertical movement

    // Update drag threshold (track movement distance)
    dragThreshold += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cube.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    cube.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis
}

function onTouchMove(event) {
    if (!isDragging) return;

    const rotationSpeed = 0.005; // Adjust rotation speed

    const touch = event.touches[0];
    const deltaX = touch.clientX - lastTouchX; // Horizontal movement
    const deltaY = touch.clientY - lastTouchY; // Vertical movement

    // Update drag threshold (track movement distance)
    dragThreshold += Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cube.rotation.y += deltaX * rotationSpeed; // Rotate on Y-axis
    cube.rotation.x += deltaY * rotationSpeed; // Rotate on X-axis

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}


function onMouseUp() {
    isDragging = false; // Stop dragging
}

function onMouseClick(event) {
    if (dragThreshold > maxClickThreshold)
        return; // It was a drag, so don't navigate.
        // Convert mouse click to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2); // Get cube face
        redirectToPage(faceIndex);
    }
}

function redirectToPage(faceIndex) {
    const pages = [
        './Pages/Playground.html',
        './Pages/Halloween.html',
        './Pages/About.html',
        './Pages/Legalisation.html',
    ];
    if (faceIndex >= 0 && faceIndex < pages.length) {
        window.location.href = pages[faceIndex]; // Navigate to corresponding page
    }
}

// Touch event handlers
function onTouchStart(event) {
    isDragging = true; // Start dragging
    dragThreshold = 0;
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
}

function onTouchEnd() {
    isDragging = false; // Stop dragging
}

function registerEventListeners(renderer) {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onMouseClick); // Enable raycasting
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
}


export { registerEventListeners };