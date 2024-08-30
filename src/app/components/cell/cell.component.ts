import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface CellState {
  isFlagged: boolean;
  isRevealed: boolean;
  isMine: boolean;
  isExploded: boolean;
  neighborCount: number;
}

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
})
export class CellComponent implements OnInit {
  @Input() state!: CellState;

  ngOnInit(): void {
    console.log(this.state);
  }
}
