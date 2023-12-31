// questions array 
var questionSet = [
    { questionOpt: 'Where do you link the script.js in the HTML?',
    choices: ["1. it doesn't", "2. in the <head>", "3. in the <body>", "4. inbetween the <head> and <body>"],
    answer: "3. in the <body>",
    },

    {questionOpt: '.querytselector() selects which specified element?',
    choices: ["1. all", "2. first", "3. last", "4. none"],
    answer: "2. first",
    },

    {questionOpt: 'Which bracket sets do you use for an array?',
    choices: ["1. []", "2. ()", "3. {}", "4. ''"],
    answer: "1. []",
    },

    {questionOpt: 'How many letters does JavaScript have?',
    choices: ["1. 5", "2. 7", "3. 8", "4. 10"],
    answer: "4. 10",
    },

    {questionOpt: 'DOM stands for?...',
    choices: ["1. Document Object Model", "2. Dirty Old Men", "3. Document Obligatory Manuscripts", "4. Dual Overview Model"],
    answer: "1. Document Object Model",
    },
];

// breaking down each section for later functions
var startScreen = document.querySelector("#start-screen");
var quizScreen = document.querySelector("#quiz-question");
var finalScreen = document.querySelector("#finalscore");
var leaderScreen = document.querySelector("#leaderboard");


// hiding until called upon
function hideContent() {
    startScreen.setAttribute("hidden", true);
    quizScreen.setAttribute("hidden", true);
    finalScreen.setAttribute("hidden", true);
    leaderScreen.setAttribute("hidden", true);
}

// hiding results
var result = document.querySelector("#result");
var resultText = document.querySelector("#result-text");

function hideResultText() {
    result.style.display = "none";
}

// start of quiz
var interval;
var time;
var currentQuestion;

document.querySelector("#start-btn").addEventListener("click", startQuiz);

function startQuiz() {
    hideContent();
    quizScreen.removeAttribute("hidden");

    currentQuestion = 0;
    displayQuestion();

    time = 25;

    interval = setInterval(countdown, 1000);

    displayTime();
}

// timing related
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

var showTime = document.querySelector("#timer");
function displayTime() {
    showTime.textContent = time;
}

// questions start functions
function displayQuestion() {
    var question = questionSet[currentQuestion];
    var choices = question.choices;

    var questionTitle = document.querySelector("#question-text");
    questionTitle.textContent = question.questionOpt;

    for (var i = 0; i < choices.length; i++) {
        var choice = choices[i];
        var choiceButton = document.querySelector("#choice" + i);
        choiceButton.textContent = choice;
    }
}

document.querySelector("#quiz-choices").addEventListener("click", checkResult);

function correctChoice(choiceButton) {
    return choiceButton.textContent === questionSet[currentQuestion].answer;
}

function checkResult(eventObject) {
    var choiceButton = eventObject.target;
    result.style.display = "block";

    if (correctChoice(choiceButton)) {
        resultText.textContent = "correct :)";
        setTimeout(hideResultText, 1000);
    } 
    
    else {
        resultText.textContent = "incorrect :("
        setTimeout(hideResultText, 1000);
        if (time >= 5) {
            time = time -2;
            displayTime();
        }
        else {
            time = 0;
            displayTime();
            endQuiz();
        }
    }


    currentQuestion++;

    if (currentQuestion < questionSet.length) {
        displayQuestion();
        } else {
            endQuiz();
    }
}

// quiz end functions that include the scores
var score = document.querySelector("#score");

function endQuiz() {
    clearInterval(interval);
    hideContent();
    finalScreen.removeAttribute("hidden");
    score.textContent = time;
}

var submitBtn = document.querySelector("#submit-button");
var scoreInput = document.querySelector("#initials");

submitBtn.addEventListener("click", scoreRecord);

function scoreRecord(event) {
    event.preventDefault();
    
    if (!scoreInput.value) {
        alert("please enter initials");
        return;
    }

    var highScores = {
        initials: scoreInput.value,
        score: time,
    };

    updateLeaderboard(highScores);

    hideContent();
    leaderScreen.removeAttribute("hidden");

    showLeaderboard();
}

function updateLeaderboard(highScores) {
    var highScoreArray = getHighScore();
    highScoreArray.push(highScores);
    localStorage.setItem("highScoreArray", JSON.stringify(highScoreArray));
}

function getHighScore() {
    var storedHighScore = localStorage.getItem("highScoreArray");
    if (storedHighScore !== null) {
        var  highScoreArray = JSON.parse(storedHighScore);
        return highScoreArray;
    } else {
        highScoreArray = [];
    }
    return highScoreArray;
}

function showLeaderboard() {
    var sortedHighScoreArray = sortHighScore();
    var leaderboardList = document.querySelector("#highscore-list");
    leaderboardList.innerHTML = "";
    for (var i = 0; i < sortedHighScoreArray.length; i++) {
        var highScoreInput = sortedHighScoreArray[i];
        var addMoreList = document.createElement("li");
        addMoreList.textContent = 
            highScoreInput.initials + " scored: " + highScoreInput.score;
        leaderboardList.append(addMoreList);
    }
}

function sortHighScore() {
    var highScoreArray = getHighScore();
    if (!highScoreArray) {
        return;
    }
    
    highScoreArray.sort(function (a,b) {
        return b.score - a.score;
    });
    return highScoreArray;
}

// restarting the quiz
var resetScores = document.querySelector("#reset-button");
resetScores.addEventListener("click", resetHighScore);

function resetHighScore() {
    localStorage.clear();
    showLeaderboard();
}

var returnBack = document.querySelector("#return-button");
returnBack.addEventListener("click", quizAgain);


function quizAgain() {
    hideContent();
    startScreen.removeAttribute("hidden");
}

var highScoreRecord = document.querySelector("#score-record");
highScoreRecord.addEventListener("click", viewHighScore);

function viewHighScore() {
    hideContent();
    leaderScreen.removeAttribute("hidden");
    
    clearInterval(interval);
    
    time = undefined;
    displayTime();

    showLeaderboard();
}