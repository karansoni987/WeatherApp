import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-forecast-item',
  templateUrl: './forecast-item.component.html',
  styleUrls: ['./forecast-item.component.scss']
})
export class ForecastItemComponent {
  @Input() currentDay: boolean = false;
  @Input() date: number | undefined;
  @Input() temperatureDay: number | undefined;
  @Input() temperatureNight: number | undefined;
  @Input() description: string | undefined;
  @Input() iconClassname: string | undefined;
  @Input() measureOfTemp: string | undefined;
}
