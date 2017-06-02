import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderConfigurationComponent } from './reader-configuration.component';

describe('ReaderConfigurationComponent', () => {
  let component: ReaderConfigurationComponent;
  let fixture: ComponentFixture<ReaderConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
