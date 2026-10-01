import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable({
  providedIn: 'root',
})
export class Address {
  private apiService = inject(Api);

  public getAddress(postCode: string, houseNumber: string) {
    return this.apiService.get(`/get-address?postcode=${postCode}&number=${houseNumber}`);
  }
}
