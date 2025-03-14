import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdministracaoFinanceiraPage } from './administracao-financeira.page';

describe('AdministracaoFinanceiraPage', () => {
  let component: AdministracaoFinanceiraPage;
  let fixture: ComponentFixture<AdministracaoFinanceiraPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracaoFinanceiraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministracaoFinanceiraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
