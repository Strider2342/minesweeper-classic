import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface CellState {
  row: number;
  column: number;
  isFlagged: boolean;
  isRevealed: boolean;
  isMine: boolean;
  isExploded: boolean;
  neighborCount: number; // TODO: fix typo
}

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
})
export class CellComponent {
  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    if ($event.button === 0) {
      this.mouseDown = true;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: MouseEvent) {
    this.mouseDown = false;

    // TODO: implement left-right click

    switch ($event.button) {
      case 0:
        this.cellClicked.emit(this.state);
        break;
      case 1:
        this.cellMiddleClicked.emit(this.state);
        break;
      case 2:
        this.cellRightClicked.emit(this.state);
        break;
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter($event: MouseEvent) {
    if ($event.buttons === 1) {
      this.mouseDown = true;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mouseDown = false;
  }

  @Input() state!: CellState;

  @Output() cellClicked: EventEmitter<CellState> = new EventEmitter();
  @Output() cellMiddleClicked: EventEmitter<CellState> = new EventEmitter();
  @Output() cellRightClicked: EventEmitter<CellState> = new EventEmitter();

  mouseDown: boolean = false;
}
