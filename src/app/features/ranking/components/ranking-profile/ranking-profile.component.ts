import { Component, Input } from '@angular/core';
import { UserData } from 'src/app/core/models/userData.model';
import { UserItem } from 'src/app/core/models/userItem.model';

@Component({
  selector: 'app-ranking-profile',
  templateUrl: './ranking-profile.component.html',
  styleUrls: ['./ranking-profile.component.scss']
})
export class RankingProfileComponent {
  @Input() user!: UserItem;
}
