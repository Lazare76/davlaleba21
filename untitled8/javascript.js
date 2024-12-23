const apiUrl = "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=boolean&encode=base64";
const questionElement = document.getElementById("question");
const trueButton = document.getElementById("true-btn");
const falseButton = document.getElementById("false-btn");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;


function decodeBase64(encoded) {
    return atob(encoded);
}


async function loadQuestions() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        questions = data.results.map((q) => ({
            question: decodeBase64(q.question),
            correctAnswer: decodeBase64(q.correct_answer) === "True",
        }));
        displayQuestion();
    } catch (error) {
        questionElement.textContent = "Failed to load questions. Try again later.";
        console.error("Error fetching questions:", error);
    }
}


function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        nextButton.disabled = true;
        trueButton.disabled = false;
        falseButton.disabled = false;
    } else {
        questionElement.textContent = `Quiz Complete! Your final score is ${score}/${questions.length}.`;
        trueButton.disabled = true;
        falseButton.disabled = true;
        nextButton.disabled = true;
    }
}

function selectAnswer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    if (isTrue === currentQuestion.correctAnswer) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
    }
    nextButton.disabled = false;
    trueButton.disabled = true;
    falseButton.disabled = true;
}


function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}


trueButton.addEventListener("click", () => selectAnswer(true));
falseButton.addEventListener("click", () => selectAnswer(false));
nextButton.addEventListener("click", nextQuestion);


loadQuestions();
