import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpfPipe } from './../brazilian-masks/cpf.pipe';
import { CepPipe } from './../brazilian-masks/cep.pipe';



@NgModule({
  declarations: [CpfPipe, CepPipe],
  imports: [
    CommonModule
  ],
  exports: [CpfPipe, CepPipe],
})
export class BrazilianMasksPipeModule { }
