// ===============================
// 1️⃣ Firebase imports (v9 modular)
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ===============================
// 2️⃣ Firebase configuration
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBFh-bBOnsScIbdT3MLwQU0oSxUULb3VlI",
  authDomain: "bac-practice-app.firebaseapp.com",
  databaseURL: "https://bac-practice-app-default-rtdb.firebaseio.com",
  projectId: "bac-practice-app",
  storageBucket: "bac-practice-app.firebasestorage.app",
  messagingSenderId: "878169578726",
  appId: "1:878169578726:web:32d5089500f23221032f27",
  measurementId: "G-P2MB51WG1X"
};

// ===============================
// 3️⃣ Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// ===============================
// 4️⃣ BPS App Logic
// ===============================
let questions = [];
let currentIndex = 0;
let score = 0;
let wrongStreak = 0;
const userId = "user_" + Date.now();

// ===============================
// 5️⃣ Load questions
// ===============================
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data.sort((a, b) => a.level - b.level);
    showQuestion();
  });

// ===============================
// 6️⃣ UI functions
// ===============================
function showQuestion() {
  if (currentIndex >= questions.length) {
    finishTest();
    return;
  }

  const q = questions[currentIndex];
  document.getElementById("question-container").innerText = q.question;
  document.getElementById("answer-input").value = "";
  document.getElementById("hint-text").innerText = "";
}

document.getElementById("next-btn").addEventListener("click", () => {
  const input = document.getElementById("answer-input").value.trim();
  const correct = questions[currentIndex].answer.trim();

  if (input === correct) {
    score++;
    wrongStreak = 0;
    currentIndex++;
  } else {
    wrongStreak++;
    if (wrongStreak >= 2) {
      wrongStreak = 0;
      currentIndex++;
    }
  }

  showQuestion();
});

document.getElementById("hint-btn").addEventListener("click", () => {
  document.getElementById("hint-text").innerText =
    questions[currentIndex].hint || "لا يوجد تلميح";
});

// ===============================
// 7️⃣ Save result to Firebase
// ===============================
function finishTest() {
  document.getElementById("question-container").innerText = "انتهى الاختبار ✅";
  document.getElementById("answer-input").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("hint-btn").style.display = "none";

  document.getElementById("score-text").innerText =
    `أجبت بشكل صحيح على ${score} من ${questions.length}`;

  saveScore();
}

function saveScore() {
  set(ref(db, "bps_scores/" + userId), {
    correct: score,
    total: questions.length,
    timestamp: Date.now()
  });
      }
