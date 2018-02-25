import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController} from 'ionic-angular';

/**
 * Generated class for the AddNewsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-news-modal',
  templateUrl: 'add-news-modal.html',
})
export class AddNewsModalPage {

  news = {title:"",description:"",cost:"",type:"",location:"",date:""};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public toasty:ToastController) {
  }

  ionViewDidLoad() {
  }

  goBack(){
    this.navCtrl.pop();
  }

  save(){
    if(this.news.title!=="" && this.news.description!=="" && this.news.date!==""){
      let toast = this.toasty.create({              //Create notification that the news event has been added:
        message: "News Item Added",
        duration: 1000,
        showCloseButton: true,
        position: 'bottom'
      });

      toast.present();          //Display notification:
      

      this.viewCtrl.dismiss(this.news);
    }

    else{                       //If the news item is invalid
      let alert = this.alertCtrl.create({
        title: 'Required Information Missing',
        subTitle: '(title/description/type/location)',
        buttons: ['OK']
      });

      alert.present();          //Display alert:
              
    }
  }

}
