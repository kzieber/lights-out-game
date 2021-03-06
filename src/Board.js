import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  }

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for(let i = 0; i < this.props.nrows; i++){
      let newRow = []
      for(let j = 0; j < this.props.ncols; j++){
        newRow.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(newRow)
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    console.log('flipping', coord)
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    //flip the cell that is clicked
    flipCell(y, x)
    //flip its neighbors that are one to the right and one to the left
    flipCell(y, x - 1)
    flipCell(y, x + 1)
    //flip neighbors one up and one down
    flipCell(y - 1, x)
    flipCell(y + 1, x)
    // TODO: flip this cell and the cells around it

    // win when every cell is turned off
    // TODO: determine is the game has been won

    //for every row on the board, check if every cell in each row is true
    // cell => !cell will return true if the cell is set to true
    let hasWon = board.every(row => row.every(cell => !cell))

    this.setState({board, hasWon});
  }


  /** Render game board or winning message. */

  render() {
    if(this.state.hasWon){
      return (
        <div className='winner'>
          <div className='neon-orange'>YOU</div>
          <div className='neon-blue'>WIN!</div>
        </div>
      )
    }

    const tableBoard = [];
    for(let y = 0; y < this.props.nrows; y++){
      let newRow = []
      for(let x = 0; x < this.props.ncols; x++){
        let coord = `${y}-${x}`
        newRow.push(<Cell key={coord} isLit={this.state.board[y][x]} flipCellsAroundMe={() => this.flipCellsAround(coord)} />)
      }
      tableBoard.push(<tr key={y}>{newRow}</tr>)
    }

    return (
      <div>
        <div className='neon-orange'>Lights</div>
        <div className='neon-blue'>Out</div>
        <table className='Board'>
          <tbody>
            {tableBoard}
          </tbody>
        </table>
      </div>
    )
  }
}


export default Board;
