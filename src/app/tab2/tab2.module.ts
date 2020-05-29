import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ModalTeamPage } from '../pages/modal-team/modal-team.page';
import { ModalTeamPageModule } from '../pages/modal-team/modal-team.module';

@NgModule({
  entryComponents: [
      ModalTeamPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
    ModalTeamPageModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
