import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalProfilePage } from './modal-profile.page';

describe('ModalProfilePage', () => {
  let component: ModalProfilePage;
  let fixture: ComponentFixture<ModalProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
