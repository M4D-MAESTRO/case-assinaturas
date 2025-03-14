
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';

import { PageOrder } from './../../../../constants/page.constant';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { ItemDePlanoDto } from './../../../../interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';
import { ItemDePlanoService } from './../../../../services/adm-assinatura/item-de-plano/item-de-plano.service';
import { AssociacaoItemPlano } from './../../../../../shared/constants/associacao-item.constant';

@Component({
  selector: 'app-itens-de-plano-cadastro',
  templateUrl: './itens-de-plano-cadastro.component.html',
  styleUrls: ['./itens-de-plano-cadastro.component.scss'],
})
export class ItensDePlanoCadastroComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup;
  isLoaded = false;

  createdPlanoItemId = '';
  wasCreated = false;

  suggestionedValues = {
    custo_estimado: 'indeterminável',
    custo_original: null,
    quantidade: null,
  };

  associacao: AssociacaoItemPlano = AssociacaoItemPlano.NAO;


  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly itemDePlanoService: ItemDePlanoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: [, [Validators.required]],
      descricao: [, [Validators.required,]],

      custo: [, []],
      quantidade: [, []],
      servico: [, []],
      produto: [, []],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  create() {
    const nome = this.form.get('nome').value;
    const descricao = this.form.get('descricao').value;

    const custo = this.form.get('custo').value == null ? undefined : Number(this.form.get('custo').value);
    const quantidade = this.form.get('quantidade').value == null ? undefined : Number(this.form.get('quantidade').value);

    const sub = this.itemDePlanoService.create({
      nome,
      descricao,

      custo,
      quantidade,
    })
      .subscribe(data => {
        this.createdPlanoItemId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }

  generateSuggestionValue({ value }: any) {
    const custo_original = value.custo_servico ? Number(value.custo_servico) : Number(value.preco_compra);

    if (isNaN(custo_original) || !custo_original) {
      this.suggestionedValues.custo_estimado = 'indeterminável';
      this.suggestionedValues.custo_original = null;
      return;
    }

    if (this.suggestionedValues.quantidade == null) {
      this.suggestionedValues.custo_estimado = 'indeterminável';
      this.suggestionedValues.custo_original = custo_original;
      return;
    }

    const custo_estimado = custo_original * this.suggestionedValues.quantidade;
    this.suggestionedValues.custo_original = custo_original;
    this.suggestionedValues.custo_estimado = !isNaN(custo_estimado) ? custo_estimado.toFixed(2) : 'indeterminável';
  }

  generateSuggestionQuantidade({ value }: any) {
    if (isNaN(value) || !value) {
      this.suggestionedValues.quantidade = null;
      this.suggestionedValues.custo_estimado = 'indeterminável';
      return;
    }
    this.suggestionedValues.quantidade = value;
    const custo_estimado = this.suggestionedValues.custo_original == null ? undefined
      : Number(this.suggestionedValues.custo_original) * value;
    this.suggestionedValues.custo_estimado = !isNaN(custo_estimado) ? custo_estimado.toFixed(2) : 'indeterminável';
  }

  clearSuggestion() {
    this.suggestionedValues.custo_estimado = 'indeterminável';
    this.suggestionedValues.custo_original = null;

    this.form.get('servico').setValue(undefined);
    this.form.get('produto').setValue(undefined);
  }

  //#region MODE
  getNoOption() {
    return AssociacaoItemPlano.NAO;
  }
  getServicoOption() {
    return AssociacaoItemPlano.SERVICO;
  }
  getProdutoOption() {
    return AssociacaoItemPlano.PRODUTO;
  }

  //#endregion

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
