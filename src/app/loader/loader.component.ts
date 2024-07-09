import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderService } from './loader.service';
import { LoaderState } from './loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  private subscription: Subscription = new Subscription;
  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: "[customSpinner]"
})
export class CustomSpinnerDirective implements AfterViewInit {

  @Input() color: string = ""

  constructor(
    private elem: ElementRef
  ) { }

  ngAfterViewInit() {
    if (!!this.color) {
      const element = this.elem.nativeElement;
      const circle = element.querySelector("circle");
      circle.style.stroke = this.color;
    }
  }

}