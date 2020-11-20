import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalNewprojectPage } from './modal-newproject.page';

describe('ModalNewprojectPage', () => {
  let component: ModalNewprojectPage;
  let fixture: ComponentFixture<ModalNewprojectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewprojectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNewprojectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
