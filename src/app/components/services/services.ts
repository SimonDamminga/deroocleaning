import { Component, signal, WritableSignal } from '@angular/core';
import { ServicePage, ServicesService } from '../../services/services';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [NgStyle],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  public availableServices: WritableSignal<ServicePage[]> = signal([]);

  constructor(private services: ServicesService) {}

  ngOnInit() {
    this.availableServices.set(this.services.getAllServices().sort((a, b) => a.popularOrder - b.popularOrder));
  }
}
