let allQuestions = [];
let questions = [];
let currentIndex = 0;
let missed = JSON.parse(localStorage.getItem('missedQuestions') || '[]');

async function loadQuestions() {
  const res = await fetch('wset2_questions.json');
  allQuestions = await res.json();
}

function startQuiz() {
  const category = document.getElementById('category-select').value;
  if (category === 'All') {
    questions = shuffleArray([...allQuestions]);
  } else if (category === 'Missed') {
    questions = shuffleArray([...missed]);
  } else {
    questions = shuffleArray(allQuestions.filter(q => q.category === category));
  }
  currentIndex = 0;
  document.getElementById('quiz-container').classList.remove('hidden');
  document.getElementById('category-label').textContent =
    category === 'All' ? 'Category: Randomized' :
    category === 'Missed' ? 'Category: Missed Questions' :
    'Category: ' + category;
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
    btn.className = 'btn block w-full text-left border p-2 rounded hover:bg-gray-100';
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
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById('quiz-container').innerHTML = '<h2 class="text-center text-xl font-semibold text-green-600">🎉 Quiz Complete!</h2>';
  }
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);

loadQuestions();
