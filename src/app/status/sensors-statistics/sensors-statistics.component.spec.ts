import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsStatisticsComponent } from './sensors-statistics.component';

describe('SensorsStatisticsComponent', () => {
  let component: SensorsStatisticsComponent;
  let fixture: ComponentFixture<SensorsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
