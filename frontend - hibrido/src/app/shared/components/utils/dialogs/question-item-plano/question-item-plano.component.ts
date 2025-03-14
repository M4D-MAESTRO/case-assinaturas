import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ItemDePlanoService } from './../../../../services/adm-assinatura/item-de-plano/item-de-plano.service';
import { ItemDePlanoDto } from './../../../../interfaces/adm-assinatura/item-de-plano/item-de-plano.dto';

@Component({
  selector: 'app-question-item-plano',
  templateUrl: './question-item-plano.component.html',
  styleUrls: ['./question-item-plano.component.scss'],
})
export class QuestionItemPlanoComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;

  @Input()
  selectedItemDePlano: ItemDePlanoDto;

  @Input()
  item_plano_id: string;

  @Output()
  closeEvent: EventEmitter<boolean> = new EventEmitter();

  private subscriptions = new Subscription();

  constructor(
    private readonly itemDePlanoService: ItemDePlanoService,
  ) { }

  ngOnInit() {
    if (this.selectedItemDePlano) {
      this.showDialog = true;
    } else {
      this.loadItemDePlano();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadItemDePlano() {
    if (!this.selectedItemDePlano && !this.item_plano_id) {
      this.close();
      return;
    }

    const sub = this.itemDePlanoService.findById(this.item_plano_id)
      .subscribe(data => {
        this.selectedItemDePlano = data;
        this.showDialog = true;
      });
    this.subscriptions.add(sub);
  }

  close() {
    this.showDialog = false;

    this.closeEvent.emit(this.showDialog);
  }
}
