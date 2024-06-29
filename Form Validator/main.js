
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// Functions 

// 1. Show input error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error'; // Same as formControl.classList.add('error');
    const small = formControl.querySelector('small');
    small.innerText = message;
}

// 2. Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

// 3. Validate email
function checkEmail(input) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid')
    }
}

// Check required
function checkRequired(inputArr){
    
    inputArr.forEach(function(input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`)
        } else {
            showSuccess(input)
        }
    });
}

// Check Password match
function checkPasswordMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords don\'t match');
    }
}

// Check input Length

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be atleast ${min} characters long`)
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be lessthan ${max} characters long`)
    } else {
        showSuccess(input)
    }
}

// Get Field Name -- will capitalize the first letter of the input for the small tag error message.
function getFieldName(input) {
    return `${input.id.slice(0,1).toUpperCase()}${input.id.slice(1, input.length)}`
}

// Event Listener

form.addEventListener('submit', function(e){
    e.preventDefault();

    checkRequired([username, email, password, password2]);
    checkLength(username, 3, 15);
    checkLength(password, 6, 24)
    checkEmail(email);
    checkPasswordMatch(password, password2)
});
