// State 
let currentFilter = 'none';
let currentFrame = 'red';
let isCameraActive = false;
let capturedImage = null;
let stream = null;

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

// Elemen baru dari HTML-mu
const previewImg = document.getElementById('previewImg');
const previewPlaceholder = document.getElementById('previewPlaceholder');

// Menjalankan kamera otomatis saat web dibuka
window.addEventListener('load', startCamera);

// Frame colors
const frameColors = {
    red: 'rgba(248, 124, 139, 0.62)',
    pink: 'rgba(255, 192, 203, 0.62)',
    blue: 'rgba(145, 181, 230, 0.62)'
};

// TEMPLATE FRAME (Pastikan huruf besar/kecilnya sama dengan nama file gambar di folder)
const frameTemplates = {
    red: "Frame Red.jpeg",
    pink: "Frame Pink.jpeg",
    blue: "Frame Blue.jpeg"
};

// Update frame color & overlay
function updateFrameColor() {
    frameArea.style.backgroundColor = frameColors[currentFrame];
    if (frameOverlay) {
        frameOverlay.src = frameTemplates[currentFrame];
    }
}

// Start camera
async function startCamera() {
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
        video.style.transform = 'scaleX(-1)'; // Anti-mirror untuk live video
        
        placeholder.style.display = 'none';
        capturedPhoto.style.display = 'none';
        isCameraActive = true;

    } catch (err) {
        console.error('Error accessing camera:', err);
        placeholder.textContent = 'Tidak dapat mengakses kamera. Pastikan memberikan izin kamera di browser.';
    }
}

// Stop camera
function stopCamera() {
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

    // Terapkan efeknya ke video langsung, hasil foto, dan preview di dalam frame
    video.style.filter = cssFilter;
    capturedPhoto.style.filter = cssFilter;
    if (previewImg) {
        previewImg.style.filter = cssFilter;
    }
}

// Capture photo (Proses Jepret)
function capturePhoto() {
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

    // Tempelkan filter ke canvas saat dicetak agar tersimpan di foto
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

    // Tampilkan di area FRAME & Sembunyikan tulisan "Preview"
    if (previewImg && previewPlaceholder) {
        previewImg.src = capturedImage;
        previewImg.style.display = 'block';
        previewPlaceholder.style.display = 'none';
    }

    stopCamera();

    retakeBtn.disabled = false;
    downloadBtn.disabled = false;
}

// Handle shoot button
shootBtn.addEventListener('click', () => {
    if (isCameraActive) {
        capturePhoto();
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
});

// Handle download button
downloadBtn.addEventListener('click', () => {
    if (capturedImage) {
        const link = document.createElement('a');
        link.href = capturedImage;
        link.download = `photobooth-${Date.now()}.png`;
        link.click();
    }
});

// Handle back button
backBtn.addEventListener('click', () => {
    // Kembali ke halaman kuis matematika (index.html)
    window.location.href = "index.html"; 
});

// Frame selection
document.querySelectorAll('.frame-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFrame = e.target.dataset.frame;
        updateFrameColor();
    });
});

// Filter selection
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        
        // Panggil fungsi live filter setiap kali tombol filter ditekan
        updateLiveFilter();
    });
});

// Initialize frame color saat pertama dibuka
updateFrameColor();

// Matikan kamera kalau pengguna menutup tab/browser
window.addEventListener('beforeunload', () => {
    stopCamera();
});