import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracaoGeralPageRoutingModule } from './administracao-geral-routing.module';

import { AdministracaoGeralPage } from './administracao-geral.page';
import { DirectivesModule } from 'src/app/shared/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracaoGeralPageRoutingModule,
    DirectivesModule,

  ],
  declarations: [AdministracaoGeralPage]
})
export class AdministracaoGeralPageModule {}
