import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateService } from './date.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-date',
  template: `<span>{{date}}</span>`,
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit, OnDestroy {
  private _clockSubscription: Subscription = new Subscription;
  date: string = "";

  constructor(private dateService: DateService) { }

  ngOnInit(): void {
    this._clockSubscription = this.dateService.getDate().subscribe(
      (date: Date) => this.date = this.dateService.formatDate(date)
    );
  }

  ngOnDestroy(): void {
    this._clockSubscription.unsubscribe();
  }
}
