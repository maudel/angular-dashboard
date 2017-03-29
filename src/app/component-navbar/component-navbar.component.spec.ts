import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentNavbarComponent } from './component-navbar.component';

describe('ComponentNavbarComponent', () => {
  let component: ComponentNavbarComponent;
  let fixture: ComponentFixture<ComponentNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
