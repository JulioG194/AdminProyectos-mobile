import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ModalTeamPage } from '../pages/modal-team/modal-team.page';
import { ModalTeamPageModule } from '../pages/modal-team/modal-team.module';
import { TooltipsModule } from 'ionic-tooltips';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';
import { ModalResourcesPage } from '../pages/modal-resources/modal-resources.page';
import { ModalResourcesPageModule } from '../pages/modal-resources/modal-resources.module';


@NgModule({
  entryComponents: [
      ModalTeamPage,
      ModalProfilePage,
      ModalResourcesPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ModalProfilePageModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
    ModalTeamPageModule,
    TooltipsModule.forRoot(),
    ModalResourcesPageModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
