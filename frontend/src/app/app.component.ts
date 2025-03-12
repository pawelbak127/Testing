import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule, MatCardModule, MatButtonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}