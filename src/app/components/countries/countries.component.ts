
import { DateWiseData } from './../../models/date-wise-data';
import { GlobalDataSummery } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data : GlobalDataSummery[];
  countries : string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData : DateWiseData[];
  dateWiseData ;
  loading = true;
 // lineChart : GoogleChartInterface = {
  //  chartType: 'LineChart'
 // }
 datatable = [];
 chart = {
  LineChart : "LineChart",
  height : 500,
 options : {
  
   animation : 
   {
     duration : 1000,
     easing: 'out',
   },
 }
}

  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result=>
        {
          this.data = result;
          this.data.forEach(cs=>
            {
              this.countries.push(cs.country)
            })
        }))

    ).subscribe({
      complete : ()=>
      {
       this.updateValues('India');
       this.loading = false;
        
      }
    })

    
    this.service.getGlobalData().subscribe(result =>
      {
        this.data = result;
        this.data.forEach(cs=>
          {
            this.countries.push(cs.country)
          })
      })
  };

  updateChart()
  {
    let dataTable = [];
    dataTable.push(["Date" , 'Cases']);
    this.selectedCountryData.forEach( cs =>{
      dataTable.push([cs.date , cs.cases]);
    });
  

    // // this.lineChart = {
    //   chartType: 'LineChart',
    //   dataTable: dataTable,
    //   options: {
    //     height : 500
    //   },

    // };
  }

  updateValues(country : string){
    console.log(country);
    this.data.forEach(cs=>
      {
        if(cs.country == country)
        {
          this.totalActive = cs.active
          this.totalConfirmed = cs.confirmed
          this.totalDeaths = cs.deaths
          this.totalRecovered = cs.recovered
        }
      })

      this.selectedCountryData = this.dateWiseData[country]
      //console.log(this.selectedCountryData);
      this.updateChart();

  }

}
