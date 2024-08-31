import { Component } from '@angular/core';

@Component({
  selector: 'app-mine-count',
  standalone: true,
  templateUrl: './mine-count.component.html',
})
export class MineCountComponent {
  mineCount = String(10).padStart(3, '0');
}
