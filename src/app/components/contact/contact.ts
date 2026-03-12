import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  public contactForm: FormGroup;
  public addressLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Voeg deze toe
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      postCode: ['', [Validators.required, , Validators.pattern(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/)]],
      houseNumber: ['', Validators.required],
      street: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    const postCodeChanges = this.contactForm.get('postCode')!.valueChanges;
    const houseNumberChanges = this.contactForm.get('houseNumber')!.valueChanges;

    combineLatest([postCodeChanges, houseNumberChanges])
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      )
      .subscribe(() => {
        this.getAddressInfo();
      });
  }

  public getAddressInfo() {
    const { postCode, houseNumber } = this.contactForm.value;
    if (this.contactForm.get('postCode')?.valid && this.contactForm.get('houseNumber')?.valid) {
      this.addressLoading.set(true);
      const apiKey = '46d3324a-d88c-495c-bfdc-8ec78ab555c9';
      const headers = new HttpHeaders({
        Authorization: `Bearer ${apiKey}`,
      });
      const url = `https://postcode.tech/api/v1/postcode?postcode=${postCode}&number=${houseNumber}`;
      this.http.get(url, { headers }).subscribe({
        next: (res: any) => {
          this.contactForm.patchValue({
            street: res.street,
            city: res.city,
          });
          this.addressLoading.set(false);
        },
        error: () => {
          this.addressLoading.set(false);
        },
      });
    }
  }
}
