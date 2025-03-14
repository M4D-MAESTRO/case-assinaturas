import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItensDePlanoCadastroComponent } from './itens-de-plano-cadastro.component';

describe('ItensDePlanoCadastroComponent', () => {
  let component: ItensDePlanoCadastroComponent;
  let fixture: ComponentFixture<ItensDePlanoCadastroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItensDePlanoCadastroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItensDePlanoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
