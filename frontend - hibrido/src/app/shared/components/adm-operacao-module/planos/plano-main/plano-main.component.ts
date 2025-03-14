import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentProps, ComponentRef } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';

import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { ToastEnum, ToastPrimeSeverityEnum } from './../../../../constants/toast.constant';
import { PageOrder } from './../../../../constants/page.constant';

import { PlanoDto } from './../../../../interfaces/adm-assinatura/plano/plano.dto';
import { PlanoService } from './../../../../services/adm-assinatura/plano/plano.service';
import { PlanoCadastroComponent } from '../plano-cadastro/plano-cadastro.component';
import { PlanoDetailComponent } from '../plano-detail/plano-detail.component';

@Component({
  selector: 'app-plano-main',
  templateUrl: './plano-main.component.html',
  styleUrls: ['./plano-main.component.scss'],
})
export class PlanoMainComponent implements OnInit, OnDestroy {
  
  @Output()
  changeToItensMainEvent: EventEmitter<any> = new EventEmitter();

  planos: PageableDto<PlanoDto>;
  sortOptions: SelectItem[] = [];
  searchedPlano: string = '';
  currentPage = 1;

  isLoaded = false;

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
    const sub = this.planoService.list({ searchedPlano }, { order: PageOrder.DESC, page, take: 5 })
      .subscribe(data => {
        this.planos = data;
        this.isLoaded = true;
      });

    this.subscriptions.add(sub);
  }


  changeFiltro(event) {
    const { value } = event;
    this.loadPlanos();
  }

  createNew() {
    this.showModal(PlanoCadastroComponent);
  }

  editar(plano: PlanoDto) {
     this.showModal(PlanoDetailComponent, { plano });
  }

  showItens(plano: PlanoDto) {

  }

  enableItensDePlano() {
    this.changeToItensMainEvent.emit(true);
  }

  search() {
    this.loadPlanos(1, this.searchedPlano);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loadPlanos(page);
    }
  }


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

    modal.onDidDismiss()
      .then((data) => {
        const { data: hasUpdate, role } = data;
        console.log(hasUpdate);

        if (hasUpdate) {
          this.toastService.presentToast({
            detalhe: `Operação bem sucedida!`,
            titulo: `Sucesso!`,
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
          this.loadPlanos(this.currentPage);
        }

      });

    return await modal.present();
  }
}
