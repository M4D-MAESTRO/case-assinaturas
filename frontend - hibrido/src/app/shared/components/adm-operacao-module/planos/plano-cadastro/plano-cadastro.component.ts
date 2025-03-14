import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ItemDePlanoDto } from './../../../../interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';
import { PlanoService } from './../../../../services/adm-assinatura/plano/plano.service';

@Component({
  selector: 'app-plano-cadastro',
  templateUrl: './plano-cadastro.component.html',
  styleUrls: ['./plano-cadastro.component.scss'],
})
export class PlanoCadastroComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup;
  isLoaded = false;

  createdPlanoId = '';
  wasCreated = false;

  suggestionedValues = {
    valor_trimestral: 0,
    valor_semestral: 0,
    valor_anual: 0,
    custo_mensal: 0,
  };
  itens_associar: string[] = [];

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly planosService: PlanoService,
    private readonly modal: ModalController,
  ) {

    this.form = this.formBuilder.group({
      nome: [, [Validators.required]],
      descricao: [, [Validators.required,]],
      valor_mensal: [, [Validators.required,]],
      valor_trimestral: [, []],
      valor_semestral: [, []],
      valor_anual: [, []],
      custo_mensal: [, []],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  create() {
    const nome = this.form.get('nome').value;
    const descricao = this.form.get('descricao').value;
    const valor_mensal = this.form.get('valor_mensal').value;

    const valor_trimestral = this.form.get('valor_trimestral').value == null ? undefined : this.form.get('valor_trimestral').value;
    const valor_semestral = this.form.get('valor_semestral').value == null ? undefined : this.form.get('valor_semestral').value;
    const valor_anual = this.form.get('valor_anual').value == null ? undefined : this.form.get('valor_anual').value;
    const custo_mensal = this.form.get('custo_mensal').value == null ? undefined : this.form.get('custo_mensal').value;

    const sub = this.planosService.create({
      nome,
      descricao,
      valor_mensal,
      valor_trimestral,
      valor_semestral,
      valor_anual,
      custo_mensal,
      itens_associar: this.itens_associar,
    })
      .subscribe(data => {
        this.createdPlanoId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }

  generateSuggestionValue({ value }: any) {
    const valor_mensal = Number(value);

    if (isNaN(valor_mensal) || !valor_mensal) {
      this.suggestionedValues.valor_anual = 0;
      this.suggestionedValues.valor_semestral = 0;
      this.suggestionedValues.valor_trimestral = 0;

      return;
    }

    const valor_trimestral = valor_mensal * 3 * 0.9; //10% de desconto em cima de 3 meses
    const valor_semestral = valor_trimestral * 2 * 0.9; //10% de desconto em cima de 2 trimestres (com 10% de desconto)
    const valor_anual = valor_semestral * 2 * 0.9; //10% de desconto em cima de 2 semestres (com 10% de desconto)

    this.suggestionedValues.valor_anual = valor_anual;
    this.suggestionedValues.valor_semestral = valor_semestral;
    this.suggestionedValues.valor_trimestral = valor_trimestral;
  }

  getSelectedItens(itens: ItemDePlanoDto[]) {
    if (!itens || itens.length <= 0) {
      return;
    }

    const { itens_associar, custo_mensal } = itens.reduce((acc, item) => {
      if (item.custo && item.custo !== null) {
        acc.custo_mensal += Number(item.custo);
      }
      acc.itens_associar.push(item.id);
      return acc;
    }, { itens_associar: [], custo_mensal: 0 });

    this.itens_associar = itens_associar;

    this.suggestionedValues.custo_mensal = isNaN(custo_mensal) ? 0 : Number(custo_mensal);
  }

  fechar() {
    this.modal.dismiss(this.wasCreated);
  }

  isInputError(inputName: string): boolean {
    const resp =
      !this.form.controls[inputName].untouched &&
      this.form.controls[inputName].errors;

    if (resp) {
      return true;
    }
    return false;
  }

  disableCreateBtn(): boolean {
    const situacao = !this.form.valid;

    return situacao;
  }

}
