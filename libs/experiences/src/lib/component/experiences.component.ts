import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { ExperiencesApiService } from './experiences.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pe-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss'],
})
export class ExperiencesComponent implements OnInit {
  @Input() locationId: any;
  result: any;
  img = [];
  constructor(
    private service: ExperiencesApiService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.fetch(this.locationId);
  }
  fetch(locationId: string) {
    this.result = [];
    this.service.fetch(locationId).subscribe((res) => {
      this.result = res;
    });
  }
  openImage(img: string, index: any) {
    const dialogRef = this.dialog.open(OpenImage, {
      data: { image: img, result: this.result[0], index: index + 1 },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

@Component({
  selector: 'image-zoom',
  templateUrl: 'image-zoom.html',
})
export class OpenImage implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {}
  next() {
    this.data.index =
      this.data.result.img.length === this.data.index ? 1 : this.data.index + 1;
    this.data.image =
      'https://www.burjcrown.com/drm/travel/users/' +
      this.data.result.locationid +
      '/' +
      this.data.result.userid +
      '/' +
      this.data.index +
      '.jpg';
  }
}
