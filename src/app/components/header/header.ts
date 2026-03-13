import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
public dropdownOpen = signal(false);

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Voorkomt dat het klik-event direct weer sluit
    this.dropdownOpen.update(val => !val);
  }

  @HostListener('window:click')
  closeDropdown() {
    this.dropdownOpen.set(false);
  }
}
