import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss']
})
export class RankingPageComponent implements OnInit {

  user = new UserModel();

  constructor() { }

  ngOnInit() {
  }

}


// TO BE DELETED
export class UserModel {
  constructor(
    public displayName: string = 'Lol Boba',
    public userScore: number = 1545413,
    public userRank: number = 1564,
    public userReward = 150
  ){}
}
//