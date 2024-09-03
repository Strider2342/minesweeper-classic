import { Injectable } from '@angular/core';
import { GameState, GameStateService } from './game-state.service';
import { map, Observable } from 'rxjs';
import { CellState } from '../components/cell/cell.component';

@Injectable({
  providedIn: 'root'
})
export class GameStateFacade {
  constructor(private service: GameStateService) {}

  get gameState$(): Observable<GameState> {
    return this.service.gameState$;
  }

  get boardMatrix$(): Observable<CellState[][]> {
    return this.gameState$.pipe(map((state) => state.boardMatrix));
  }

  init() {
    this.service.init();
  }

  cellClicked(row: number, column: number) {
    this.service.cellClicked(row, column);
  }

  cellRightClicked(row: number, column: number) {
    this.service.cellRightClicked(row, column);
  }
}
