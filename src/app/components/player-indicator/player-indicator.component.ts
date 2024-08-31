import { Component } from '@angular/core';

enum PlayerStatus {
  Alive = 'Alive',
  Scared = 'Scared',
  Dead = 'Dead',
}

@Component({
  selector: 'app-player-indicator',
  standalone: true,
  templateUrl: './player-indicator.component.html',
})
export class PlayerIndicatorComponent {
  playerStatus = PlayerStatus.Alive;
}
