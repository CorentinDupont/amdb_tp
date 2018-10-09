import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data:any;
  movies: string[];
  errorMessage: string;
  page = 1;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  subscription;
  searchString;

  constructor(public navCtrl: NavController, public api :ApiProvider) {
    console.log("init home page");
    this.getMovies();
    console.log("movies", this.movies);
    console.log("page", this.page);
    console.log("totalData", this.totalData);
    console.log("totalPage", this.totalPage);
  }

  /**
   * searchByString
   */
  public searchByString(searchInput) {
    this.movies = []
    this.page = 1;
    this.perPage = 0;
    this.totalData = 0;
    this.totalPage = 0;
    this.api.inputString = searchInput.target.value;
    console.log(this.api.inputString)
    this.getMovies()
  }


  getMovies() {
    this.subscription = this.api.getMovies(this.page)
       .subscribe(
         res => {
           console.log(res);
           this.data = res;
           this.movies = this.data.Search;
           this.perPage = 10;
           this.totalData = this.data.totalResults;
           this.totalPage = 20;
         },
         error =>  this.errorMessage = <any>error);
        }


  doInfinite(infiniteScroll) {
    this.page = this.page+1;
    setTimeout(() => {
      this.subscription.unsubscribe();
      this.subscription = this.api.getMovies(this.page)
         .subscribe(
           res => {
            console.log(res);
            this.data = res;
            this.perPage = 10;
            this.totalData = this.data.totalResults;
            this.totalPage = 20;
            for(let i=0; i<this.data.Search.length; i++) {
              this.movies.push(this.data.Search[i]);
            }
           },
           error =>  this.errorMessage = <any>error);
  
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  movieToString(movie){
    return JSON.stringify(movie)
  }

}
