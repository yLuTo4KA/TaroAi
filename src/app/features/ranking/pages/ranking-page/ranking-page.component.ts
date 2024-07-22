import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/core/models/userData.model';
import { UserItem } from 'src/app/core/models/userItem.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss']
})
export class RankingPageComponent implements OnInit {
  userData!: UserItem;
  openPaymentModal: boolean = false;
  openProfileModal: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.userData$.subscribe(userData => this.userData = {
      "user_name": userData!.name,
      "telegram_id": userData!.telegram_id,
      "avatar_url": userData!.avatar_url,
      "stars": userData!.start_total,
      "global_rank": userData!.global_rank
    });
  }

}


// TO BE DELETED
export class UserModel {
  constructor(
    public telegram_id: number = 123123,
    public user_name: string = "boba",
    public avatar_url: string = "",
    public stars: number = 100
  ){}
}
//