import { ModalController } from '@ionic/angular';
import { ComponentRef, ComponentProps } from '@ionic/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EChartsOption } from 'echarts';

import { PageOrder } from './../../shared/constants/page.constant';
import { BasicNotificacaoDto } from './../../shared/interfaces/others/notificacao.dto';
import { PageableDto } from './../../shared/interfaces/others/pageable.dto';
import { UserDto } from './../../shared/interfaces/users/user.dto';
import { StorageService } from './../../shared/services/auth/storage.service';
import { NotificacaoService } from './../../shared/services/notificacao/notificacao.service';
import { UserService } from './../../shared/services/user/user.service';
import { NotificacaoUtils } from './../../shared/utils/NotificacaoUtils';
import { Role } from './../../shared/constants/role.constants';
import { ToastMessageService } from './../../shared/services/toast/toast-message.service';
import { NotificacaoStatus } from './../../shared/constants/notificacao.constant';
import { FuncionarioProfileComponent } from './../../shared/components/adm-recurso-module/funcionarios/funcionario-profile/funcionario-profile.component';
import { PreferencesService } from './../../shared/services/preferences/preferences.service';
import { EmailService } from './../../shared/services/comunicacao/emails/email.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  user: UserDto

  notificacoes: BasicNotificacaoDto[] = [];
  itemsNotificacao: MenuItem[];

  users: PageableDto<UserDto>;
  itemsUsers: MenuItem[];

  inAndOutDash: EChartsOption;

  private subscriptions = new Subscription();

  constructor(
    private readonly route: Router,
    private readonly storage: StorageService,
    private readonly usersService: UserService,
    private readonly notificacaoService: NotificacaoService,
    private readonly toastService: ToastMessageService,
    private readonly modal: ModalController,
    private readonly preferencesService: PreferencesService,
    private readonly emailService: EmailService,
  ) { }

  ngOnInit() {
    this.itemsNotificacao = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Atualizar',
            icon: 'pi pi-fw pi-refresh',
            command: () => {
              this.loadNotificacoes();
            }
          },
        ]
      }];

    this.itemsUsers = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Atualizar',
            icon: 'pi pi-fw pi-refresh',
            command: () => {
              this.loadUsers();
            }
          },
        ]
      }];

    this.user = this.storage.getCompleteLocalUser();
    this.loadUsers();
    this.loadNotificacoes();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadNotificacoes() {
    const sub = this.notificacaoService.listSelf()
      .subscribe((notificacoes) => {
        this.notificacoes = notificacoes
      });
    this.subscriptions.add(sub);
  }

  loadUsers(page: number = 1) {
    const sub = this.usersService.listUsers({}, { order: PageOrder.ASC, page, take: 10 })
      .subscribe(users => {
        users.data = users.data.filter(u => u.id !== this.user.id);
        this.users = users as any;
      });
    this.subscriptions.add(sub);
  }

  paginar(event) {
    const page = event.page + 1;
    this.loadUsers(page);
  }

  getNotificacaoIcon(n: BasicNotificacaoDto) {
    return NotificacaoUtils.getIconByTipo(n.tipo);
  }

  getNotificacaoColor(status: string) {
    switch (status) {
      case NotificacaoStatus.AVISO:
        return 'text-yellow-500';

      case NotificacaoStatus.ERRO:
        return 'text-pink-500';

      case NotificacaoStatus.INFO:
        return 'text-blue-500';

      case NotificacaoStatus.SUCESSO:
        return 'text-green-500';

      default:
        return 'text-blue-500';
    }
  }


  openPerfil() {
    this.showModal(FuncionarioProfileComponent, { user: this.user, enableMessageAndNotification: true });
  }

  openMembro(user: UserDto) {
    this.showModal(FuncionarioProfileComponent, { user });
  }

  goToPDV() {
    this.route.navigateByUrl('pdv');
  }

  goToPrestacaoServico() {
    // this.route.navigateByUrl('prestacao-servico');
  }

  goToAssinatura() {
    // this.route.navigateByUrl('assinatura');
  }

  goToSendEmail(user: UserDto) {
    this.emailService.addEmailToList(user.email);
    const extras: NavigationExtras = {
      queryParams: {
        tab: 'email-send',
      },
    };
    this.route.navigate(['/comunicacao-email'], extras);

  }

  getTheme() {
    const theme = this.preferencesService.getThemePreference();
    this.inAndOutDash.backgroundColor = this.preferencesService.surfaceBackground;
    return theme == 'dark' ? theme : undefined;
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
      const { data: updatedUser } = data;

      if (updatedUser) {
        this.user = this.storage.getCompleteLocalUser();
      }

    });

    return await modal.present();
  }

}