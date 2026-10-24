import { Component, inject } from '@angular/core';
import { Emailsnackbar } from '../utils/emailsnackbar/emailsnackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private _snackBar = inject(MatSnackBar);

  public openEmail(email: string) {
    window.location.href = `mailtlo:${email}`;
    navigator.clipboard.writeText(email).then(() => {
      this._snackBar.openFromComponent(Emailsnackbar, {data: {email: email}, duration: 3000});
    });
  }
}
