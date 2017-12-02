import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCourseModalPage } from './add-course-modal';

@NgModule({
  declarations: [
    AddCourseModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCourseModalPage),
  ],
})
export class AddCourseModalPageModule {}
