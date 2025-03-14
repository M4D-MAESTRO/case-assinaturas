import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administracao-operacao',
  templateUrl: './administracao-operacao.page.html',
  styleUrls: ['./administracao-operacao.page.scss'],
})
export class AdministracaoOperacaoPage implements OnInit {

  currentTab = 'planos';
  enableItem = false;

  constructor(
  ) { }

  ngOnInit() {
  }

  changeTab(event) {
    this.currentTab = event.detail.value;
  }


}
