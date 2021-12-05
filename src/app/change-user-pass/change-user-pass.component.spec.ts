import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserPassComponent } from './change-user-pass.component';

describe('ChangeUserPassComponent', () => {
  let component: ChangeUserPassComponent;
  let fixture: ComponentFixture<ChangeUserPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeUserPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
