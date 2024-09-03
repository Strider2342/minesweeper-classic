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
      .filter((x, i) => i !== omit)
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

    // TODO: revealing every cell for debug reasons, should remove this later
    return boardData.map(row => row.map(col => ({ ...col, isRevealed: true })));
  }

  startGame(row: number, column: number) {
    this.gameState$.pipe(first()).subscribe((gameState) => {
      if (gameState.gameStatus === GameStatus.NotStarted) {
        this.gameStateSubject.next({
          ...this._gameState,
          boardMatrix: this.generateBoard((row - 1) * gameState.columns + (column - 1)),
          gameStatus: GameStatus.InProgress,
        });
      }
    });
  }
}
