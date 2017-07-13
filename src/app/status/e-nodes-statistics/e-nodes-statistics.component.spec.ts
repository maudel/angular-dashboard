import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ENodesStatisticsComponent } from './e-nodes-statistics.component';

describe('ENodesStatisticsComponent', () => {
  let component: ENodesStatisticsComponent;
  let fixture: ComponentFixture<ENodesStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ENodesStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ENodesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
