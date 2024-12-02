const titulo = document.getElementById('titulo');
const pista = document.getElementById('pista-de-baile');
const agregarColorBtn = document.getElementById('agregar-color');
const reiniciarBtn = document.getElementById('reiniciar');
const mensajePopular = document.getElementById('mensaje-popular');
const selectorColores = document.getElementById('selector-colores');
const coloresDisponibles = document.getElementById('colores-disponibles');
const cerrarSelectorBtn = document.getElementById('cerrar-selector');
const verListaVotosBtn = document.getElementById('ver-lista-votos');
const listaVotosDiv = document.getElementById('lista-votos');
const toggleSonidoBtn = document.getElementById('toggle-sonido');

let colores = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF'];
let votos = {};
let timer;
let sonidoActivo = true;

const coloresPredefinidos = [
    '#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF',
    '#123456', '#654321', '#F0A500', '#0AFFF0', '#A500FF'
];

function guardarDatos() {
    localStorage.setItem('colores', JSON.stringify(colores));
    localStorage.setItem('votos', JSON.stringify(votos));
}

function cargarDatos() {
    colores = JSON.parse(localStorage.getItem('colores')) || colores;
    votos = JSON.parse(localStorage.getItem('votos')) || {};
}

function iniciarFiesta() {
    pista.innerHTML = '';
    colores.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color';
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => seleccionarColor(color));
        pista.appendChild(colorDiv);
        votos[color] = votos[color] || 0;
    });
    reiniciarTemporizador();  // Reinicia el temporizador cada vez que se inicia la fiesta.
}

function mostrarListaVotos() {
    listaVotosDiv.innerHTML = '';
    const lista = Object.entries(votos)
        .map(([color, cantidad]) => `
            <div style="margin: 5px 0;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${color};"></span>
                ${color}: ${cantidad} voto(s)
            </div>
        `)
        .join('');
    listaVotosDiv.innerHTML = lista || 'No hay votos aún.';
    listaVotosDiv.style.display = 'block';
}

function seleccionarColor(color) {
    titulo.style.color = color;
    votos[color]++;
    mostrarColorPopular();
    reproducirSonido();
    reiniciarTemporizador(); // Reinicia el temporizador cada vez que se selecciona un color.
}

function agregarColor() {
    selectorColores.style.display = 'block';
    coloresDisponibles.innerHTML = '';
    coloresPredefinidos.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-opcion';
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => {
            colores.push(color);
            iniciarFiesta();
            cerrarSelector();
        });
        coloresDisponibles.appendChild(colorDiv);
    });
}

function cerrarSelector() {
    selectorColores.style.display = 'none';
}

function reiniciarFiesta() {
    colores = [];
    votos = {};
    titulo.style.color = '#000';
    iniciarFiesta();  // Vuelve a iniciar la fiesta.
}

function mostrarColorPopular() {
    const [colorPopular] = Object.entries(votos).sort((a, b) => b[1] - a[1])[0] || [];
    if (colorPopular) {
        mensajePopular.innerHTML = `
            El color más popular es <span style="display: inline-block; width: 20px; height: 20px; background-color: ${colorPopular};"></span> 
            con ${votos[colorPopular]} votos.
        `;
        mensajePopular.classList.add('visible');
    } else {
        mensajePopular.textContent = '';
        mensajePopular.classList.remove('visible');
    }
}

function reproducirSonido() {
    if (!sonidoActivo) return;
    const audio = new Audio('sonido.mp3');
    audio.play();
}

function reiniciarTemporizador() {
    if (timer) clearTimeout(timer);  // Limpiar cualquier temporizador previo.
    timer = setTimeout(() => {
        reiniciarFiesta();  // Reinicia la fiesta después de 10 segundos de inactividad.
    }, 10000);  // 10000 milisegundos = 10 segundos.
}

toggleSonidoBtn.addEventListener('click', () => {
    sonidoActivo = !sonidoActivo;
    toggleSonidoBtn.textContent = `Sonido: ${sonidoActivo ? 'Activado' : 'Desactivado'}`;
});

agregarColorBtn.addEventListener('click', agregarColor);
cerrarSelectorBtn.addEventListener('click', cerrarSelector);
reiniciarBtn.addEventListener('click', reiniciarFiesta);
verListaVotosBtn.addEventListener('click', mostrarListaVotos);

window.addEventListener('beforeunload', guardarDatos);
cargarDatos();
iniciarFiesta();
