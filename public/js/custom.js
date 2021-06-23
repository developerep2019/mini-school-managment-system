const findParams = new URLSearchParams(window.location.search);
const getParams = findParams.get('page');

const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');


if (getParams === null || getParams === '0') {
    Object.assign(previousBtn.style, { color: '#721c24', cursor: 'not-allowed' });
} else {
    previousBtn.style.color = '#007bff'
}

nextBtn.style.color = '#007bff';

const loadData = ifData => {
    if (ifData === 0) {
        nextBtn.href = 'javascript:void(0)';
        Object.assign(nextBtn.style, { color: '#721c24', cursor: 'not-allowed' });
    }
    else {
        nextBtn.addEventListener('click', () => {
            window.location.replace(`http://localhost:3000/notices?page=${+getParams + 1}`);
        })
    }
};

function dynamicPrevious() {
    if (getParams === null || getParams === '0') {
        previousBtn.href = 'javascript:void(0)';
    }
    else {
        window.location.replace(`http://localhost:3000/notices?page=${+getParams - 1}`)
    }
}