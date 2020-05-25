const username = document.getElementById('username');
const saveScoreButton = document.getElementById('save-score-button');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const finalScore = document.getElementById('final-score');
// Retourne un tableau vide si pas de highScore dans le localStorage ou le tableau des meilleurs scores. JSON.parse() transforme une string en objet JavaScript.
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    // Le bouton Enregistrer ne doit être actif que si l'utilisateur a renseigné son nom
    saveScoreButton.disabled = !username.value;
})

saveScoreButton.addEventListener('click', event => {
    event.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    }

    highScores.push(score); // On ajoute le score au tableau des meilleures scores
    highScores.sort( (a, b) => {
        return b.score - a.score;   // Permet de mettre les scores les plus hauts en premier
    })
    highScores.splice(5);   // On ne garde que les 5 scores les plus hauts

    localStorage.setItem('highScores', JSON.stringify(highScores)); // JSON.stringify() transforme un objet JavaScript en string

    window.location.assign("/");
})