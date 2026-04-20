// Адаптивное меню
document.querySelector('.burger')?.addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');
});

// Счётчик онлайна (имитация)
function updateOnlineCount() {
    const base = 750;
    const variation = Math.floor(Math.random() * 250);
    const count = base + variation;
    const onlineSpan = document.getElementById('onlineCount');
    if (onlineSpan) onlineSpan.innerText = count;
}
setInterval(updateOnlineCount, 10000);
updateOnlineCount();

// Топ-5 матчей (главная)
const liveMatchesData = [
    { map: "Завод", players: 12, mode: "Deathmatch", time: "идет" },
    { map: "Залив", players: 8, mode: "Faceit", time: "15:30" },
    { map: "Аэропорт", players: 14, mode: "Deathmatch", time: "идет" },
    { map: "Тренировка", players: 6, mode: "Спавн", time: "10:00" },
    { map: "Кладбище", players: 10, mode: "Deathmatch", time: "идет" }
];
function renderLiveMatches() {
    const container = document.getElementById('liveMatches');
    if (!container) return;
    container.innerHTML = liveMatchesData.map(match => `
        <div class="match-card">
            <h3>${match.map}</h3>
            <div class="players"><i class="fas fa-user"></i> ${match.players} игроков</div>
            <div>${match.mode} • ${match.time}</div>
            <a href="deathmatches.html" class="btn-sm">Присоединиться</a>
        </div>
    `).join('');
}
renderLiveMatches();

// Карусель розыгрышей
const giveaways = [
    { title: "Скины на 5000₽", date: "20 апреля", desc: "Участвуй и выигрывай!" },
    { title: "Battlepass Premium", date: "25 апреля", desc: "Бесплатный доступ для 3 победителей" },
    { title: "Игровая мышь", date: "30 апреля", desc: "От HyperX" }
];
let currentSlide = 0;
function renderCarousel() {
    const slide = document.getElementById('carouselSlide');
    if (!slide) return;
    slide.innerHTML = giveaways.map(g => `
        <div class="giveaway-item">
            <h3>${g.title}</h3>
            <p>${g.date}</p>
            <p>${g.desc}</p>
            <a href="giveaways.html" class="btn-primary" style="margin-top:16px; display:inline-block;">Подробнее</a>
        </div>
    `).join('');
    slide.style.transform = `translateX(-${currentSlide * 100}%)`;
}
function nextSlide() {
    if (currentSlide < giveaways.length - 1) currentSlide++;
    else currentSlide = 0;
    renderCarousel();
}
function prevSlide() {
    if (currentSlide > 0) currentSlide--;
    else currentSlide = giveaways.length - 1;
    renderCarousel();
}
if (document.getElementById('carouselSlide')) {
    renderCarousel();
    document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
    document.getElementById('prevBtn')?.addEventListener('click', prevSlide);
}

// Лобби (Faceit)
const lobbyModal = document.getElementById('lobbyModal');
const findMatchBtn = document.getElementById('findMatchBtn');
const closeLobbyBtn = document.getElementById('closeLobbyBtn');
const leaveLobbyBtn = document.getElementById('leaveLobbyBtn');
const inviteFriendBtn = document.getElementById('inviteFriendBtn');
let timerInterval = null;

const maps = ["Завод", "Залив", "Аэропорт", "Кладбище", "Тренировка"];

function openLobby() {
    // Случайная карта
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    document.getElementById('mapName').innerText = randomMap;
    // Сброс таймера
    if (timerInterval) clearInterval(timerInterval);
    let seconds = 60; // 1 минута до начала
    const timerElement = document.getElementById('timer');
    timerElement.innerText = formatTime(seconds);
    timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            clearInterval(timerInterval);
            timerElement.innerText = "00:00";
            alert("Матч начался! Перенаправление...");
            lobbyModal.style.display = 'none';
            // Здесь можно сделать редирект на страницу матча, например:
            // window.location.href = 'deathmatches.html';
        } else {
            timerElement.innerText = formatTime(seconds);
        }
    }, 1000);
    lobbyModal.style.display = 'flex';
}

function formatTime(sec) {
    const mins = Math.floor(sec / 60);
    const remainSec = sec % 60;
    return `${mins.toString().padStart(2,'0')}:${remainSec.toString().padStart(2,'0')}`;
}

function closeLobby() {
    if (timerInterval) clearInterval(timerInterval);
    lobbyModal.style.display = 'none';
}

if (findMatchBtn) {
    findMatchBtn.addEventListener('click', openLobby);
}
if (closeLobbyBtn) closeLobbyBtn.addEventListener('click', closeLobby);
if (leaveLobbyBtn) leaveLobbyBtn.addEventListener('click', closeLobby);

if (inviteFriendBtn) {
    inviteFriendBtn.addEventListener('click', () => {
        alert('Ссылка-приглашение скопирована (демо-режим)');
    });
}

// Автоподбор на странице Deathmatches
const autoMatchBtn = document.getElementById('autoMatchBtn');
const autoModal = document.getElementById('autoMatchModal');
const autoModalMessage = document.getElementById('autoModalMessage');
let autoTimeout;

function startAutoMatchmaking() {
    if (!autoModal) return;
    autoModal.style.display = 'flex';
    autoModalMessage.textContent = 'Поиск подходящего матча...';
    if (autoTimeout) clearTimeout(autoTimeout);
    autoTimeout = setTimeout(() => {
        autoModalMessage.textContent = 'Матч найден! Перенаправление...';
        setTimeout(() => {
            autoModal.style.display = 'none';
            alert('Вы присоединены к матчу на карте "Завод".');
        }, 1500);
    }, 3500);
    setTimeout(() => {
        if (autoModal.style.display === 'flex' && autoModalMessage.textContent === 'Поиск подходящего матча...') {
            autoModalMessage.textContent = 'Не удалось найти матч. Попробуйте позже.';
            setTimeout(() => {
                autoModal.style.display = 'none';
            }, 2000);
        }
    }, 7000);
}

if (autoMatchBtn) {
    autoMatchBtn.addEventListener('click', startAutoMatchmaking);
}

// Кнопки "Присоединиться" и "Создать матч" на deathmatches.html
document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Вы присоединились к матчу!');
    });
});
const createBtn = document.getElementById('createMatchBtn');
if (createBtn) {
    createBtn.addEventListener('click', () => {
        alert('Создание матча (демо-режим)');
    });
}
