import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/* import { ModalEvidencedelegatePageRoutingModule } from './modal-evidencedelegate-routing.module'; */

import { ModalEvidencedelegatePage } from './modal-evidencedelegate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    /* ModalEvidencedelegatePageRoutingModule */
  ],
  declarations: [ModalEvidencedelegatePage]
})
export class ModalEvidencedelegatePageModule {}
