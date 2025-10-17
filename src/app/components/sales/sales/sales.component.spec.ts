import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './sales.component';
import { SalesService } from './services/sales.service';
import { SalesResponse } from './model/sales.model';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let salesService: SalesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SalesComponent,
        ReactiveFormsModule
      ],
      providers: [
        SalesService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    salesService = TestBed.inject(SalesService);
    fixture.detectChanges();
  });

  describe('Iniciar el formulario', () => {
    it('debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar el formulario con valores vacíos y validadores', () => {
      expect(component.salesForm.get('amount')?.value).toBe('');
      expect(component.salesForm.get('country')?.value).toBe('');

      const amountControl = component.salesForm.get('amount');
      const countryControl = component.salesForm.get('country');

      expect(amountControl?.hasError('required')).toBeTrue();
      expect(countryControl?.hasError('required')).toBeTrue();
      expect(component.salesForm.valid).toBeFalse();
    });

    it('debe validar el valor mínimo del monto', () => {
      const amountControl = component.salesForm.get('amount');

      amountControl?.setValue('-10');
      expect(amountControl?.hasError('min')).toBeTrue();

      amountControl?.setValue('0');
      expect(amountControl?.hasError('min')).toBeFalse();

      amountControl?.setValue('100');
      expect(amountControl?.hasError('min')).toBeFalse();
    });

    it('debe ser valido cuando se llena los campos del formulario', () => {
      component.salesForm.get('amount')?.setValue('200');
      component.salesForm.get('country')?.setValue('MX');

      expect(component.salesForm.valid).toBeTrue();
    });
  });

  describe('Envío del Formulario', () => {
    it('debe enviar monto final correcto para MX con 200 = 232', fakeAsync(() => {
      component.salesForm.get('amount')?.setValue('200');
      component.salesForm.get('country')?.setValue('MX');
      fixture.detectChanges();

      component.onSubmit();

      tick(3000);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const finalAmountParagraph = compiled.querySelector('p:nth-child(5)');

      expect(finalAmountParagraph).toBeTruthy();
      expect(finalAmountParagraph.textContent).toContain('Monto final: 232');
    }));

    it('debe no mostrar nada cuando el formulario es inválido', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      const resultSection = compiled.querySelector('[style*="display: flex; flex-direction: column"]');
      expect(resultSection).toBeNull();

      const allText = compiled.textContent;
      expect(allText).not.toContain('Monto final:');

      const resultHeading = compiled.querySelector('h2');
      expect(resultHeading).toBeNull();
    });

    it('debe no mostrar el resultado cuando solo el monto esta lleno', () => {
      component.salesForm.get('amount')?.setValue('200');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const resultSection = compiled.querySelector('[style*="display: flex; flex-direction: column"]');

      expect(resultSection).toBeNull();
      expect(compiled.textContent).not.toContain('Monto final:');
    });

    it('debe no mostrar el resultado cuando solo el pais esta seleccionado', () => {
      component.salesForm.get('country')?.setValue('MX');
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const resultSection = compiled.querySelector('[style*="display: flex; flex-direction: column"]');

      expect(resultSection).toBeNull();
      expect(compiled.textContent).not.toContain('Monto final:');
    });
  });

  describe('Envío del Formulario', () => {
    it('debe llamar al servicio y mostrar el resultado completo para MX con monto 200', fakeAsync(() => {
      component.salesForm.get('amount')?.setValue('200');
      component.salesForm.get('country')?.setValue('MX');
      fixture.detectChanges();

      component.onSubmit();

      expect(component.isLoading).toBeTrue();

      tick(3000);
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.resultado?.finalAmount).toBe(232);
      expect(component.resultado?.amount).toBe(200);
      expect(component.resultado?.country).toBe('MX');
      expect(component.resultado?.vatRate).toBe(16);
      expect(component.errorMessage).toBe('');

      const compiled = fixture.nativeElement;
      const resultDiv = compiled.querySelector('[style*="display: flex; flex-direction: column"]');
      expect(resultDiv).toBeTruthy();

      expect(compiled.querySelector('h2').textContent).toContain('Resultado');
      expect(compiled.querySelector('p:nth-child(2)').textContent).toContain('Monto Base: 200');
      expect(compiled.querySelector('p:nth-child(3)').textContent).toContain('País: MX');
      expect(compiled.querySelector('p:nth-child(4)').textContent).toContain('Tasa de impuesto: 16%');
      expect(compiled.querySelector('p:nth-child(5)').textContent).toContain('Monto final: 232');
    }));

    it('debe calcular 100 para CL = 119', fakeAsync(() => {
      component.salesForm.get('amount')?.setValue('100');
      component.salesForm.get('country')?.setValue('CL');
      fixture.detectChanges();

      component.onSubmit();

      tick(3000);
      fixture.detectChanges();

      expect(component.resultado?.finalAmount).toBe(119);

      const compiled = fixture.nativeElement;
      const finalAmountElement = compiled.querySelector('p:nth-child(5)');
      expect(finalAmountElement.textContent).toContain('Monto final: 119');
    }));

    it('debe calcular 100 para BR = 112', fakeAsync(() => {
      component.salesForm.get('amount')?.setValue('100');
      component.salesForm.get('country')?.setValue('BR');
      fixture.detectChanges();

      component.onSubmit();

      tick(3000);
      fixture.detectChanges();

      expect(component.resultado?.finalAmount).toBe(112);

      const compiled = fixture.nativeElement;
      const finalAmountElement = compiled.querySelector('p:nth-child(5)');
      expect(finalAmountElement.textContent).toContain('Monto final: 112');
    }));
  });

  describe('Manejo de Errores', () => {
    it('debe mostrar mensaje de error cuando el servicio lanza error para AR', fakeAsync(() => {
      component.salesForm.get('amount')?.setValue('100');
      component.salesForm.get('country')?.setValue('AR');
      fixture.detectChanges();

      component.onSubmit();

      tick(3000);
      fixture.detectChanges();

      expect(component.errorMessage).toBe('País no soportado');
      expect(component.isLoading).toBeFalse();
      expect(component.resultado).toBeUndefined();

      const compiled = fixture.nativeElement;
      const errorElement = compiled.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('País no soportado');
    }));
  });
});
