import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CellState } from '../components/cell/cell.component';

import { boardData } from '../mock-data/board-matrix';

export enum GameStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Won = 'Won',
  Lost = 'Lost',
}

export interface GameState {
  rows: number;
  columns: number;
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
    boardMatrix: Array(9).fill(Array(9).fill({
      isFlagged: false,
      isRevealed: false,
      isMine: false,
      isExploded: false,
      neighborCount: 0
    })),
    gameStatus: GameStatus.NotStarted,
  };

  public gameStateSubject: BehaviorSubject<GameState> = new BehaviorSubject(this._gameState);

  get gameState$(): Observable<GameState> {
    return this.gameStateSubject.asObservable();
  }

  generateEmptyGameBoard(): CellState[][] {
    return Array(this._gameState.rows).fill(Array(this._gameState.columns).fill({
      isFlagged: false,
      isRevealed: false,
      isMine: false,
      isExploded: false,
      neighborCount: 0
    }));
  }

  generateBoardBoard(): CellState[][] {
    return boardData;
  }

  startGame() {
    if (this._gameState.gameStatus === GameStatus.NotStarted) {
      this.gameStateSubject.next({
        ...this._gameState,
        boardMatrix: this.generateBoardBoard(),
        gameStatus: GameStatus.InProgress,
      });
    }
  }
}
