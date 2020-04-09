import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  @Input() datos: number[] = [];
  @Input() datosLabel: string[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = this.datosLabel;
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: this.datos },
  ];

  public barChartColors: Color[] = [
    { backgroundColor: ['blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta'] }
  ];
  constructor() { }

  ngOnInit() {
    console.log(this.datos);
    console.log(this.datosLabel);
  }

}
