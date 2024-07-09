import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchText = '';
  private readonly searchSubject = new Subject<string | undefined>();
  private searchSubscription?: Subscription;

  constructor(
    private router: Router
  ) { }


  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onClickCleanBtn() {
    this.searchText = '';
  }

  onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }

  onKeyPress(e: any) {
    if (e.keyCode === 13 && e.target.value) {
      const city = e.target.value;

      this.router.navigate([`/${city}`]);
      this.searchText = '';
    }
  }

  public ngOnInit(): void {
    const combinedObs = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchQuery) =>
        combineLatest([of(searchQuery), this.search(searchQuery)])
      )
    );

    this.searchSubscription = combinedObs.subscribe();
  }

  public async search(query?: string) {
    console.log(`${new Date()} Search: ${query}`);

    if (query === undefined || query.length === 0) {
      return;
    }

    this.router.navigate([`/${query}`]);
  }
}
