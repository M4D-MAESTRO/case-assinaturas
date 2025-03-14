import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comunicacao-email',
  templateUrl: './comunicacao-email.page.html',
  styleUrls: ['./comunicacao-email.page.scss'],
})
export class ComunicacaoEmailPage implements OnInit {

  currentTab = 'email-send';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) { 
    this.currentTab =
      this.activatedRoute.snapshot.queryParamMap.get('tab') ||
      'email-send';
   }

  ngOnInit() {
  }

  changeTab(event) {
    this.currentTab = event.detail.value;
  }

}
