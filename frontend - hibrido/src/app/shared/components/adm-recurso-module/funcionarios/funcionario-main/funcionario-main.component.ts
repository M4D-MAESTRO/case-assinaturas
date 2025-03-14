import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';

import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';

import { ToastEnum, ToastPrimeSeverityEnum } from '../../../../../shared/constants/toast.constant';
import { UserDto } from '../../../../../shared/interfaces/users/user.dto';
import { UserService } from '../../../../../shared/services/user/user.service';
import { EnderecoComponent } from '../../../endereco-module/endereco/endereco.component';
import { UpdateEnderecoComponent } from '../../../endereco-module/update-endereco/update-endereco.component';
import { FuncionarioCadastroComponent } from '../funcionario-cadastro/funcionario-cadastro.component';
import { FuncionarioDetailComponent } from '../funcionario-detail/funcionario-detail.component';
import { StatusUser } from './../../../../constants/status.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../../constants/page.constant';
import { FuncionarioProfileComponent } from '../funcionario-profile/funcionario-profile.component';
import { AuthorizationMainComponent } from '../../../authorization-module/authorization-main/authorization-main.component';

@Component({
  selector: 'app-funcionario-main',
  templateUrl: './funcionario-main.component.html',
  styleUrls: ['./funcionario-main.component.scss'],
})
export class FuncionarioMainComponent implements OnInit, OnDestroy {

  users: PageableDto<UserDto>;
  sortOptions: SelectItem[] = [];

  isLoaded = false;
  currentLojaLoaded: string;
  searchedNome = '';
  selectedStatus = '';
  currentPage = 1;

  selectedUser: UserDto;

  editMenuItens: MenuItem[] = [{
    label: 'Opções',
    items: [
      {
        label: 'Simplificada',
        icon: 'pi pi-user',
        command: () => this.detalharSimplificado(this.selectedUser),
      },
    ]
  }
  ];

  private subscriptions = new Subscription();

  constructor(
    private readonly userService: UserService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
  ) { }

  ngOnInit() {
    //Permitir filtrar usuário por status
    this.sortOptions = [...StatusUser];

    this.loadFuncionarios();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeFiltro({ value }) {
    this.selectedStatus = value;
    this.loadFuncionarios(1);
  }


  clearFilter() {
    this.loadFuncionarios(1);
  }

  clearAllFilters(event, dropdown_filtro: Dropdown) {
    this.searchedNome = undefined;
    this.selectedStatus = undefined;

    dropdown_filtro.writeValue(null);

    this.loadFuncionarios(1);
  }


  loadFuncionarios(page = 1) {
    const sub = this.userService.listUsers({ searchedUser: this.searchedNome, status: this.selectedStatus }, { order: PageOrder.DESC, page, take: 5 })
      .subscribe(response => {
        this.users = response;
        this.isLoaded = true;
      });
    this.subscriptions.add(sub);
  }

  detalharSimplificado(user: UserDto) {
    this.showModal(FuncionarioDetailComponent, { user });
  }


  detalharEndereco(user: UserDto) {
    if (user.endereco) {
      this.showModal(UpdateEnderecoComponent, { currentEndereco: user, isFuncionario: true });
    } else {
      this.showModal(EnderecoComponent, { idOf: user.id, isFuncionario: true, isModal: true });
    }
  }

  setUserImage(user: UserDto) {
    return user.avatar_url || "assets/imgs/outros/default-user.jpg";
  }

  createNewUser() {
    this.showModal(FuncionarioCadastroComponent);
  }

  search() {
    this.loadFuncionarios(1);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadFuncionarios(page);
    }
  }

  private async showModal(
    component: ComponentRef,
    componentProps?: ComponentProps
  ) {
    const modal = await this.modal.create({
      component,
      backdropDismiss: false,
      cssClass: 'modal-size-100',
      componentProps,
    });

    modal.onDidDismiss().then((data) => {
      const { data: hasUpdate } = data;
      this.isLoaded = false;
      this.loadFuncionarios();
      /*if (hasUpdate) {
        this.toastService.presentToast({
          titulo: 'Sucesso',
          detalhe: 'Operação bem sucedida!',
          duracao: ToastEnum.mediumDuration,
          gravidade: ToastPrimeSeverityEnum.SUCESSO
        });
      }*/
    });

    return await modal.present();
  }
}




// Acertar Toast
// Colocar filtro por status do funcionario
// Filtro por Cargo
// Filtro por Perfil