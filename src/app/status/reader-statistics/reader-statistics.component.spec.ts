import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderStatisticsComponent } from './reader-statistics.component';

describe('ReaderStatisticsComponent', () => {
  let component: ReaderStatisticsComponent;
  let fixture: ComponentFixture<ReaderStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
