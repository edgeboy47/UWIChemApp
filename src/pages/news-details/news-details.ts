import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from 'moment';

/**
 * Generated class for the NewsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  news = {id:"",title:"",cost:"",location:"",date: new Date().toISOString(), type:"",description:""};

  newsSub;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public dbProv: DatabaseProvider) {
  }

  ionViewDidLoad() {
    this.news.id = this.navParams.get('id');
    console.log(this.news.id);
    this.getData();
  }

  getData(){
    this.newsSub = this.dbProv.readObject('/News/'+this.news.id).subscribe(data=>{
      if(data){
        this.news.title = data['title'];
        this.news.type = data['type'];
        this.news.cost = data['cost'];
        this.news.location = data['location'];
        this.news.description = data['description'];
        this.news.date = moment(new Date(data['date'])).format('DD/MMM/YYYY');
      }
    });
  }
}
