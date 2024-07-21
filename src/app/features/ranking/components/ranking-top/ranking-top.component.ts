import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserItem } from 'src/app/core/models/userItem.model';

@Component({
  selector: 'app-ranking-top',
  templateUrl: './ranking-top.component.html',
  styleUrls: ['./ranking-top.component.scss']
})
export class RankingTopComponent implements OnInit {

  @Input() user!: UserItem;
  @Output() openPaymentModalEmit = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  openPaymentModal(): void {
    this.openPaymentModalEmit.emit();
  }

}
