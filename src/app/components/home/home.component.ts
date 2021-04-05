import { GlobalDataSummery } from './../../models/global-data';

import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from './../../services/data-service.service';
//import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummery[] ;
  loading = true;
  // pieChart: GoogleChartInterface =
  // {
  //   chartType : 'PieChart'
  // }
  // columnChart: GoogleChartInterface =
  // {
  //   chartType : 'ColumnChart'
  // }
  datatable = [];
  chart = {
    PieChart : "PieChart" ,
    ColumnChart : 'ColumnChart' ,
    LineChart : "LineChart", 
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }  
  }
  constructor(private dataService : DataServiceService) { }

  initChart(caseType : string) {
    
   // let datatable = [];
    //datatable.push(["Country" , "Cases"])
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])

    this.globalData.forEach(cs=>{
      let value :number;
      if(caseType == 'c')
      if(cs.confirmed > 50000)
      value = cs.confirmed
       
      if(caseType == 'd')
      if(cs.deaths > 10000)
      value = cs.deaths
       
      if(caseType == 'a')
      if(cs.active > 20000)
      value = cs.active

      if(caseType == 'r')
      if(cs.recovered > 50000)
      value = cs.recovered

         this.datatable.push(
           [cs.country , value])
        }) 
        console.log(this.datatable)
  //   this.pieChart = {
  //   chartType: 'PieChart',
  //   dataTable: datatable,
  //   //firstRowIsData: true,
  //   options: {
  //     height : 500
  //   },
  // };

  // this.columnChart = {
  //   chartType: 'ColumnChart',
  //   dataTable: datatable,
  //   //firstRowIsData: true,
  //   options: {
  //     height : 500
  //   },
  // };
   }
  ngOnInit() {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result) =>
        {
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if(!Number.isNaN(cs.confirmed))
            {
              this.totalActive += cs.active
              this.totalConfirmed += cs.confirmed
              this.totalDeaths += cs.deaths
              this.totalRecovered += cs.recovered

            }
          })
          this.initChart('c');
        },
        complete : () => {
          this.loading = false
        }
      }
    )
    }
    updateChart(input: HTMLInputElement){
      console.log(input.value)
      this.initChart(input.value)

    }
  

}
