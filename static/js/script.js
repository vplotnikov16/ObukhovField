document.getElementById('get-signal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'flex';
    centerSelectedNumber(); // Центрирование на выбранном числе
});

document.getElementById('confirm').addEventListener('click', function() {
    const selectedNumber = getSelectedNumber();
    fetch('/get_signal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: parseInt(selectedNumber) })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal').style.display = 'none';
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

document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

function getSelectedNumber() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const pickerHeight = numberPicker.clientHeight;

    for (let option of options) {
        const optionRect = option.getBoundingClientRect();
        const pickerRect = numberPicker.getBoundingClientRect();

        if (optionRect.top >= pickerRect.top + pickerHeight / 2 - optionRect.height / 2 &&
            optionRect.bottom <= pickerRect.bottom - pickerHeight / 2 + optionRect.height / 2) {
            return option.innerText;
        }
    }

    return null;
}

document.getElementById('number-select').addEventListener('scroll', function() {
    highlightSelectedOption();
    preventScrollOutOfBounds(); // Добавляем функцию для предотвращения выхода за границы
});

let touchstartY = 0;
let currentScrollY = 0;

document.getElementById('number-select').addEventListener('touchstart', function(event) {
    touchstartY = event.changedTouches[0].screenY;
    currentScrollY = document.getElementById('number-select').scrollTop;
});

document.getElementById('number-select').addEventListener('touchmove', function(event) {
    const touchmoveY = event.changedTouches[0].screenY;
    const distance = touchstartY - touchmoveY;
    document.getElementById('number-select').scrollTop = currentScrollY + distance;
});

document.getElementById('number-select').addEventListener('touchend', function(event) {
    centerSelectedNumber();
    preventScrollOutOfBounds(); // Добавляем функцию для предотвращения выхода за границы
});

function centerSelectedNumber() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const pickerHeight = numberPicker.clientHeight;
    let closestOption = options[0];
    let closestDistance = Infinity;

    for (let option of options) {
        const optionRect = option.getBoundingClientRect();
        const pickerRect = numberPicker.getBoundingClientRect();
        const distance = Math.abs(optionRect.top + optionRect.height / 2 - pickerRect.top - pickerHeight / 2);

        if (distance < closestDistance) {
            closestOption = option;
            closestDistance = distance;
        }
    }

    numberPicker.scrollTop = closestOption.offsetTop - pickerHeight / 2 + closestOption.clientHeight / 2;
    highlightSelectedOption();
    adjustForEmptyOptions(closestOption); // Добавляем вызов новой функции
}

function adjustForEmptyOptions(selectedOption) {
    const emptyOptions = ['9', '10', '11', '12'];
    if (emptyOptions.includes(selectedOption.innerText)) {
        const numberPicker = document.getElementById('number-select');
        const options = numberPicker.getElementsByClassName('number-option');
        if (selectedOption.innerText === '9' || selectedOption.innerText === '10') {
            numberPicker.scrollTop = options[2].offsetTop - numberPicker.clientHeight / 2 + options[2].clientHeight / 2; // Скроллим к числу 1
        } else if (selectedOption.innerText === '11' || selectedOption.innerText === '12') {
            numberPicker.scrollTop = options[5].offsetTop - numberPicker.clientHeight / 2 + options[5].clientHeight / 2; // Скроллим к числу 7
        }
        highlightSelectedOption();
    }
}

function highlightSelectedOption() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const pickerHeight = numberPicker.clientHeight;

    for (let option of options) {
        const optionRect = option.getBoundingClientRect();
        const pickerRect = numberPicker.getBoundingClientRect();

        if (optionRect.top >= pickerRect.top + pickerHeight / 2 - optionRect.height / 2 &&
            optionRect.bottom <= pickerRect.bottom - pickerHeight / 2 + optionRect.height / 2) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    }
}

// Новая функция для предотвращения выхода за границы
function preventScrollOutOfBounds() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const minScroll = options[2].offsetTop - numberPicker.clientHeight / 2 + options[2].clientHeight / 2; // Минимальный скролл для числа 1
    const maxScroll = options[5].offsetTop - numberPicker.clientHeight / 2 + options[5].clientHeight / 2; // Максимальный скролл для числа 7

    if (numberPicker.scrollTop < minScroll) {
        numberPicker.scrollTop = minScroll;
    } else if (numberPicker.scrollTop > maxScroll) {
        numberPicker.scrollTop = maxScroll;
    }
}

// Центрирование на числе 1 при загрузке страницы
window.onload = function() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const optionHeight = options[2].clientHeight; // Индекс 2 для числа 1
    numberPicker.scrollTop = options[2].offsetTop - numberPicker.clientHeight / 2 + optionHeight / 2;
    highlightSelectedOption();
    preventScrollOutOfBounds(); // Убедимся, что начальный скролл тоже в пределах границ
};
