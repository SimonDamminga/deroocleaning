import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable({
  providedIn: 'root',
})
export class Mail {
  private apiService = inject(Api);

  public sendEmailOrder(payload: any) {
    return this.apiService.post('/send-email-order', payload);
  }

  public sendEmailContact(payload: any) {
    return this.apiService.post('/send-email-contact', payload);
  } 
}