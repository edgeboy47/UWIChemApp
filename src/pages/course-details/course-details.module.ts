import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseDetailsPage } from './course-details';

@NgModule({
  declarations: [
    CourseDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseDetailsPage),
  ],
})
export class CourseDetailsPageModule {}
