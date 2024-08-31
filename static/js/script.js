document.getElementById('decrease-button').addEventListener('click', function() {
    adjustNumber(-1);
});

document.getElementById('increase-button').addEventListener('click', function() {
    adjustNumber(1);
});

function adjustNumber(delta) {
    const numberDisplay = document.getElementById('number-display');
    const currentNumber = parseInt(numberDisplay.innerText);
    const numbers = [1, 3, 5, 7];
    const currentIndex = numbers.indexOf(currentNumber);
    const newIndex = Math.min(Math.max(currentIndex + delta, 0), numbers.length - 1);
    numberDisplay.innerText = numbers[newIndex];
}

document.getElementById('get-signal').addEventListener('click', function() {
    const selectedNumber = document.getElementById('number-display').innerText;
    fetch('/get_signal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: parseInt(selectedNumber) })
    })
    .then(response => response.json())
    .then(data => {
        clearGrid();
        animateStars(data.stars_positions);
    });
});

function clearGrid() {
    for (let i = 0; i < 25; i++) {
        const cell = document.getElementById(`cell-${i}`);
        cell.innerHTML = '<div class="cell-inner"><div class="cell-front"></div><div class="cell-back"></div></div>';
        cell.classList.remove('flip');
    }
}

function animateStars(positions) {
    let index = 0;
    function showStar() {
        if (index < positions.length) {
            const [row, col] = positions[index].split('-').map(Number);
            const cellIndex = (row - 1) * 5 + (col - 1);
            const cell = document.getElementById(`cell-${cellIndex}`);
            cell.querySelector('.cell-back').innerHTML = '⭐';
            cell.classList.add('flip');
            index++;
            setTimeout(showStar, 1000);
        }
    }
    showStar();
}

window.onload = function() {
    document.getElementById('number-display').innerText = "1";
};

const minesTitle = document.getElementById('mines-title');

// Функция для изменения текста
function changeText() {
    setTimeout(() => {
        if (minesTitle.textContent == "MINES") {
            minesTitle.textContent = 'WINNERS';
        }
        else {
            minesTitle.textContent = 'MINES';
        }
    }, 1500); // Изменение текста через 1.5 секунды (50% от 3 секунд)
}

// Слушаем событие окончания анимации и вызываем changeText
minesTitle.addEventListener('animationiteration', changeText);
