import { Component } from '@angular/core';

import { CellComponent, CellState } from '../cell/cell.component';
import { GameStateFacade } from '../../services/game-state.facade';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  boardData: CellState[][] = [];

  constructor(private gameStateFacade: GameStateFacade) {
    // this.gameStateFacade.gameState$.subscribe(console.log);

    this.gameStateFacade.boardMatrix$.subscribe((boardMatrix) => {
      this.boardData = boardMatrix;
    });
  }

  cellClicked(cell: CellState) {
    this.gameStateFacade.cellClicked(cell.row, cell.column);
  }

  cellRightClicked(cell: CellState) {
    this.gameStateFacade.cellRightClicked(cell.row, cell.column);
  }
}
