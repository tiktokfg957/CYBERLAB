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

// Топ-5 матчей (блок "Сейчас играют")
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

// Карусель анонсов розыгрышей
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

// ========== ПОИСК МАТЧА (Faceit) ==========
let searchInterval = null;
let searchSeconds = 0;
let isSearching = false;

function startMatchSearch() {
    if (isSearching) return;
    isSearching = true;
    const modal = document.getElementById('matchSearchModal');
    const messageDiv = document.getElementById('searchMessage');
    const timerDiv = document.getElementById('searchTimer');
    const resultDiv = document.getElementById('matchResult');
    const cancelBtn = document.getElementById('cancelSearchBtn');
    const spinner = document.querySelector('.spinner');
    
    // Сброс
    searchSeconds = 0;
    if (searchInterval) clearInterval(searchInterval);
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
    messageDiv.style.display = 'block';
    timerDiv.style.display = 'block';
    spinner.style.display = 'inline-block';
    messageDiv.innerText = 'Ищем соперника...';
    timerDiv.innerText = '0 сек';
    
    modal.style.display = 'flex';
    
    searchInterval = setInterval(() => {
        searchSeconds++;
        timerDiv.innerText = `${searchSeconds} сек`;
        // Эмуляция прогресса
        if (searchSeconds === 3) {
            messageDiv.innerText = 'Анализируем ваш рейтинг...';
        } else if (searchSeconds === 5) {
            messageDiv.innerText = 'Подбираем соперника...';
        } else if (searchSeconds >= 8) {
            // Завершаем поиск
            clearInterval(searchInterval);
            isSearching = false;
            spinner.style.display = 'none';
            messageDiv.style.display = 'none';
            timerDiv.style.display = 'none';
            resultDiv.style.display = 'block';
            // Случайный результат
            const found = Math.random() > 0.3; // 70% успех
            if (found) {
                const opponent = ["H1T_M4N", "GH0ST_R1P", "QU1CK_SCOPE", "FR0ST_GG"][Math.floor(Math.random() * 4)];
                resultDiv.innerHTML = `<p style="color:#4CAF50;">✓ Матч найден!</p><p>Соперник: ${opponent}</p><p>Карта: Завод</p><button id="acceptMatchBtn" class="btn-primary">Принять</button>`;
                document.getElementById('acceptMatchBtn')?.addEventListener('click', () => {
                    alert('Вы приняли матч. Скоро начнётся игра!');
                    modal.style.display = 'none';
                });
            } else {
                resultDiv.innerHTML = `<p style="color:#F44336;">✗ Соперник не найден</p><p>Попробуйте ещё раз.</p><button id="retrySearchBtn" class="btn-primary">Повторить</button>`;
                document.getElementById('retrySearchBtn')?.addEventListener('click', () => {
                    modal.style.display = 'none';
                    startMatchSearch();
                });
            }
        }
    }, 1000);
}

function cancelSearch() {
    if (searchInterval) clearInterval(searchInterval);
    isSearching = false;
    const modal = document.getElementById('matchSearchModal');
    modal.style.display = 'none';
}

// Обработчики для кнопок поиска
const findBtn = document.getElementById('findMatchBtn');
if (findBtn) {
    findBtn.addEventListener('click', startMatchSearch);
}
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', cancelSearch);
}
const cancelSearchBtn = document.getElementById('cancelSearchBtn');
if (cancelSearchBtn) {
    cancelSearchBtn.addEventListener('click', cancelSearch);
}
// Закрытие модалки при клике вне окна
window.addEventListener('click', (e) => {
    const modal = document.getElementById('matchSearchModal');
    if (e.target === modal) cancelSearch();
});

// ========== СОРТИРОВКА ТАБЛИЦЫ ==========
function initTableSorting() {
    const table = document.getElementById('ratingTable');
    if (!table) return;
    const headers = table.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.getAttribute('data-sort');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const isNumeric = sortKey === 'rating' || sortKey === 'matches' || sortKey === 'winrate';
            const direction = header.classList.contains('asc') ? 'desc' : 'asc';
            // Убираем классы у всех
            headers.forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.add(direction);
            
            rows.sort((a, b) => {
                let aVal = a.cells[getColumnIndex(sortKey)].innerText;
                let bVal = b.cells[getColumnIndex(sortKey)].innerText;
                if (isNumeric) {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                }
                if (direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}
function getColumnIndex(sortKey) {
    const headers = document.querySelectorAll('#ratingTable th');
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].getAttribute('data-sort') === sortKey) return i;
    }
    return 0;
}
initTableSorting();
