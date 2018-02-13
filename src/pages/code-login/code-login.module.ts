import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodeLoginPage } from './code-login';

@NgModule({
  declarations: [
    CodeLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(CodeLoginPage),
  ],
})
export class CodeLoginPageModule {}
