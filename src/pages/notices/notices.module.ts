import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticesPage } from './notices';

@NgModule({
  declarations: [
    NoticesPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticesPage),
  ],
})
export class NoticesPageModule {}
