// VARIABLES
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];




// INITIALISATION
fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&encode=base64")
    .then( response => {
        return response.json();
    })
    .then( loadedQuestions => {
        questions = loadedQuestions.results.map( loadedQuestion => {
            const formattedQuestion = {
                question: decodeURIComponent(escape(window.atob(loadedQuestion.question)))
            }

            const answerChoices = [ ...loadedQuestion.incorrect_answers];
            for (let i = 0; i < answerChoices.length; i++) {
                answerChoices[i] = choice = decodeURIComponent(escape(window.atob(answerChoices[i])));
            }
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, decodeURIComponent(escape(window.atob(loadedQuestion.correct_answer))));

            answerChoices.forEach( (choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            })

            return formattedQuestion;
        })

        startGame();
    })
    .catch( error => {
        alert("ERREUR ! Les questions n'ont pas pu être chargées. Merci de retourner à l'accueil et d'essayer de lancer une nouvelle partie !");
    })



  // CONSTANTES
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;



// FONCTIONS
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];  // Crée une copie du tableau de questions dans le tableau des questions disponibles. On fait pas availableQuestions = questions car sinon, en changeant le tableau availableQuestions, on changerait aussi le tableau d'origine
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;  // = progressText.innerText = "Question" + questionCounter + "/" + MAX_QUESTIONS;
    progressBarFull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];  // Récupéré grâce à l'attribut data-number dans le HTML
        choice.innerText = currentQuestion['choice' + number] // On utilise la syntaxe [] au lieu de . pour pouvoir concaténer le numéro correspondant au choix
    })

    availableQuestions.splice(questionIndex, 1);  // On supprime la question qui vient d'être posée du tableau des questions disponibles

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', event => {
        if (!acceptingAnswers) {
            return;
        };

        acceptingAnswers = false;
        const selectedChoice = event.target;    // event.target est égal au <p class="choice-text"> du choix sélectionné
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        selectedChoice.parentElement.classList.add(classToApply);
        if (classToApply == 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
})

incrementScore = number => {
    score += number;
    scoreText.innerText = score;
}