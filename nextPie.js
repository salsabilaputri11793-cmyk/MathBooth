// State 
let currentFilter = 'none';
let currentFrame = 'red';
let isCameraActive = false;
let capturedImage = null;
let stream = null;

// Elements
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

// Frame colors
const frameColors = {
    red: 'rgba(248, 124, 139, 0.62)',
    pink: 'rgba(255, 192, 203, 0.62)',
    blue: 'rgba(145, 181, 230, 0.62)'
};

// TEMPLATE FRAME
const frameTemplates = {
    red: "Frame Red.jpeg",
    pink: "Frame Pink.jpeg",
    blue: "Frame Blue.jpeg"
};

// Update frame color
function updateFrameColor() {
    frameArea.style.backgroundColor = frameColors[currentFrame];
    frameOverlay.src = frameTemplates[currentFrame];
}

// Start camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });

        video.srcObject = stream;
        video.style.display = 'block';
        
        // [REVISI]: Membalikkan layar preview video agar tidak mirror
        video.style.transform = 'scaleX(-1)';
        
        placeholder.style.display = 'none';
        capturedPhoto.style.display = 'none';
        isCameraActive = true;

    } catch (err) {
        console.error('Error accessing camera:', err);
        placeholder.textContent = 'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.';
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

// Apply filter to canvas
function applyFilter(ctx, width, height) {
    if (currentFilter === 'bw') {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

    } else if (currentFilter === 'vintage') {
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
    if (!video.videoWidth || !video.videoHeight) {
        alert('Video belum siap. Silakan coba lagi.');
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    // --- [REVISI]: Membalikkan kanvas sebelum digambar agar hasilnya tidak mirror ---
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    // -------------------------------------------------------------------------------

    ctx.drawImage(video, 0, 0);

    // --- [REVISI]: Kembalikan posisi kanvas ke normal biar filternya tidak berantakan ---
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ------------------------------------------------------------------------------------

    applyFilter(ctx, canvas.width, canvas.height);

    capturedImage = canvas.toDataURL('image/png');

    capturedPhoto.src = capturedImage;
    capturedPhoto.style.display = 'block';
    
    // [REVISI]: Pastikan foto yang ditampilkan juga tidak ikut terbalik karena efek CSS video sebelumnya
    capturedPhoto.style.transform = 'none';

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
    stopCamera();
    capturedImage = null;
    capturedPhoto.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.textContent = 'Tekan SHOOT untuk mulai';
    retakeBtn.disabled = true;
    downloadBtn.disabled = true;
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
    });
});

// Initialize frame color
updateFrameColor();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopCamera();
});