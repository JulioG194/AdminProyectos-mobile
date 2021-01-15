import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/* import { ModalEvidencegestorPageRoutingModule } from './modal-evidencegestor-routing.module'; */

import { ModalEvidencegestorPage } from './modal-evidencegestor.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    /* ModalEvidencegestorPageRoutingModule */
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    })
  ],
  declarations: [ModalEvidencegestorPage]
})
export class ModalEvidencegestorPageModule {}
