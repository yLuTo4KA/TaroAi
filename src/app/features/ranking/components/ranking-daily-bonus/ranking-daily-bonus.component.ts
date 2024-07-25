import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bonus, DailyBonus } from '../../services/models/daily-bonus.model';

@Component({
  selector: 'app-ranking-daily-bonus',
  templateUrl: './ranking-daily-bonus.component.html',
  styleUrls: ['./ranking-daily-bonus.component.scss']
})
export class RankingDailyBonusComponent {
  @Input() bonusData!: DailyBonus;
  @Output() closeModalEmit = new EventEmitter<void>();

  constructor() {}

  getCurrentBonus() {
    const currentBonus = this.bonusData.bonuses.find((el) => el.day === this.bonusData.current_day)
    return currentBonus
  }

  closeModal(): void {
    this.closeModalEmit.emit();
  }
}