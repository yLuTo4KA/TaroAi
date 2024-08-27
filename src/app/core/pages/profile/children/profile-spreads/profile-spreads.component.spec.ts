import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSpreadsComponent } from './profile-spreads.component';

describe('ProfileSpreadsComponent', () => {
  let component: ProfileSpreadsComponent;
  let fixture: ComponentFixture<ProfileSpreadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSpreadsComponent]
    });
    fixture = TestBed.createComponent(ProfileSpreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
