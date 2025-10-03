import { inject, Injectable } from '@angular/core';
import { SalesRequest, SalesResponse } from '../model/sales.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'http://localhost:8080/api/sales/price';

  constructor(private http: HttpClient) {}

  calculatePrice(sale: SalesRequest): Observable<SalesResponse> {
    return this.http.post<SalesResponse>(this.apiUrl, sale);
  }
}
