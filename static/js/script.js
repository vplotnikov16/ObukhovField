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
            setTimeout(showStar, 500);
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

document.getElementById('number-select').addEventListener('scroll', function() {
    highlightSelectedOption();
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
});

function highlightSelectedOption() {
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
}
