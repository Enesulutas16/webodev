// Tema Değiştirici
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️ Tema' : '🌙 Tema';
});

// Form Doğrulama (Giriş)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        if (username.length < 3 || password.length < 6) {
            errorMessage.textContent = 'Kullanıcı adı en az 3, şifre en az 6 karakter olmalı!';
        } else {
            localStorage.setItem('username', username);
            window.location.href = 'anasayfa.html';
        }
    });
}

// Form Doğrulama (Kayıt)
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        localStorage.setItem('username', username);
        window.location.href = 'anasayfa.html';
    });
}

// Hoş Geldin Mesajı
const welcomeMessage = document.getElementById('welcome-message');
if (welcomeMessage) {
    const username = localStorage.getItem('username');
    if (username) {
        welcomeMessage.textContent = `Hoş Geldiniz, ${username}!`;
    }
}

// Şarkı Kartı Tıklama
const songCards = document.querySelectorAll('.song-card');
songCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('favorite-btn')) return;
        songCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Favori Şarkılar
const favoriteButtons = document.querySelectorAll('.favorite-btn');
favoriteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.song-card');
        const songId = card.dataset.songId;
        const songTitle = card.querySelector('h4').textContent;
        const songImg = card.querySelector('img').src;

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorited = favorites.some(fav => fav.id === songId);

        if (isFavorited) {
            favorites = favorites.filter(fav => fav.id !== songId);
            card.classList.remove('favorited');
            btn.textContent = '❤️ Favorilere Ekle';
            showToast('Şarkı favorilerden kaldırıldı!');
        } else {
            favorites.push({ id: songId, title: songTitle, img: songImg });
            card.classList.add('favorited');
            btn.textContent = '❤️ Favorilerden Çıkar';
            showToast('Şarkı favorilere eklendi!');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    });

    // Başlangıçta favori durumunu kontrol et
    const songId = btn.closest('.song-card').dataset.songId;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.some(fav => fav.id === songId)) {
        btn.closest('.song-card').classList.add('favorited');
        btn.textContent = '❤️ Favorilerden Çıkar';
    }
});

// Favoriler Sayfası
const favoritesList = document.getElementById('favorites-list');
if (favoritesList) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Henüz favori şarkınız yok!</p>';
    } else {
        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.dataset.songId = fav.id;
            card.innerHTML = `
                <img src="${fav.img}" alt="${fav.title}">
                <h4>${fav.title}</h4>
                <button class="favorite-btn">❤️ Favorilerden Çıkar</button>
            `;
            favoritesList.appendChild(card);
        });

        // Favorilerden çıkar butonları
        favoritesList.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.song-card');
                const songId = card.dataset.songId;

                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                favorites = favorites.filter(fav => fav.id !== songId);
                localStorage.setItem('favorites', JSON.stringify(favorites));

                card.remove();
                showToast('Şarkı favorilerden kaldırıldı!');

                if (favoritesList.children.length === 0) {
                    favoritesList.innerHTML = '<p>Henüz favori şarkınız yok!</p>';
                }
            });
        });
    }
}

// Toast Bildirimi
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}