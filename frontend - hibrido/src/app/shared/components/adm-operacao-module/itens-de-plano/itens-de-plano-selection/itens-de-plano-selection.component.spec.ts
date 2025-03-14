import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItensDePlanoSelectionComponent } from './itens-de-plano-selection.component';

describe('ItensDePlanoSelectionComponent', () => {
  let component: ItensDePlanoSelectionComponent;
  let fixture: ComponentFixture<ItensDePlanoSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItensDePlanoSelectionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItensDePlanoSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
