import { appSettings } from './../settings/app.settings';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${appSettings.apiUrl}/checkout`;

  constructor(private http: HttpClient) {}

  checkout(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
