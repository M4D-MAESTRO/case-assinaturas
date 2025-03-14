
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentProps, ComponentRef } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlanoDto } from './../../../../interfaces/adm-assinatura/plano/plano.dto';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../../constants/page.constant';
import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PlanoService } from './../../../../services/adm-assinatura/plano/plano.service';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { AssinaturasCadastroComponent } from '../assinaturas-cadastro/assinaturas-cadastro.component';

@Component({
  selector: 'app-assinaturas-main',
  templateUrl: './assinaturas-main.component.html',
  styleUrls: ['./assinaturas-main.component.scss'],
})
export class AssinaturasMainComponent implements OnInit, OnDestroy {

  planos: PageableDto<PlanoDto>;
  searchedPlano = '';

  currentPage = 1;

  private subscriptions = new Subscription();

  constructor(
    private readonly planoService: PlanoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
  ) { }

  ngOnInit() {
    this.loadPlanos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPlanos(page: number = 1, searchedPlano = undefined) {
    const sub = this.planoService.list({ searchedPlano }, { order: PageOrder.DESC, page, take: 6 })
      .subscribe(data => {
        this.planos = data;
      });

    this.subscriptions.add(sub);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadPlanos(page, this.searchedPlano);
    }
  }

  doSearch() {
    this.loadPlanos(1, this.searchedPlano);
  }

  clearSearch() {
    this.searchedPlano = '';
    this.loadPlanos();
  }

  assinar(plano: PlanoDto) {
    this.showModal(AssinaturasCadastroComponent, { plano });
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

    modal.onDidDismiss()
      .then((data) => {
        const { data: hasUpdate, role } = data;

        if (hasUpdate) {
          this.toastService.presentToast({
            detalhe: `Operação bem sucedida!`,
            titulo: `Sucesso!`,
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
        }

      });

    return await modal.present();
  }
}
