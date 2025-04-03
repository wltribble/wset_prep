
let allQuestions = [];
let availableQuestions = [];
let missed = JSON.parse(localStorage.getItem('missedQuestions') || '[]');
let totalAnswered = 0;
let totalCorrect = 0;

// Maps categories to their corresponding JSON filenames
const categoryFiles = {
  "Varietals": "varietals.json",
  "Regions": "regions.json",
  "Wine Production": "winemaking.json",
  "Styles of Wine": "styles.json"
};

async function loadQuestions(category) {
  if (category === 'Missed') {
    availableQuestions = [...missed];
    startQuiz(category);
  } else if (category === 'All') {
    const files = Object.values(categoryFiles);
    const requests = files.map(file => fetch(file).then(res => res.json()));
    const data = await Promise.all(requests);
    allQuestions = data.flat();
    availableQuestions = shuffleArray([...allQuestions]);
    startQuiz(category);
  } else {
    const file = categoryFiles[category];
    if (!file) return;
    const res = await fetch(file);
    allQuestions = await res.json();
    availableQuestions = shuffleArray([...allQuestions]);
    startQuiz(category);
  }
}

function startQuiz(category) {
  totalAnswered = 0;
  totalCorrect = 0;
  document.getElementById('start-btn').classList.add('hidden');
  document.getElementById('category-select').classList.add('hidden');
  document.querySelector('label[for=category-select]').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  document.getElementById('quit-btn').classList.remove('hidden');
  document.getElementById('score').classList.remove('hidden');

  document.getElementById('category-label').textContent =
    category === 'All' ? 'Category: Randomized' :
    category === 'Missed' ? 'Category: Missed Questions' :
    'Category: ' + category;

  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  if (availableQuestions.length === 0) {
    const percent = ((totalCorrect / totalAnswered) * 100).toFixed(1);
    document.getElementById('quiz-container').innerHTML = `
      <h2 class="text-center text-xl font-semibold text-green-600 mb-2">🎉 Quiz Complete!</h2>
      <p class="text-center mb-4">You answered ${totalCorrect} out of ${totalAnswered} correctly (${percent}%).</p>
      <button onclick="resetQuiz()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Start New Quiz</button>
    `;
    document.getElementById('quit-btn').classList.add('hidden');
    document.getElementById('score').classList.add('hidden');
    return;
  }

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  const q = availableQuestions.splice(questionIndex, 1)[0];
  window.currentQuestion = q;

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
}

function checkAnswer(selected, question) {
  const feedback = document.getElementById('feedback');
  totalAnswered++;
  if (selected === question.answer) {
    feedback.textContent = '\n✅ Correct! ' + question.explanation;
    feedback.className = 'correct';
    totalCorrect++;
  } else {
    feedback.textContent = `\n❌ Incorrect. Correct answer: ${question.answer}. ` + question.explanation;
    feedback.className = 'incorrect';
    missed.push(question);
    localStorage.setItem('missedQuestions', JSON.stringify(missed));
  }
  updateScoreDisplay();
  document.getElementById('next-btn').classList.remove('hidden');
}

function updateScoreDisplay() {
  const scoreBox = document.getElementById('score');
  if (totalAnswered === 0) {
    scoreBox.textContent = "Score: 0/0 (0%)";
  } else {
    const percent = ((totalCorrect / totalAnswered) * 100).toFixed(1);
    scoreBox.textContent = `Score: ${totalCorrect}/${totalAnswered} (${percent}%)`;
  }
}

function nextQuestion() {
  showQuestion();
}

function resetQuiz() {
  document.getElementById('quiz-container').innerHTML = `
    <div class="text-sm text-gray-500 mb-2" id="category-label"></div>
    <div id="question" class="mb-4 font-semibold text-lg text-gray-900">Loading question...</div>
    <div id="choices" class="space-y-2"></div>
    <div id="feedback" class="mt-4 text-sm font-medium"></div>
    <button id="next-btn" class="w-full bg-gray-700 text-white py-2 mt-4 rounded hidden">Next Question</button>
  `;

  document.getElementById('start-btn').classList.remove('hidden');
  document.getElementById('category-select').classList.remove('hidden');
  document.querySelector('label[for=category-select]').classList.remove('hidden');
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('quit-btn').classList.add('hidden');
  document.getElementById('score').classList.add('hidden');
}

function quitQuiz() {
  resetQuiz();
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

document.getElementById('start-btn').addEventListener('click', () => {
  const category = document.getElementById('category-select').value;
  loadQuestions(category);
});
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('quit-btn').addEventListener('click', quitQuiz);
