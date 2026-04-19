// Адаптивное меню
document.querySelector('.burger')?.addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');
});

// Счётчик онлайна (имитация реального времени)
function updateOnlineCount() {
    const base = 750;
    const variation = Math.floor(Math.random() * 250);
    const count = base + variation;
    document.getElementById('onlineCount').innerText = count;
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
