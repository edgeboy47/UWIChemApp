import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCoursesPage } from './user-courses';

@NgModule({
  declarations: [
    UserCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserCoursesPage),
  ],
})
export class UserCoursesPageModule {}
