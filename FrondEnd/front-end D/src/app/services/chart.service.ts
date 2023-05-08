import { Injectable } from '@angular/core';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  ChartConfiguration
} from 'chart.js';


@Injectable({
  providedIn: 'root'
})
export class ChartService {


  constructor() { 
    Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );
    
  }

  
  subMenuState:'single'|'compare'|'doughnut'|'calculate' = 'single'

  setSubMenuState(newstate:'single'|'compare'|'doughnut'|'calculate'){
    this.subMenuState = newstate
  }

  getNewChart(ctx:CanvasRenderingContext2D,config:ChartConfiguration){
    return new Chart(ctx,config);
  }
}
