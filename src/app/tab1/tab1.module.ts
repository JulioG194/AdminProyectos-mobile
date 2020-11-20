import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ChartsModule } from 'ng2-charts';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';

@NgModule({
  entryComponents: [
    ModalProfilePage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    ChartsModule,
    ModalProfilePageModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
