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

@NgModule({
  entryComponents: [
      ModalTeamPage,
      ModalProfilePage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ModalProfilePageModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
    ModalTeamPageModule,
    TooltipsModule.forRoot()
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
