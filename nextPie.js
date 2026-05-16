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
  video.style.display = "none";

  isCameraActive = false;
}

// Fungsi untuk Update Live Filter
function updateLiveFilter() {

  let cssFilter = "none";

  if (currentFilter === "bw") {
    cssFilter = "grayscale(100%)";
  } else if (currentFilter === "vintage") {
    cssFilter = "sepia(60%) contrast(110%) brightness(90%)";
  }

  video.style.filter = cssFilter;
  capturedPhoto.style.filter = cssFilter;

  if (previewImg) {
    previewImg.style.filter = cssFilter;
  }
}

// Capture photo
function capturePhoto() {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  // BATAS 3 FOTO
  if (currentSlot >= 3) {
    alert("3 foto sudah penuh!");
    return;
  }

  if (!video.videoWidth || !video.videoHeight) {
    alert("Tunggu sebentar, kamera sedang dimuat...");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  // Anti-mirror
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  // filter
  if (currentFilter === "bw") {
    ctx.filter = "grayscale(100%)";
  } else if (currentFilter === "vintage") {
    ctx.filter = "sepia(60%) contrast(110%) brightness(90%)";
  } else {
    ctx.filter = "none";
  }

  // Cetak gambar
  ctx.drawImage(video, 0, 0);

  // Reset transform
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // SIMPAN FOTO
  const photoData = canvas.toDataURL("image/png");

  capturedImages.push(photoData);

  currentSlot++;

  // Render photostrip
  renderPhotoStrip();

  retakeBtn.disabled = false;

  // Aktif kalau sudah ada minimal 1 foto
  downloadBtn.disabled = false;

  // Kalau sudah 3 foto matikan kamera
  if (currentSlot >= 3) {
    stopCamera();
  }
}

// RENDER PHOTO STRIP
function renderPhotoStrip() {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  const stripCanvas = document.createElement("canvas");
  const ctx = stripCanvas.getContext("2d");

  stripCanvas.width = 400;
  stripCanvas.height = 1200;

  // POSISI SLOT FOTO
  const slots = [
    { x: 60, y: 90, w: 280, h: 280 },
    { x: 60, y: 430, w: 280, h: 280 },
    { x: 60, y: 770, w: 280, h: 280 },
  ];

  let loadedCount = 0;

  capturedImages.forEach((src, index) => {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
    const img = new Image();

    img.src = src;

    img.onload = () => {
<<<<<<< HEAD
      const s = slots[index];

      ctx.drawImage(img, s.x, s.y, s.w, s.h);
=======

      const s = slots[index];

      ctx.drawImage(
        img,
        s.x,
        s.y,
        s.w,
        s.h
      );
>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf

      loadedCount++;

      // kalau semua foto selesai dimasukin
      if (loadedCount === capturedImages.length) {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
        const frameImg = new Image();

        frameImg.src = frameTemplates[currentFrame];

        frameImg.onload = () => {
<<<<<<< HEAD
          ctx.drawImage(frameImg, 0, 0, stripCanvas.width, stripCanvas.height);

          const finalImage = stripCanvas.toDataURL("image/png");
=======

          ctx.drawImage(
            frameImg,
            0,
            0,
            stripCanvas.width,
            stripCanvas.height
          );

          const finalImage =
            stripCanvas.toDataURL("image/png");
>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf

          previewImg.src = finalImage;

          previewImg.style.display = "block";

          previewPlaceholder.style.display = "none";

          // simpan hasil final buat download
          downloadBtn.dataset.image = finalImage;
        };
      }
    };
  });
}

// Fungsi hitungan mundur
function startCountdown(seconds) {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  shootBtn.disabled = true;

  countdownTimer.style.display = "block";
  countdownTimer.textContent = seconds;

  timerInterval = setInterval(() => {

    seconds--;

    if (seconds > 0) {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
      countdownTimer.textContent = seconds;

    } else {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
      clearInterval(timerInterval);

      countdownTimer.style.display = "none";

      capturePhoto();

      shootBtn.disabled = false;
    }
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  }, 1000);
}

// Handle shoot button
shootBtn.addEventListener("click", () => {

  if (isCameraActive) {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
    startCountdown(3);

  } else {

    startCamera();

    capturedPhoto.style.display = "none";
  }
});

// Handle retake button
retakeBtn.addEventListener("click", () => {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  // RESET SEMUA
  capturedImages = [];
  currentSlot = 0;

  capturedPhoto.style.display = "none";

  if (previewImg && previewPlaceholder) {

    previewImg.src = "";

    previewImg.style.display = "none";

    previewPlaceholder.style.display = "flex";
  }

  placeholder.style.display = "none";

  retakeBtn.disabled = true;

  downloadBtn.disabled = true;

  delete downloadBtn.dataset.image;

  startCamera();
});

// Handle download button
downloadBtn.addEventListener("click", () => {
<<<<<<< HEAD
  if (downloadBtn.dataset.image) {
=======

  if (downloadBtn.dataset.image) {

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
    const link = document.createElement("a");

    link.href = downloadBtn.dataset.image;

<<<<<<< HEAD
    link.download = `photobooth-${Date.now()}.png`;
=======
    link.download =
      `photobooth-${Date.now()}.png`;
>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf

    link.click();
  }
});

// Handle back button
backBtn.addEventListener("click", () => {
<<<<<<< HEAD
=======

>>>>>>> 90070b720a04038431508cf72882a1ded5f7deaf
  window.location.href = "index.html";
});

// Frame selection
document.querySelectorAll(".frame-btn").forEach((btn) => {

  btn.addEventListener("click", (e) => {

    document
      .querySelectorAll(".frame-btn")
      .forEach((b) => b.classList.remove("active"));

    e.target.classList.add("active");

    currentFrame = e.target.dataset.frame;

    updateFrameColor();
  });
});

// Filter selection
document.querySelectorAll(".filter-btn").forEach((btn) => {

  btn.addEventListener("click", (e) => {

    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));

    e.target.classList.add("active");

    currentFilter = e.target.dataset.filter;
    
    updateLiveFilter();
  });
});

// Initialize
updateFrameColor();

// Matikan kamera kalau tab ditutup
window.addEventListener("beforeunload", () => {

  stopCamera();
});