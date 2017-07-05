import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Star3000UpgradeComponent } from './star-3000-upgrade.component';

describe('Star3000UpgradeComponent', () => {
  let component: Star3000UpgradeComponent;
  let fixture: ComponentFixture<Star3000UpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Star3000UpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Star3000UpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
