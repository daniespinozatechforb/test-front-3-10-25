import { TestBed } from '@angular/core/testing';
import { SalesService } from './sales.service';
import { SalesRequest, SalesResponse } from '../model/sales.model';

describe('SalesService', () => {
    let service: SalesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SalesService]
        });
        service = TestBed.inject(SalesService);
    });

    describe('calculatePriceWithVAT', () => {
        it('debería retornar respuesta correcta para CL con monto 100', () => {
            const request: SalesRequest = { country: 'CL', amount: 100 };
            const result = service.calculatePriceWithVAT(request);

            expect(result).toEqual({
                amount: 100,
                country: 'CL',
                vatRate: 19,
                finalAmount: 119
            });
        });

        it('debería retornar respuesta correcta para BR con monto 100', () => {
            const request: SalesRequest = { country: 'BR', amount: 100 };
            const result = service.calculatePriceWithVAT(request);

            expect(result).toEqual({
                amount: 100,
                country: 'BR',
                vatRate: 12,
                finalAmount: 112
            });
        });

        it('debería retornar respuesta correcta para MX con monto 100', () => {
            const request: SalesRequest = { country: 'MX', amount: 100 };
            const result = service.calculatePriceWithVAT(request);

            expect(result).toEqual({
                amount: 100,
                country: 'MX',
                vatRate: 16,
                finalAmount: 116
            });
        });

        it('debería lanzar error para país no soportado', () => {
            const request: SalesRequest = { country: 'AR', amount: 100 };
            expect(() => {
                service.calculatePriceWithVAT(request);
            }).toThrowError('Country not supported');
        });

        it('debería lanzar error para país vacío', () => {
            const request: SalesRequest = { country: '', amount: 100 };
            expect(() => {
                service.calculatePriceWithVAT(request);
            }).toThrowError('Country not supported');
        });

        it('debería manejar montos decimales correctamente', () => {
            const request: SalesRequest = { country: 'MX', amount: 200 };
            const result = service.calculatePriceWithVAT(request);

            expect(result).toEqual({
                amount: 200,
                country: 'MX',
                vatRate: 16,
                finalAmount: 232
            });
        });
    });
});
