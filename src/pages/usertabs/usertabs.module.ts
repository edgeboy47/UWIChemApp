import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsertabsPage } from './usertabs';

@NgModule({
  declarations: [
    UsertabsPage,
  ],
  imports: [
    IonicPageModule.forChild(UsertabsPage),
  ],
})
export class UsertabsPageModule {}
