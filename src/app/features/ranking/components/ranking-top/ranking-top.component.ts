import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../pages/ranking-page/ranking-page.component';

@Component({
  selector: 'app-ranking-top',
  templateUrl: './ranking-top.component.html',
  styleUrls: ['./ranking-top.component.scss']
})
export class RankingTopComponent implements OnInit {

  @Input() user = new UserModel();

  constructor() { }

  ngOnInit() {
  }

}
