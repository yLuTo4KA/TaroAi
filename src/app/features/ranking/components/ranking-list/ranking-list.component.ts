import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../pages/ranking-page/ranking-page.component';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
})
export class RankingListComponent implements OnInit {
  users = [
    new UserModel(),
     new UserModel(), 
    new UserModel(),
     new UserModel(), 
    new UserModel(),
     new UserModel(), 
    new UserModel(),
     new UserModel(), 
    new UserModel(),
     new UserModel(), 
     new UserModel()
    ];

  constructor() {}

  ngOnInit() {}
}
