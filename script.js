var startBtn = document.querySelector("#start");
var closeBtn = document.querySelector(".close");
var saveBtn = document.querySelector("#save");
var questionaireDiv = document.querySelector("#questions");
var currentQuestion = document.querySelector("#currentQuestion");
var optionsDiv = document.querySelector("#optionsDiv");
var optionsUl = document.querySelector("#optionsUl");
var index = -1;
var userChoices;
var questions = [
    {
        question: "What does DOM stand for?",
        choices: ["Document Object Modum", "Dime Object Modum", "Document Object Model", "Dime Object Model"],
        answer: "Document Object Model"
    },
    {
        question: "What is CSS used for?",
        choices: ["Styling a webpage", "Adding buttons to a webpage", "Adding a paragraph to a webpage", "None of the above"],
        answer: "Styling a webpage"
    },
    {
        question: "JavaScript creates functionality for a webpage.",
        choices: ["True", "False"],
        answer: "True"
    },
    {
        question: "Arrays are list-like objects.",
        choices: ["True", "False"],
        answer: "True"
    },
    {
        question: "What does HTML stand for?",
        choices: ["Hyperlink Text Markup Language", "Hyper Text Making List", "Hyperlink Text Making Language", "Hyper Text Markup Language"],
        answer: "Hyper Text Markup Language"
    },
];
var leaderBoardList = document.querySelector("#leaderBoardList");
var enterName = document.querySelector("#enterName");
var leaderBoardlink = document.querySelector("#leaderBoardLink");
var modalEl = document.querySelector("#modal-container");
var modalNameEl = document.querySelector("#modal-name");
var leaderBoardForm = document.querySelector("#leaderBoardForm");
var leaderBoard = [];
var timer = document.getElementById("timer");
var currentTimer = 60;
var timesUp = document.querySelector("#timesup");
timesUp.style.display = "none";
var score = 0;

function startTimer(event) {
    event.preventDefault()
    startBtn.style.display = "none";
    modalEl.style.display = "none";
    leaderBoardlink.style.display = "none";
    var timeInterval = setInterval(function () {
        timer.textContent = "Time: " + currentTimer;
        currentTimer--;
        if (currentTimer === 0 || currentTimer < 0) {
            timer.textContent = "";
            timesUp.style.display = "block";
            leaderBoardlink.style.display = "none";
            currentQuestion.textContent = "";
            optionsUl.style.display = "none";
            startBtn.style.display = "block";
            startBtn.textContent = "TRY AGAIN";
            startBtn.addEventListener("click", function (event) {
                window.location.reload();
            });
            clearInterval(timeInterval);
        } else if (index > questions.length - 1) {
            timer.textContent = "";
            init();
            clearInterval(timeInterval);
        }

    }, 1000);
    startQuiz(1);
}
function startQuiz(direction) {
    index += direction;
    currentQuestion.textContent = "";
    optionsUl.innerHTML = "";
    optionsUl.style.listStyleType = "none";
    currentQuestion.textContent = questions[index].question;
    userChoices = questions[index].choices;
    userChoices.forEach(function (option) {
        var optionsLi = document.createElement("li");
        optionsLi.style.padding = "5px";
        var optionBtn = document.createElement("button");
        optionBtn.style.width = "300px";
        optionBtn.style.height = "50px";
        optionsLi.appendChild(optionBtn);
        optionBtn.textContent = option;
        optionsDiv.appendChild(optionsUl);
        optionsUl.appendChild(optionsLi);
        optionsLi.addEventListener("click", (checkAnswer));
    });
}
function checkAnswer(event) {
    var element = event.target;
    if (element.textContent === questions[index].answer) {
        score++;
        alert("CORRECT!! Score: " + score);
        startQuiz(1);
    } else {
        alert("TRY AGAIN! -5 seconds!");
        currentTimer -= 5;
        startQuiz(1);
    }
    if (index > questions.length - 1) {
        init();
    }
}
function init() {
    modalEl.style.display = "block";
    var storedleaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));
    if (storedleaderBoard) {
        storedleaderBoard.sort(function(a,b){
            return b.score - a.score; 
        });
        leaderBoard = storedleaderBoard;
    }
    renderleaderBoard();
}
function renderleaderBoard() {
    leaderBoardList.innerHTML = "";
    for (var i = 0; i < leaderBoard.length; i++) {
        var currentIndex = leaderBoard[i];
        var li = document.createElement("li");
        li.textContent = currentIndex.initials + ": " + currentIndex.score;
        leaderBoardList.appendChild(li);
    }
}
function storeleaderBoard() {
    localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
}
leaderBoardlink.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    init();
    modalEl.style.display = "block";
    currentQuestion.textContent = "";
    startBtn.style.display = "none";
    timer.textContent = "";
    optionsUl.style.display = "none";
    saveBtn.style.display = "none";
    enterName.style.display = "none";
});
function close() {
    modalEl.style.display = "none";
    index = 0;
    startBtn.style.display = "block";
    currentTimer = 60;
    window.location.reload("refresh");
}
saveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (!enterName.value ) {
        alert("Enter Initials");
    } else {
        var userScore = {
            initials: enterName.value,
            score: score
        };
        enterName.value = "";
        leaderBoard.push(userScore);
        storeleaderBoard();
        renderleaderBoard();
    }
    modalEl.style.display = "none";
    window.location.reload("refresh");
});
closeBtn.addEventListener("click", close);
startBtn.addEventListener("click", startTimer);