import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDegreePage } from './edit-degree';

@NgModule({
  declarations: [
    EditDegreePage,
  ],
  imports: [
    IonicPageModule.forChild(EditDegreePage),
  ],
})
export class EditDegreePageModule {}
