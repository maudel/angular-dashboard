import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MconUpgradeComponent } from './mcon-upgrade.component';

describe('MconUpgradeComponent', () => {
  let component: MconUpgradeComponent;
  let fixture: ComponentFixture<MconUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MconUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MconUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
