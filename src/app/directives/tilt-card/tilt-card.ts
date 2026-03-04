
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tiltCard]'
})
export class TiltCardDirective {
  private frameId: number | null = null;
  private targetClientX = 0;
  private targetClientY = 0;
  private maxTilt = 3;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform 90ms linear'
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.targetClientX = event.clientX;
    this.targetClientY = event.clientY;

    if (this.frameId !== null) return;

    this.frameId = requestAnimationFrame(() => {
      const card = this.el.nativeElement;
      const bounds = card.getBoundingClientRect();

      const relativeX = this.targetClientX - bounds.left;
      const relativeY = this.targetClientY - bounds.top;

      const normalizedX = (relativeX / bounds.width) * 2 - 1;
      const normalizedY = (relativeY / bounds.height) * 2 - 1;

      const rotateY = normalizedX * this.maxTilt;
      const rotateX = -normalizedY * this.maxTilt;

      this.renderer.setStyle(
        card,
        'transform',
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`
      );

      this.frameId = null;
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    const card = this.el.nativeElement;

    this.renderer.setStyle(card, 'transition', 'transform 280ms ease');
    this.renderer.setStyle(
      card,
      'transform',
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    );
  }
}
