import { PlanoService } from './../../../../services/adm-assinatura/plano/plano.service';
import { AssinaturaDto } from './../../../../interfaces/adm-assinatura/assinatura/assinatura.dto';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';

import { PageOrder } from './../../../../constants/page.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { AssinaturaService } from './../../../../services/adm-assinatura/assinatura/assinatura.service';
import { PlanoDto } from './../../../../interfaces/adm-assinatura/plano/plano.dto';
import { CartaoClientesService } from './../../../../services/adm-pagamentos/cartao-clientes/cartao-clientes.service';
import { PagamentoFormasEnum, PagamentoFormasMenu } from './../../../../constants/pagamento-formas.constant';
import { UserDto } from './../../../../interfaces/users/user.dto';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { TipoUsuarioEnum } from './../../../../constants/tipo-user.constant';
import { UserService } from './../../../../services/user/user.service';
import { ModalidadesAssinaturaEnum } from './../../../../constants/modalidade-assinaturas.const';
import { CartaoClienteDto } from './../../../../interfaces/adm-pagamentos/cartao-clientes/cartao-cliente.dto';

@Component({
  selector: 'app-assinaturas-update',
  templateUrl: './assinaturas-update.component.html',
  styleUrls: ['./assinaturas-update.component.scss'],
})
export class AssinaturasUpdateComponent implements OnInit, OnDestroy {

  @Input()
  assinatura_id: string;

  assinatura: AssinaturaDto
  plano: PlanoDto

  form: UntypedFormGroup;
  isLoaded = false;

  clients: PageableDto<UserDto>;
  searchedCliente = '';
  selectedClienteId = '';

  formasPagamento = PagamentoFormasMenu;

  enableCartaoView = false;
  cartoes: PageableDto<CartaoClienteDto>;

  modalidadesPagamento: any[] = [];

  createdAssinaturaItemId = '';
  wasCreated = false;

  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modal: ModalController,
    private readonly assinaturaService: AssinaturaService,
    private readonly toastService: ToastMessageService,
    private readonly userService: UserService,
    private readonly planoService: PlanoService,
    private readonly cartaoClientesService: CartaoClientesService,
  ) {
  }

  ngOnInit() {
    this.loadAssinatura();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  create() {
    const tipo = this.form.get('forma_pagamento').value;
    const modalidade = this.form.get('modalidade').value;
    const cartao_cliente_id = this.form.get('cartao_cliente_id').value || undefined;
    const plano_assinatura_id = this.plano.id;
    const dto = {
      modalidade,
      plano_assinatura_id,
      forma_pagamento: {
        tipo,
        cartao_cliente_id: cartao_cliente_id || undefined,
      }
    };

    const sub = this.assinaturaService.update(this.assinatura_id, dto)
      .subscribe(data => {
        this.createdAssinaturaItemId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }

  //#region CARTAO
  enableCartaoCliente({ value }: any) {
    const formaPagamento = value as PagamentoFormasEnum;
    if (formaPagamento == PagamentoFormasEnum.CARTAO_CREDITO || formaPagamento == PagamentoFormasEnum.CARTAO_DEBITO) {
      this.enableCartaoView = true;
      this.form.get('cartao_cliente_id').setValidators([Validators.required]);
    } else {
      this.enableCartaoView = false;
      this.form.get('cartao_cliente_id').setValue(undefined);
      this.form.get('cartao_cliente_id').clearValidators();
    }

    this.form.get('cartao_cliente_id').updateValueAndValidity({ onlySelf: true });
    this.form.updateValueAndValidity();
  }

  loadCartao(page = 1) {
    const sub = this.cartaoClientesService.list(
      { cliente_id: this.selectedClienteId },
      { order: PageOrder.DESC, page, take: 10 }
    )
      .subscribe(response => {
        this.cartoes = response;
      });
    this.subscriptions.add(sub);
  }
  paginarCartao(event) {
    this.loadCartao();
  }
  onCartaoFilter(event) {
    const filter = event.filter as string;
    this.searchedCliente = filter;
  }
  blurCartao(event, dropdown: Dropdown) {
    this.searchedCliente = undefined;
    dropdown.filterValue = undefined;
  }

  cadastrarCartao() {

  }

  //#endregion

  loadPlano() {
    const { id } = this.assinatura.plano_assinatura;

    const sub = this.planoService.findById(id)
      .subscribe(data => {
        this.plano = data;
        this.generateModalidade();
      });
    this.subscriptions.add(sub);
  }


  loadAssinatura() {
    const sub = this.assinaturaService.findById(this.assinatura_id)
      .subscribe(data => {
        this.assinatura = data;
        this.selectedClienteId = data.assinante.id;

        this.loadCartao();
        this.loadPlano();

        const { forma_pagamento, modalidade } = this.assinatura;
        this.form = this.formBuilder.group({
          forma_pagamento: [forma_pagamento.tipo, [Validators.required,]],
          modalidade: [modalidade, [Validators.required,]],

          cartao_cliente_id: [forma_pagamento.cartao_cliente?.id || undefined, []],
        });
        
        this.enableCartaoCliente({ value: forma_pagamento.tipo });
      });
    this.subscriptions.add(sub);
  }

  generateModalidade() {
    const { valor_mensal, valor_trimestral, valor_semestral, valor_anual } = this.plano;

    this.modalidadesPagamento.push({
      modalidade: ModalidadesAssinaturaEnum.MENSAL,
      label: `Mensal - R$ ${Number(valor_mensal).toFixed(2)}`,
    });

    if (valor_trimestral) {
      this.modalidadesPagamento.push({
        modalidade: ModalidadesAssinaturaEnum.TRIMESTRAL,
        label: `Trimestral - R$ ${Number(valor_trimestral).toFixed(2)}`,
      });
    }

    if (valor_semestral) {
      this.modalidadesPagamento.push({
        modalidade: ModalidadesAssinaturaEnum.SEMESTRAL,
        label: `Semestral - R$ ${Number(valor_semestral).toFixed(2)}`,
      });
    }

    if (valor_anual) {
      this.modalidadesPagamento.push({
        modalidade: ModalidadesAssinaturaEnum.ANUAL,
        label: `Anual - R$ ${Number(valor_anual).toFixed(2)}`,
      });
    }
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
