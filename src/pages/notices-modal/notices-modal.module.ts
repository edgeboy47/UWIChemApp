import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticesModalPage } from './notices-modal';

@NgModule({
  declarations: [
    NoticesModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticesModalPage),
  ],
})
export class NoticesModalPageModule {}
