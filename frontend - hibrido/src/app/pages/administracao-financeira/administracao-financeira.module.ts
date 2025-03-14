
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracaoFinanceiraPageRoutingModule } from './administracao-financeira-routing.module';

import { AdministracaoFinanceiraPage } from './administracao-financeira.page';
import { DirectivesModule } from './../../shared/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracaoFinanceiraPageRoutingModule,
    DirectivesModule
  ],
  declarations: [AdministracaoFinanceiraPage]
})
export class AdministracaoFinanceiraPageModule {}
