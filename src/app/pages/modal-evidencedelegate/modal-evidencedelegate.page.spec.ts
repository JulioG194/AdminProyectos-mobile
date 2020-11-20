import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEvidencedelegatePage } from './modal-evidencedelegate.page';

describe('ModalEvidencedelegatePage', () => {
  let component: ModalEvidencedelegatePage;
  let fixture: ComponentFixture<ModalEvidencedelegatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEvidencedelegatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEvidencedelegatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
