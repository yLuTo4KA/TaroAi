import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})

export class StatCardComponent implements OnInit {

  @Input() user = new UserModel();
  @Input() isTop = true;
  @Input() place!: number;


  //TODO model for placeObj
  get placeObj(): {class:string, width: number, height: number} {
    if(this.place) {
      switch(this.place) {
        case 1: return {class: 'place place_gold', width: 7, height: 7 }
        case 2: return {class: 'place place_silver', width: 6, height: 6 }
        case 3: return {class: 'place place_bronze', width: 5, height: 5 }
        default: return {class: '', width: 0, height: 0 };
      }
    }
    else return {class: '', width: 0, height: 0 };
  }

  constructor() { }

  ngOnInit() {
  }

}

// TO BE DELETED
class UserModel {
  constructor(
    public displayName: string = 'Lol Boba',
    public userScore: number = 1545413,
    public userReward = 150
  ){}
}
//