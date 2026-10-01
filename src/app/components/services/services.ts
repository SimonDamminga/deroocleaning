import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from './package/package';
import { Title } from '@angular/platform-browser';
import { ServicePage, ServicesService } from '../../services/services/services';

@Component({
  selector: 'app-services',
  imports: [
    Package
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  public service = signal<ServicePage | null>(null);
  public serviceId = signal<string | null>(null);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private services = inject(ServicesService);
  private titleService = inject(Title);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.serviceId.set(serviceId);
        const selectedService = this.services.getServiceById(serviceId);
        if (selectedService) {
          this.service.set(selectedService);
          setTimeout(() => {
            this.titleService.setTitle(selectedService.title);
          });
        }
      }
    });
  }

  goToOrder(serviceId: any, packageName: any) {
    if (serviceId && packageName) {
      this.router.navigate(['/order'], { queryParams: { serviceId, packageName } });
    }
  }
}
