import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AleStatisticsComponent } from './ale-statistics.component';

describe('AleStatisticsComponent', () => {
  let component: AleStatisticsComponent;
  let fixture: ComponentFixture<AleStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AleStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AleStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
