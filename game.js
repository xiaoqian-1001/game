const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const size = 15;
let grid = window.innerWidth < 500 ? 20 : 30;
canvas.width = canvas.height = grid * size;

let board = Array.from({ length: size }, () => Array(size).fill(0));
let currentPlayer = 1;
let moves = [];
let aiEnabled = false;

// 画棋盘
function drawBoard() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(grid/2, grid/2 + i * grid);
        ctx.lineTo(grid/2 + (size-1)*grid, grid/2 + i * grid);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(grid/2 + i * grid, grid/2);
        ctx.lineTo(grid/2 + i * grid, grid/2 + (size-1)*grid);
        ctx.stroke();
    }

    moves.forEach(m => drawPiece(m.x, m.y, m.player));
}

function drawPiece(x,y,player){
    ctx.beginPath();
    ctx.arc(grid/2+x*grid,grid/2+y*grid,grid/3,0,Math.PI*2);
    ctx.fillStyle = player===1?"black":"white";
    ctx.fill();
}

// 落子
canvas.addEventListener("click", e=>{
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((e.clientX-rect.left)/grid);
    let y = Math.floor((e.clientY-rect.top)/grid);

    if(board[x][y]) return;

    move(x,y,currentPlayer);

    if(aiEnabled && currentPlayer===2){
        setTimeout(aiMove,300);
    }
});

function move(x,y,player){
    board[x][y]=player;
    moves.push({x,y,player});
    drawBoard();

    if(checkWin(x,y,player)){
        document.getElementById("status").innerText =
            (player===1?"黑棋":"白棋")+" 胜利！";
        canvas.onclick=null;
        return;
    }

    currentPlayer = player===1?2:1;
}

// 胜负判断
function checkWin(x,y,p){
    const dirs=[[1,0],[0,1],[1,1],[1,-1]];
    for(let [dx,dy] of dirs){
        let count=1;
        for(let i=1;i<5;i++){
            if(board[x+dx*i]?.[y+dy*i]===p) count++;
            else break;
        }
        for(let i=1;i<5;i++){
            if(board[x-dx*i]?.[y-dy*i]===p) count++;
            else break;
        }
        if(count>=5) return true;
    }
    return false;
}

// 🤖 简单AI（评分）
function aiMove(){
    let best = null;
    let maxScore = -1;

    for(let x=0;x<size;x++){
        for(let y=0;y<size;y++){
            if(board[x][y]===0){
                let score = evaluate(x,y,2);
                if(score>maxScore){
                    maxScore=score;
                    best={x,y};
                }
            }
        }
    }
    if(best) move(best.x,best.y,2);
}

function evaluate(x,y,player){
    let score = 0;
    const dirs=[[1,0],[0,1],[1,1],[1,-1]];

    for(let [dx,dy] of dirs){
        let count=0;
        for(let i=1;i<5;i++){
            if(board[x+dx*i]?.[y+dy*i]===player) count++;
        }
        score += Math.pow(10,count);
    }
    return score;
}

// 悔棋
function undo(){
    for(let i=0;i<(aiEnabled?2:1);i++){
        let m = moves.pop();
        if(!m) return;
        board[m.x][m.y]=0;
    }
    drawBoard();
}

// 控制
function restart(){
    board = Array.from({ length: size }, () => Array(size).fill(0));
    moves=[];
    currentPlayer=1;
    drawBoard();
}

function toggleAI(){
    aiEnabled = !aiEnabled;
}

drawBoard();
