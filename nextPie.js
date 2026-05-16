// State
let currentFilter = "none";
let currentFrame = "red";
let isCameraActive = false;
let capturedImage = null;
let stream = null;

<<<<<<< HEAD
// Elements dari HTML
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedPhoto = document.getElementById('capturedPhoto');
const placeholder = document.getElementById('placeholder');
const shootBtn = document.getElementById('shootBtn');
const retakeBtn = document.getElementById('retakeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const frameArea = document.getElementById('frameArea');
const frameOverlay = document.getElementById('frameOverlay');
=======
// Elements
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
>>>>>>> c264017 (bebaslah)

// Elemen baru dari HTML
const previewImg = document.getElementById('previewImg');
const previewPlaceholder = document.getElementById('previewPlaceholder');

// Menjalankan kamera otomatis saat web dibuka
window.addEventListener('load', startCamera);

// Timer
const countdownTimer = document.getElementById('countdownTimer');
let timerInterval; // Untuk menyimpan interval waktu

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
<<<<<<< HEAD
    frameArea.style.backgroundColor = frameColors[currentFrame];
    if (frameOverlay) {
        frameOverlay.src = frameTemplates[currentFrame];
    }
=======
  frameArea.style.backgroundColor = frameColors[currentFrame];
  frameOverlay.src = frameTemplates[currentFrame];
>>>>>>> c264017 (bebaslah)
}

// Start camera
async function startCamera() {
<<<<<<< HEAD
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user' // Kamera depan
            }
        });

        video.srcObject = stream;
        video.style.display = 'block';
        video.style.transform = 'scaleX(-1)'; 
        
        placeholder.style.display = 'none';
        capturedPhoto.style.display = 'none';
        isCameraActive = true;

    } catch (err) {
        console.error('Error accessing camera:', err);
        placeholder.textContent = 'Tidak dapat mengakses kamera. Pastikan memberikan izin kamera di browser.';
    }
=======
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

    // [REVISI]: Membalikkan layar preview video agar tidak mirror
    video.style.transform = "scaleX(-1)";

    placeholder.style.display = "none";
    capturedPhoto.style.display = "none";
    isCameraActive = true;
  } catch (err) {
    console.error("Error accessing camera:", err);
    placeholder.textContent =
      "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.";
  }
>>>>>>> c264017 (bebaslah)
}

// Stop camera
function stopCamera() {
<<<<<<< HEAD
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.srcObject = null;
    video.style.display = 'none';
    isCameraActive = false;
}

