import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  time = String(2).padStart(3, '0');
}
