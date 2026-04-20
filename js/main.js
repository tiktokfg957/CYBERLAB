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

// Топ-5 матчей (главная страница)
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

// ========== СТРАНИЦА FACEIT (поиск соперника) ==========
const findBtn = document.getElementById('findMatchBtn');
const modal = document.getElementById('searchModal');
const modalMessage = document.getElementById('modalMessage');
let searchTimeout;

function showSearchModal() {
    if (!modal || !modalMessage) return;
    modal.style.display = 'flex';
    modalMessage.textContent = 'Поиск соперника...';
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        modalMessage.textContent = 'Соперник найден! Перенаправление...';
        setTimeout(() => {
            modal.style.display = 'none';
            alert('Матч создан! Вы будете перенаправлены в лобби.');
        }, 1500);
    }, 3000);
    setTimeout(() => {
        if (modal.style.display === 'flex' && modalMessage.textContent === 'Поиск соперника...') {
            modalMessage.textContent = 'Не удалось найти соперника. Попробуйте позже.';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 2000);
        }
    }, 6000);
}

if (findBtn) {
    findBtn.addEventListener('click', showSearchModal);
}

// Кнопка "Создать лобби"
const createLobbyBtn = document.getElementById('createLobbyBtn');
if (createLobbyBtn) {
    createLobbyBtn.addEventListener('click', () => {
        window.location.href = 'lobby.html';
    });
}

// ========== СТРАНИЦА LOBBY ==========
if (window.location.pathname.includes('lobby.html')) {
    const currentUser = "H1T_M4N";
    let myTeam = [currentUser, null, null, null, null];
    let enemyTeam = [null, null, null, null, null];

    function renderTeams() {
        const myContainer = document.getElementById('myTeamSlots');
        const enemyContainer = document.getElementById('enemyTeamSlots');
        if (myContainer) {
            myContainer.innerHTML = myTeam.map((player, idx) => `
                <div class="player-slot">
                    <span class="name">${player ? player : `Слот ${idx+1}`}</span>
                    ${!player && idx !== 0 ? `<button class="invite-btn" data-slot="${idx}">Пригласить</button>` : ''}
                </div>
            `).join('');
        }
        if (enemyContainer) {
            enemyContainer.innerHTML = enemyTeam.map((player, idx) => `
                <div class="player-slot">
                    <span class="name">${player ? player : `Соперник ${idx+1}`}</span>
                </div>
            `).join('');
        }
        document.querySelectorAll('.invite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = btn.getAttribute('data-slot');
                alert(`Приглашение отправлено игроку на слот ${slot}`);
            });
        });
    }
    renderTeams();

    let timeLeft = 60;
    const timerElement = document.getElementById('timer');
    let timerInterval;
    function updateTimerDisplay() {
        if (timerElement) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }
    }
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Матч начался!');
            } else {
                timeLeft--;
                updateTimerDisplay();
            }
        }, 1000);
    }
    updateTimerDisplay();

    const startMatchBtn = document.getElementById('startMatchBtn');
    if (startMatchBtn) {
        startMatchBtn.addEventListener('click', () => {
            const filledSlots = myTeam.filter(p => p !== null).length;
            if (filledSlots < 2) {
                alert('Нужно минимум 2 игрока в команде!');
                return;
            }
            startTimer();
            startMatchBtn.disabled = true;
            startMatchBtn.textContent = 'Матч начат';
        });
    }

    const inviteFriendBtn = document.getElementById('inviteFriendBtn');
    if (inviteFriendBtn) {
        inviteFriendBtn.addEventListener('click', () => {
            alert('Ссылка-приглашение скопирована (демо)');
        });
    }
}

// ========== СТРАНИЦА DEATHMATCHES (автоподбор) ==========
const autoMatchBtn = document.getElementById('autoMatchBtn');
const autoModal = document.getElementById('autoMatchModal');
const autoModalMessage = document.getElementById('autoModalMessage');
let autoTimeout;

function startAutoMatchmaking() {
    if (!autoModal || !autoModalMessage) return;
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

// Обработка кнопок "Присоединиться" в таблице Deathmatches
document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Вы присоединились к матчу!');
    });
});

const createMatchBtn = document.getElementById('createMatchBtn');
if (createMatchBtn) {
    createMatchBtn.addEventListener('click', () => {
        alert('Создание матча (демо-режим)');
    });
}
