import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComunicacaoEmailPage } from './comunicacao-email.page';

const routes: Routes = [
  {
    path: '',
    component: ComunicacaoEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComunicacaoEmailPageRoutingModule {}
