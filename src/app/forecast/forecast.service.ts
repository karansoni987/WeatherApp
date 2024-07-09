import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http"
import { Observable } from 'rxjs';
import { interval, throwError } from 'rxjs';

import { AppService } from '../shared/services/app.service';
import { WeatherService } from '../weather/weather.service';
import { HelperService } from '../shared/services/helper.service';
import { WeatherIconsService } from '../shared/services/weather-icons/weather-icons.service';
import { Forecast } from './forecast';

import { apiConfig } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ForecastService {
  private forecastUpdateInterval = apiConfig.updateInterval.forecast;
  private unitSystem: string;

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private weatherService: WeatherService,
    private weatherIconsService: WeatherIconsService,
    private helperService: HelperService
  ) {
    this.unitSystem = appService.getUnitSystem();
  }

  getForecastByCity(city: string): Observable<any> {
    return this.http.get(
      `${apiConfig.host}/forecast/daily?q=${city}&appid=${apiConfig.appId}&units=${this.unitSystem}&cnt=${apiConfig.amountForecastDays}`
    )
  }

  handleResponseForecastData(responseData: any): Forecast {
    const { dt, temp, weather } = responseData;
    const currentWeatherTimestamp = this.weatherService.getCurrentWeatherTimestamp();

    const currentDay = this.helperService.isItCurrentDayByTimestamps(dt, currentWeatherTimestamp);
    const date = dt * 1000;
    const iconClassname = this.weatherIconsService.getIconClassNameByCode(weather[0].id);
    const temperatureDay = Math.round(temp.day);
    const temperatureNight = Math.round(temp.night);

    return new Forecast(
      currentDay,
      date,
      iconClassname,
      temperatureDay,
      temperatureNight,
      weather[0].description
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('Error', error);
    return throwError(error.message || error);
  }
}
