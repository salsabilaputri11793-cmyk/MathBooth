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
  red: "rgba(251, 14, 41, 0.62)",
  pink: "rgba(255, 192, 203, 0.62)",
  blue: "rgba(145, 181, 230, 0.62)",
};

// TEMPLATE FRAME
const frameTemplates = {
  red: "frameFixMerah.png",
  pink: "frameFixPink.png",
  blue: "frameFixBiru.png",
};

// UKURAN DAN POSISI SLOT UNTUK MASING-MASING FRAME
const frameSlots = {
  red: [
    { x: 45, y: 316, w: 310, h: 225 },
    { x: 45, y: 559, w: 310, h: 225 },
    { x: 45, y: 802, w: 310, h: 225 },
  ],
  pink: [
    { x: 140, y: 245, w: 237, h: 236 },
    { x: 140, y: 543, w: 237, h: 235 },
    { x: 140, y: 845, w: 237, h: 230 },
  ],
  blue: [
    { x: 74, y: 202, w: 276, h: 284 },
    { x: 74, y: 568, w: 276, h: 284 },
    { x: 74, y: 932, w: 276, h: 268 },
  ],
};

// Update frame color & overlay
function updateFrameColor() {
  frameArea.style.backgroundColor = frameColors[currentFrame];

  if (frameOverlay) {
    frameOverlay.src = frameTemplates[currentFrame];
  }

  // Update ukuran kamera sesuai rasio lubang frame
  const cameraInner = document.querySelector(".camera-bg-inner");
  if (cameraInner) {
    if (currentFrame === "blue") {
      cameraInner.style.width = "360px";
      cameraInner.style.left = "230px";
    } else if (currentFrame === "pink") {
      cameraInner.style.width = "372px";
      cameraInner.style.left = "224px";
    } else {
      // red
      cameraInner.style.width = "510px";
      cameraInner.style.left = "155px";
    }
  }

  // Update background di belakang preview frame
  const previewGradient = document.querySelector(".preview-gradient");
  if (previewGradient) {
    if (currentFrame === "red") {
      previewGradient.style.background =
        "linear-gradient(180deg, #4a332a 0%, #2b1d18 100%)"; // Coklat tua
    } else if (currentFrame === "pink") {
      previewGradient.style.background =
        "linear-gradient(180deg, #fad0c4 0%, #ffd1ff 100%)"; // Pink muda pastel
    } else if (currentFrame === "blue") {
      previewGradient.style.background =
        "linear-gradient(180deg, #a1c4fd 0%, #c2e9fb 100%)"; // Biru muda pastel
    }
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
video.style.display = "none";

isCameraActive = false;

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

  // Render ulang kalau ganti filter setelah ambil foto
  if (capturedImages.length > 0) {
    renderPhotoStrip();
  }
}

// Capture photo
function capturePhoto() {
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

  // Jangan aplikasikan filter di sini, simpan foto asli
  ctx.filter = "none";

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
  const stripCanvas = document.createElement("canvas");
  const ctx = stripCanvas.getContext("2d");

  stripCanvas.width = 400;
  stripCanvas.height = 1200;

  // POSISI SLOT FOTO (Disesuaikan dengan frame yang dipilih)
  const slots = frameSlots[currentFrame];

  let loadedCount = 0;

  capturedImages.forEach((src, index) => {
    const img = new Image();

    img.src = src;

    img.onload = () => {
      const s = slots[index];

      // Logic untuk object-fit: cover (supaya foto tidak gepeng)
      const imgRatio = img.width / img.height;
      const slotRatio = s.w / s.h;

      let sx, sy, sw, sh;
      if (imgRatio > slotRatio) {
        // Gambar lebih lebar dari slot, potong kiri kanan
        sh = img.height;
        sw = img.height * slotRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        // Gambar lebih tinggi dari slot, potong atas bawah
        sw = img.width;
        sh = img.width / slotRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      // Aplikasikan filter SAAT menggambar ke photostrip (jadi bisa diganti-ganti)
      if (currentFilter === "bw") {
        ctx.filter = "grayscale(100%)";
      } else if (currentFilter === "vintage") {
        ctx.filter = "sepia(60%) contrast(110%) brightness(90%)";
      } else {
        ctx.filter = "none";
      }

      ctx.drawImage(img, sx, sy, sw, sh, s.x, s.y, s.w, s.h);

      // Reset filter kembali ke none (supaya frame tidak kena filter)
      ctx.filter = "none";

      loadedCount++;

      // kalau semua foto selesai dimasukin
      if (loadedCount === capturedImages.length) {
        const frameImg = new Image();

        frameImg.src = frameTemplates[currentFrame];

        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, stripCanvas.width, stripCanvas.height);

          const finalImage = stripCanvas.toDataURL("image/png");

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
  shootBtn.disabled = true;

  countdownTimer.style.display = "block";
  countdownTimer.textContent = seconds;

  timerInterval = setInterval(() => {
    seconds--;

    if (seconds > 0) {
      countdownTimer.textContent = seconds;
    } else {
      clearInterval(timerInterval);

      countdownTimer.style.display = "none";

      capturePhoto();

      shootBtn.disabled = false;
    }
  }, 1000);
}

// Handle shoot button
shootBtn.addEventListener("click", () => {
  if (isCameraActive) {
    startCountdown(3);
  } else {
    startCamera();

    capturedPhoto.style.display = "none";
  }
});

// Handle retake button
retakeBtn.addEventListener("click", () => {
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
  if (downloadBtn.dataset.image) {
    const link = document.createElement("a");

    link.href = downloadBtn.dataset.image;

    link.download = `photobooth-${Date.now()}.png`;

    link.click();
  }
});

// Handle back button
backBtn.addEventListener("click", () => {
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
