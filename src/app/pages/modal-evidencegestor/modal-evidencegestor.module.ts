import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/* import { ModalEvidencegestorPageRoutingModule } from './modal-evidencegestor-routing.module'; */

import { ModalEvidencegestorPage } from './modal-evidencegestor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    /* ModalEvidencegestorPageRoutingModule */
  ],
  declarations: [ModalEvidencegestorPage]
})
export class ModalEvidencegestorPageModule {}
