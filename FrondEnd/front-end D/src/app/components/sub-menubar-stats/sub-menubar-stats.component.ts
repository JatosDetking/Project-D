import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-sub-menubar-stats',
  templateUrl: './sub-menubar-stats.component.html',
  styleUrls: ['./sub-menubar-stats.component.scss']
})
export class SubMenubarStatsComponent implements OnInit {

  constructor(
    public chartService:ChartService
  ) { }

  ngOnInit(): void {
  }

  singleChart(){
    this.chartService.setSubMenuState('single')
  }

  compareCharts(){
    this.chartService.setSubMenuState('compare')
  }

  doughnut(){
    this.chartService.setSubMenuState('doughnut')
  }

  mathCalculations(){
    this.chartService.setSubMenuState('calculate')
  }
}
