import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalActivityPage } from './modal-activity.page';

describe('ModalActivityPage', () => {
  let component: ModalActivityPage;
  let fixture: ComponentFixture<ModalActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalActivityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
