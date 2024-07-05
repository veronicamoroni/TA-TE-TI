// Definición del tablero y variables del juego
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const cells = document.querySelectorAll("td");
let selectedCellIndex = null;
let gameStarted = false; // Variable para controlar el estado del juego

// Event listener para el botón de iniciar juego
document.getElementById("startButton").addEventListener("click", startGame);

// Event listeners para cada celda del tablero
cells.forEach((cell) => {
    cell.addEventListener("click", handleClick);
});

// Función para iniciar el juego
function startGame() {
    resetGame();
    gameStarted = true; // El juego ha comenzado
    alert("El juego ha comenzado. ¡Selecciona una celda para responder una pregunta!");
}

// Función para manejar el click en una celda del tablero
function handleClick(event) {
    if (!gameStarted) {
        alert("Presiona 'Iniciar Juego' para comenzar.");
        return;
    }

    selectedCellIndex = Array.from(cells).indexOf(event.target);

    if (board[selectedCellIndex] != "") {
        return;
    }

    fetchQuestion();
}

// Función para obtener una pregunta del servidor
function fetchQuestion() {
    fetch('http://localhost:3002/pregunta') 
        .then(response => response.json())
        .then(data => {
            displayQuestion(data[Math.floor(Math.random() * data.length)]);
        });
}

// Función para mostrar la pregunta en un modal
function displayQuestion(question) {
    const questionModal = $('#questionModal');
    $('#question').text(question.Pregunta);
    const answersDiv = $('#answers');
    answersDiv.empty();
    for (let i = 1; i <= 3; i++) {
        const answer = question['Respuesta' + i];
        const answerBtn = $('<button>')
            .addClass('btn btn-primary m-2')
            .text(answer)
            .on('click', () => checkAnswer(question, i));
        answersDiv.append(answerBtn);
    }
    questionModal.modal('show');
}

// Función para verificar la respuesta seleccionada por el jugador
function checkAnswer(question, answerIndex) {
    const questionModal = $('#questionModal');
    questionModal.modal('hide');
    if (question.Verdadera === answerIndex) {
        alert('Respuesta correcta!');
        board[selectedCellIndex] = currentPlayer;
        cells[selectedCellIndex].textContent = currentPlayer; // Coloca X o O en la celda seleccionada
        cells[selectedCellIndex].classList.add('correct-answer'); // Agrega la clase de respuesta correcta

        // Verificar si algún jugador ha ganado después de la jugada
        setTimeout(() => {
            if (checkWin()) {
                alert(`¡Jugador ${currentPlayer} ha ganado!`);
                resetGame();
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Cambia el turno del jugador después de verificar la victoria
        }, 100); // Ajusta el tiempo según sea necesario para asegurar que se vea la última jugada
    } else {
        alert('Respuesta incorrecta. Turno perdido.');
    }
}

// Función para verificar si algún jugador ha ganado
function checkWin() {
    const winCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winCondition) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Función para reiniciar el juego
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('correct-answer'); // Remueve la clase de respuesta correcta al reiniciar el juego
    });
    currentPlayer = "X";
    gameStarted = false; // El juego no ha comenzado
}
