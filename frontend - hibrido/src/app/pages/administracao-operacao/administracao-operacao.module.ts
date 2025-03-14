
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AdministracaoOperacaoPageRoutingModule } from './administracao-operacao-routing.module';

import { AdministracaoOperacaoPage } from './administracao-operacao.page';
import { AdmOperacaoModuleModule } from './../../shared/components/adm-operacao-module/adm-operacao-module.module';
import { DirectivesModule } from './../../shared/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    AdministracaoOperacaoPageRoutingModule,
    AdmOperacaoModuleModule,
    DirectivesModule,
  ],
  declarations: [AdministracaoOperacaoPage]
})
export class AdministracaoOperacaoPageModule {}
