import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { selectReviewtrip, selectTrip } from '@appBase/+state/select';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'pe-review-trip',
  templateUrl: './review-trip.component.html',
  styleUrls: ['./review-trip.component.scss'],
})
export class ReviewTripComponent implements OnInit {
  panelOpenState = false;
  trip: any;
  tripTitle: any;
  tripReview: any;
  delayTime = 0;
  savedMoney = 0;
  totalMoney: any = 0;
  tolerance = {
    movement: 0,
    price: 0,
    time: 0,
  };
  sumCost = 0;
  constructor(private route: ActivatedRoute, private store: Store) {}
  dateDifference(
    date1: any,
    time1: any,
    date2: any,
    time2: any,
    show: boolean
  ) {
    let diffDays: any;
    const date1_: any = new Date(date1 + ' ' + time1);
    const date2_: any = new Date(date2 + ' ' + time2);

    const diffTime = date2_ - date1_;
    if (show) {
      diffDays =
        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) +
        ' D ,' +
        Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / 3600000) +
        ' H ,' +
        Math.ceil((diffTime % (1000 * 60 * 60 * 24)) % 3600000) / 60000 +
        ' M';
    } else {
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return diffDays;
  }
  measuring() {
    this.totalMoney = this.tripReview?.trip.reduce((a: any, b: any) => ({
      x: Math.floor(a.moneyLost) + Math.floor(b.moneyLost),
    }));
    this.totalMoney = this.totalMoney?.x;
    for (let i = 0; i < this.tripReview?.trip.length; i++) {
      this.savedMoney +=
        this.trip.trip[i].moneyLost - this.tripReview.trip[i].moneyLost;

      this.delayTime += this.dateDifference(
        this.trip.trip[i].dateIncome,
        this.trip.trip[i].timeIncome,
        this.tripReview.trip[i].dateIncome,
        this.tripReview.trip[i].timeIncome,
        false
      );
    }
  }
  takeTolerance() {
    let priceTolerance = 0;
    let movementTolerance = 0;
    let timelerance = 0;
    for (let i = 0; i < this.trip.trip.length; i++) {
      priceTolerance +=
        Number(this.trip.trip[i].moneyLost) -
        Number(this.tripReview.trip[i].moneyLost);
      movementTolerance =
        this.trip.trip[i].vehicle === this.tripReview.trip[i].vehicle
          ? movementTolerance
          : movementTolerance + 1;
      timelerance =
        this.trip.trip[i].dateIncome === this.tripReview.trip[i].dateIncome
          ? timelerance
          : timelerance + 1;
    }
    console.log(priceTolerance, movementTolerance, timelerance);

    priceTolerance = Math.abs(priceTolerance) / this.sumCost;
    movementTolerance = movementTolerance / this.trip.trip.length;
    timelerance = timelerance / this.trip.trip.length;
    console.log(priceTolerance, movementTolerance, timelerance);
  }

  selectTrip() {
    this.store
      .select(selectTrip)
      .pipe(
        map((res) => res.filter((res: any) => res.title === this.tripTitle))
      )
      .subscribe((res) => {
        this.trip = res[0];
        this.sumCost = this.trip.trip.reduce(
          (acc: any, val: any) => (acc += Number(val.moneyLost)),
          0
        );
      });
  }

  selectReviewTrip() {
    this.store
      .select(selectReviewtrip)
      .pipe(
        map((res) => res.filter((res: any) => res.title === this.tripTitle))
      )
      .subscribe((res) => {
        this.tripReview = res[0];
        this.measuring();
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((res: any) => {
      this.tripTitle = res.params.trip;
      this.selectReviewTrip();
      this.selectTrip();
      this.takeTolerance();
    });
  }
}
