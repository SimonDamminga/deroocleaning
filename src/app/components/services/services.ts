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
  public selectedPackage = signal<string | null>(null);

  constructor(private services: ServicesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        const selectedService = this.services.getServiceById(serviceId);
        if (selectedService) {
          this.service.set(selectedService);
        }
      }
    });
  }

  selectPackage(packageName: string) {
    // Als je er nogmaals op klikt, deselecteer je hem (optioneel)
    if (this.selectedPackage() === packageName) {
      this.selectedPackage.set(null);
    } else {
      this.selectedPackage.set(packageName);
    }
    
    console.log("Gekozen pakket:", packageName);
  }
}
