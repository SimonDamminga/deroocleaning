import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ServicePage, ServicesService } from '../../services/services';
import { BackgroundImageDirective } from '../../directives/background-image/background-image';
import { distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, BackgroundImageDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private services = inject(ServicesService);
  private route = inject(ActivatedRoute);

  public availableServices: WritableSignal<ServicePage[]> = signal([]);
  public selectedBackground = signal<string>('main.jpg');
  public menuOpen: WritableSignal<boolean> = signal(false);
  public showHeaderImage = toSignal(
    this.router.events.pipe(
      map(() => !this.router.url.includes('order'))
    ),
    { initialValue: !this.router.url.includes('order') }
  );

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        console.log("Geselecteerde service ID in header:", serviceId);
        this.selectedBackground.set(`${serviceId}.jpg`);
      } else {
        console.log("Geen service ID geselecteerd, standaard achtergrond gebruiken.");
        this.selectedBackground.set('main.jpg');
      }
    });
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
