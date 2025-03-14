import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administracao-financeira',
  templateUrl: './administracao-financeira.page.html',
  styleUrls: ['./administracao-financeira.page.scss'],
})
export class AdministracaoFinanceiraPage implements OnInit {

  currentTab = 'transacoes'; 

  constructor(
  ) { }

  ngOnInit() {
  }

  changeTab(event) {
    this.currentTab = event.detail.value;
  }

}
