import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeViewModalPage } from './notice-view-modal';

@NgModule({
  declarations: [
    NoticeViewModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeViewModalPage),
  ],
})
export class NoticeViewModalPageModule {}
