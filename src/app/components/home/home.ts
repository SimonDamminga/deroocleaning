import { Component } from '@angular/core';
import { TiltCardDirective } from '../../directives/tilt-card/tilt-card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [TiltCardDirective, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public goToInstagram() {
    window.open("https://www.instagram.com/deroocleaning", "_blank");
  }
}
