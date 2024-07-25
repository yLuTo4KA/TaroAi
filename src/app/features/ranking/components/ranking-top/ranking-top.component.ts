import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserItem } from 'src/app/core/models/userItem.model';
import { UserModel } from '../../pages/ranking-page/ranking-page.component';

@Component({
  selector: 'app-ranking-top',
  templateUrl: './ranking-top.component.html',
  styleUrls: ['./ranking-top.component.scss']
})
export class RankingTopComponent implements OnInit {
  @Input() user!: UserItem;
  @Input() userTop: UserModel[] | null = null;
  @Output() openPaymentModalEmit = new EventEmitter<void>();
  @Output() openProfileEmit = new EventEmitter<UserModel>();

  constructor() { }

  ngOnInit() {
  }

  openPaymentModal(): void {
    this.openPaymentModalEmit.emit();
  }

  openProfile(userData: UserModel): void {
    this.openProfileEmit.emit(userData);
  }

}
