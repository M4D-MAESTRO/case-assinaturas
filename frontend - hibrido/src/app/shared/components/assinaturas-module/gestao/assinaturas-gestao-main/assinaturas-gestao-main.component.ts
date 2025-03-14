
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';

import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from './../../../../services/auth/storage.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../../constants/page.constant';
import { ToastEnum, ToastPrimeSeverityEnum } from '../../../../../shared/constants/toast.constant';
import { UserDto } from '../../../../../shared/interfaces/users/user.dto';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { AssinaturasEnum, AssinaturasEnumMenu } from './../../../../../shared/constants/status-assinaturas.constant';
import { PlanoService } from './../../../../services/adm-assinatura/plano/plano.service';
import { AssinaturaService } from './../../../../services/adm-assinatura/assinatura/assinatura.service';
import { UserService } from './../../../../../shared/services/user/user.service';
import { PlanoDto } from './../../../../interfaces/adm-assinatura/plano/plano.dto';
import { AssinaturaDto } from './../../../../interfaces/adm-assinatura/assinatura/assinatura.dto';
import { TipoUsuarioEnum } from './../../../../constants/tipo-user.constant';
import { AssinaturasUpdateComponent } from '../../simplificado/assinaturas-update/assinaturas-update.component';

@Component({
  selector: 'app-assinaturas-gestao-main',
  templateUrl: './assinaturas-gestao-main.component.html',
  styleUrls: ['./assinaturas-gestao-main.component.scss'],
})
export class AssinaturasGestaoMainComponent implements OnInit, OnDestroy {

  assinaturas: PageableDto<AssinaturaDto>;
  searchedAssinatura = '';
  selectedAssinatura: AssinaturaDto;
  selectedStatusAssinatura;
  currentPage = 1;

  clientes: PageableDto<UserDto>;
  searchedCliente = '';
  selectedCliente = '';

  planos: PageableDto<PlanoDto>;
  searchedPlano = '';
  selectedPlano = '';
  shouldDisableCliente = false;

  sortOptions: SelectItem[] = [];
  isLoaded = false;
  currentPlanoLoaded: string;

  showEnderecoDialog = false;
  showServicoDialog = false;

  private subscriptions = new Subscription();

  constructor(
    private readonly userService: UserService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
    private readonly planoService: PlanoService,
    private readonly router: Router,
    private readonly assinaturasService: AssinaturaService,
    private readonly storageService: StorageService,
    private readonly confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.sortOptions = [...AssinaturasEnumMenu];

    this.loadPlanos();
    this.loadClientes();
    this.loadAssinatura();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeFiltro({ value }) {
    this.selectedStatusAssinatura = value;
    this.loadAssinatura();
  }

  clearFilter() {
    this.loadAssinatura();
  }

  clearAllFilters(event, dropdown_planos: Dropdown, dropdown_filtro: Dropdown) {
    this.searchedAssinatura = undefined;
    this.selectedPlano = undefined;
    this.clearPlanoFilter(null);

    dropdown_planos.writeValue(null);
    dropdown_filtro.writeValue(null);


    this.loadClientes(1);
  }

  createNewAssinatura() {
    this.router.navigateByUrl('plano-assinaturas');
  }

  setUserImage(user: UserDto) {
    return user.avatar_url || "assets/imgs/outros/default-user.jpg";
  }


  //#region Plano
  changePlano({ value }) {
    this.selectedPlano = value;
    this.loadAssinatura();
  }

  clearPlanoFilter(event) {
    this.shouldDisableCliente = true;
    this.selectedCliente = undefined;
    this.selectedStatusAssinatura = undefined;
  }

  loadPlanos(page = 1, dropdown?: Dropdown) {
    const sub = this.planoService.list(
      { searchedPlano: this.searchedPlano },
      { order: PageOrder.ASC, page, take: 10 })
      .subscribe(data => {
        this.planos = data;
        if (dropdown) {
          dropdown.show();
        }
      });

    this.subscriptions.add(sub);
  }
  paginarPlanos(event) {
    this.loadPlanos();
  }
  onPlanoFilter(event) {
    const filter = event.filter as string;
    this.searchedPlano = filter;
  }

  blurPlanos(event, dropdown: Dropdown) {
    this.searchedPlano = undefined;
    dropdown.filterValue = undefined;
  }
  //#endregion

  //#region Cliente
  changeCliente({ value }) {
    this.loadAssinatura();
  }


  loadClientes(page = 1) {
    const sub = this.userService.listUsers(
      {
        searchedUser: this.searchedCliente,
        tipo_usuario: TipoUsuarioEnum.CLIENTE,
        load_cliente_nao_identificado: true,
      },
      { order: PageOrder.DESC, page, take: 10 }
    )
      .subscribe(response => {
        this.clientes = response;
      });
    this.subscriptions.add(sub);
  }
  paginarCliente(event) {
    this.loadClientes();
  }
  onClienteFilter(event) {
    const filter = event.filter as string;
    this.searchedCliente = filter;
    this.loadClientes();
  }
  blurCliente(event, dropdown: Dropdown) {
    this.searchedCliente = undefined;
    dropdown.filterValue = undefined;
  }
  //#endregion

  //#region Assinatura

  searchAssinatura() {
    this.loadAssinatura(1);
  }

  paginarAssinatura(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadAssinatura(page);
    }
  }

