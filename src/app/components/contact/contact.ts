import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Mail } from '../../services/mail/mail';
import { Address } from '../../services/address/address';
import { MatIconModule } from '@angular/material/icon';

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
    MatSelectModule, MatProgressSpinnerModule, ReactiveFormsModule,
    RouterLink, MatIconModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private router = inject(Router);
  private mailService = inject(Mail);
  private addressService = inject(Address);

  public addressLoading = signal(false);
  public addressError = signal<string | null>(null);
  public isFormSent = signal<boolean>(false);

  public isButtonEnabled = signal<boolean>(false);
  public isButtonLoading = signal<boolean>(false);

  // Het hoofdformulier met Signal-integratie
  public contactForm = new FormGroup({
    firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    phone: new FormControl(''),
    zipCode: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/)],
      nonNullable: true
    }),
    houseNumber: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    street: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    message: new FormControl('', {validators: [Validators.required]}),
    termsAndConditions: new FormControl(false, Validators.requiredTrue),
  });

  private zipCodeValue = toSignal(this.contactForm.controls.zipCode.valueChanges);
  private houseNumberValue = toSignal(this.contactForm.controls.houseNumber.valueChanges);
  public selectedFile: any = null;

  constructor() {
    effect((onCleanup) => {
      const pc = this.zipCodeValue();
      const nr = this.houseNumberValue();

      const timeout = setTimeout(() => {
        if (this.contactForm.controls.zipCode.valid && this.contactForm.controls.houseNumber.valid) {
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

  public getAddressInfo(postCode: string, houseNumber: string) {
    if (!postCode || !houseNumber) return;

    this.addressService.getAddress(postCode, houseNumber).subscribe({
      next: (res: any) => {
        this.addressError.set(null);
        this.contactForm.patchValue({ street: res.street, city: res.city });
        this.addressLoading.set(false);
      },
      error: (error) => {
        console.error(error)
        this.addressError.set('Ongeldige postcode of huisnummer. Probeer het opnieuw.');
        this.addressLoading.set(false);
      }
    });

    this.addressLoading.set(true);
    this.addressError.set(null);
  }

  public onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  public deleteSelectedFile() {
    this.selectedFile = null;
  }

  public openPageInNewTab(page: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([page])
    );

    window.open(url, '_blank');
  }

  public onSubmit() {
    this.isButtonEnabled.set(false);
    this.isButtonLoading.set(true);

    if (this.contactForm.valid) {
      const rawValues = this.contactForm.getRawValue();

      // Sla de samengestelde naam één keer op
      const fullName = `${rawValues.firstName} ${rawValues.lastName}`.trim();
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('address', `${rawValues.street} ${rawValues.houseNumber}, ${rawValues.zipCode} ${rawValues.city}`);
      formData.append('email', rawValues.email);
      formData.append('phone', rawValues.phone ?? '');
      formData.append('message', rawValues.message ?? '');
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      

      this.mailService.sendEmailContact(formData).subscribe({
        next: () => {
          this.isButtonLoading.set(false);
          this.isButtonEnabled.set(true);
          this.router.navigate(['/bevestiging']);
        },
        error: (error) => {
          console.error('Er ging iets mis: ', error);
          this.isButtonLoading.set(false);
          this.isButtonEnabled.set(true);
        }
      });
    }
  }
}