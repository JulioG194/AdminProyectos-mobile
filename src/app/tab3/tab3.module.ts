import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ModalNewprojectPageModule } from '../pages/modal-newproject/modal-newproject.module';
import { ModalNewprojectPage } from '../pages/modal-newproject/modal-newproject.page';
import { ModalEvidencedelegatePage } from '../pages/modal-evidencedelegate/modal-evidencedelegate.page';
import { ModalEvidencedelegatePageModule } from '../pages/modal-evidencedelegate/modal-evidencedelegate.module';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';

@NgModule({
  entryComponents: [
    ModalNewprojectPage,
    ModalEvidencedelegatePage,
    ModalProfilePage
],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ModalProfilePageModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    ModalNewprojectPageModule,
    ModalEvidencedelegatePageModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
