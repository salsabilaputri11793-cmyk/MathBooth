let CORRECT_ANSWER = 0;

function generateQuestion() {
    const types = ['determinant', 'aritmetika', 'vektor'];
    const type = types[Math.floor(Math.random() * types.length)];
    let questionText = "";

    if (type === 'determinant') {
        let a = Math.floor(Math.random() * 9) + 1, b = Math.floor(Math.random() * 5) + 1;
        let c = Math.floor(Math.random() * 5) + 1, d = Math.floor(Math.random() * 9) + 1;
        questionText = `Det A = [[${a}, ${b}], [${c}, ${d}]]`;
        CORRECT_ANSWER = (a * d) - (b * c);
    } else if (type === 'aritmetika') {
        let a = Math.floor(Math.random() * 5) + 1, beda = Math.floor(Math.random() * 5) + 1;
        let n = Math.floor(Math.random() * 5) + 3; 
        questionText = `Barisan: a=${a}, b=${beda}. U${n} = ?`;
        CORRECT_ANSWER = a + (n - 1) * beda;
    } else if (type === 'vektor') {
        let x1 = Math.floor(Math.random() * 5) + 1, y1 = Math.floor(Math.random() * 5) + 1;
        let x2 = Math.floor(Math.random() * 5) + 1, y2 = Math.floor(Math.random() * 5) + 1;
        questionText = `P=[${x1},${y1}], Q=[${x2},${y2}]. P•Q = ?`;
        CORRECT_ANSWER = (x1 * x2) + (y1 * y2);
    }

    document.getElementById('quiz-question').textContent = questionText;
    document.getElementById('answer-input').value = "";
    document.getElementById('msg').textContent = "";
}

// Fungsi untuk memeriksa jawaban
function checkAnswer() {
    const input = document.getElementById('answer-input');
    const value = input.value.trim();
    
    if (value === '') {
        alert('Silakan masukkan jawaban Anda!');
        return;
    }
    
    const answer = Number(value);
    if (answer === CORRECT_ANSWER) {
        // Redirect ke halaman success
        window.location.href="next.html";
    } else {
        // Shake animation untuk input yang salah
        const inputBox = document.querySelector('.input-box');
        inputBox.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            inputBox.style.animation = '';
        }, 500);
        
        alert('Jawaban salah! Coba lagi.');
        input.value = '';
        input.focus();
    }
}

// Event listener untuk tombol Enter
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('answer-input');
    
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Focus pada input saat halaman dimuat
    input.focus();
});
