import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable()
export class ClockService {
  private clock: Observable<Date>;

  constructor() {
    this.clock = interval(0).pipe(map(() => new Date()));
  }

  getClock(): Observable<Date> {
    return this.clock;
  }
}
