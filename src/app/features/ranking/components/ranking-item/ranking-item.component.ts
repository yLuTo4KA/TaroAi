import { Component, Input, OnInit } from '@angular/core';
import { UserData } from 'src/app/core/models/userData.model';
import { UserItem } from 'src/app/core/models/userItem.model';

@Component({
  selector: 'app-ranking-item',
  templateUrl: './ranking-item.component.html',
  styleUrls: ['./ranking-item.component.scss']
})
export class RankingItemComponent implements OnInit {

  @Input() user!: UserItem;
  @Input() currentUser = false;

  constructor() { }

  ngOnInit() {
  }

}
