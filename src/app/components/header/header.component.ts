import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

import { PlayerIndicatorComponent } from '../player-indicator/player-indicator.component';
import { GameStateFacade } from '../../services/game-state.facade';
import { GameStatus } from '../../services/game-state.service';
import { ThreeDigitDisplayComponent } from '../three-digit-display/three-digit-display.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    PlayerIndicatorComponent,
    ThreeDigitDisplayComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  gameStatus$: Observable<GameStatus>;
  remainingMines$: Observable<number>;

  constructor(private gameStateFacade: GameStateFacade) {
    this.gameStatus$ = this.gameStateFacade.gameState$.pipe(map((state) => state.gameStatus));
    this.remainingMines$ = this.gameStateFacade.gameState$.pipe(map((state) => state.remainingMines));
  }

  handlePlayerClicked() {
    this.gameStateFacade.init();
  }
}
