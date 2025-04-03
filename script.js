let allQuestions = [];
let availableQuestions = [];
let missed = JSON.parse(localStorage.getItem('missedQuestions') || '[]');

async function loadQuestions() {
  const res = await fetch('wset2_questions.json');
  allQuestions = await res.json();
}

function startQuiz() {
  const category = document.getElementById('category-select').value;
  if (category === 'All') {
    availableQuestions = [...allQuestions];
  } else if (category === 'Missed') {
    availableQuestions = [...missed];
  } else {
    availableQuestions = allQuestions.filter(q => q.category === category);
  }

  availableQuestions = shuffleArray(availableQuestions);
  document.getElementById('quiz-container').classList.remove('hidden');
  document.getElementById('category-label').textContent =
    category === 'All' ? 'Category: Randomized' :
    category === 'Missed' ? 'Category: Missed Questions' :
    'Category: ' + category;
  showQuestion();
}

function showQuestion() {
  if (availableQuestions.length === 0) {
    document.getElementById('quiz-container').innerHTML = '<h2 class="text-center text-xl font-semibold text-green-600">🎉 Quiz Complete!</h2>';
    return;
  }

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  const q = availableQuestions.splice(questionIndex, 1)[0];  // remove selected question

  document.getElementById('question').textContent = q.question;

  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';

  const shuffledChoices = shuffleArray([...q.choices]);
  shuffledChoices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.className = 'w-full border p-2 rounded text-left hover:bg-gray-100';
    btn.onclick = () => checkAnswer(choice, q);
    choicesDiv.appendChild(btn);
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('next-btn').classList.add('hidden');

  // store current question for answer check
  window.currentQuestion = q;
}

function checkAnswer(selected, question) {
  const feedback = document.getElementById('feedback');
  if (selected === question.answer) {
    feedback.textContent = '✅ Correct! ' + question.explanation;
    feedback.className = 'correct';
  } else {
    feedback.textContent = `❌ Incorrect. Correct answer: ${question.answer}. ` + question.explanation;
    feedback.className = 'incorrect';
    missed.push(question);
    localStorage.setItem('missedQuestions', JSON.stringify(missed));
  }
  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  showQuestion();
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);

loadQuestions();
