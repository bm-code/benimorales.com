// Selectors

const menuLink = document.querySelectorAll('.menu__link');
const inputMenu = document.getElementById('burger-activador');
const submitBtn = document.getElementsByClassName('form__btn');
const form = document.getElementsByTagName('form');
const inputForm = document.querySelectorAll('#input-form');

//Plegar el menú móvil cuando clickamos en un link
menuLink.forEach(item => item.addEventListener('click', () => inputMenu.checked = !inputMenu.checked));

// reCAPTCHA V3

function onSubmit(token) {
    document.getElementById("demo-form").submit();
}