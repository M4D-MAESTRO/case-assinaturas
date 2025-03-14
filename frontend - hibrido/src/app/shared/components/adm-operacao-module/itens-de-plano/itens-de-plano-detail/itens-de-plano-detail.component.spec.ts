import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItensDePlanoDetailComponent } from './itens-de-plano-detail.component';

describe('ItensDePlanoDetailComponent', () => {
  let component: ItensDePlanoDetailComponent;
  let fixture: ComponentFixture<ItensDePlanoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItensDePlanoDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItensDePlanoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
