//requires constants.js

jQuery(function(){(function(dashboarddata,fixeddata){

  igive.basicfunctions={

    currencyConversionFactor:function(from,to,date){
      if(from==to){
        return 1;
      }
      //use the closest available date
      var index=0;
      var foundindex=false;
      while(foundindex==false){
        if(date>fixeddata.exchangerates.date[index]){
          foundindex=true;
          if(index>0&&fixeddata.exchangerates.date[index-1]-date<date-fixeddata.exchangerates.date[index]){
            index--;
          }
        }
        else{
          if(index==fixeddata.exchangerates.date.length-1){
            foundindex=true;
          }
          else{
            index++;
          }
        }
      }
      return fixeddata.exchangerates[to][index]/fixeddata.exchangerates[from][index];
    },

    getCollatedDonations:function(donations,recurringdonations,currency,dates){
      if(typeof(dates.cap)=="undefined"&&typeof(dates.end)!="undefined"){
        dates.cap=new Date(dates.end.getTime());
      }
      var alldonations=igive.basicfunctions.unpackRecurringDonations(donations,recurringdonations,dates.cap);

      //filter donations by date and convert to currency
      var converted=[];
      for(var i=0;i<alldonations.length;i++){
        if((typeof(dates.start)=="undefined"||alldonations[i][0].getTime()>=dates.start.getTime())&&(typeof(dates.end)=="undefined"||alldonations[i][0].getTime()<dates.end.getTime())){
          converted.push([alldonations[i][1],alldonations[i][3]*igive.basicfunctions.currencyConversionFactor(alldonations[i][2],currency,alldonations[i][0])]);            
        }
      }

      //collate donations in new currency
      var charities=[[],[]];
      for(var i=0;i<converted.length;i++){
        var j=charities[0].indexOf(converted[i][0]);
        if(j==-1){
          charities[0].push(converted[i][0]);
          charities[1].push(converted[i][1]);
        }
        else{
          charities[1][j]+=converted[i][1];
        }
      }
      for(var j=0;j<charities[1].length;j++){
        charities[1][j]=Math.round(charities[1][j]*100)/100;
      }
      charities=charities.transpose();
      charities.sort(function(a,b){if(a[1]==b[1]){return 0;}else{return a[1]>b[1]?-1:1;}});
      return charities;
    },

    getTotalDonations:function(donations,recurringdonations,currency,dates){
      if(typeof(dates.cap)=="undefined"&&typeof(dates.end)!="undefined"){
        dates.cap=new Date(dates.end.getTime());
      }
      var alldonations=igive.basicfunctions.unpackRecurringDonations(donations,recurringdonations,dates.cap);
      var total=0;
      for(var i=0;i<alldonations.length;i++){
        if((typeof(dates.start)=="undefined"||alldonations[i][0].getTime()>=dates.start.getTime())&&(typeof(dates.end)=="undefined"||alldonations[i][0].getTime()<dates.end.getTime())){
          total+=alldonations[i][3]*igive.basicfunctions.currencyConversionFactor(alldonations[i][2],currency,alldonations[i][0]);
        }
      }
      return total;
    },

    //converts recurring donations to the same format as one-time donations
    unpackRecurringDonations:function(donations,recurringdonations,capdate){
      var defaultcap=dashboarddata.lastupdated==null?fixeddata.today:(fixeddata.today.getTime()<dashboarddata.lastupdated.addDays(365).getTime()?fixeddata.today:dashboarddata.lastupdated.addDays(365));
      if(typeof(capdate)=="undefined"||capdate.getTime()>defaultcap.getTime()){
        capdate=defaultcap;
      }
      var alldonations=[];
      for(var i=0;i<donations.length;i++){
        alldonations.push([new Date(donations[i][0].getTime()),donations[i][1],donations[i][2],donations[i][3],donations[i][4]]);
      }
      for(var i=0;i<recurringdonations.length;i++){
        var date=new Date(recurringdonations[i][0].getTime());
        var enddatetimestamp=Math.min(recurringdonations[i][1]===null?Infinity:recurringdonations[i][1].getTime(),capdate.getTime());
        while(date.getTime()<=enddatetimestamp){
          alldonations.push([new Date(date.getTime()),recurringdonations[i][4],recurringdonations[i][5],recurringdonations[i][6],-recurringdonations[i][7]]);
          if(recurringdonations[i][2]=="day"||recurringdonations[i][2]=="week"){
            date.setDate(date.getDate()+recurringdonations[i][3]*(recurringdonations[i][2]=="day"?1:7));
          }
          else if(recurringdonations[i][2]=="month"){
            date.setMonth(date.getMonth()+recurringdonations[i][3]);
          }
          else if(recurringdonations[i][2]=="year"){
            date.setFullYear(date.getFullYear()+recurringdonations[i][3]);
          }
        }
      }
      return alldonations;
    },

    //converts a JavaScript date to a nice string
    formatDate:function(date){
      var ordinalise=function(number){
        var b = number % 10,
          output = (~~ (number % 100 / 10) === 1) ? 'th' :
          (b === 1) ? 'st' :
          (b === 2) ? 'nd' :
          (b === 3) ? 'rd' : 'th';
        return number + output;
      };
      if(date===null){
        return "never";
      }
      else{
        return ordinalise(date.getDate())+" "+["January","February","March","April","May","June","July","August","September","October","November","December"][date.getMonth()]+" "+date.getFullYear();
      }
    },

    //converts a currency and an amount to a nice string
    formatCurrency:function(currency,amount,symbol){
      number=amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");
      if(symbol){
        return typeof(fixeddata.currencysymbol[currency])=="undefined"?number+" "+currency:fixeddata.currencysymbol[currency]+number;
      }
      else{
        return typeof(fixeddata.currencyhtml[currency])=="undefined"?number+" "+currency:fixeddata.currencyhtml[currency]+number;
      }
    },

    //converts a frequency unit and an amount to a nice string
    formatFrequency:function(unit,amount){
      number=amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",");
      return number+" "+unit+(number==="1"?"":"s");
    },

    //converts a number to a nice one for displaying
    formatNumber:function(n){
      var parts=(n<10?n.toPrecision(2):n.toFixed(0)).split(".");
      parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
      return parts.join(".");
    },

    //for percentages, use .toFixed(2)*1

    //handy - taken from utilities in calculator.js
    numval:function(val,digits,minval,maxval){
      var filterChars=function(s, charList){
        var s1 = "" + s; // force s1 to be a string data type
        var i;
        for (i = 0; i < s1.length; )
        {
          if (charList.indexOf(s1.charAt(i)) < 0)
            s1 = s1.substring(0,i) + s1.substring(i+1, s1.length);
          else
            i++;
        }
        return s1;
      };
      var makeNumeric=function(s){
        return filterChars(s, "1234567890.-");
      };
      val = makeNumeric(val);
      if (val == "" || isNaN(val)) val = 0;
      val = parseFloat(val);
      if (digits != null)
      {
        var dec = Math.pow(10,digits);
        val = (Math.round(val * dec))/dec;
      }
      if (minval != null && val < minval) val = minval;
      if (maxval != null && val > maxval) val = maxval;
      return parseFloat(val);
    }
  };

  //transpose function by Shamasis Bhattacharya, http://www.shamasis.net/
  Array.prototype.transpose = function() {
    var a = this,
      w = a.length ? a.length : 0,
      h = a[0] instanceof Array ? a[0].length : 0;
    if(h === 0 || w === 0) { return []; }
    var i, j, t = [];
    for(i=0; i<h; i++) {
      t[i] = [];
      for(j=0; j<w; j++) {
        t[i][j] = a[j][i];
      }
    }
    return t;
  };

  //date manipulation function from http://stackoverflow.com/a/4413721
  Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  }

})(igive.dashboarddata,igive.fixeddata);});