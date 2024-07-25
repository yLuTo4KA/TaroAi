import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingDailyBonusComponent } from './ranking-daily-bonus.component';

describe('RankingDailyBonusComponent', () => {
  let component: RankingDailyBonusComponent;
  let fixture: ComponentFixture<RankingDailyBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingDailyBonusComponent]
    });
    fixture = TestBed.createComponent(RankingDailyBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
