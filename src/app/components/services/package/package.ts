import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-package',
  imports: [],
  templateUrl: './package.html',
  styleUrl: './package.scss',
})
export class Package {
  package = input<any>(null);

  selectedPackage = output<string>();

  selectPackage() {
    if (this.package()) {
      this.selectedPackage.emit(this.package()?.id);
    }
  }
}
