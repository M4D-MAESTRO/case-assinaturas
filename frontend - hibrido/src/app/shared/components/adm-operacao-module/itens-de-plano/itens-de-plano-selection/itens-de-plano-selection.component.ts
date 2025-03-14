
import { SelectItem } from 'primeng/api';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ToastMessageService } from './../../../../services/toast/toast-message.service';
import { PageableDto } from './../../../../interfaces/others/pageable.dto';
import { PageOrder } from './../../../../constants/page.constant';
import { ItemDePlanoDto } from './../../../../../shared/interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';
import { ItemDePlanoService } from './../../../../services/adm-assinatura/item-de-plano/item-de-plano.service';

@Component({
  selector: 'app-itens-de-plano-selection',
  templateUrl: './itens-de-plano-selection.component.html',
  styleUrls: ['./itens-de-plano-selection.component.scss'],
})
export class ItensDePlanoSelectionComponent implements OnInit, OnDestroy {

  @Input()
  itens_associados: ItemDePlanoDto[] = [];

  @Output()
  selectedItensEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  unselectedItensEvent: EventEmitter<any> = new EventEmitter();

  itens: PageableDto<ItemDePlanoDto>;
  sortOptions: SelectItem[] = [];
  searchedItem: string = '';
  currentPage = 1;
  selectAll: boolean = false;
  selectedItens: ItemDePlanoDto[] = [];
  unselectedItens: ItemDePlanoDto[] = [];
  totalRecords = 0;
  showDialog = false;
  selectedItem: ItemDePlanoDto;

  isLoaded = false;
  private subscriptions = new Subscription();

  constructor(
    private readonly modal: ModalController,
    private readonly toastMessageService: ToastMessageService,
    private readonly itemDePlanoService: ItemDePlanoService,
  ) { }

  ngOnInit() {
    this.loadItens();
    this.selectedItens = this.itens_associados;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadItens(page: number = 1, searchedItem = undefined) {
    const sub = this.itemDePlanoService.list({ searchedItem }, { order: PageOrder.DESC, page, take: 10 })
      .subscribe(data => {
        this.itens = data;
        this.totalRecords = data.meta.itemCount;
        this.isLoaded = true;
      });

    this.subscriptions.add(sub);
  }

  paginar(event) {
    const { first, rows } = event;
    const page = Number((Number(first) / Number(rows)) + 1);
    this.currentPage = page;
    this.loadItens(page);
  }

  search() {
    this.loadItens(1, this.searchedItem);
  }

  clear() {
    this.searchedItem = '';
    this.loadItens(1, this.searchedItem);
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedItens = value;
    this.selectedItens.forEach(i => {
      const index = this.unselectedItens.findIndex(unselectedItem => i.id == unselectedItem.id);
      if (index >= 0) {
        this.unselectedItens.splice(index, 1);
        this.emitDeselections();
      }
    });
    this.emitSelections();
  }

  onSelectAllChange(event) {
    const checked = event.checked;
    if (checked) {
      const sub = this.itemDePlanoService.list({}, { order: PageOrder.DESC, page: this.currentPage, take: 10 })
        .subscribe(data => {
          this.itens = data;
          this.selectAll = true;
        });
      this.subscriptions.add(sub);
    }
    else {
      this.selectedItens = [];
      this.selectAll = false;
    }
  }

  onRowUnselect({ data }) {
    const index = this.itens_associados.findIndex(i => i.id == data.id);
    if (index >= 0 && !this.unselectedItens.includes(data)) {
      this.unselectedItens.push(data);
      this.emitDeselections();
    }
  }

  detail(item: ItemDePlanoDto) {
    this.selectedItem = item;
    this.showDialog = true;
  }

  emitSelections() {
    this.selectedItensEvent.emit(this.selectedItens);
  }

  emitDeselections() {
    this.unselectedItensEvent.emit(this.unselectedItens);
  }

}
