import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDegreeModalPage } from './add-degree-modal';

@NgModule({
  declarations: [
    AddDegreeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDegreeModalPage),
  ],
})
export class AddDegreeModalPageModule {}
