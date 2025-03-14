import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanoAssinaturasPage } from './plano-assinaturas.page';

const routes: Routes = [
  {
    path: '',
    component: PlanoAssinaturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanoAssinaturasPageRoutingModule {}
