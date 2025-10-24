let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userName = "";
let leaderboard = [];

// Elements
const questionInput = document.getElementById("questionInput");
const optionInputs = document.getElementsByClassName("optionInput");
const answerInput = document.getElementById("answerInput");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const questionList = document.getElementById("questionList");
const startQuizBtn = document.getElementById("startQuizBtn");

const loginContainer = document.getElementById("loginContainer");
const userNameInput = document.getElementById("userNameInput");
const loginBtn = document.getElementById("loginBtn");

const quizContainer = document.getElementById("quizContainer");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

const toggleLeaderboardBtn = document.getElementById("toggleLeaderboardBtn");
const leaderboardContainer = document.getElementById("leaderboardContainer");
const leaderboardList = document.getElementById("leaderboardList");

const resetBtn = document.getElementById("resetBtn");

// ---------- ADD QUESTION ----------
addQuestionBtn.addEventListener("click", () => {
  const options = Array.from(optionInputs).map(input => input.value);
  const answer = parseInt(answerInput.value) - 1;

  if (!questionInput.value || options.includes("") || isNaN(answer) || answer < 0 || answer > 3) {
    alert("Please fill all fields correctly.");
    return;
  }

  questions.push({ question: questionInput.value, options, answer });
  updatePreview();

  questionInput.value = "";
  Array.from(optionInputs).forEach(input => input.value = "");
  answerInput.value = "";
});

// ---------- UPDATE PREVIEW ----------
function updatePreview() {
  questionList.innerHTML = "";
  questions.forEach((q, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${q.question} (Answer: ${q.options[q.answer]})`;
    questionList.appendChild(li);
  });
}

// ---------- START QUIZ ----------
startQuizBtn.addEventListener("click", () => {
  if (questions.length === 0) {
    alert("Add at least one question before starting quiz!");
    return;
  }
  document.getElementById("addQuestions").style.display = "none";
  document.getElementById("previewQuestions").style.display = "none";
  loginContainer.style.display = "block";
});

// ---------- LOGIN ----------
loginBtn.addEventListener("click", () => {
  if (!userNameInput.value.trim()) {
    alert("Please enter your name!");
    return;
  }
  userName = userNameInput.value.trim();
  loginContainer.style.display = "none";
  quizContainer.style.display = "block";
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
});

// ---------- SHOW QUESTION ----------
function showQuestion() {
  selectedOption = null;
  const q = questions[currentQuestionIndex];
  quizQuestion.textContent = q.question;
  quizOptions.innerHTML = "";

  q.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.addEventListener("click", () => {
      selectedOption = index;
      Array.from(quizOptions.children).forEach(el => el.style.backgroundColor = "");
      li.style.backgroundColor = "#d0f0c0";
    });
    quizOptions.appendChild(li);
  });

  scoreDisplay.textContent = `${userName}, Score: ${score} / ${questions.length}`;
}

// ---------- NEXT BUTTON ----------
nextBtn.addEventListener("click", () => {
  if (selectedOption === null) {
    alert("Please select an option!");
    return;
  }

  const correctAnswer = questions[currentQuestionIndex].answer;

  Array.from(quizOptions.children).forEach((li, index) => {
    if (index === correctAnswer) li.style.backgroundColor = "#90ee90";
    else if (index === selectedOption) li.style.backgroundColor = "#ff7f7f";
    else li.style.backgroundColor = "";
  });

  if (selectedOption === correctAnswer) score++;

  currentQuestionIndex++;

  setTimeout(() => {
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      quizContainer.style.display = "none";
      scoreDisplay.textContent = `${userName}, Your final score: ${score} / ${questions.length}`;

      // Add user to leaderboard
      leaderboard.push({ name: userName, score });
      updateLeaderboard();

      // Show toggle button
      toggleLeaderboardBtn.style.display = "inline-block";
      toggleLeaderboardBtn.textContent = "Show Leaderboard";

      // Allow next user to attempt
      loginContainer.style.display = "block";
      userNameInput.value = "";
    }
  }, 1000);
});

// ---------- UPDATE LEADERBOARD ----------
function updateLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${user.name} - ${user.score} / ${questions.length}`;
    leaderboardList.appendChild(li);
  });
}

// ---------- TOGGLE LEADERBOARD ----------
toggleLeaderboardBtn.addEventListener("click", () => {
  updateLeaderboard(); // Always update latest leaderboard

  if (!leaderboardContainer.classList.contains("show")) {
    leaderboardContainer.classList.add("show");
    toggleLeaderboardBtn.textContent = "Hide Leaderboard";
  } else {
    leaderboardContainer.classList.remove("show");
    toggleLeaderboardBtn.textContent = "Show Leaderboard";
  }
});

// ---------- RESET QUIZ ----------
resetBtn.addEventListener("click", () => {
  questions = [];
  currentQuestionIndex = 0;
  score = 0;
  selectedOption = null;
  userName = "";
  leaderboard = [];
  questionList.innerHTML = "";
  quizQuestion.textContent = "";
  quizOptions.innerHTML = "";
  scoreDisplay.textContent = "";
  leaderboardList.innerHTML = "";
  leaderboardContainer.classList.remove("show");
  toggleLeaderboardBtn.style.display = "none";

  document.getElementById("addQuestions").style.display = "block";
  document.getElementById("previewQuestions").style.display = "block";
  quizContainer.style.display = "none";
  loginContainer.style.display = "none";
  userNameInput.value = "";
});
