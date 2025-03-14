
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
  selector: 'app-assinaturas-cadastro',
  templateUrl: './assinaturas-cadastro.component.html',
  styleUrls: ['./assinaturas-cadastro.component.scss'],
})
export class AssinaturasCadastroComponent implements OnInit, OnDestroy {

  @Input()
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
    private readonly cartaoClientesService: CartaoClientesService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      assinante_id: [, [Validators.required]],
      forma_pagamento: [, [Validators.required,]],
      modalidade: [, [Validators.required,]],
      cartao_cliente_id: [, []],
    });

    this.loadClients();
    this.generateModalidade();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  create() {
    const assinante_id = this.form.get('assinante_id').value;
    const tipo = this.form.get('forma_pagamento').value;
    const modalidade = this.form.get('modalidade').value;
    const cartao_cliente_id = this.form.get('cartao_cliente_id').value || undefined;
    const plano_assinatura_id = this.plano.id;
    const dto = {
      modalidade,
      plano_assinatura_id,
      assinante_id,
      forma_pagamento: {
        tipo,
        cartao_cliente_id: cartao_cliente_id || undefined,
      }
    };

    const sub = this.assinaturaService.create(dto)
      .subscribe(data => {
        this.createdAssinaturaItemId = data.id;
        this.wasCreated = true;
        this.fechar();
      });

    this.subscriptions.add(sub);
  }

  //#region CLIENTE
  loadClients(page = 1) {
    const sub = this.userService.listUsers(
      { searchedUser: this.searchedCliente, tipo_usuario: TipoUsuarioEnum.CLIENTE, load_cliente_nao_identificado: false },
      { order: PageOrder.DESC, page, take: 10 }
    )
      .subscribe(response => {
        this.clients = response;
      });
    this.subscriptions.add(sub);
  }
  paginarClient(event) {
    this.loadClients();
  }
  onClientFilter(event) {
    const filter = event.filter as string;
    this.searchedCliente = filter;
  }
  blurClient(event, dropdown: Dropdown) {
    this.searchedCliente = undefined;
    dropdown.filterValue = undefined;
  }
  onChangeClient({ value }) {
    this.selectedClienteId = value;
    this.enableCartaoView = false;
    this.form.get('forma_pagamento').setValue(undefined);
    this.form.get('forma_pagamento').updateValueAndValidity({ onlySelf: true });

    this.form.get('cartao_cliente_id').setValue(undefined);
    this.form.get('cartao_cliente_id').clearValidators();
    this.form.get('cartao_cliente_id').updateValueAndValidity({ onlySelf: true });

    this.form.updateValueAndValidity();
  }

  get assinanteId() {
    const assinante_id = this.form.get('assinante_id').value;
    return assinante_id ? true : false;
  }
  //#endregion

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
