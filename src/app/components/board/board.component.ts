import { Component } from '@angular/core';

import { CellComponent } from '../cell/cell.component';
import { boardData } from '../../mock-data/board-matrix';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  boardData = boardData;

  title = 'minesweeper-classic';
}
