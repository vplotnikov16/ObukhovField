document.getElementById('get-signal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
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
            const cell = document.getElementById(`cell-${positions[index]}`);
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
    let selectedNumber = options[3].innerText; // Adjust to match the correct option position

    for (let option of options) {
        const optionRect = option.getBoundingClientRect();
        const pickerRect = numberPicker.getBoundingClientRect();

        if (optionRect.top >= pickerRect.top + pickerHeight / 3 &&
            optionRect.bottom <= pickerRect.bottom - pickerHeight / 3) {
            selectedNumber = option.innerText;
            break;
        }
    }

    return selectedNumber;
}

// Добавляем прослушиватель событий для прокрутки
document.getElementById('number-select').addEventListener('scroll', function() {
    const numberPicker = document.getElementById('number-select');
    const options = numberPicker.getElementsByClassName('number-option');
    const pickerHeight = numberPicker.clientHeight;

    for (let option of options) {
        const optionRect = option.getBoundingClientRect();
        const pickerRect = numberPicker.getBoundingClientRect();

        if (optionRect.top >= pickerRect.top + pickerHeight / 3 &&
            optionRect.bottom <= pickerRect.bottom - pickerHeight / 3) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    }
});