  loadAssinatura(page = 1) {
    const sub = this.assinaturasService.list(
      {
        plano_assinatura_id: this.selectedPlano,
        assinante_id: this.selectedCliente,
        searchedAssinatura: this.searchedAssinatura,
        status: this.selectedStatusAssinatura,
      },
      { order: PageOrder.DESC, page, take: 10 }
    )
      .subscribe(response => {
        this.assinaturas = response;
      });
    this.subscriptions.add(sub);
  }
  //#endregion

  //#region OPERACOES
  openDetailAssinatura(assinatura?: AssinaturaDto) {
    this.showModal(AssinaturasUpdateComponent, { assinatura_id: assinatura.id });
  }

  startAssinatura(assinatura: AssinaturaDto) {
    const { id, assinante } = assinatura;
    this.confirmationService.confirm({
      message: `Deseja mesmo ativar a assinatura ${id}?`,
      header: `Assinatura do cliente '${assinante.nome}'`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const sub = this.assinaturasService.startById(id)
          .subscribe(response => {
            this.toastService.presentToast({
              titulo: `Ativada`,
              detalhe: `Assinatura do cliente '${assinante.nome}' ativada`,
              duracao: ToastEnum.mediumDuration,
              gravidade: ToastPrimeSeverityEnum.INFORMACAO,
            });
            this.loadAssinatura();
          });
        this.subscriptions.add(sub);
      },
      reject: (type) => {
        this.toastService.clearToast();
      }
    });
  }

  pauseAssinatura(assinatura: AssinaturaDto) {
    const { id, assinante } = assinatura;
    this.confirmationService.confirm({
      message: `Deseja mesmo pausar a assinatura ${id}?`,
      header: `Assinatura do cliente '${assinante.nome}'`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const sub = this.assinaturasService.pausadaById(id)
          .subscribe(response => {
            this.toastService.presentToast({
              titulo: `Pausada`,
              detalhe: `Assinatura do cliente '${assinante.nome}' foi pausada`,
              duracao: ToastEnum.mediumDuration,
              gravidade: ToastPrimeSeverityEnum.INFORMACAO,
            });
            this.loadAssinatura(1);
          });
        this.subscriptions.add(sub);
      },
      reject: (type) => {
        this.toastService.clearToast();
      }
    });
  }

  cancelAssinatura(assinatura: AssinaturaDto) {
    const { id, assinante } = assinatura;

    this.confirmationService.confirm({
      message: `Deseja mesmo cancelar a assinatura ${id}?`,
      header: `Assinatura do cliente '${assinante.nome}'`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const sub = this.assinaturasService.cancelById(id)
          .subscribe(response => {
            this.toastService.presentToast({
              titulo: `Cancelada`,
              detalhe: `Assinatura do cliente '${assinante.nome}' cancelada`,
              duracao: ToastEnum.mediumDuration,
              gravidade: ToastPrimeSeverityEnum.INFORMACAO,
            });
            this.loadAssinatura();
          });
        this.subscriptions.add(sub);
      },
      reject: (type) => {
        this.toastService.clearToast();
      }
    });
  }

  updateAssinatura(assinatura: AssinaturaDto) {
    //this.showModal(ServicosUpdateComponent, { assinatura });
  }

  showStartButton(assinatura: AssinaturaDto) {
    const { status } = assinatura;

    if (status != AssinaturasEnum.ATIVO && status != AssinaturasEnum.CANCELADA) {
      return true;
    }

    return false;
  }

  showPauseButton(assinatura: AssinaturaDto) {
    const { status } = assinatura;

    if (
      status != AssinaturasEnum.PAUSADO
      && status != AssinaturasEnum.CANCELADA
      && status != AssinaturasEnum.PENDENTE
    ) {
      return true;
    }

    return false;
  }

  showCancelButton(assinatura: AssinaturaDto) {
    const { status } = assinatura;

    if (status != AssinaturasEnum.CANCELADA) {
      return true;
    }

    return false;
  }
  //#endregion

  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modal.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-80',
      componentProps,
    });

    modal.onDidDismiss().then((data) => {
      const { data: hasUpdate } = data;
      this.isLoaded = false;
      if (hasUpdate) {
        this.loadAssinatura();
      }
    });

    return await modal.present();
  }
}
