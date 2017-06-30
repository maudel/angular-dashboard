import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEngineComponent } from './rules-engine.component';

describe('RulesEngineComponent', () => {
  let component: RulesEngineComponent;
  let fixture: ComponentFixture<RulesEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
