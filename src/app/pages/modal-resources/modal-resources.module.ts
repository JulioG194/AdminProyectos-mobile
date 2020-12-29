import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalResourcesPage } from './modal-resources.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    /* ModalActivityPageRoutingModule */
  ],
  declarations: [ModalResourcesPage]
})
export class ModalResourcesPageModule {}
