import { Component, signal, WritableSignal } from '@angular/core';
import { ServicePage, ServicesService } from '../../services/services';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  public availableServices: WritableSignal<ServicePage[]> = signal([]);
  public selectedPackage = signal<string | null>(null);

  constructor(private services: ServicesService) {}

  ngOnInit() {
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
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
