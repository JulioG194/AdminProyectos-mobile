import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

/* import { ModalTaskPageRoutingModule } from './modal-task-routing.module'; */

import { ModalTaskPage } from './modal-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    /* ModalTaskPageRoutingModule */
  ],
  declarations: [ModalTaskPage]
})
export class ModalTaskPageModule {}
