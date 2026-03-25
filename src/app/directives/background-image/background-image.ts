import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[setBackgroundImage]',
})
export class BackgroundImageDirective {
  @Input() imageUrl: string = 'main.jpg'; // Standaardafbeelding als er geen URL wordt opgegeven
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.setStyle(
        this.elementRef.nativeElement,
        'backgroundImage',
        `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(${this.imageUrl})`
    );
  }

  ngOnChanges() {
    this.renderer.setStyle(
        this.elementRef.nativeElement,
        'backgroundImage',
        `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(${this.imageUrl})`
    );
  }
}
