import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetInDetailComponent } from './sheet-in-detail.component';

describe('SheetInDetailComponent', () => {
  let component: SheetInDetailComponent;
  let fixture: ComponentFixture<SheetInDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetInDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
