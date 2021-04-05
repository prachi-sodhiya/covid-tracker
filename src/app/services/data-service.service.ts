import { DateWiseData } from './../models/date-wise-data';
import { GlobalDataSummery } from './../models/global-data';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-12-2021.csv'
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  
  constructor( private http : HttpClient) { }

  getDateWiseData()
  {
    return this.http.get(this.dateWiseDataUrl , {responseType : 'text'})
    .pipe(map(result =>
      {
        let rows = result.split('\n');
        //console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0,4);
          //console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value , index)=>
          {
            let dw: DateWiseData = {
              cases : +value ,
              country : con ,
              date : new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw)
          })

        })

        //console.log(mainData);
        return mainData;
      }))
  }

  getGlobalData(){
     return this.http.get(this.globalDataUrl , {responseType : 'text'}).pipe(
      map(result=>{
        let data: GlobalDataSummery[] = [];
        let raw = {}

        let rows = result.split('\n');
        rows.splice(0 , 1);
        //console.log(rows);
        rows.forEach(row =>
          {
            // only consider the value as new column which dont have whitespaces before the comma
            let cols = row.split(/,(?=\S)/)   

            let  cs = {
              country : cols[3],
                confirmed : +cols[7],
                deaths : +cols[8],
                recovered : +cols[9],
                active : +cols[10],
            };

            let temp : GlobalDataSummery = raw[cs.country];
            if(temp){
              temp.active = cs.active + temp.active
              temp.confirmed = cs.confirmed + temp.confirmed
              temp.deaths = cs.deaths + temp.deaths
              temp.recovered = cs.recovered + temp.recovered

              raw[cs.country] = temp;
              
            } else
            {
              raw[cs.country] = cs;
            }

              }
            )
            return <GlobalDataSummery[]>Object.values(raw);
         })
      )
  }
}
