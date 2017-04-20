import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IoDevicesComponent } from './io-devices.component';

describe('IoDevicesComponent', () => {
  let component: IoDevicesComponent;
  let fixture: ComponentFixture<IoDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IoDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IoDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
