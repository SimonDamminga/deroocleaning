import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal, effect, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ServicesService } from '../../services/services';
import { Package } from '../services/package/package';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of, delay } from 'rxjs';

/** Validator om te checken of er minimaal één checkbox aan staat */
function minSelectedValidator(min = 1): ValidatorFn {
  return (control: AbstractControl) => {
    const totalSelected = Object.values(control.value || {}).filter(v => v === true).length;
    return totalSelected >= min ? null : { minSelected: true };
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatCheckboxModule,
    MatSelectModule, MatProgressSpinnerModule, ReactiveFormsModule, Package
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private services = inject(ServicesService);

  public addressLoading = signal(false);
  public addressError = signal<string | null>(null);
  public package = signal<any>(null);

  // Het hoofdformulier met Signal-integratie
  public contactForm = new FormGroup({
    firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    phone: new FormControl(''),
    postCode: new FormControl('', { 
      validators: [Validators.required, Validators.pattern(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/)], 
      nonNullable: true 
    }),
    houseNumber: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    street: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    message: new FormControl(''),
    // Dynamische groepen voor de checkboxes
    options: new FormGroup({}, minSelectedValidator(1)),
    optionalExtras: new FormGroup({}, minSelectedValidator(1))
  });

  private postCodeValue = toSignal(this.contactForm.controls.postCode.valueChanges);
  private houseNumberValue = toSignal(this.contactForm.controls.houseNumber.valueChanges);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const selected = this.services.getServiceById(params['serviceId'])
        ?.packages.find(pkg => pkg.id === params['packageName']);
      
      if (selected) {
        this.package.set(selected);
        this.buildDynamicCheckboxes(selected);
      }
    });

    effect((onCleanup) => {
      const pc = this.postCodeValue();
      const nr = this.houseNumberValue();
      
      const timeout = setTimeout(() => {
        if (this.contactForm.controls.postCode.valid && this.contactForm.controls.houseNumber.valid) {
          this.getAddressInfo(pc as string, nr as string);
        }
      }, 500);

      onCleanup(() => clearTimeout(timeout));
    });
  }

  private buildDynamicCheckboxes(pkg: any) {
    const optionsGroup = this.contactForm.controls.options;
    const extrasGroup = this.contactForm.controls.optionalExtras;

    Object.keys(optionsGroup.controls).forEach(key => optionsGroup.removeControl(key));
    Object.keys(extrasGroup.controls).forEach(key => extrasGroup.removeControl(key));

    pkg.options?.forEach((opt: any) => {
      optionsGroup.addControl(opt.description, new FormControl(false));
    });

    pkg.optionalExtras?.forEach((extra: any) => {
      extrasGroup.addControl(extra.description, new FormControl(false));
    });
  }

  public getAddressInfo(postCode: string, houseNumber: string) {
    this.addressLoading.set(true);
    const apiKey = '46d3324a-d88c-495c-bfdc-8ec78ab555c9';
    const headers = new HttpHeaders({ Authorization: `Bearer ${apiKey}` });
    const url = `https://postcode.tech/api/v1/postcode?postcode=${postCode}&number=${houseNumber}`;

    this.http.get(url, { headers }).subscribe({
      next: (res: any) => {
        this.addressError.set(null);
        this.contactForm.patchValue({ street: res.street, city: res.city });
        this.addressLoading.set(false);
      },
      error: () => {
        this.addressError.set('Ongeldige postcode of huisnummer. Probeer het opnieuw.');
        this.addressLoading.set(false);
      }
    });
  }

  public onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Data:', this.contactForm.getRawValue());
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}