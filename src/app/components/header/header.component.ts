import { Component } from '@angular/core';

import { MineCountComponent } from '../mine-count/mine-count.component';
import { TimerComponent } from '../timer/timer.component';
import { PlayerIndicatorComponent } from '../player-indicator/player-indicator.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MineCountComponent, PlayerIndicatorComponent, TimerComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  title = 'minesweeper-classic';
}
