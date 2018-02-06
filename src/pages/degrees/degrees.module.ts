import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DegreesPage } from './degrees';

@NgModule({
  declarations: [
    DegreesPage,
  ],
  imports: [
    IonicPageModule.forChild(DegreesPage),
  ],
})
export class DegreesPageModule {}
