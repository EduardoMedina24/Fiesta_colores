// Variables de referencia
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

// Variables de estado
let colores = ['#FF5733', '#33FF57', '#3357FF'];
let votos = {};
let timer;
let sonidoActivo = true;

// Colores predefinidos para agregar
const coloresPredefinidos = [
    '#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF',
    '#123456', '#654321', '#F0A500', '#0AFFF0', '#A500FF'
];

// Función para guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('colores', JSON.stringify(colores));
    localStorage.setItem('votos', JSON.stringify(votos));
}

// Función para cargar datos desde localStorage
function cargarDatos() {
    colores = JSON.parse(localStorage.getItem('colores')) || colores;
    votos = JSON.parse(localStorage.getItem('votos')) || {};
}

// Función para iniciar la fiesta
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
    mostrarColorPopular();
    reiniciarTemporizador();
}

// Función para mostrar la lista de votos
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

// Función para seleccionar un color
function seleccionarColor(color) {
    titulo.style.color = color;
    votos[color]++;
    mostrarColorPopular();
    reproducirSonido();
    reiniciarTemporizador();
}

// Función para agregar un nuevo color
function agregarColor() {
    selectorColores.style.display = 'block';
    coloresDisponibles.innerHTML = '';
    coloresPredefinidos.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-opcion';
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => {
            if (!colores.includes(color)) {
                colores.push(color);
                iniciarFiesta();
                cerrarSelector();
            }
        });
        coloresDisponibles.appendChild(colorDiv);
    });
}

// Función para cerrar el selector de colores
function cerrarSelector() {
    selectorColores.style.display = 'none';
}

// Función para reiniciar la fiesta
function reiniciarFiesta() {
    colores = ['#FF5733', '#33FF57', '#3357FF'];
    votos = {};
    titulo.style.color = '#000';
    iniciarFiesta();
}

// Función para mostrar el color más popular
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

// Función para reproducir un sonido al seleccionar un color
function reproducirSonido() {
    if (!sonidoActivo) return;

    // Lista de archivos de sonido para aleatoriedad
    const sonidos = [
    
        'sounds/bells.mp3',
        'sounds/campana.mp3',
        'sounds/jingle.mp3'
    ];

    // Seleccionar un sonido aleatorio
    const sonidoAleatorio = sonidos[Math.floor(Math.random() * sonidos.length)];
    
    // Reproducir el sonido
    const audio = new Audio(sonidoAleatorio);
    audio.play();
}


// Función para reiniciar el temporizador de inactividad
function reiniciarTemporizador() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        reiniciarFiesta();
    }, 10000);
}

// Configurar eventos
toggleSonidoBtn.addEventListener('click', () => {
    sonidoActivo = !sonidoActivo;
    toggleSonidoBtn.textContent = `Sonido: ${sonidoActivo ? 'Activado' : 'Desactivado'}`;
});

agregarColorBtn.addEventListener('click', agregarColor);
cerrarSelectorBtn.addEventListener('click', cerrarSelector);
reiniciarBtn.addEventListener('click', reiniciarFiesta);
verListaVotosBtn.addEventListener('click', mostrarListaVotos);

// Inicialización
window.addEventListener('beforeunload', guardarDatos);
cargarDatos();
iniciarFiesta();
