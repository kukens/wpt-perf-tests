   export default class Charts {

       public static GetChartOptions = (dates: Array<Date>): any => {

           return {
               scales: {
                   yAxes: [{
                       ticks: {
                           beginAtZero: true,
                       }
                   }],
                   xAxes: [{
                       type: 'time',
                       time: {
                           min: dates[0],
                           max: dates[dates.length - 1],
                           tooltipFormat: 'MMM DD, h:mm A'
                       }
                   }]
               },
               tooltips: {
                   caretSize: 10
               }
           }
       }
    }
