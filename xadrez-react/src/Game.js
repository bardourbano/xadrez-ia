import * as Chess from 'chess.js';
import {BehaviorSubject} from 'rxjs';


let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5'
//let promotion = ' rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQ - 1 5'
let checkmate = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'
let staleMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78'

const chess = new Chess(checkmate)


export const gameSubject = new BehaviorSubject()

export function initGame(){
    updateGame()
}

/*export function setMenuOptiom(option){
    const playerXPlayer = 0;
    const playerXIa = 1
    const IaXIa =2 

    menuOption = [playerXPlayer, playerXIa,IaXIa]



    return option;
}*/

export function handleMove(from, to){
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    // eslint-disable-next-line
    //const moves = chess.moves({verbose: true})
    console.table(promotions)
    /*if (moves[1].color === "b"){
        console.log("**************")
        const moveia = moves.[Math.floor(Math.random() * moves.length)]
        console.log(moveia)

        move(moveia.from , moveia.to)
    }
    else{
        console.log(moves)
        move(from,to)
    } */
    // eslint-disable-next-line
    if (promotions.some(p => `${p.from}:${p.to}` ===  `${from}:${to}`)) {
        const pendingPromotion = {from , to, color: promotions[0].color }
        updateGame(pendingPromotion)

    }
    const { pendingPromotion } = gameSubject.getValue()

    if (!pendingPromotion){
        move(from, to)
    }
    
}

export function iaHandleMove(from, to){
    const moves = chess.moves({verbose: true})
    
    console.log(`${moves[1].color}`);
    // pecas pretas sao a IA, verifica se a peca eh preta e move 
    if (moves[1].color === "b"){
        console.log("**************")
        const moveia = moves.[Math.floor(Math.random() * moves.length)]
        console.log(moveia)

        move(moveia.from , moveia.to)
    }else{
        console.log(moves)
        move(from,to)
    }
    
}


export function move(from, to, promotion){
    let tempMove = {from, to}

    if(promotion){
        tempMove.promotion = promotion
    }
    const legalMove = chess.move(tempMove)

    if (legalMove){
        //console.log(chess.fen())
        updateGame()

    }else{
        alert("Movimento Inválido")
    }
}

function updateGame(pendingPromotion){
    const isGameOver = chess.game_over()
    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        result: isGameOver ? getGameResult(): null
    }
    gameSubject.next(newGame)
}

function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}
export function resetGame() {
    chess.reset()
    updateGame()
}