import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../pages/ranking-page/ranking-page.component';

@Component({
  selector: 'app-ranking-item',
  templateUrl: './ranking-item.component.html',
  styleUrls: ['./ranking-item.component.scss']
})
export class RankingItemComponent implements OnInit {

  @Input() user = new UserModel();

  constructor() { }

  ngOnInit() {
  }

}
