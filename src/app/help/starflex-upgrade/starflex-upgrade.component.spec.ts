import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarflexUpgradeComponent } from './starflex-upgrade.component';

describe('StarflexUpgradeComponent', () => {
  let component: StarflexUpgradeComponent;
  let fixture: ComponentFixture<StarflexUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarflexUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarflexUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
