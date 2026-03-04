import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  public smallerHeader = signal(false);

  private isHomeRoute(url: string): boolean {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    return normalizedUrl === '/home' || normalizedUrl === '/';
  }

  ngOnInit() {
    this.smallerHeader.set(!this.isHomeRoute(this.router.url));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.smallerHeader.set(!this.isHomeRoute(event.urlAfterRedirects));
      });
  }
}
