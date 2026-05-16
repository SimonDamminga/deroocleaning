import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal, effect, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    MatSelectModule, MatProgressSpinnerModule, ReactiveFormsModule, Package,
    RouterLink
],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  // This key is public and can be in the code.
  private readonly WEB3FORMS_ACCESS_KEY = 'e0acc89b-fa48-4832-ac31-9fd3ad68ee0a';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private services = inject(ServicesService);
  private router = inject(Router);

  public addressLoading = signal(false);
  public addressError = signal<string | null>(null);
  public package = signal<any>(null);
  public isFormSent = signal<boolean>(false);

  public isButtonEnabled = signal<boolean>(false);
  public isButtonLoading = signal<boolean>(false);

  private sendEmail: boolean = false;

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
    options: new FormGroup({}, minSelectedValidator(0)),
    optionalExtras: new FormGroup({}, minSelectedValidator(0)),
    termsAndConditions: new FormControl(false, Validators.requiredTrue)
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

  ngOnInit() {
    this.contactForm.valueChanges.subscribe(() => {
      this.isButtonEnabled.set(this.contactForm.valid);
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

    if (pkg.options.length !== 0) {
      optionsGroup.setValidators(minSelectedValidator(1));
    }
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
    this.isButtonEnabled.set(false);
    this.isButtonLoading.set(true);

    if (this.contactForm.valid) {
      const rawValues = this.contactForm.getRawValue();

      // Haal direct de keys op waarvan de waarde true is, en zet ze om naar een string
      const selectedOptionsString = Object.entries(rawValues.options || {})
        .filter(([, val]) => val)
        .map(([key]) => key)
        .join(', ');

      const selectedOptionalOptionsString = Object.entries(rawValues.optionalExtras || {})
        .filter(([, val]) => val)
        .map(([key]) => key)
        .join(', ');

      // Sla de samengestelde naam één keer op
      const fullName = `${rawValues.firstName} ${rawValues.lastName}`.trim();

      const formData = {
        access_key: this.WEB3FORMS_ACCESS_KEY,
        from_name: fullName,
        name: fullName,
        selectedPackage: this.package()?.name,
        selectedOptions: selectedOptionsString,
        selectedOptionalOptions: selectedOptionalOptionsString,
        address: `${rawValues.street} ${rawValues.houseNumber}, ${rawValues.postCode} ${rawValues.city}`,
        email: rawValues.email,
        phone: rawValues.phone,
        message: rawValues.message
      };

      if (this.sendEmail) {
        this.http.post('https://api.web3forms.com/submit', formData).subscribe({
          next: (response) => {
            console.log('Succesvol verzonden!', response);
            this.isFormSent.set(true);
            this.isButtonLoading.set(false);
            this.isButtonEnabled.set(true);
          },
          error: (error) => {
            console.error('Er ging iets mis:', error);
            this.isButtonLoading.set(false);
            this.isButtonEnabled.set(true);
          }
        });
      } else {
        console.log(formData);
        this.isFormSent.set(true);
        this.isButtonLoading.set(false);
        this.isButtonEnabled.set(true);
      }
    }
  }
}