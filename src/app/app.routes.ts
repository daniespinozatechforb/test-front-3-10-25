import { Routes } from '@angular/router';
import { SalesComponent } from './components/sales/sales/sales.component';

export const routes: Routes = [
  {path: '**', redirectTo: 'sales', pathMatch: 'full'},
  {path: 'sales', component: SalesComponent}
];
