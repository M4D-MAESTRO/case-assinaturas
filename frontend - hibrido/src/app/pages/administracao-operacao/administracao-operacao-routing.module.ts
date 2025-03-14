import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministracaoOperacaoPage } from './administracao-operacao.page';

const routes: Routes = [
  {
    path: '',
    component: AdministracaoOperacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracaoOperacaoPageRoutingModule {}
