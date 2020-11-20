import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

/* import { ModalNewprojectPageRoutingModule } from './modal-newproject-routing.module'; */

import { ModalNewprojectPage } from './modal-newproject.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule

    /* ModalNewprojectPageRoutingModule */
  ],
  declarations: [ModalNewprojectPage]
})
export class ModalNewprojectPageModule {}
