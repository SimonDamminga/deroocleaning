import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'https://api-jrkyqpk5eq-uc.a.run.app/'
  
  public get(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  public post(url: string, body: any) {
    return this.http.post(`${this.baseUrl}${url}`, body);
  }
}
