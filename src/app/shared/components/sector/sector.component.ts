import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {
  @Input() border: boolean = false;
  @Input() shadow: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