// Fungsi untuk Update Live Filter
function updateLiveFilter() {
    let cssFilter = 'none';
    if (currentFilter === 'bw') {
        cssFilter = 'grayscale(100%)';
    } else if (currentFilter === 'vintage') {
        cssFilter = 'sepia(60%) contrast(110%) brightness(90%)';
    }

    
    video.style.filter = cssFilter;
    capturedPhoto.style.filter = cssFilter;
    if (previewImg) {
        previewImg.style.filter = cssFilter;
=======
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  video.srcObject = null;
  video.style.display = "none";
  isCameraActive = false;
}

// Apply filter to canvas
function applyFilter(ctx, width, height) {
  if (currentFilter === "bw") {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
>>>>>>> c264017 (bebaslah)
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (currentFilter === "vintage") {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.2);
      data[i + 1] = data[i + 1] * 0.9;
      data[i + 2] = data[i + 2] * 0.7;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

// Capture photo 
function capturePhoto() {
<<<<<<< HEAD
    if (!video.videoWidth || !video.videoHeight) {
        alert('Tunggu sebentar, kamera sedang dimuat...');
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Anti-mirror untuk kanvas sebelum dicetak
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

   // filter 
    if (currentFilter === 'bw') {
        ctx.filter = 'grayscale(100%)';
    } else if (currentFilter === 'vintage') {
        ctx.filter = 'sepia(60%) contrast(110%) brightness(90%)';
    } else {
        ctx.filter = 'none';
    }

    // Cetak gambar
    ctx.drawImage(video, 0, 0);

    // Kembalikan ke normal
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Simpan data gambar
    capturedImage = canvas.toDataURL('image/png');

    // Tampilkan di area utama
    capturedPhoto.src = capturedImage;
    capturedPhoto.style.display = 'block';
    capturedPhoto.style.transform = 'none'; 

    if (previewImg && previewPlaceholder) {
        previewImg.src = capturedImage;
        previewImg.style.display = 'block';
        previewPlaceholder.style.display = 'none';
    }
=======
  if (!video.videoWidth || !video.videoHeight) {
    alert("Video belum siap. Silakan coba lagi.");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  // --- [REVISI]: Membalikkan kanvas sebelum digambar agar hasilnya tidak mirror ---
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  // -------------------------------------------------------------------------------

  ctx.drawImage(video, 0, 0);

  // --- [REVISI]: Kembalikan posisi kanvas ke normal biar filternya tidak berantakan ---
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // ------------------------------------------------------------------------------------

  applyFilter(ctx, canvas.width, canvas.height);

  capturedImage = canvas.toDataURL("image/png");

  capturedPhoto.src = capturedImage;
  capturedPhoto.style.display = "block";
>>>>>>> c264017 (bebaslah)

  // [REVISI]: Pastikan foto yang ditampilkan juga tidak ikut terbalik karena efek CSS video sebelumnya
  capturedPhoto.style.transform = "none";

  stopCamera();

  retakeBtn.disabled = false;
  downloadBtn.disabled = false;
}

// Fungsi hitungan mundur (Timer)
function startCountdown(seconds) {
    // Nonaktifkan tombol sementara agar user tidak spam klik saat timer berjalan
    shootBtn.disabled = true; 
    
    // Tampilkan timer dan set angka awalnya
    countdownTimer.style.display = 'block';
    countdownTimer.textContent = seconds;

    timerInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            // Update angka di layar
            countdownTimer.textContent = seconds;
        } else {
            // Jika timer habis (0)
            clearInterval(timerInterval);
            countdownTimer.style.display = 'none'; // Sembunyikan angka timer
            
            capturePhoto(); // Ambil foto
            
            shootBtn.disabled = false; // Aktifkan tombol kembali
        }
    }, 1000); // 1000 ms = 1 detik
}

// Handle shoot button
<<<<<<< HEAD
shootBtn.addEventListener('click', () => {
    if (isCameraActive) {
        // PANGGIL TIMER DI SINI (Misalnya 3 detik)
        startCountdown(3); 
    } else {
        startCamera();
        capturedPhoto.style.display = 'none';
    }
});

// Handle retake button
retakeBtn.addEventListener('click', () => {
    capturedImage = null;
    capturedPhoto.style.display = 'none';
    
    // Kosongkan frame dan munculkan tulisan "Preview" lagi
    if (previewImg && previewPlaceholder) {
        previewImg.src = "";
        previewImg.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
    }
    
    placeholder.style.display = 'none';
    retakeBtn.disabled = true;
    downloadBtn.disabled = true;
    
    startCamera();
=======
shootBtn.addEventListener("click", () => {
  if (isCameraActive) {
    capturePhoto();
  } else {
    startCamera();
    capturedPhoto.style.display = "none";
  }
});

// Handle retake button
retakeBtn.addEventListener("click", () => {
  capturedImage = null;
  capturedPhoto.style.display = "none";
  placeholder.style.display = "none";
  retakeBtn.disabled = true;
  downloadBtn.disabled = true;
  startCamera();
>>>>>>> c264017 (bebaslah)
});

// Handle download button
downloadBtn.addEventListener("click", () => {
  if (capturedImage) {
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `photobooth-${Date.now()}.png`;
    link.click();
  }
});

// Handle back button
<<<<<<< HEAD
backBtn.addEventListener('click', () => {
    // Kembali ke halaman kuis matematika (index.html)
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
<<<<<<< HEAD
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        
        // Panggil fungsi live filter setiap kali tombol filter ditekan
        updateLiveFilter();
    });
=======
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
  });
>>>>>>> c264017 (bebaslah)
});

// Initialize frame color saat pertama dibuka
updateFrameColor();

<<<<<<< HEAD
// Matikan kamera kalau pengguna menutup tab/browser
window.addEventListener('beforeunload', () => {
    stopCamera();
});


=======
// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  stopCamera();
});
>>>>>>> c264017 (bebaslah)
