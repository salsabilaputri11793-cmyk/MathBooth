// State
let currentFilter = "none";
let currentFrame = "red";
let isCameraActive = false;

// UBAH INI
let capturedImages = [];
let currentSlot = 0;

let stream = null;

// Elements dari HTML
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const capturedPhoto = document.getElementById("capturedPhoto");
const placeholder = document.getElementById("placeholder");
const shootBtn = document.getElementById("shootBtn");
const retakeBtn = document.getElementById("retakeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const backBtn = document.getElementById("backBtn");
const frameArea = document.getElementById("frameArea");
const frameOverlay = document.getElementById("frameOverlay");

// Elemen baru dari HTML
const previewImg = document.getElementById("previewImg");
const previewPlaceholder = document.getElementById("previewPlaceholder");

// Menjalankan kamera otomatis saat web dibuka
window.addEventListener("load", startCamera);

// Timer
const countdownTimer = document.getElementById("countdownTimer");
let timerInterval;

// Frame colors
const frameColors = {
  red: "rgba(248, 124, 139, 0.62)",
  pink: "rgba(255, 192, 203, 0.62)",
  blue: "rgba(145, 181, 230, 0.62)",
};

// TEMPLATE FRAME
const frameTemplates = {
  red: "Frame Red.jpeg",
  pink: "Frame Pink.jpeg",
  blue: "Frame Blue.jpeg",
};

// Update frame color & overlay
function updateFrameColor() {
  frameArea.style.backgroundColor = frameColors[currentFrame];

  if (frameOverlay) {
    frameOverlay.src = frameTemplates[currentFrame];
  }

  // render ulang preview kalau user ganti frame
  if (capturedImages.length > 0) {
    renderPhotoStrip();
  }
}

// Start camera
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
    });

    video.srcObject = stream;
    video.style.display = "block";
    video.style.transform = "scaleX(-1)";

    placeholder.style.display = "none";
    capturedPhoto.style.display = "none";

    isCameraActive = true;

  } catch (err) {

    console.error("Error accessing camera:", err);

    placeholder.textContent =
      "Tidak dapat mengakses kamera. Pastikan memberikan izin kamera di browser.";
  }
}

// Stop camera
function stopCamera() {

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  video.srcObject = null;
}