import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the DegreesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-degrees',
  templateUrl: 'degrees.html',
})
export class DegreesPage {
  degreeSub;
  degrees:any = [];
  showdegrees = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db: AngularFireDatabase,
              ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DegreesPage');
    this.degreeSub = this.db.object('/Degrees').valueChanges().subscribe(data=>{
      this.degrees = [];
      if(data){
        for(let key in data){
          let d = data[key];
          d['Name'] = key;
          this.degrees.push(d);
        }
        this.showdegrees = this.degrees;
      }
    });
  }

}
