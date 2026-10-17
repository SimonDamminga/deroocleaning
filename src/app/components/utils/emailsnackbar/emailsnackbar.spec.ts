import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emailsnackbar } from './emailsnackbar';

describe('Emailsnackbar', () => {
  let component: Emailsnackbar;
  let fixture: ComponentFixture<Emailsnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emailsnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emailsnackbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
