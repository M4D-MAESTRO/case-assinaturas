
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ComunicacaoEmailPageRoutingModule } from './comunicacao-email-routing.module';

import { ComunicacaoEmailPage } from './comunicacao-email.page';
import { DirectivesModule } from './../../shared/directive/directives.module';
import { EmailsModuleModule } from './../../shared/components/comunicacao-module/emails-module/emails-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    ComunicacaoEmailPageRoutingModule,
    EmailsModuleModule,
    DirectivesModule,
  ],
  declarations: [ComunicacaoEmailPage]
})
export class ComunicacaoEmailPageModule {}
