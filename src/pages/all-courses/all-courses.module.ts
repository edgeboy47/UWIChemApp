import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllCoursesPage } from './all-courses';

@NgModule({
  declarations: [
    AllCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllCoursesPage),
  ],
})
export class AllCoursesPageModule {}
