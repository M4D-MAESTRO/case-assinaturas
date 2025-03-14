import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestaoAssinaturasPage } from './gestao-assinaturas.page';

const routes: Routes = [
  {
    path: '',
    component: GestaoAssinaturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestaoAssinaturasPageRoutingModule {}
