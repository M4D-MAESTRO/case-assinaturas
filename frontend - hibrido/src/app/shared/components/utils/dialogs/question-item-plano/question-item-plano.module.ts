import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { QuestionItemPlanoComponent } from './question-item-plano.component';

@NgModule({
  declarations: [QuestionItemPlanoComponent],
  imports: [
    CommonModule,
    IonicModule,
    DialogModule,
    ButtonModule,
    RippleModule,
  ],
  exports: [QuestionItemPlanoComponent],
})
export class QuestionItemPlanoModule { }
