// leaderboard.js

// Функция для открытия таблицы лидеров
async function openLeaderboard() {
    // Проверяем, есть ли уже модальное окно
    let modal = document.getElementById('leaderboard-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leaderboard-modal';
        modal.style = `
            position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 9999;`;
        modal.innerHTML = `
            <div style="background: #fff; border-radius: 10px; padding: 24px 32px; min-width: 320px; max-width: 90vw; box-shadow: 0 2px 16px #0002; position: relative;">
                <button id="close-leaderboard" style="position:absolute;top:10px;right:10px;width:32px;height:32px;line-height:32px;font-size:24px;background:transparent;border:none;cursor:pointer;border-radius:50%;color:#222;display:flex;align-items:center;justify-content:center;transition:background 0.2s, color 0.2s;"><span style='font-size:24px;line-height:24px;'>✕</span></button>
                <h2 style="margin-top:0;">Таблица лидеров</h2>
                <div id="leaderboard-content">Загрузка...</div>
            </div>
        `;
        document.body.appendChild(modal);
        const closeBtn = document.getElementById('close-leaderboard');
        closeBtn.onmouseover = () => { closeBtn.style.background = '#f2f2f2'; closeBtn.style.color = '#000'; };
        closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#222'; };
        closeBtn.onclick = () => modal.remove();
    } else {
        modal.style.display = 'flex';
    }
    // Получаем топ-10 пользователей
    try {
        const usersRef = firebase.firestore().collection('users');
        const snapshot = await usersRef.orderBy('balance', 'desc').limit(10).get();
        let html = `<table style='width:100%;border-collapse:collapse;'>`;
        html += `<tr><th style='text-align:left;'>#</th><th style='text-align:left;'>Пользователь</th><th style='text-align:right;'>Баланс</th></tr>`;
        let i = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `<tr><td>${i}</td><td>${data.displayName || data.email || 'Без имени'}</td><td style='text-align:right;'>${data.balance?.toLocaleString('ru-RU', {maximumFractionDigits:2}) || 0}</td></tr>`;
            i++;
        });
        html += `</table>`;
        document.getElementById('leaderboard-content').innerHTML = html;
    } catch (e) {
        document.getElementById('leaderboard-content').innerHTML = 'Ошибка загрузки лидеров: ' + (e && e.message ? e.message : e);
        console.error('Ошибка загрузки лидеров:', e);
    }
} 