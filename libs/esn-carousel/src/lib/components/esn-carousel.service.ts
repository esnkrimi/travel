import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EsnCarouselService {
  constructor(private http: HttpClient) {}
  addToWishlist(url: any) {
    return this.http.get(url);
  }
}
