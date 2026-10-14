import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Mail } from '../../services/mail/mail';
import { CleaningPackage, ServicePage, ServicesService } from '../../services/services/services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-flow',
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  templateUrl: './order-flow.html',
  styleUrl: './order-flow.scss',
})
export class OrderFlow {
  private services = inject(ServicesService);
  private mailService = inject(Mail)
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private queryParams = toSignal(this.route.queryParams, {
    initialValue: {} as Params
  });

  public isButtonLoading: WritableSignal<boolean> = signal(false);

  public selectedService = computed<ServicePage | undefined>(() => {
    const serviceId = this.queryParams()['serviceId'];
    if (!serviceId) return undefined;
    return this.services.getServiceById(serviceId);
  });

  public selectedPackage = computed<CleaningPackage | undefined>(() => {
    const packageName = this.queryParams()['packageName'];
    const service = this.selectedService();

    if (!service || !packageName) return undefined;

    return service.packages.find(p => p.id === packageName);
  });

  public contactForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    street: ['', Validators.required],
    houseNumber: ['', Validators.required],
    zipCode: ['', Validators.required],
    city: ['', Validators.required],
  });

  public optionsForm: FormGroup = this.fb.group({
    selectedOption: [null], // Verplicht indien opties aanwezig zijn
    selectedExtras: [[]]                        // Array van geselecteerde optionele extra's
  });

  public totalPrice!: Signal<any>;

  constructor() {
    // Gebruik je Angular Signals? Dan kun je met een effect() de validator dynamisch aanpassen:
    effect(() => {
      const pkg = this.selectedPackage(); // jouw signal
      const optionControl = this.optionsForm.get('selectedOption');

      if (pkg?.options?.length) {
        // Wel opties aanwezig -> Veld verplicht maken
        optionControl?.setValidators([Validators.required]);
      } else {
        // Geen opties aanwezig -> Validatie wissen & waarde resetten
        optionControl?.clearValidators();
        optionControl?.setValue(null);
      }

      // Update de validatiestatus van de FormControl
      optionControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.optionsForm.valueChanges.subscribe(() => {
      this.totalPrice = computed(() => {
        const basePrice = Number(this.selectedPackage()?.price || 0);

        const selectedOption = this.optionsForm.get('selectedOption')?.value;
        const optionPrice = selectedOption ? Number(selectedOption.price || 0) : 0;

        const extras = this.optionsForm.get('selectedExtras')?.value || [];
        const extrasPrice = extras.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);

        return (optionPrice ? 0 : basePrice) + optionPrice + extrasPrice;
      });
    })
  }

  // Helper methode om checkboxes (extra's) bij te houden in het formulier
  onExtraChange(extra: any, isChecked: boolean): void {
    const currentExtras: any[] = this.optionsForm.get('selectedExtras')?.value || [];

    if (isChecked) {
        this.optionsForm.patchValue({
          selectedExtras: [...currentExtras, extra]
        });
    } else {
      this.optionsForm.patchValue({
        selectedExtras: currentExtras.filter((e: any) => e.description !== extra.description)
      });
    }
    this.optionsForm.get('selectedExtras')?.markAsTouched();
  }

  onSubmitOrder(): void {
    this.isButtonLoading.set(true);
    if (this.contactForm.valid && this.optionsForm.valid) {
      const payload = {
        service: this.selectedService(),
        package: this.selectedPackage(),
        options: this.optionsForm.value,
        customerDetails: this.contactForm.value,
        totalPrice: this.totalPrice()
      };

      this.mailService.sendEmailOrder(payload).subscribe({
        next: () => {
          this.isButtonLoading.set(false);
          this.router.navigate(['/bevestiging'], { queryParams: { from: 'order' } });
        },
        error: (error) => {
          this.isButtonLoading.set(false);
          console.error('Er ging iets mis: ', error.error);
        }
      });
    }
  }
}
