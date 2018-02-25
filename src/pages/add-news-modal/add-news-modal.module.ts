import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewsModalPage } from './add-news-modal';

@NgModule({
  declarations: [
    AddNewsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewsModalPage),
  ],
})
export class AddNewsModalPageModule {}
