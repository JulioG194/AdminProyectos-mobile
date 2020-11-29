import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/* import { ModalActivityPageRoutingModule } from './modal-activity-routing.module'; */

import { ModalActivityPage } from './modal-activity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    /* ModalActivityPageRoutingModule */
  ],
  declarations: [ModalActivityPage]
})
export class ModalActivityPageModule {}
