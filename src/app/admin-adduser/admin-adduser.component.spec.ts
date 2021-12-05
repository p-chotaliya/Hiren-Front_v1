import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdduserComponent } from './admin-adduser.component';

describe('AdminAdduserComponent', () => {
  let component: AdminAdduserComponent;
  let fixture: ComponentFixture<AdminAdduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAdduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAdduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
