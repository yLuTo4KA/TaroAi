/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RankingTopComponent } from './ranking-top.component';

describe('RankingTopComponent', () => {
  let component: RankingTopComponent;
  let fixture: ComponentFixture<RankingTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
