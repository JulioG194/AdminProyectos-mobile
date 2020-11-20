import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEvidencegestorPage } from './modal-evidencegestor.page';

describe('ModalEvidencegestorPage', () => {
  let component: ModalEvidencegestorPage;
  let fixture: ComponentFixture<ModalEvidencegestorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEvidencegestorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEvidencegestorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
