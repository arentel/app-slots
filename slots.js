// Configuración inicial de Phaser
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  parent: 'game',
  backgroundColor: '#111',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let slots = [];
let symbols = ['ron_barcelo', 'puerto_indias', 'absolut_vodka'];
let spinning = false;
let countdownTime = 1200; // 20 minutos en segundos
let countdownText = document.getElementById('countdown');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');

// Altura deseada para cada imagen en el slot
const slotHeight = 200;

function preload() {
  // Carga de imágenes con nombres correctos
  this.load.image('ron_barcelo', 'images/ron.jpg');
  this.load.image('puerto_indias', 'images/puerto.jpeg');
  this.load.image('absolut_vodka', 'images/absolut.jpeg');
}

function create() {
  const slotXStart = 125; // Coordenada X inicial para el primer slot
  const slotSpacing = 175; // Espacio entre cada slot

  // Crear los tres slots con imágenes escaladas y espacio entre ellos
  for (let i = 0; i < 3; i++) {
    const randomSymbol = Phaser.Math.RND.pick(symbols);
    const slot = this.add.image(slotXStart + i * slotSpacing, 200, randomSymbol);

    // Ajusta la altura y permite que Phaser mantenga la proporción original
    slot.displayHeight = slotHeight;
    slot.scaleX = slot.scaleY; // Asegura que se mantenga la proporción original en el ancho

    slots.push(slot);
  }

  // Configura el botón de giro
  document.getElementById('spin_button').onclick = () => {
    spinSlots.call(this);
  };

  // Temporizador de cuenta regresiva
  this.time.addEvent({
    delay: 1000,
    callback: updateCountdown,
    callbackScope: this,
    loop: true
  });
}

function spinSlots() {
  if (spinning) return;
  spinning = true;
  countdownTime = 1200; // Reinicia el contador después de cada giro

  slots.forEach((slot, index) => {
    this.tweens.add({
      targets: slot,
      y: slot.y + 600,
      duration: 200, // Duración de cada cambio de imagen, más lenta para un giro más suave
      repeat: 15, // Aumentar las repeticiones para hacer el giro más largo
      delay: index * 150, // Añade un retraso escalonado para cada slot
      onRepeat: () => {
        const randomSymbol = Phaser.Math.RND.pick(symbols);
        slot.setTexture(randomSymbol);

        // Aplicar solo la altura y dejar que se mantenga la proporción del ancho
        slot.displayHeight = slotHeight;
        slot.scaleX = slot.scaleY;
      },
      onComplete: () => {
        const finalSymbol = Phaser.Math.RND.pick(symbols);
        slot.setTexture(finalSymbol);

        // Aplicar solo la altura y mantener proporción en el ancho
        slot.displayHeight = slotHeight;
        slot.scaleX = slot.scaleY;

        slot.y -= 600;
        if (index === slots.length - 1) {
          checkResult();
          spinning = false;
        }
      }
    });
  });
}

function checkResult() {
  const result = slots.map(slot => slot.texture.key);
  if (result[0] === result[1] && result[1] === result[2]) {
    const specialPrice = Phaser.Math.RND.pick([3, 4, 5]);
    showPopup(`¡Ganaste! Bebida: ${result[0].replace('_', ' ')} a un precio especial de ${specialPrice}€`, 5000); // 5 segundos
  } else {
    showPopup("No has ganado esta vez. ¡Sigue intentando!", 5000); // 5 segundos
  }
}

function updateCountdown() {
  if (countdownTime > 0) {
    countdownTime--;
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    countdownText.innerText = `Próximo giro automático en: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    spinSlots.call(this);
  }
}

// Mostrar ventana emergente de anuncio de premio
function showPopup(message, duration) {
  popupContent.innerText = message;
  popup.style.display = 'flex';

  // Configura un temporizador para cerrar el popup después de la duración especificada
  setTimeout(() => {
    popup.style.display = 'none';
  }, duration);
}

function update() {}
