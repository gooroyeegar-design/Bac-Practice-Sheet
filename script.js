let questions = [];
let currentIndex = 0;
let score = 0;
let wrongStreak = 0;

fetch('questions.json')
    .then(response => response.json())
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
        } // else stay on same question
    }

    showQuestion();
});

document.getElementById('hint-btn').addEventListener('click', () => {
    document.getElementById('hint-text').innerText = questions[currentIndex].hint || "لا يوجد تلميح";
});
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
