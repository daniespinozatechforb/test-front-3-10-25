import { Injectable } from '@angular/core';
import { SalesRequest, SalesResponse } from '../model/sales.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor() {}

  calculatePriceWithVAT(request: SalesRequest): SalesResponse {
    const vatRates: { [key: string]: number } = {
      'BR': 0.12,
      'CL': 0.19,
      'MX': 0.16
    };

    if (!(request.country in vatRates)) {
      throw new Error('Country not supported');
    }

    const vatRate = vatRates[request.country];
    const finalAmount = request.amount + (request.amount * vatRate);

    return {
      amount: request.amount,
      country: request.country,
      vatRate: vatRate * 100,
      finalAmount: finalAmount
    };
  }
}
