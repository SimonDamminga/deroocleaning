import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation {
  private route = inject(ActivatedRoute);

  public isOrder = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isOrder.set(params['from'] === 'order');
    });
  }
}
