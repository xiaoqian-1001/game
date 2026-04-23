let game = {
    points: 0,
    clickPower: 1,
    perSec: 0,
    up1Cost: 10,
    up2Cost: 50
};

// DOM元素
const elPoints = document.getElementById('points');
const elPerSec = document.getElementById('perSec');
const elUp1Cost = document.getElementById('up1Cost');
const elUp2Cost = document.getElementById('up2Cost');
const clickBtn = document.getElementById('clickBtn');
const up1Btn = document.getElementById('up1');
const up2Btn = document.getElementById('up2');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const saveTip = document.getElementById('saveTip');

// 界面刷新
function render() {
    elPoints.textContent = Math.floor(game.points);
    elPerSec.textContent = game.perSec;
    elUp1Cost.textContent = game.up1Cost;
    elUp2Cost.textContent = game.up2Cost;
}

// 点击
clickBtn.addEventListener('click', () => {
    game.points += game.clickPower;
    render();
});

// 升级1：点击倍率
up1Btn.addEventListener('click', () => {
    if (game.points >= game.up1Cost) {
        game.points -= game.up1Cost;
        game.clickPower += 1;
        game.up1Cost = Math.floor(game.up1Cost * 1.35);
        render();
    }
});

// 升级2：每秒被动
up2Btn.addEventListener('click', () => {
    if (game.points >= game.up2Cost) {
        game.points -= game.up2Cost;
        game.perSec += 1;
        game.up2Cost = Math.floor(game.up2Cost * 1.4);
        render();
    }
});

// 游戏主循环
function gameLoop() {
    game.points += game.perSec / 20;
    render();
}
setInterval(gameLoop, 50);

// 本地存档 localStorage
function saveGame() {
    localStorage.setItem('maomaoSave', JSON.stringify(game));
    saveTip.textContent = '已存档';
    setTimeout(() => saveTip.textContent = '', 2000);
}

function loadGame() {
    const data = localStorage.getItem('maomaoSave');
    if (data) game = JSON.parse(data);
    render();
}

function resetGame() {
    if (confirm('确定清空所有存档重新开始？')) {
        localStorage.removeItem('maomaoSave');
        location.reload();
    }
}

saveBtn.addEventListener('click', saveGame);
resetBtn.addEventListener('click', resetGame);

// 自动存档
setInterval(saveGame, 10000);

// 加载存档启动
loadGame();
