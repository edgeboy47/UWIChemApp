import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentsPage } from './departments';

@NgModule({
  declarations: [
    DepartmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentsPage),
  ],
})
export class DepartmentsPageModule {}
