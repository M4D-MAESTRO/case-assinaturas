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
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { StyleClassModule } from 'primeng/styleclass';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AssinaturasGestaoMainComponent } from './assinaturas-gestao-main/assinaturas-gestao-main.component';
import { PipeModule } from './../../../pipes/pipe.module';
import { DirectivesModule } from '../../../directive/directives.module';
import { AttentionSurfaceModule } from '../../utils/attention-surface/attention-surface.module';

@NgModule({
  declarations: [AssinaturasGestaoMainComponent],
  imports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,

    ButtonModule,
    RippleModule,
    InputTextModule,
    InputSwitchModule,
    InputNumberModule,
    DialogModule,
    DropdownModule,
    DividerModule,
    StyleClassModule,
    SkeletonModule,
    MenuModule,
    DataViewModule,
    CalendarModule,
    ConfirmDialogModule,
    PanelModule,
    PaginatorModule,
    MessageModule,
    RadioButtonModule,

    PipeModule,
    DirectivesModule,
    AttentionSurfaceModule,
  ],
  exports: [AssinaturasGestaoMainComponent],
})
export class AssinaturasGestaoMainModule { }
