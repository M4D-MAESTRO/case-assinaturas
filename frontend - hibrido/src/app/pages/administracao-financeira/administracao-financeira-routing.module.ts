import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministracaoFinanceiraPage } from './administracao-financeira.page';

const routes: Routes = [
  {
    path: '',
    component: AdministracaoFinanceiraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracaoFinanceiraPageRoutingModule {}
