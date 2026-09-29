let data = {};
let activeBrand = 'mercedes';   // открытая вкладка

// Полные названия брендов для заголовка и модалки
const brandNames = {
  mercedes: 'Mercedes-Benz',
  bmw: 'BMW',
  porsche: 'Porsche'
};

// Названия цветов из data.json
const colorNames = {
  '#0B0B0D': 'Obsidian Black',
  '#F4F5F6': 'Polar White',
  '#C7C9CC': 'Iridium Silver',
  '#4A4E52': 'Selenite Grey',
  '#5B5D5F': 'Graphite Grey',
  '#2E3A4E': 'Midnight Blue',
  '#1C2331': 'Deep Navy',
  '#1C2A45': 'Carbon Blue',
  '#2E5BFF': 'Portimao Blue',
  '#4E9BB8': 'Frozen Blue',
  '#7A2E2E': 'Ruby Red',
  '#C7352E': 'Guards Red',
  '#F2C230': 'Racing Yellow',
  '#3A4A3F': 'Olive Green',
  '#3A9B5C': 'Isle of Man Green',
  '#1C4532': 'British Racing Green',
  '#3A2E4E': 'Amethyst'
};

function colorName(hex) {
  return colorNames[hex.toUpperCase()] || hex;
}

// ===== Часть 1. Загрузка данных =====
axios.get('data/data.json')
  .then(function(response) {
    data = response.data;

    console.log(data);          // проверьте структуру

    renderCards(activeBrand);   // первый вывод
  })
  .catch(function(error) {
    console.error('Не удалось загрузить data.json', error);
    document.querySelector('.cards').innerHTML =
      '<p class="error">Не удалось загрузить данные. Откройте проект через Live Server.</p>';
  });

// ===== Часть 2. Вкладки категорий =====
function selectBrand(brand) {
  activeBrand = brand;

  const tabs = document.querySelectorAll('.tab');
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].dataset.brand === brand) {
      tabs[i].classList.add('active');
    } else {
      tabs[i].classList.remove('active');
    }
  }

  renderCards(activeBrand);
}

// ===== Часть 3. Сетка карточек =====
function renderCards(brand) {
  const cars = data[brand];
  let html = '';

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];

    // Бейдж остатка — только для машин с count = 1
    let badge = '';
    if (car.count === 1) {
      badge = '<span class="badge">Осталась 1</span>';
    }

    html = html + `
      <div class="card" onclick="openModal('${brand}', ${i})">
        <div class="card-image">
          ${badge}
          <div class="photo-slot">
            <svg class="photo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <p>Фото: ${car.title}</p>
            <span>or <u>browse files</u></span>
          </div>
        </div>
        <h3>${car.title}</h3>
        <p class="card-desc">${car.description}</p>
        <div class="card-bottom">
          <p class="price">$${car.price.toLocaleString('en-US')}</p>
          <button class="btn">Заказать</button>
        </div>
      </div>
    `;
  }

  document.querySelector('.cards').innerHTML = html;

  // Заголовок секции
  document.querySelector('.brand-title').textContent = brandNames[brand];
  document.querySelector('.models-count').textContent = cars.length + ' моделей в салоне';
}

// ===== Часть 4. Окно с деталями =====
function openModal(brand, index) {
  const car = data[brand][index];

  // Кружки цветов — тоже цикл с накоплением
  let colorsHtml = '';

  for (let i = 0; i < car.availableColors.length; i++) {
    let activeClass = '';
    if (i === 0) {
      activeClass = ' active';
    }

    colorsHtml = colorsHtml + `
      <span class="color-dot${activeClass}"
            style="background: ${car.availableColors[i]}"
            title="${colorName(car.availableColors[i])}"
            onclick="selectColor(this, '${car.availableColors[i]}')"></span>
    `;
  }

  document.querySelector('.modal-content').innerHTML = `
    <div class="modal-image">
      <div class="photo-slot">
        <svg class="photo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <p>Фото: ${car.title}, крупно</p>
        <span>or <u>browse files</u></span>
      </div>
    </div>
    <div class="modal-info">
      <p class="eyebrow eyebrow-accent">${brandNames[brand]} · 2026</p>
      <h2>${car.title}</h2>
      <p class="modal-price">$${car.price.toLocaleString('en-US')}</p>
      <p class="modal-desc">${car.description}</p>
      <p class="stock"><span class="stock-dot"></span>В наличии: <b>${car.count} шт.</b></p>
      <p class="color-label">Цвет: <b class="color-name">${colorName(car.availableColors[0])}</b></p>
      <div class="colors">${colorsHtml}</div>
      <button class="btn btn-big" onclick="orderCar('${brand}', ${index})">Заказать</button>
    </div>
  `;

  document.querySelector('.modal').classList.add('open');
}

// Выбор цвета в модалке
function selectColor(dot, color) {
  const box = document.querySelector('.modal-content');

  const dots = dot.parentElement.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
  dot.classList.add('active');

  const label = box.querySelector('.color-name');
  if (label) {
    label.textContent = colorName(color);
  }
}

function closeModal() {
  document.querySelector('.modal').classList.remove('open');
}

function orderCar(brand, index) {
  alert('Заявка на ' + data[brand][index].title + ' принята!');
}

// Закрытие по клику на затемнённый фон и по Esc
document.querySelector('.modal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeModal();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});
