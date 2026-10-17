import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emailsnackbar',
  imports: [],
  templateUrl: './emailsnackbar.html',
  styleUrl: './emailsnackbar.scss',
})
export class Emailsnackbar {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { email: string }) {}
}
