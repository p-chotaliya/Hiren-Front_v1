import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetdataDetailsDialogComponent } from './sheetdata-details-dialog.component';

describe('SheetdataDetailsDialogComponent', () => {
  let component: SheetdataDetailsDialogComponent;
  let fixture: ComponentFixture<SheetdataDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetdataDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetdataDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
