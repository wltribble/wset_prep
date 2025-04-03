let questions = [];
let currentIndex = 0;

async function loadQuestions() {
  const res = await fetch('wset2_questions.json');
  questions = await res.json();
  questions = shuffleArray(questions);
  showQuestion();
}

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById('question').textContent = q.question;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.className = 'btn block w-full text-left';
    btn.onclick = () => checkAnswer(choice, q);
    choicesDiv.appendChild(btn);
  });
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('next-btn').classList.add('hidden');
}

function checkAnswer(selected, question) {
  const feedback = document.getElementById('feedback');
  if (selected === question.answer) {
    feedback.textContent = 'Correct! ' + question.explanation;
    feedback.className = 'correct';
  } else {
    feedback.textContent = `Incorrect. Correct answer: ${question.answer}. ` + question.explanation;
    feedback.className = 'incorrect';
  }
  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById('quiz-container').innerHTML = '<h2 class="text-center">Quiz Complete!</h2>';
  }
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

document.getElementById('next-btn').addEventListener('click', nextQuestion);
loadQuestions();
