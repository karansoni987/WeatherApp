import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppService } from '../shared/services/app.service';
import { LoaderService } from '../loader/loader.service';
import { HelperService } from '../shared/services/helper.service';
import { WeatherIconsService } from '../shared/services/weather-icons/weather-icons.service';

import { Weather } from './weather';
import { apiConfig, appConfig } from '../config';
import * as wiDataByCode from '../shared/services/weather-icons/weather-icons.service';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';

@Injectable()
export class WeatherService {
  private unitSystem: string;
  private weather: Subject<Weather> = new Subject<Weather>();
  private currentWeatherTimestamp: number = 0;
  private subscribers: any = {};
  private wiDataByCode: any;
  private weatherUpdateInterval = apiConfig.updateInterval.weather;

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private loaderService: LoaderService,
    private helperService: HelperService,
    private weatherIconsService: WeatherIconsService,
  ) {
    this.unitSystem = appService.getUnitSystem();
    this.wiDataByCode = wiDataByCode;
  }

  getWeather(): Observable<Weather> {
    return this.weather.asObservable();
  }

  getCurrentWeatherTimestamp(): number {
    return this.currentWeatherTimestamp;
  }

  getWeatherByСurrentLocation(): Promise<any> {
    this.showLoader();
    if (this.subscribers.city) {
      this.subscribers.city.unsubscribe();
    }

    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        this.subscribers.city = this.getWeatherByLocation(latitude, longitude).subscribe((weather: Weather) => {
          resolve(weather.city);

          this.hideLoader();
        });
      }, (error) => {
        if (error.code === 1) { // if user didn't approve geolocation
          this.subscribers.city = this.getWeatherByLocation(
            appConfig.defaultCity.coord.latitude,
            appConfig.defaultCity.coord.longitude
          ).subscribe((weather: Weather) => {
            resolve(weather.city);

            this.hideLoader();
          });
        } else {
          console.error(error);
          this.hideLoader();
        }
      });
    });
  }

  createResponseWeatherByCity(city: string): Promise<any> {
    this.showLoader();
    if (this.subscribers.city) {
      this.subscribers.city.unsubscribe();
    }

    return new Promise((resolve, reject) => {
      this.subscribers.city = this.getWeatherByCity(city).subscribe((weather: Weather) => {
        resolve(weather);

        this.hideLoader();
      }, (error: Error) => {
        reject(error);
        this.hideLoader();
      });
    });
  }

  getWeatherByLocation(latitude: number, longitude: number): Observable<Weather> {
    return this.http.get<any>(
      `${apiConfig.host}/weather?appid=${apiConfig.appId}&lat=${latitude}&lon=${longitude}&units=${this.unitSystem}`
    )
      .pipe(map((data: any) => this.handleResponseWeatherData(data)))
      .pipe(map((weather: Weather) => {
        this.weather.next(weather);
        return weather;
      }));
  }

  getWeatherByCity(city: string): Observable<Weather> {
    console.log(city);
    return this.http.get(`${apiConfig.host}/weather?appid=${apiConfig.appId}&q=${city}&units=${this.unitSystem}`)
      .pipe(
        map((data: any) => {
          const weather = this.handleResponseWeatherData(data);
          this.weather.next(weather);
          return weather;
        })
      );
  }
  

  private handleResponseWeatherData(responseData: any): Weather {
    const { name, main, weather, wind, sys, dt } = responseData;

    this.currentWeatherTimestamp = dt;

    const updateAt = new Date().getTime();
    const iconClassname = this.weatherIconsService.getIconClassNameByCode(weather[0].id, sys.sunset);
    const temperature = Math.round(main.temp);
    const pressureInHpa = Math.round(main.pressure);
    const pressure = (this.unitSystem === appConfig.defaultUnit) ?
      this.helperService.getPressureInMmHg(pressureInHpa) :
      pressureInHpa;
    const windDegrees = Math.round(wind.deg);
    const windDirection = this.helperService.getWindDirection(windDegrees);
    const windBeaufortScale = this.helperService.getWindBeaufortScaleByMeterInSecond(wind.speed);
    const sunriseTime = sys.sunrise * 1000;
    const sunsetTime = sys.sunset * 1000;

    return new Weather(
      updateAt,
      name,
      iconClassname,
      temperature,
      main.humidity,
      pressure,
      weather[0].description,
      sunriseTime,
      sunsetTime,
      windDirection,
      wind.speed,
      windBeaufortScale
    );
  }

  private handleError(error: any): Observable<any> {
    return throwError(error.message || error);
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}