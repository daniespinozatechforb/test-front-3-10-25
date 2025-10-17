import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalesRequest, SalesResponse, CountryOption } from './model/sales.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SalesService } from './services/sales.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  salesForm: FormGroup;
  resultado?: SalesResponse;
  isLoading = false;
  errorMessage = '';
  private fb=inject(FormBuilder);
  public salesService=inject(SalesService);

  countries: CountryOption[] = [
    { value: 'BR', label: 'Brasil' },
    { value: 'MX', label: 'México' },
    { value: 'CL', label: 'Chile' }
  ];

  constructor() {
    this.salesForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      country: ['', Validators.required],
    });
  }

  public onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = event.key >= '0' && event.key <= '9';
    const isDecimal = event.key === '.' || event.key === ',';
    const isMinus = event.key === '-';

    if (allowedKeys.includes(event.key) || isNumber) {
      return;
    }

    if (isDecimal) {
      const input = event.target as HTMLInputElement;
      if (input.value.includes('.') || input.value.includes(',')) {
        event.preventDefault();
      }
      return;
    }

    if (isMinus) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
  }

  public onSubmit() {
    if (this.salesForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.resultado = undefined;

      const formValue = this.salesForm.value;
      const amount = Number(formValue.amount);
      const country = formValue.country;

      try {
        const request: SalesRequest = {
          amount: amount,
          country: country
        };

        this.resultado = this.salesService.calculatePriceWithVAT(request);
        this.showSpinner();
      } catch (error) {
        this.errorMessage = 'País no soportado';
        this.showSpinner();
      }
    }
  }

  private showSpinner() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
}
