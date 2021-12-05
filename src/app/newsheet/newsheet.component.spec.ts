import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsheetComponent } from './newsheet.component';

describe('NewsheetComponent', () => {
  let component: NewsheetComponent;
  let fixture: ComponentFixture<NewsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
