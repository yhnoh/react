import React, {Fragment} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Square 컴포넌트는 버튼을 랜더링
 * propes를 통해서 데이터 전달을 받을 수 있고, state값을 입력하여 재 랜더링 가능
 */
// class Square extends React.Component {
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {
//     //         value : null
//     //     }
//     // }
//     render() {
//         return (
//             <button className="square" onClick={ () => this.props.onClick()}>
//                 { this.props.value }
//             </button>
//         );
//     }
// }

//함수형 컴포넌트
// React는 render 메서드만으로 구성된 Square와 같은 컴포넌트 타입을 위해 함수형 컴포넌트라 불리는 간단한 문법을 지원
// 굳이 컴포넌트를 상속받아서 사용할 필요 없음
function Square(props){
    let winner = props.winner;
    let isWin = false;


    if(winner){
        let index = props.index;
        for (let i = 0; i < winner.length; i++) {
            if(winner[i] == index){
                isWin = true;
            }
        }
    }

    const className = isWin ? "square win" : "square";

    return (
        <button className={className}  onClick={ () => props.onClick() }>
            { props.value }
        </button>
    );
}

/**
 * Board는 사각형 9개를 렌더링
 * state 끌어올리기
 * 여러 하위 컴포넌트로부터 데이터를 모으거나 두 개의 하위 컴포넌트들이 서로 통신하기를 원한다면 상위 컴포넌트 안으로 state를 이동시키세요. 상위 컴포넌트는 props를 통해 하위 컴포넌트로 state를 전달해줄 수 있습니다. 그러면 하위 컴포넌트들은 항상 하위 컴포넌트나 상위 컴포넌트와 동기될 수 있습니다.
 * props : 외부에서 전달 받은 데이터
 * state : 컴포넌트 내부에서 관리하는 데이터
 *
 */
class Board extends React.Component {

    //Square 컴포넌트 prop에 value 값 전달
    renderSquare(i, winner) {
        return <Square
            value = {this.props.squares[i]}
            onClick = {()=>this.props.onClick(i)}
            index = {i}
            winner = {winner}
            />;
    }


    render() {
        const axis = [0,1,2];


        const board = axis.map(y => {

            const xAxis = axis.map(x => {
                let idx = y * axis.length + x;

                return (
                    <Fragment key={x}>{this.renderSquare(idx, this.props.winner)}</Fragment>
                );
            });

            return (
                <div key={y} className="board-row">
                    {xAxis}
                </div>
            );
        });

        return (
            <div>
                {board}
            </div>
        );
    }

}

//승자 알려주기
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                pos : null,
            }],
            stepNumber : 0,
            winnerLine : [],
            xIsNext: true,
        }
    }
    //0,1,2,3,4,5,6,7,8
    //변화 가져오기, X와 O 번갈아 가면서 클릭
    handleClick(i) {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history : history.concat([{
                squares: squares,
                pos: i
            }]),
            stepNumber : history.length,
            xIsNext : !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((value, index, array) => {
            const desc = index ? 'Go to move #' + index : 'Go to game start';

            const pos = history[index].pos;
            const player = value.squares[pos];
            const x = pos % 3;
            const y = parseInt(pos / 3);

            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{desc}</button>
                    <span> (x: {x} , y: {y}, player : {player}) </span>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
