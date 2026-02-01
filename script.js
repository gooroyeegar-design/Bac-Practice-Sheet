// 1️⃣ Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "bps-math-web.firebaseapp.com",
    databaseURL: "https://bps-math-web-default-rtdb.firebaseio.com",
    projectId: "bps-math-web",
    storageBucket: "bps-math-web.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2️⃣ Questions + Logic
let questions = [];
let currentIndex = 0;
let score = 0;
let wrongStreak = 0;
let userId = "user" + Date.now(); // temp unique id

fetch('questions.json')
    .then(res => res.json())
    .then(data => {
        questions = data.sort((a,b) => a.level - b.level);
        showQuestion();
    });

function showQuestion() {
    if(currentIndex >= questions.length){
        document.getElementById('question-container').innerText = "لقد أنهيت الاختبار!";
        document.getElementById('answer-input').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('hint-btn').style.display = 'none';
        document.getElementById('score-text').innerText = `لقد أجبت على ${score} من ${questions.length} بشكل صحيح!`;
        saveScore(); // save online
        return;
    }
    const q = questions[currentIndex];
    document.getElementById('question-container').innerText = q.question;
    document.getElementById('answer-input').value = '';
    document.getElementById('hint-text').innerText = '';
}

document.getElementById('next-btn').addEventListener('click', () => {
    const input = document.getElementById('answer-input').value.trim();
    const correct = questions[currentIndex].answer.trim();

    if(input === correct){
        score++;
        wrongStreak = 0;
        currentIndex++;
    } else {
        wrongStreak++;
        if(wrongStreak >= 2){
            currentIndex++;
            wrongStreak = 0;
        }
    }
    showQuestion();
});

document.getElementById('hint-btn').addEventListener('click', () => {
    document.getElementById('hint-text').innerText = questions[currentIndex].hint || "لا يوجد تلميح";
});

// 3️⃣ Save Score Online
function saveScore(){
    db.ref("scores/" + userId).set({
        correct: score,
        total: questions.length
    });
}