import { Component, Input, OnInit, SimpleChange, HostListener, Renderer2, ElementRef, ViewChild, Directive } from '@angular/core';

import { Weather } from '../weather/weather';
import { apiConfig } from '../config';
import {SimpleChanges } from "@angular/core"

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.scss']
})
export class CityCardComponent implements OnInit {
  @Input()
  weather!: Weather;
  @Input() unitSystem: string = "metric";
  @ViewChild('card__box') box!: ElementRef<HTMLInputElement>;

  measureOfTemp: string = "";
  measureOfWindSpeed: string = "";
  measureOfPressure: string = "";

  constructor(private renderer:Renderer2){}

  ngOnInit() {
    const measurementUnits = apiConfig.measurementUnits['metric'];

    this.measureOfTemp = measurementUnits.temperature;
    this.measureOfWindSpeed = measurementUnits.windSpeed;
    this.measureOfPressure = measurementUnits.pressure;
  }

  // @HostListener('mouseover', ['$event']) onMouseOver(event: MouseEvent) {
  //   let x = -(window.screen.width / 2 - event.screenX) / 10;
  //   let y = (window.screen.height / 2 - event.screenY) / 7;
  //   this.renderer.setStyle(this.box.nativeElement,'transform',`rotateY(${x}deg) rotateX(${y}deg)`);
  // }

  ngOnChanges(changes: SimpleChanges) {
    const {weather, metric} = changes;
    console.log(weather);
  }

  ngAfterViewInit() {
    console.log(this.box);
  }
}
