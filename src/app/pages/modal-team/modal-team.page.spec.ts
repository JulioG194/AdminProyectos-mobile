import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTeamPage } from './modal-team.page';

describe('ModalTeamPage', () => {
  let component: ModalTeamPage;
  let fixture: ComponentFixture<ModalTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTeamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
