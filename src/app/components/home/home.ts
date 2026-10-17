import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ServicePage, ServicesService } from '../../services/services/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Emailsnackbar } from '../utils/emailsnackbar/emailsnackbar';
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public SocialType = SocialType;
  public availableServices: WritableSignal<ServicePage[]> = signal([]);
  private _snackBar = inject(MatSnackBar);

  constructor(private services: ServicesService) {}

  ngOnInit() {
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
  }

  public goToSocials(type: SocialType) {
    let url;
    const email = "deroocleaning@gmail.com";

    switch (type) {
      case SocialType.WhatsApp:
        url = "https://wa.me/31612278821";
        break;
      case SocialType.Email:
        url = `mailto:${email}`;
        break;
      case SocialType.Instagram:
        url = "https://www.instagram.com/deroocleaning"
        break;
    }

    if (type === SocialType.Email) {
      navigator.clipboard.writeText(email).then(() => {
        this._snackBar.openFromComponent(Emailsnackbar, {data: {email: email}, duration: 3000});
      });
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  }
}

enum SocialType {
  WhatsApp = "wa",
  Email = "mail",
  Instagram = "insta"
}
