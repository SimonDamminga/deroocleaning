import { Component, signal } from '@angular/core';
import { ServicePage, ServicesService } from '../../services/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  public service = signal<ServicePage | null>(null);
  public serviceId = signal<string | null>(null);
  public selectedPackage = signal<string | null>(null);

  constructor(private services: ServicesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.serviceId.set(serviceId);
        const selectedService = this.services.getServiceById(serviceId);
        if (selectedService) {
          this.service.set(selectedService);
        }
      }
    });
  }

  selectPackage(packageName: string) {
    if (this.selectedPackage() === packageName) {
      this.selectedPackage.set(null);
    } else {
      this.selectedPackage.set(packageName);
    }
  }

  isPackageSelected(packageName: string): boolean {
    return this.selectedPackage() === packageName;
  }

  isButtonEnabled(): boolean {
    const selectedPackage = this.selectedPackage()?.split('/')[0] || null;
    return this.serviceId() === selectedPackage ? this.selectedPackage() !== null : false;
  }
}
