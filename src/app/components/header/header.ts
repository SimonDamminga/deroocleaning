import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServicePage, ServicesService } from '../../services/services';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public availableServices: WritableSignal<ServicePage[]> = signal([]);
  public menuOpen: WritableSignal<boolean> = signal(false);

  constructor(private services: ServicesService) {}

  ngOnInit() {
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
