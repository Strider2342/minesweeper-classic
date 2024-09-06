import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { GameStatus } from '../../services/game-state.service';

enum PlayerStatus {
  Alive = 'Alive',
  Scared = 'Scared',
  Dead = 'Dead',
  Won = 'Won',
}

@Component({
  selector: 'app-player-indicator',
  standalone: true,
  templateUrl: './player-indicator.component.html',
})
export class PlayerIndicatorComponent {
  PlayerStatus = PlayerStatus;

  @HostListener('mousedown')
  onMouseDown() {
    this.mouseDown = true;
    this.mouseDownStartedHere = true;
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.mouseDown = false;
    this.mouseDownStartedHere = false;
    this.clicked.emit();
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

  @Input() set gameStatus(value: GameStatus | null) {
    switch (value) {
      case GameStatus.Lost:
        this.playerStatus = PlayerStatus.Dead;
        break;
      case GameStatus.Won:
        this.playerStatus = PlayerStatus.Won;
        break;
      default:
        this.playerStatus = PlayerStatus.Alive;
        break;
    }
  }

  @Output() clicked: EventEmitter<void> = new EventEmitter();

  mouseDown: boolean = false;
  mouseDownStartedHere: boolean = false;

  playerStatus = PlayerStatus.Alive;
}
