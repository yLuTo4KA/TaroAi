import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingProfileComponent } from './ranking-profile.component';

describe('RankingProfileComponent', () => {
  let component: RankingProfileComponent;
  let fixture: ComponentFixture<RankingProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingProfileComponent]
    });
    fixture = TestBed.createComponent(RankingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
