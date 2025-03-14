
import { ItemDePlanoService } from './../../../../services/adm-assinatura/item-de-plano/item-de-plano.service';
import { ItemDePlanoDto } from './../../../../interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';
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
import { ItensDePlanoCadastroComponent } from '../itens-de-plano-cadastro/itens-de-plano-cadastro.component';
import { ItensDePlanoDetailComponent } from '../itens-de-plano-detail/itens-de-plano-detail.component';


@Component({
  selector: 'app-itens-de-plano-main',
  templateUrl: './itens-de-plano-main.component.html',
  styleUrls: ['./itens-de-plano-main.component.scss'],
})
export class ItensDePlanoMainComponent implements OnInit {
  @Output()
  changeToPlanosMainEvent: EventEmitter<any> = new EventEmitter();

  itensDePlano: PageableDto<ItemDePlanoDto>;
  sortOptions: SelectItem[] = [];
  searchedItem: string = '';
  currentPage = 1;

  showQuestionProduto = false;
  showQuestionServico = false;
  isLoaded = false;

  private subscriptions = new Subscription();

  constructor(
    private readonly itensDePlanoervice: ItemDePlanoService,
    private readonly modal: ModalController,
    private readonly toastService: ToastMessageService,
  ) { }

  ngOnInit() {
    this.loaditensDePlano();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loaditensDePlano(page: number = 1, searchedItem = undefined) {
    const sub = this.itensDePlanoervice.list({ searchedItem }, { order: PageOrder.DESC, page, take: 5 })
      .subscribe(data => {
        this.itensDePlano = data;
        this.isLoaded = true;
      });

    this.subscriptions.add(sub);
  }


  changeFiltro(event) {
    const { value } = event;
    this.loaditensDePlano();
  }

  createNew() {
    this.showModal(ItensDePlanoCadastroComponent);
  }

  editar(itemDePlano: ItemDePlanoDto) {
    this.showModal(ItensDePlanoDetailComponent, { itemDePlano });
  }

  enablePlano() {
    this.changeToPlanosMainEvent.emit(true);
  }

  search() {
    this.loaditensDePlano(1, this.searchedItem);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    if (page != this.currentPage) {
      this.currentPage = page;
      this.loaditensDePlano(page);
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

        if (hasUpdate) {
          this.toastService.presentToast({
            detalhe: `Operação bem sucedida!`,
            titulo: `Sucesso!`,
            duracao: ToastEnum.mediumDuration,
            gravidade: ToastPrimeSeverityEnum.SUCESSO
          });
          this.loaditensDePlano(this.currentPage);
        }

      });

    return await modal.present();
  }

}
