import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestaoAssinaturasPageRoutingModule } from './gestao-assinaturas-routing.module';

import { GestaoAssinaturasPage } from './gestao-assinaturas.page';
import { AssinaturasGestaoMainModule } from './../../shared/components/assinaturas-module/gestao/assinaturas-gestao-main.module';
import { DirectivesModule } from './../../shared/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestaoAssinaturasPageRoutingModule,
    DirectivesModule,
    AssinaturasGestaoMainModule,
  ],
  declarations: [GestaoAssinaturasPage]
})
export class GestaoAssinaturasPageModule { }
