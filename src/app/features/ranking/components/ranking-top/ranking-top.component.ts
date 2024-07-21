import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking-top',
  templateUrl: './ranking-top.component.html',
  styleUrls: ['./ranking-top.component.scss']
})
export class RankingTopComponent implements OnInit {

  @Input() user: any;

  constructor() { }

  ngOnInit() {
  }

}
