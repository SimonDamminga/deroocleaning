import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ServicePage, ServicesService } from '../../services/services';
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public SocialType = SocialType;
  public availableServices: WritableSignal<ServicePage[]> = signal([]);

  constructor(private services: ServicesService) {}

  ngOnInit() {
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
  }

  public goToSocials(type: SocialType) {
    let url;

    switch (type) {
      case SocialType.WhatsApp:
        url = "https://wa.me/31612278821";
        break;
      case SocialType.Email:
        url = "mailto:deroocleaning@gmail.com";
        break;
      case SocialType.Instagram:
        url = "https://www.instagram.com/deroocleaning"
        break;
    }

    if (type === SocialType.Email) {
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
