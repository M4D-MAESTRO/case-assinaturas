
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { StepsModule } from 'primeng/steps';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

import { DirectivesModule } from '../../directive/directives.module';
import { PlanoDetailComponent } from './planos/plano-detail/plano-detail.component';
import { PlanoCadastroComponent } from './planos/plano-cadastro/plano-cadastro.component';
import { PlanoMainComponent } from './planos/plano-main/plano-main.component';
import { ItensDePlanoCadastroComponent } from './itens-de-plano/itens-de-plano-cadastro/itens-de-plano-cadastro.component';
import { ItensDePlanoDetailComponent } from './itens-de-plano/itens-de-plano-detail/itens-de-plano-detail.component';
import { ItensDePlanoMainComponent } from './itens-de-plano/itens-de-plano-main/itens-de-plano-main.component';
import { ItensDePlanoSelectionComponent } from './itens-de-plano/itens-de-plano-selection/itens-de-plano-selection.component';
import { QuestionItemPlanoModule } from '../utils/dialogs/question-item-plano/question-item-plano.module';



@NgModule({
  declarations: [
    PlanoMainComponent, PlanoDetailComponent, PlanoCadastroComponent,
    ItensDePlanoCadastroComponent, ItensDePlanoDetailComponent, ItensDePlanoMainComponent, ItensDePlanoSelectionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DataViewModule,
    PanelModule,
    DropdownModule,
    TabViewModule,
    TableModule,
    InputTextModule,
    InputSwitchModule,
    CheckboxModule,
    InputTextareaModule,
    RadioButtonModule,
    ButtonModule,
    MessageModule,
    StepsModule,
    PasswordModule,
    InputMaskModule,
    InputSwitchModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    DirectivesModule,
    QuestionItemPlanoModule,
  ],
  exports: [
    PlanoMainComponent, PlanoDetailComponent, PlanoCadastroComponent,
    ItensDePlanoCadastroComponent, ItensDePlanoDetailComponent, ItensDePlanoMainComponent, ItensDePlanoSelectionComponent,
  ]
})
export class AdmOperacaoModuleModule { }
