import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';

import { CellState } from '../components/cell/cell.component';

// import { boardData } from '../mock-data/board-matrix';

export enum GameStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Won = 'Won',
  Lost = 'Lost',
}

export interface GameState {
  rows: number;
  columns: number;
  mineCount: number;
  remainingMines: number;
  boardMatrix: CellState[][];
  gameStatus: GameStatus;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private _gameState: GameState = {
    rows: 9,
    columns: 9,
    mineCount: 10,
    remainingMines: 10,
    boardMatrix: [],
    gameStatus: GameStatus.NotStarted,
  };

  public gameStateSubject: BehaviorSubject<GameState> = new BehaviorSubject(this._gameState);

  get gameState$(): Observable<GameState> {
    return this.gameStateSubject.asObservable();
  }

  constructor() {
    this._gameState.boardMatrix = this.generateEmptyGameBoard();
    this.gameStateSubject.next(this._gameState);
  }

  init() {
    this._gameState = {
      rows: 9,
      columns: 9,
      mineCount: 10,
      remainingMines: 10,
      boardMatrix: [],
      gameStatus: GameStatus.NotStarted,
    };

    this._gameState.boardMatrix = this.generateEmptyGameBoard();
    this.gameStateSubject.next(this._gameState);
  }

  generateEmptyGameBoard(): CellState[][] {
    const boardData = new Array(this._gameState.rows).fill(null);

    boardData.forEach((row, rowIndex) => {
      boardData[rowIndex] = new Array(this._gameState.columns).fill({
        row: rowIndex,
        column: 0,
        isFlagged: false,
        isRevealed: false,
        isMine: false,
        isExploded: false,
        neighborCount: 0
      }).map((cell, columnIndex) => ({ ...cell, column: columnIndex }));
    });

    return boardData;
  }

  generateBoard(omit?: number): CellState[][] {
    // generate empty board
    const boardData = this.generateEmptyGameBoard();

    // generate mines
    const mines = new Array(this._gameState.rows * this._gameState.columns)
      .fill(null)
      .map((x, i) => i)
      .sort(() => Math.random() - 0.5)
      .filter((x) => x !== omit)
      .slice(0, this._gameState.mineCount);

    mines.forEach((mine) => {
      const row = Math.floor(mine / this._gameState.columns);
      const column = mine % this._gameState.columns;

      boardData[row][column] = {
        ...boardData[row][column],
        isMine: true,
      };
    });

    // generate number indicators
    boardData.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell.isMine) {
          return;
        }

        let mineCount = 0;

        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
          for (let j = columnIndex - 1; j <= columnIndex + 1; j++) {
            if (i < 0 || i >= this._gameState.rows || j < 0 || j >= this._gameState.columns) {
              continue;
            }

            if (boardData[i][j].isMine) {
              mineCount++;
            }
          }
        }

        boardData[rowIndex][columnIndex] = {
          ...boardData[rowIndex][columnIndex],
          neighborCount: mineCount,
        };
      });
    });

    return boardData;
  }

  startGame(gameState: GameState, row: number, column: number): GameState {
    return {
      ...gameState,
      boardMatrix: this.generateBoard(row * gameState.columns + column),
      gameStatus: GameStatus.InProgress,
    };
  }

  revealCell(gameState: GameState, row: number, column: number): GameState {
    const cell = gameState.boardMatrix[row][column];
    const boardData = gameState.boardMatrix;
    let gameStatus = gameState.gameStatus;

    const flaggedCells = boardData.flat().filter((cell) => cell.isFlagged).length;

    if (cell.isRevealed || cell.isFlagged) {
      return { ...gameState };
    }

    if (cell.isMine) {
      // game over
      boardData[row][column] = { ...cell, isRevealed: true, isExploded: true };
      gameStatus = GameStatus.Lost;
    } else {
      if (cell.neighborCount === 0) {
        // reveal neighbours
        boardData[row][column] = { ...cell, isRevealed: true };

        let neighbours = this.getUntouchedCellNeighbours(gameState, row, column);

        neighbours.forEach((neighbour) => this.revealCell(gameState, neighbour.row, neighbour.column));
      }

      if (cell.neighborCount > 0) {
        // reveal only clicked cell
        boardData[row][column] = { ...cell, isRevealed: true };
      }
    }

    return  {
      ...gameState,
      gameStatus: gameStatus,
      remainingMines: gameState.mineCount - flaggedCells,
      boardMatrix: [ ...boardData ],
    };
  }

  revealNeighboursOfCell(gameState: GameState, row: number, column: number): GameState {
    // TODO: implement this
    return gameState;
  }

  getUntouchedCellNeighbours(gameState: GameState, row: number, column: number): Set<CellState> {
    let neighbours = new Set<CellState>();

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = column - 1; j <= column + 1; j++) {
        const outOfBounds = i < 0 || i >= gameState.rows || j < 0 || j >= gameState.columns;
        const isSameCell = i === row && j === column;

        if (outOfBounds || isSameCell) {
          continue;
        }

        neighbours.add(gameState.boardMatrix[i][j]);
      }
    }

    return neighbours;
  }

  cellClicked(row: number, column: number) {
    this.gameState$.pipe(first()).subscribe((gameState) => {
      let newGameState = { ...gameState };

      if (newGameState.gameStatus === GameStatus.NotStarted) {
        newGameState = this.startGame(newGameState, row, column);
      }

      if (newGameState.gameStatus === GameStatus.InProgress) {
        newGameState = this.revealCell(newGameState, row, column);
      }

      this.gameStateSubject.next(newGameState);
    });
  }

  cellMiddleClicked(row: number, column: number) {
    this.gameState$.pipe(first()).subscribe((gameState) => {
      let newGameState = { ...gameState };

      if (newGameState.gameStatus === GameStatus.InProgress) {
        newGameState = this.revealNeighboursOfCell(newGameState, row, column);
      }

      this.gameStateSubject.next(newGameState);
    });
  }

  cellRightClicked(row: number, column: number) {
    this.gameState$.pipe(first()).subscribe((gameState) => {
      let newGameState = { ...gameState };

      if (newGameState.gameStatus === GameStatus.NotStarted) {
        newGameState = this.startGame(newGameState, row, column);
      }

      const cell = newGameState.boardMatrix[row][column];

      if (!cell.isRevealed) {
        newGameState.boardMatrix[row][column] = {
          ...cell,
          isFlagged: !newGameState.boardMatrix[row][column].isFlagged,
        };
      }

      const flaggedCellCount = newGameState.boardMatrix.flat().filter((cell) => cell.isFlagged).length;

      newGameState = {
        ...newGameState,
        remainingMines: newGameState.mineCount - flaggedCellCount,
      }

      this.gameStateSubject.next(newGameState);
    });
  }
}
