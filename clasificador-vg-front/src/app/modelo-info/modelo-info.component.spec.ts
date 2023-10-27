import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloInfoComponent } from './modelo-info.component';

describe('ModeloInfoComponent', () => {
  let component: ModeloInfoComponent;
  let fixture: ComponentFixture<ModeloInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeloInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeloInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
