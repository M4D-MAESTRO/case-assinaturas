import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PlanoAssinaturasPageRoutingModule } from './plano-assinaturas-routing.module';

import { PlanoAssinaturasPage } from './plano-assinaturas.page';
import { DirectivesModule } from './../../shared/directive/directives.module';
import { AssinaturasSimplificadoModule } from './../../shared/components/assinaturas-module/simplificado/assinaturas-simplificado.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanoAssinaturasPageRoutingModule,
    DirectivesModule,
    AssinaturasSimplificadoModule,
  ],
  declarations: [PlanoAssinaturasPage]
})
export class PlanoAssinaturasPageModule { }
