import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface CellState {
  row: number;
  column: number;
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

  @Output() cellClicked: EventEmitter<CellState> = new EventEmitter();

  ngOnInit(): void {
    // console.log(this.state);
  }

  handleClick() {
    this.cellClicked.emit(this.state);
  }
}
