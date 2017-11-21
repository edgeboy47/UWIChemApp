import { ToastController } from "ionic-angular";
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  show(message: string, duration: number = 2000){
    return this.toastCtrl.create({
      message,
      duration
    }).present();
  }
}
