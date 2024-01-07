const body = document.getElementsByTagName('body')[0];

const divheader = document.createElement('header');
divheader.id = "header";
body.prepend(divheader);
const header = document.getElementById('header');

header.style.backgroundColor = 'black';
header.style.width = "300px"
header.style.height = "300px"

const divfooter = document.createElement('footer');
divfooter.id = "footer";
body.append(divfooter);
const footer = document.getElementById('footer');

footer.style.backgroundColor = 'yellow'
footer.style.width = "300px"
footer.style.height = "300px"