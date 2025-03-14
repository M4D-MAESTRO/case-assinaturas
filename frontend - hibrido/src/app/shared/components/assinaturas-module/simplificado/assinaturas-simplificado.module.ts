import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

import { AssinaturasCadastroComponent } from './assinaturas-cadastro/assinaturas-cadastro.component';
import { AssinaturasMainComponent } from './assinaturas-main/assinaturas-main.component';
import { AssinaturasUpdateComponent } from './assinaturas-update/assinaturas-update.component';

import { PipeModule } from './../../../pipes/pipe.module';
import { DirectivesModule } from '../../../directive/directives.module';
import { AttentionSurfaceModule } from '../../utils/attention-surface/attention-surface.module';


@NgModule({
  declarations: [
    AssinaturasUpdateComponent,
    AssinaturasMainComponent,
    AssinaturasCadastroComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,

    ButtonModule,
    RippleModule,
    InputTextModule,
    InputSwitchModule,
    RadioButtonModule,
    PaginatorModule,

    PipeModule,
    DirectivesModule,
    AttentionSurfaceModule,
  ],
  exports: [
    AssinaturasUpdateComponent,
    AssinaturasMainComponent,
    AssinaturasCadastroComponent,
  ]
})
export class AssinaturasSimplificadoModule { }
