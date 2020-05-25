const highScoresList = document.getElementById('high-scores-list');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const title = document.getElementById('final-score');

if (highScores.length == 0) {
    const p = document.createElement("p");
    p.classList.add("no-score");
    p.textContent = "Pas encore de score enregistré !";
    title.parentNode.insertBefore(p, title.nextSibling);
} else {
    const noScore = document.getElementsByClassName('no-score');
    if (noScore.length != 0) {
        noScore.parentNode.removeChild(noScore);
    }
}

highScoresList.innerHTML =
    highScores
        .map( score => {
            return `<li class="high-score">${score.name} - ${score.score}</li>`;
        })
        .join("");