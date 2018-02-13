import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentEventModalPage } from './department-event-modal';

@NgModule({
  declarations: [
    DepartmentEventModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentEventModalPage),
  ],
})
export class DepartmentEventModalPageModule {}
