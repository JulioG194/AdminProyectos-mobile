import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalTaskPage } from './modal-task.page';

describe('ModalTaskPage', () => {
  let component: ModalTaskPage;
  let fixture: ComponentFixture<ModalTaskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTaskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
