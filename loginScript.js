let currentAnswer = 0;

function generateQuestion() {
    const types = ['determinant', 'aritmetika', 'vektor'];
    const type = types[Math.floor(Math.random() * types.length)];
    let questionText = "";

    if (type === 'determinant') {
        let a = Math.floor(Math.random() * 9) + 1, b = Math.floor(Math.random() * 5) + 1;
        let c = Math.floor(Math.random() * 5) + 1, d = Math.floor(Math.random() * 9) + 1;
        questionText = `Det A = [[${a}, ${b}], [${c}, ${d}]]`;
        currentAnswer = (a * d) - (b * c);
    } else if (type === 'aritmetika') {
        let a = Math.floor(Math.random() * 5) + 1, beda = Math.floor(Math.random() * 5) + 1;
        let n = Math.floor(Math.random() * 5) + 3; 
        questionText = `Barisan: a=${a}, b=${beda}. U${n} = ?`;
        currentAnswer = a + (n - 1) * beda;
    } else if (type === 'vektor') {
        let x1 = Math.floor(Math.random() * 5) + 1, y1 = Math.floor(Math.random() * 5) + 1;
        let x2 = Math.floor(Math.random() * 5) + 1, y2 = Math.floor(Math.random() * 5) + 1;
        questionText = `P=[${x1},${y1}], Q=[${x2},${y2}]. P•Q = ?`;
        currentAnswer = (x1 * x2) + (y1 * y2);
    }

    document.getElementById('quiz-question').textContent = questionText;
    document.getElementById('answer-input').value = "";
    document.getElementById('msg').textContent = "";
}


function unlock() {
    // PENTING: Baris ini HARUS ada di dalam fungsi unlock(), bukan di luarnya!
    const answerInput = document.getElementById("answer-input").value.trim();
    const msgEl = document.getElementById("msg");

    // Cek apakah kotak input benar-benar kosong
    if (answerInput === "") {
        msgEl.textContent = "Masukkan angka terlebih dahulu!";
        msgEl.style.color = "white"; // Ubah jadi putih
        return;
    }

    // Ubah teks menjadi angka
    const answer = parseInt(answerInput);

    if (answer === currentAnswer) {
        msgEl.textContent = "BERHASIL!";
        msgEl.style.color = "white"; // Ubah jadi putih
        
        setTimeout(() => {
            window.location.href = "next.html"; 
        }, 1500);
        
    } else {
        msgEl.textContent = "JAWABAN SALAH!";
        msgEl.style.color = "white"; // Ubah jadi putih
        
        setTimeout(() => {
            generateQuestion();
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', generateQuestion);