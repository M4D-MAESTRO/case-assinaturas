import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssinaturasGestaoMainComponent } from './assinaturas-gestao-main.component';

describe('AssinaturasGestaoMainComponent', () => {
  let component: AssinaturasGestaoMainComponent;
  let fixture: ComponentFixture<AssinaturasGestaoMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssinaturasGestaoMainComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssinaturasGestaoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
