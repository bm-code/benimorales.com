// Selectors

const menuLink = document.querySelectorAll('.menu__link');
const inputMenu = document.getElementById('burger-activador');

menuLink.forEach(item => item.addEventListener('click', () => inputMenu.checked = !inputMenu.checked));