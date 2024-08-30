import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent, HeaderComponent } from './components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'minesweeper-classic';
}
