export interface SalesRequest {
  country: string;
  amount: number;
}

export interface SalesResponse {
  amount: number;
  country: string;
  vatRate: number;
  finalAmount: number;
}

export interface CountryOption {
  value: string;
  label: string;
}
