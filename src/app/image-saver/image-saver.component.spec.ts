import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSaverComponent } from './image-saver.component';

describe('ImageSaverComponent', () => {
  let component: ImageSaverComponent;
  let fixture: ComponentFixture<ImageSaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
