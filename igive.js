/********************************
***     TABLE OF CONTENTS     ***

Where things are outputted:

  tabs
    //create and populate tabs
  donation meter
    - * pledge status - meter *
    the meter itself
      - function updatePledgeMeters()
    donation meter message
      - //set the message
        //set the message for members
        //set the message for non-members
  social media buttons
    - * social media buttons *
    the links including variable text
      - function updatePledgeMeters()
  donate now button
    - * donate now button *
  graphs
    headers and containers
      - * where you've donated graph *
    top charity metrics
      - function updateDonationEffects()


*********************************
********************************/


//requires basicfunctions.js

igive.visualizationLoaded=false;
google.load("visualization","1",{packages:["corechart"]});
google.setOnLoadCallback(function(){
  igive.visualizationLoaded=true;
});

jQuery(function(){(function($,dashboarddata,fixeddata,basicfunctions,visualizationLoaded){


/**************************
***************************
*** WHERE THE HTML IS   ***
*** OUTPUTTED           ***
***************************
***************************/


  /*------------------------
   YEAR AND "ALL TIME" TABS
  ------------------------*/

  //calculate the current year according to the year start date
  function getcurrentyear(){
    var returnvalue=fixeddata.startyear;
    while((new Date(returnvalue+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()<=fixeddata.today.getTime()){
      returnvalue++;
    }
    return returnvalue++;
  };

  //create and populate tabs
  (function(){
    for(var i=-1;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      var year=i==-1?"alltime":(fixeddata.startyear+i);
      var tab=$("<li id=\""+year+"tab\"><a href=\"#"+year+"\">"+(year=="alltime"?"All time":year)+"</a></li>");
      $("#dashboardtabs>ul").prepend(tab);

      //create tab container
      var tabcontainer=$("<div></div>",{"id":year+""});

      if(year=="alltime"){
        if(fixeddata.ismember){
          tabcontainer.append("<h2>Your overall pledge</h2>");
        }
        else if(fixeddata.istryinggiving){
          tabcontainer.append("<h2>Your overall progress trying giving</h2>");
        }
        tabcontainer.append("<div id=\"alltimepledgemeter\" class=\"pledgemeter\"><div class=\"pledgebaron\"></div><div class=\"pledgebaroff\"></div><div class=\"pledgebuttonleft pledge0\"></div><div class=\"pledgebuttonmiddle pledge25\"></div><div class=\"pledgebuttonmiddle pledge50\"></div><div class=\"pledgebuttonmiddle pledge75\"></div><div class=\"pledgebuttonright pledge100\"></div><div class=\"pledgetext pledge0\">0%</div><div class=\"pledgetext pledge25\">25%</div><div class=\"pledgetext pledge50\">50%</div><div class=\"pledgetext pledge75\">75%</div><div class=\"pledgetext pledge100\">100%</div></div>");
        tabcontainer.append("<div><p id=\"alltimetotaldonations\" class=\"pledgemetermessage\"></p></div>");
        tabcontainer.append("<div id=\"alltimepledgemeterheaderdiv\"><h2 id=\"alltimepledgemeterheader\" class=\"wide-underline-header\">Percentages you have donated</h2></div>");
        tabcontainer.append("<div><p id=\"alltimepledgemetermessage\" class=\"pledgemetermessage\"></p><div id=\"alltimepledgemeters\" style=\"width:"+fixeddata.chartwidth+"px;height:"+fixeddata.chartheight+"px;\"></div></div>");
      }
      else{
        if(fixeddata.ismember){
          tabcontainer.append("<h2>Your pledge during "+year+"</h2>");
        }
        else if(fixeddata.istryinggiving){
          tabcontainer.append("<h2>Your donations during "+year+"</h2>");
        }

        /* pledge status - meter */
        tabcontainer.append("<div id=\""+year+"pledgemeter\" class=\"pledgemeter\"><div class=\"pledgebaron\"></div><div class=\"pledgebaroff\"></div><div class=\"pledgebuttonleft pledge0\"></div><div class=\"pledgebuttonmiddle pledge25\"></div><div class=\"pledgebuttonmiddle pledge50\"></div><div class=\"pledgebuttonmiddle pledge75\"></div><div class=\"pledgebuttonright pledge100\"></div><div class=\"pledgetext pledge0\">0%</div><div class=\"pledgetext pledge25\">25%</div><div class=\"pledgetext pledge50\">50%</div><div class=\"pledgetext pledge75\">75%</div><div class=\"pledgetext pledge100\">100%</div></div>");

        /* pledge status - text */
        tabcontainer.append("<div id=\""+year+"pledgemetermessage\" class=\"pledgemetermessage\"></div>");

        /* link to "All time" tab */
        tabcontainer.append($("<div class=\"alltimetablink\"></div>").append($("<a href=\"#alltime\" class=\"linkbuttonsmall\">Your overall progress</a>").click(function(event){
          $("#alltimetab>a").click();
          event.preventDefault();
        })));

      }

      /* social media buttons */
      //tabcontainer.append('<div class="pledge-completion-social-media-share"><a class="mygiving-fb-msg" href="#" id="'+year+'facebooklink" target="_blank"><img src="/sites/all/themes/summerton/images/social-media/postfacebook.png" alt="Share on Facebook"></a> <a href="#" id="'+year+'twitterlink" target="_blank"><img src="/sites/all/themes/summerton/images/social-media/posttwitterlogo.png" alt="Share on Twitter"></a>');

      if(fixeddata.ismember){

        /* donate now button for members */
        //tabcontainer.append("<div class=\"progress-links\"><a class=\"join\" href=\"/donate\">Donate now</a></div>");

      }
      else if(fixeddata.istryinggiving){

        /* donate now and pledge buttons for try givers */
        //tabcontainer.append("<div class=\"progress-links\"><a class=\"join\" href=\"/get-involved/join-us\">Take the pledge</a><a class=\"join\" href=\"/donate\">Donate now</a></div>");

      }
      else{

        /* calls to action for everyone else */
        //tabcontainer.append('<div class="progress-links"><a class="join" href="/get-involved/join-us">Take the pledge</a><a class="join" href="/get-involved/try-giving">Try Giving</a><a class="join" href="/donate">Donate now</a></div>');

      }

      /* where you've donated graph */
      tabcontainer.append("<div class=\"collateddonationsdiv\"><h2 id=\""+year+"collateddonationsheader\" class=\"wide-underline-header\">Where you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated</h2><div id=\""+year+"collateddonations\" style=\"width:"+fixeddata.chartwidth+"px;height:"+fixeddata.chartheight+"px;\"></div></div>");

      /* your achievements section */
      tabcontainer.append("<div class=\"donationeffectsdiv\"><h2 id=\""+year+"donationeffectsheader\" class=\"wide-underline-header\">What you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"achieved</h2><div id=\""+year+"donationeffects\"></div></div>");

      /* when you donated */
      tabcontainer.append("<div class=\"donationstimelinediv\"><h2 id=\""+year+"donationstimelineheader\" class=\"wide-underline-header\">When you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated</h2><div id=\""+year+"donationstimeline\" style=\"width:"+fixeddata.timelinewidth+"px;height:"+fixeddata.timelineheight+"px;\"></div></div>");

      tabcontainer.append("<div class=\"lastupdatedcontainer\"><p>Last updated: <span class=\"lastupdated\"></span></p></div>");
      tabcontainer.insertBefore("#edit");
    }
  })();

  //initialise tabs
  $("#dashboardtabs").tabs({"active":(function(){
    if(dashboarddata.donations.length==0&&dashboarddata.recurringdonations.length==0){
      return fixeddata.endyear-fixeddata.startyear+fixeddata.othertabs.indexOf("edit")+2;
    }
    if(fixeddata.istryinggiving){
      return fixeddata.endyear-fixeddata.startyear+1;
    }
    var mostrecentdonationdate=new Date(Math.max.apply(Math,basicfunctions.unpackRecurringDonations(dashboarddata.donations,dashboarddata.recurringdonations,new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)).transpose()[0]));
    for(var year=fixeddata.endyear;year>fixeddata.startyear-1;year--){
      if(mostrecentdonationdate>=new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)){
        return fixeddata.endyear-year;
      }
    }
    return fixeddata.endyear-fixeddata.startyear+1;
  })()});
  $("#dashboardtabs").bind("tabsactivate",function(event,ui){
    fixeddata.activetab=ui.newTab.attr("id").slice(0,-3);
    if(fixeddata.othertabs.indexOf(fixeddata.activetab)==-1){
      if(fixeddata.activetab=="alltime"){
        updatePledgeMeters();
      }
      updateCollatedDonations(fixeddata.activetab);
      updateDonationsTimelines(fixeddata.activetab);
    }
  });
  //version of the above for jQuery UI 1.8 rather than 1.10
  /*$("#dashboardtabs").bind("tabsselect",function(event,ui){
    fixeddata.activetab=$(ui.panel).attr("id");
    window.setTimeout(function(){
      if(fixeddata.othertabs.indexOf(fixeddata.activetab)==-1){
        if(fixeddata.activetab=="alltime"){
          updatePledgeMeters();
        }
        updateCollatedDonations(fixeddata.activetab);
        updateDonationsTimelines(fixeddata.activetab);
      }
    },1);
  });*/

  //remove the noscript paragraph
  $("#igivenoscript").hide();

  //adjust the base HTML based on whether or not they are a member
  if(fixeddata.ismember){
    if(fixeddata.joindate!==null){
      $("#joindate").html("Date you joined Giving What We Can: <strong>"+(fixeddata.joindate===false?"not recorded":basicfunctions.formatDate(fixeddata.joindate))+"</strong>"+(fixeddata.joindate===false?"<br><small>This can be updated using the import/export settings feature below.</small>":""));//If you can tell us when you joined, please email <a href=\"mailto:webmaster@givingwhatwecan.org\">webmaster@givingwhatwecan.org</a>.</small>":""));
    }
    $("#alltimepledgemeterheader").html("Pledge history");
  }
  else if(fixeddata.istryinggiving){
    if(fixeddata.trygivingenddate!==null&&fixeddata.trygivingenddate!==false&&fixeddata.trygivingstartdate!==null&&fixeddata.trygivingstartdate!==false){
      $("#joindate").html("Your period of Trying Giving"+(fixeddata.trygivingstartdate===false?"":" "+(fixeddata.trygivingstartdate.getTime()<fixeddata.today.getTime()?"began":"will begin")+" on <strong>"+basicfunctions.formatDate(fixeddata.trygivingstartdate)+"</strong> and")+" "+(fixeddata.trygivingenddate.getTime()<fixeddata.today.getTime()?"ended":"will end")+" on <strong>"+basicfunctions.formatDate(fixeddata.trygivingenddate)+"</strong>.");
    }
    $("#alltimepledgemeterheader").hide();
    $("#alltimepledgemeters").hide();
  }
  if(fixeddata.ismember||fixeddata.istryinggiving){
    $("#incometableinfo").html("Approximate income is fine, although the more accurate the better.");
    if(fixeddata.ismember){
      $("#studentmodeinfo").html("In case you have little to no income (and are supported by your family or a loan, for example), then we suggest that you donate 1% of your spending money (see <a style=\"text-decoration:underline;\" href=\"https://www.givingwhatwecan.org/about-us/frequently-asked-questions#18\">this FAQ</a> for more information). In order to indicate this for a particular year, please enable &quot;<b>student/1% mode</b>&quot; when editing your income.");
    }
    $("#percentagepledged").html("Income you have pledged: <strong>"+fixeddata.percentagepledged+"%</strong>");
  }
  else{
    $("#incometableheader").html("Income <small>(optional)</small>");
    $("#percentagepledged").hide();
  }

  //sets the pledge meter for a given year to a given percentage
  function setPledgeMeter(year,percentage){
    $("#"+year+"pledgemeter").show();
    percentage=Math.min(percentage,100);
    $("#"+year+"pledgemeter .pledgebaron").css("width",percentage+"%");
    $("#"+year+"pledgemeter .pledgebaron").css("background-image","url('"+fixeddata.modulepath+"/pledgemeterimages/baron.png')");
    $("#"+year+"pledgemeter .pledgebaroff").css("left",percentage+"%");
    $("#"+year+"pledgemeter .pledgebaroff").css("background-image","url('"+fixeddata.modulepath+"/pledgemeterimages/baroff.png')");
    $("#"+year+"pledgemeter .pledgebaroff").css("width",(100-percentage)+"%");
    $("#"+year+"pledgemeter .pledgebuttonleft").css("background-image","url('"+fixeddata.modulepath+"/pledgemeterimages/left"+(percentage>0?"on":"off")+".png')");
    for(var i=25;i<=75;i+=25){
      $("#"+year+"pledgemeter .pledgebuttonmiddle.pledge"+i).css("background-image","url('"+fixeddata.modulepath+"/pledgemeterimages/middle"+(percentage>=i?"on":"off")+".png')");
    }
    $("#"+year+"pledgemeter .pledgebuttonright").css("background-image","url('"+fixeddata.modulepath+"/pledgemeterimages/right"+(percentage>=100?"on":"off")+".png')");
  }

  //updates the pledge progress bar section
  function updatePledgeMeters(){

    //initialise variables
    var percentages=[];
    var totaldonations=[];
    var incomerecorded=false;
    var relevantincomerecorded=false;
    //var pledgesfulfilled=[];
    //var pledgesunfulfilled=[];
    //var thisyearpledgefulfilled=null;
    var noincomerecordedsincejoining=[];
    var noincomerecordedtryinggiving=[];
    var socialmediamessages=[];

    //calculate the year in which the user joined
    if(fixeddata.ismember==false||fixeddata.joindate===null||fixeddata.joindate===false||fixeddata.joindate.getTime()<(new Date(fixeddata.startyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()||fixeddata.joindate.getTime()>=(new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()){
      var joinyear=false;
    }
    else{
      var joinyear=fixeddata.startyear;
      while((new Date(joinyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()<=fixeddata.joindate.getTime()){
        joinyear++;
      }
    }

    //calculate the years in which the user started and ended trying giving
    if(fixeddata.istryinggiving==false||fixeddata.trygivingstartdate===null||fixeddata.trygivingstartdate===false||fixeddata.trygivingstartdate.getTime()<(new Date(fixeddata.startyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()||fixeddata.trygivingstartdate.getTime()>=(new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()||fixeddata.trygivingenddate===null||fixeddata.trygivingenddate===false||fixeddata.trygivingstartdate.getTime()>fixeddata.trygivingenddate.getTime()){
      var trygivingstartyear=false;
      var trygivingendyear=false;
    }
    else{
      var trygivingstartyear=fixeddata.startyear;
      while((new Date(trygivingstartyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()<=fixeddata.trygivingstartdate.getTime()){
        trygivingstartyear++;
      }
      if(fixeddata.trygivingenddate.getTime()>=(new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()){
        var trygivingendyear=false;
      }
      else{
        var trygivingendyear=fixeddata.startyear;
        while((new Date(trygivingendyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()<=fixeddata.trygivingenddate.getTime()){
          trygivingendyear++;
        }
      }
    }

    //update the pledge meters and messages for the tabs for specific years tabs
    //collect data for the "All time" tab at the same time
    for(var i=0;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      var year=fixeddata.startyear+i;
      totaldonations[i]=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});

      //if the user hasn't given their income for the year
      if(typeof(dashboarddata.income[year])=="undefined"){

        percentages[i]=false;

        //set the message and the pledgemeter
        var message="<div class=\"isfulfilled\">You "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong> "+(year==fixeddata.endyear||year==getcurrentyear()?"since "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)):"from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1)))+".</div>";
        if(fixeddata.ismember){
          if(joinyear===false||year>=joinyear){
            message+="<div class=\"sofar\">You have not entered any income for this year.</div>";
            noincomerecordedsincejoining.push(year);
            setPledgeMeter(year,0);
          }
          else{
            message+="<div class=\"sofar\">This was before you joined Giving What We Can.</div>";
            $("#"+year+"pledgemeter").hide();
          }
        }
        else{
          if(fixeddata.istryinggiving&&trygivingstartyear!==false){
            if(year>=trygivingstartyear&&(trygivingendyear===false||year<=trygivingendyear)){
              noincomerecordedtryinggiving.push(year);
            }
          }
          $("#"+year+"pledgemeter").hide();
        }

        //set the social media message
        socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have so far ":"")+"donated "+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],true)+" for "+year;

      }

      //if the user has given their income for the year
      else{

        incomerecorded=true;
        if((fixeddata.ismember&&(joinyear===false||year>=joinyear))||(fixeddata.istryinggiving&&trygivingstartyear!==false&&year>=trygivingstartyear&&(year<=trygivingendyear||trygivingendyear===false))||(!fixeddata.ismember&&!fixeddata.istryinggiving)){
          relevantincomerecorded=true;
        }
        percentages[i]=(100*basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[year][0],{"start":new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}))/dashboarddata.income[year][1];
        if(fixeddata.ismember){
          var adjustedpercentagepledged=!!dashboarddata.income[year][2]?1:fixeddata.percentagepledged;
          var adjustedincomeword=!!dashboarddata.income[year][2]?"spending money":"income";
          if(year==joinyear){
            var totaldonationssincejoininginjoinyear=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":fixeddata.joindate,"end":new Date(joinyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
            var incomeinoldcurrencysincejoininginjoinyear=dashboarddata.income[joinyear][1]*(((new Date(joinyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-fixeddata.joindate.getTime())/((new Date(joinyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-(new Date(joinyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()));
            var percentagesincejoininginjoinyear=(100*basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[joinyear][0],{"start":fixeddata.joindate,"end":new Date(joinyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}))/incomeinoldcurrencysincejoininginjoinyear;
            setPledgeMeter(year,100*percentagesincejoininginjoinyear/adjustedpercentagepledged);
          }
          else{
            setPledgeMeter(year,100*percentages[i]/adjustedpercentagepledged);
          }

          //set the message and social media message for members
          if(joinyear!=false&&year<joinyear){
            var message="<div class=\"isfulfilled\">You donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong> from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+".</div>";
            message+="<div class=\"sofar\">You donated <strong>"+percentages[i].toFixed(2)*1+"%</strong> of your "+adjustedincomeword+". This was before you joined Giving What We Can.</div>";
            socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and donated "+percentages[i].toFixed(0)*1+"%25 of my "+adjustedincomeword+" for "+year;
          }
          else if(year==joinyear&&fixeddata.joindate.getTime()>(new Date(joinyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()){
            if(year==fixeddata.endyear||year==getcurrentyear()){
              if(percentagesincejoininginjoinyear>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin){
                //thisyearpledgefulfilled=true;
                var message="<div class=\"isfulfilled\">You have fulfilled your pledge during this year!</div>";
                message+="<div class=\"sofarexplanation\">This is based on your donations since you joined Giving What We Can on "+basicfunctions.formatDate(fixeddata.joindate)+", and your pro-rata "+adjustedincomeword+" according to how far through the year this was.</div>";
                message+="<div class=\"sofar\" >In fact, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoininginjoinyear,false)+"</strong>, which amounts to "+(percentagesincejoininginjoinyear>100?"more than":"<strong>"+percentagesincejoininginjoinyear.toFixed(2)*1+"%</strong> of")+" your pro-rata "+adjustedincomeword+"!</div>";
                message+="<div class=\"sofar\">In total from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounts to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your total "+adjustedincomeword+".</div>";
                socialmediamessages[year]="I've completed my Giving What We Can commitment for "+year+" and given "+(percentagesincejoininginjoinyear>100?"all":percentagesincejoininginjoinyear.toFixed(0)*1+"%25")+" of my "+adjustedincomeword+" to the most effective charities";
              }
              else{
                //thisyearpledgefulfilled=false;
                var message="<div class=\"isfulfilled\">You have not yet fulfilled your pledge during this year.</div>";
                message+="<div class=\"sofarexplanation\">This is based on your donations since you joined Giving What We Can on "+basicfunctions.formatDate(fixeddata.joindate)+", and your pro-rata "+adjustedincomeword+" according to how far through the year this was.</div>";
                message+="<div class=\"sofar\" >So far, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoininginjoinyear,false)+"</strong>, which amounts to <strong>"+percentagesincejoininginjoinyear.toFixed(2)*1+"%</strong> of your pro-rata "+adjustedincomeword+".<br>In order to fulfil your pledge, you need to donate a further <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,Math.ceil((((adjustedpercentagepledged-percentagesincejoininginjoinyear)*incomeinoldcurrencysincejoininginjoinyear*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,fixeddata.today))/100)*100)/100,false)+"</strong>.</div>";
                message+="<div class=\"sofar\">In total from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounts to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your total "+adjustedincomeword+".</div>";
                socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and have so far donated "+percentagesincejoininginjoinyear.toFixed(0)*1+"%25 of my "+adjustedincomeword+" for "+year;
              }
            }
            else{
              if(percentagesincejoininginjoinyear>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin){
                //pledgesfulfilled.push(year);
                var message="<div class=\"isfulfilled\">You fulfilled your pledge during the portion of "+year+" from when you joined Giving What We Can ("+basicfunctions.formatDate(fixeddata.joindate)+" &ndash; "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+")!</div>";
                message+="<div class=\"sofar\" >In fact, you donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoininginjoinyear,false)+"</strong>, which amounted to "+(percentagesincejoininginjoinyear>100?"more than":"<strong>"+percentagesincejoininginjoinyear.toFixed(2)*1+"%</strong> of")+" your pro-rata "+adjustedincomeword+"!</div>";
                message+="<div class=\"sofar\">In total from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", you donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounted to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your total "+adjustedincomeword+".</div>";
                socialmediamessages[year]="I completed my Giving What We Can commitment for "+year+" and donated "+(percentagesincejoininginjoinyear>100?"all":percentagesincejoininginjoinyear.toFixed(0)*1+"%25")+" of my "+adjustedincomeword+" to the most effective charities";
              }
              else{
                //pledgesunfulfilled.push(year);
                var message="<div class=\"isfulfilled\">You donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoininginjoinyear,false)+"</strong> from when you joined Giving What We Can on "+basicfunctions.formatDate(fixeddata.joindate)+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", which amounted to <strong>"+percentagesincejoininginjoinyear.toFixed(2)*1+"%</strong> of your pro-rata "+adjustedincomeword+".</div>";
                message+="<div class=\"sofar\">You did not fulfil your pledge during this portion of "+year+".<br>Were you a student? <img src=\""+fixeddata.modulepath+"/help.png\" class=\"studentmodetooltip\" title=\"We suggest that students donate 1% of their spending money (see <a style='text-decoration:underline;' href='https://www.givingwhatwecan.org/about-us/frequently-asked-questions#18'>this FAQ</a> for more information). In order to indicate this for a particular year, please enable &quot;student/1% mode&quot; when editing your income.\"></div>";
                message+="<div class=\"sofar\">In total from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", you donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounted to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your total "+adjustedincomeword+".</div>";
                socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and donated "+percentagesincejoininginjoinyear.toFixed(0)*1+"%25 of my "+adjustedincomeword+" for "+year;
              }
            }
          }
          else{
            if(year==fixeddata.endyear||year==getcurrentyear()){
              if(percentages[i]>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin){
                //thisyearpledgefulfilled=true;
                var message="<div class=\"isfulfilled\">You have fulfilled your pledge during this year ("+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" &ndash; "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+")!</div>";
                message+="<div class=\"sofar\" >In fact, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounts to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your "+adjustedincomeword+"!</div>";
                socialmediamessages[year]="I've completed my Giving What We Can commitment for "+year+" and given "+(percentages[i]>100?"all":percentages[i].toFixed(0)*1+"%25")+" of my "+adjustedincomeword+" to the most effective charities";
              }
              else{
                //thisyearpledgefulfilled=false;
                var message="<div class=\"isfulfilled\">You have not yet fulfilled your pledge during this year ("+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" &ndash; "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+").</div>";
                message+="<div class=\"sofar\" >So far, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounts to <strong>"+percentages[i].toFixed(2)*1+"%</strong> of your "+adjustedincomeword+".<br>In order to fulfil your pledge, you need to donate a further <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,Math.ceil((((adjustedpercentagepledged-percentages[i])*dashboarddata.income[year][1]*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,fixeddata.today))/100)*100)/100,false)+"</strong>.<br>Are you a student? <img src=\""+fixeddata.modulepath+"/help.png\" class=\"studentmodetooltip\" title=\"We suggest that students donate 1% of their spending money (see <a style='text-decoration:underline;' href='https://www.givingwhatwecan.org/about-us/frequently-asked-questions#18'>this FAQ</a> for more information). In order to indicate this for a particular year, please enable &quot;student/1% mode&quot; when editing your income.\"></div>";
                socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and have so far donated "+percentages[i].toFixed(0)*1+"%25 of my "+adjustedincomeword+" for "+year;
              }
            }
            else{
              if(percentages[i]>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin){
                //pledgesfulfilled.push(year);
                var message="<div class=\"isfulfilled\">You fulfilled your pledge during "+year+" ("+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" &ndash; "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+")!</div>";
                message+="<div class=\"sofar\" >In fact, you donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong>, which amounted to "+(percentages[i]>100?"more than":"<strong>"+percentages[i].toFixed(2)*1+"%</strong> of")+" your "+adjustedincomeword+"!</div>";
                socialmediamessages[year]="I completed my Giving What We Can commitment for "+year+" and donated "+(percentages[i]>100?"all":percentages[i].toFixed(0)*1+"%25")+" of my "+adjustedincomeword+" to the most effective charities";
              }
              else{
                //pledgesunfulfilled.push(year);
                var message="<div class=\"isfulfilled\">You donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong> from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+", which amounted to <strong>"+percentages[i].toFixed(2)*1+"%</strong> of your "+adjustedincomeword+".</div>";
                message+="<div class=\"sofar\">You did not fulfil your pledge during "+year+".<br>Were you a student? <img src=\""+fixeddata.modulepath+"/help.png\" class=\"studentmodetooltip\" title=\"We suggest that students donate 1% of their spending money (see <a style='text-decoration:underline;' href='https://www.givingwhatwecan.org/about-us/frequently-asked-questions#18'>this FAQ</a> for more information). In order to indicate this for a particular year, please enable &quot;student/1% mode&quot; when editing your income.\"></div>";
                socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and donated "+percentages[i].toFixed(0)*1+"%25 of my "+adjustedincomeword+" for "+year;
              }
            }
          }

        }
        else{
          if(fixeddata.istryinggiving){
            setPledgeMeter(year,100*percentages[i]/fixeddata.percentagepledged);
          }
          else{
            setPledgeMeter(year,percentages[i]);
          }

          //set the message for non-members
          var message="<div class=\"isfulfilled\">You "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonations[i],false)+"</strong> "+(year==fixeddata.endyear||year==getcurrentyear()?"since "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)):"from "+basicfunctions.formatDate(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" to "+basicfunctions.formatDate((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1)))+".</div>";
          message+="<div class=\"sofar\">You "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated <strong>"+percentages[i].toFixed(2)*1+"%</strong> of your income.</div>";

          //set the social media message for non-members
          socialmediamessages[year]="I am tracking my charitable giving through Giving What We Can and "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have so far ":"")+"donated "+percentages[i].toFixed(0)*1+"%25 of my income for "+year;

        }
      }
      $("#"+year+"pledgemetermessage").html(message);
    }
    $(".studentmodetooltip").tooltip();

    //calculate the total amounts and overall percentages
    var totaldonationsabsolutely=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)});
    if(fixeddata.ismember&&joinyear!==false){
      var totaldonationssincejoining=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":fixeddata.joindate,"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)});
    }
    else if(fixeddata.istryinggiving&&trygivingstartyear!==false){
      var totaldonationstryinggiving=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,$.extend({"start":fixeddata.trygivingstartdate},trygivingendyear===false?{"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)}:{"end":fixeddata.trygivingenddate.addDays(1)}));
    }
    else{
      var totaldonationssincejoining=totaldonationsabsolutely;
    }
    var totaldonationswithincome=0;
    var totaldonationswithincomeforpercentage=0;
    var totalincome=0;
    var totaldonationswithincomesincejoining=0;
    var totaldonationswithincomesincejoiningforpercentage=0;
    var totalincomesincejoining=0;
    var totaldonationswithincometryinggiving=0;
    var totaldonationswithincometryinggivingforpercentage=0;
    var totalincometryinggiving=0;
    for(var i=0;i<percentages.length;i++){
      if(percentages[i]!==false){
        var year=fixeddata.startyear+i;
        var income=dashboarddata.income[year][1]*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(183));
        var adjustedincome=income/(!!dashboarddata.income[year][2]?10:1);
        totalincome+=adjustedincome;
        totaldonationswithincome+=totaldonations[i];
        totaldonationswithincomeforpercentage+=income*(percentages[i]/100);
        if(fixeddata.ismember&&joinyear!==false){
          if(year==joinyear){
            var incomesincejoininginjoinyear=incomeinoldcurrencysincejoininginjoinyear*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(183));
            var adjustedincomesincejoininginjoinyear=incomesincejoininginjoinyear/(!!dashboarddata.income[year][2]?10:1);
            totalincomesincejoining+=adjustedincomesincejoininginjoinyear;
            totaldonationswithincomesincejoining+=totaldonationssincejoininginjoinyear;
            totaldonationswithincomesincejoiningforpercentage+=incomesincejoininginjoinyear*(percentagesincejoininginjoinyear/100);
          }
          if(year>joinyear){
            totalincomesincejoining+=adjustedincome;
            totaldonationswithincomesincejoining+=totaldonations[i];
            totaldonationswithincomesincejoiningforpercentage+=income*(percentages[i]/100);
          }
        }
        if(fixeddata.istryinggiving&&trygivingstartyear!==false){
          if(trygivingstartyear==trygivingendyear){
            if(year==trygivingstartyear){
              //no need to convert anything to the default currency
              totalincometryinggiving=dashboarddata.income[year][1]*((fixeddata.trygivingenddate.addDays(1).getTime()-fixeddata.trygivingstartdate.getTime())/((new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-(new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()));
              totaldonationswithincometryinggiving=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":fixeddata.trygivingstartdate,"end":fixeddata.trygivingenddate.addDays(1)});
              totaldonationswithincometryinggivingforpercentage=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[year][0],{"start":fixeddata.trygivingstartdate,"end":fixeddata.trygivingenddate.addDays(1)});
            }
          }
          else{
            if(year==trygivingstartyear){
              var totaldonationstryinggivinginstartyear=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":fixeddata.trygivingstartdate,"end":new Date(trygivingstartyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
              var incomeinoldcurrencytryinggivinginstartyear=dashboarddata.income[trygivingstartyear][1]*(((new Date(trygivingstartyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-fixeddata.trygivingstartdate.getTime())/((new Date(trygivingstartyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-(new Date(trygivingstartyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()));
              var percentagetryinggivinginstartyear=(100*basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[trygivingstartyear][0],{"start":fixeddata.trygivingstartdate,"end":new Date(trygivingstartyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}))/incomeinoldcurrencytryinggivinginstartyear;
              var incometryinggivinginstartyear=incomeinoldcurrencytryinggivinginstartyear*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(183));
              totalincometryinggiving+=incometryinggivinginstartyear;
              totaldonationswithincometryinggiving+=totaldonationstryinggivinginstartyear;
              totaldonationswithincometryinggivingforpercentage+=incometryinggivinginstartyear*(percentagetryinggivinginstartyear/100);
            }
            if(trygivingendyear!==false&&year==trygivingendyear){
              var totaldonationstryinggivinginendyear=basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"end":fixeddata.trygivingenddate.addDays(1),"start":new Date(trygivingendyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
              var incomeinoldcurrencytryinggivinginendyear=dashboarddata.income[trygivingendyear][1]*((fixeddata.trygivingenddate.addDays(1).getTime()-(new Date(trygivingendyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime())/((new Date(trygivingendyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()-(new Date(trygivingendyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).getTime()));
              var percentagetryinggivinginendyear=(100*basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[trygivingendyear][0],{"end":fixeddata.trygivingenddate.addDays(1),"start":new Date(trygivingendyear,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}))/incomeinoldcurrencytryinggivinginendyear;
              var incometryinggivinginendyear=incomeinoldcurrencytryinggivinginendyear*basicfunctions.currencyConversionFactor(dashboarddata.income[year][0],dashboarddata.defaultcurrency,new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(183));
              totalincometryinggiving+=incometryinggivinginendyear;
              totaldonationswithincometryinggiving+=totaldonationstryinggivinginendyear;
              totaldonationswithincometryinggivingforpercentage+=incometryinggivinginendyear*(percentagetryinggivinginendyear/100);
            }
            if(year>trygivingstartyear&&(trygivingendyear===false||year<trygivingendyear)){
              totalincometryinggiving+=income;
              totaldonationswithincometryinggiving+=totaldonations[i];
              totaldonationswithincometryinggivingforpercentage+=income*(percentages[i]/100);
            }
          }
        }
      }
    }
    var overallpercentage=100*totaldonationswithincomeforpercentage/totalincome;
    var overallpercentagesincejoining=100*totaldonationswithincomesincejoiningforpercentage/totalincomesincejoining;
    var overallpercentagetryinggiving=100*totaldonationswithincometryinggivingforpercentage/totalincometryinggiving;
    
    //update the pledge meters, messages and social media message for the for "All time" tab
    if(!(fixeddata.istryinggiving&&trygivingstartyear!==false)){
      if(relevantincomerecorded){
        if(visualizationLoaded){
          var array=fixeddata.ismember?[["Year","Pledge fulfilled. Percentage donated","Pledge unfulfilled. Percentage donated"]]:[["Year","Percentage donated"]];
          for(var i=percentages.length-1;i>=0;i--){
            if(percentages[i]!==false){
              var year=fixeddata.startyear+i;
              if(fixeddata.ismember){
                var adjustedpercentagepledged=!!dashboarddata.income[year][2]?1:fixeddata.percentagepledged;
                if(joinyear===false||year>joinyear){
                  array.push([year+"",percentages[i]>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin?percentages[i]:0,percentages[i]>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin?0:percentages[i]]);
                }
                else if(year==joinyear){
                  array.push([year+"",percentagesincejoininginjoinyear>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin?percentagesincejoininginjoinyear:0,percentagesincejoininginjoinyear>=adjustedpercentagepledged-fixeddata.pledgepercentageerrormargin?0:percentagesincejoininginjoinyear]);
                }
              }
              else{
                array.push([year+"",percentages[i]]);
              }
            }
          }
          var data=google.visualization.arrayToDataTable(array);
          var formatter=new google.visualization.NumberFormat({"suffix":"%"});
          formatter.format(data,1);
          if(fixeddata.ismember){
            formatter.format(data,2);
          }
          var options=fixeddata.ismember?{
            "isStacked":true,
            "vAxis":{"title":"Year"},
            "hAxis":{"title":"Percentage donated","minValue":0,"maxValue":2*fixeddata.percentagepledged},
            "legend":{"position":"none"},
            "colors":["#d9b51f","#dc3912"]
          }:{
            "vAxis":{"title":"Year"},
            "hAxis":{"title":"Percentage donated","minValue":0},
            "legend":{"position":"none"},
            "colors":["#d9b51f"]
          };
          var chart=new google.visualization.BarChart(document.getElementById("alltimepledgemeters"));
          chart.draw(data,options);
        }
        $("#alltimepledgemeters").show();
        $("#alltimepledgemeterheader").show();
        /*var messages=[];
        if(pledgesfulfilled.length>0){
          if(thisyearpledgefulfilled){
            pledgesfulfilled.push(fixeddata.endyear);
          }
          if(pledgesfulfilled.length>1){
            pledgesfulfilled[pledgesfulfilled.length-2]+=" and "+pledgesfulfilled[pledgesfulfilled.length-1];
            pledgesfulfilled.pop();
          }
          messages.push("You fulfilled your pledge during "+pledgesfulfilled.join(", ")+"!");
        }
        else if(thisyearpledgefulfilled===true){
          messages.push("You have fulfilled your pledge during this year!");
        }
        if(pledgesunfulfilled.length>0){
          if(pledgesunfulfilled.length>1){
            pledgesunfulfilled[pledgesunfulfilled.length-2]+=" or "+pledgesunfulfilled[pledgesunfulfilled.length-1];
            pledgesunfulfilled.pop();
          }
          messages.push("You did not fulfil your pledge during "+pledgesunfulfilled.join(", ")+".");
        }
        if(thisyearpledgefulfilled===false){
          messages.push("You have not yet fulfilled your pledge during this year.");
        }
        $("#alltimepledgemetermessage").html("<div class=\"sofar\">"+messages.join("<br>")+"</div>");*/
        if(noincomerecordedsincejoining.length>1){
          noincomerecordedsincejoining[noincomerecordedsincejoining.length-2]+=" or "+noincomerecordedsincejoining[noincomerecordedsincejoining.length-1];
          noincomerecordedsincejoining.pop();
        }
        if(Math.round(totaldonationsabsolutely*100)==Math.round(totaldonationssincejoining*100)){
          setPledgeMeter("alltime",fixeddata.ismember?100*overallpercentage/fixeddata.percentagepledged:overallpercentage);
          var message="<div class=\"isfulfilled\">In total, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,false)+"</strong>.</div>";
          if(Math.round(totaldonationsabsolutely*100)==Math.round(totaldonationswithincome*100)){
            message+="<div class=\"sofar\">This amounts to <strong class=\"overallpercentage\">"+overallpercentage.toFixed(2)*1+"%</strong> of your income."+(fixeddata.ismember&&overallpercentage>=fixeddata.percentagepledged-fixeddata.pledgepercentageerrormargin?" Congratulations!":"")+"</div>";
          }
          else{
            if(noincomerecordedsincejoining.length>0){
              message+="<div class=\"sofar\">You have not entered any income for "+noincomerecordedsincejoining.join(", ")+".</div>";
            }
            message+="<div class=\"sofar\">During the years for which you have entered income, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationswithincome,false)+"</strong>, which amounts to <strong class=\"overallpercentage\">"+overallpercentage.toFixed(2)*1+"%</strong> of your income.</div>";
          }
          socialmediamessages["alltime"]="I am tracking my charitable giving through Giving What We Can and have donated "+overallpercentage.toFixed(0)*1+"% of my income";
        }
        else{
          setPledgeMeter("alltime",100*overallpercentagesincejoining/fixeddata.percentagepledged);
          var message="<div class=\"isfulfilled\">Since joining Giving What We Can, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoining,false)+"</strong>.</div>";
          if(Math.round(totaldonationssincejoining*100)==Math.round(totaldonationswithincomesincejoining*100)){
            message+="<div class=\"sofar\">This amounts to <strong class=\"overallpercentage\">"+overallpercentagesincejoining.toFixed(2)*1+"%</strong> of your income over this period."+(overallpercentagesincejoining>=fixeddata.percentagepledged-fixeddata.pledgepercentageerrormargin?" Congratulations!":"")+"</div>";
          }
          else{
            if(noincomerecordedsincejoining.length>0){
              message+="<div class=\"sofar\">You have not entered any income for "+noincomerecordedsincejoining.join(", ")+".</div>";
            }
            message+="<div class=\"sofar\">During the years for which you have entered income since joining, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationswithincomesincejoining,false)+"</strong>, which amounts to <strong class=\"overallpercentage\">"+overallpercentagesincejoining.toFixed(2)*1+"%</strong> of your income.</div>";
          }
          message+="<div class=\"sofar\">In total, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,false)+"</strong>.</div>";
          socialmediamessages["alltime"]="I am tracking my charitable giving through Giving What We Can and have donated "+overallpercentagesincejoining.toFixed(0)*1+"% of my income";
        }
      }
      else{
        if(fixeddata.ismember){
          setPledgeMeter("alltime",0);
        }
        else{
          $("#alltimepledgemeter").hide();
        }
        if(Math.round(totaldonationsabsolutely*100)==Math.round(totaldonationssincejoining*100)){
          var message="<div class=\"isfulfilled\">In total, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,false)+"</strong>.</div>";
        }
        else{
          var message="<div class=\"isfulfilled\">Since joining Giving What We Can, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationssincejoining,false)+"</strong>.</div>";
          message+="<div class=\"sofar\">In total, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,false)+"</strong>.</div>";
        }
        socialmediamessages["alltime"]="I am tracking my charitable giving through Giving What We Can"+(dashboarddata.donations.length==0&&dashboarddata.recurringdonations.length==0?"":" and have donated a total of "+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,true));
        $("#alltimepledgemeterheader").hide();
        $("#alltimepledgemeters").hide();
        if(incomerecorded){
          message+="<div class=\"sofar\">You have not entered any income for since you joined Giving What We Can.</div>";
        }
        else{
          message+=fixeddata.ismember?"<div class=\"sofar\">You have not entered any income.</div>":"";
        }
      }
    }
    else{

      //separate messages and social media message for trying giving
      var message="<div class=\"isfulfilled\">While trying giving from "+basicfunctions.formatDate(fixeddata.trygivingstartdate)+" to "+basicfunctions.formatDate(fixeddata.trygivingenddate)+", you"+(fixeddata.trygivingenddate.getTime()<fixeddata.today.getTime()?"":" have")+" donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationstryinggiving,false)+"</strong>.</div>";
      if(relevantincomerecorded){
        if(noincomerecordedtryinggiving.length>1){
          noincomerecordedtryinggiving[noincomerecordedtryinggiving.length-2]+=" or "+noincomerecordedtryinggiving[noincomerecordedtryinggiving.length-1];
          noincomerecordedtryinggiving.pop();
        }
        setPledgeMeter("alltime",100*overallpercentagetryinggiving/fixeddata.percentagepledged);
        if(Math.round(totaldonationstryinggiving*100)==Math.round(totaldonationswithincometryinggiving*100)){
          message+="<div class=\"sofar\">This amounts to <strong class=\"overallpercentage\">"+overallpercentagetryinggiving.toFixed(2)*1+"%</strong> of your pro-rata income over this period."+(overallpercentagetryinggiving>=fixeddata.percentagepledged-fixeddata.pledgepercentageerrormargin?" Congratulations!":"")+"</div>";
        }
        else{
          if(noincomerecordedtryinggiving.length>0){
            message+="<div class=\"sofar\">You have not entered any income for "+noincomerecordedtryinggiving.join(", ")+".</div>";
          }
          message+="<div class=\"sofar\">During the years for which you have entered income while trying giving, you"+(fixeddata.trygivingenddate.getTime()<fixeddata.today.getTime()?"":" have")+" donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationswithincometryinggiving,false)+"</strong>, which amounts to <strong class=\"overallpercentage\">"+overallpercentagetryinggiving.toFixed(2)*1+"%</strong> of your pro-rata income.</div>";
        }
        socialmediamessages["alltime"]="I am tracking my charitable giving through Giving What We Can and have donated "+overallpercentagetryinggiving.toFixed(0)*1+"% of my income";
      }
      else{
        setPledgeMeter("alltime",0);
        if(noincomerecordedtryinggiving.length>0){
          message+="<div class=\"sofar\">You have not entered any income for "+noincomerecordedtryinggiving.join(", ")+".</div>";
        }
        socialmediamessages["alltime"]="I am tracking my charitable giving through Giving What We Can"+(dashboarddata.donations.length==0&&dashboarddata.recurringdonations.length==0?"":" and have donated a total of "+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,true));
      }
      if(Math.round(totaldonationsabsolutely*100)!=Math.round(totaldonationstryinggiving*100)){
        message+="<div class=\"sofar\">In total, you have donated <strong>"+basicfunctions.formatCurrency(dashboarddata.defaultcurrency,totaldonationsabsolutely,false)+"</strong>.</div>";
      }

    }
    $("#alltimetotaldonations").html(message);

    //set the social media button links using the social media messages
    for(var i=-1;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      var year=i==-1?"alltime":(fixeddata.startyear+i);
      //$("#"+year+"facebooklink").prop("href","http://www.facebook.com/sharer.php?s=100&p[url]=http://bit.ly/1nzxaAp");//"http://www.facebook.com/sharer.php?s=100&p[title]=My Giving What We Can donation progress&p[summary]="+socialmediamessages[year]+"%21&p[url]=http://bit.ly/1nzxaAp&p[images][0]=http://files.centreforeffectivealtruism.net/logos/gwwc-logo-2014-redbg.png"
      //$("#"+year+"twitterlink").prop("href","https://twitter.com/intent/tweet?text="+socialmediamessages[year]+"%21 http://bit.ly/1nzxaAp");
    }

  };

  updatePledgeMeters();

  //updates a pie chart of collated donations, or all of them if year is not set
  function updateCollatedDonations(year){//year determines which tab is updated
    var update=function(year){
      var collateddonations=year=="alltime"?basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)}):basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
      if(collateddonations.length>0){
        $("#"+year+"collateddonations").show();
        $("#"+year+"collateddonationsheader").show();
        if(visualizationLoaded){
          var data=google.visualization.arrayToDataTable([["Charity","Donation"]].concat(collateddonations));
          var formatter=new google.visualization.NumberFormat(typeof(fixeddata.currencysymbol[dashboarddata.defaultcurrency])=="undefined"?{"suffix": " "+dashboarddata.defaultcurrency}:{"prefix":fixeddata.currencysymbol[dashboarddata.defaultcurrency]});
          formatter.format(data,1);
          var options={
            "pieSliceText":"value"
          };
          var chart=new google.visualization.PieChart(document.getElementById(year+"collateddonations"));
          chart.draw(data,options);
        }
      }
      else{
        $("#"+year+"collateddonations").hide();
        $("#"+year+"collateddonationsheader").hide();
      }
    };
    if(typeof(year)=="undefined"){
      for(var i=-1;i<fixeddata.endyear-fixeddata.startyear+1;i++){
        var year=i==-1?"alltime":(fixeddata.startyear+i);
        update(year);
      }
    }
    else{
      if(year!="alltime"){
        year=year*1;
      }
      update(year);
    }
  };

  updateCollatedDonations();

  //updates the lists of effects of donations
  function updateDonationEffects(){
    for(var i=-1;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      var year=i==-1?"alltime":(fixeddata.startyear+i);
      $("#"+year+"collateddonationsheader").html("Where you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated");
      $("#"+year+"donationeffectsheader").html("What you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"achieved");
      $("#"+year+"donationstimelineheader").html("When you "+(year=="alltime"||year==fixeddata.endyear||year==getcurrentyear()?"have ":"")+"donated");
      $("#"+year+"donationeffects").empty();
      var collateddonationsdefault=year=="alltime"?basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)}):basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
      var collateddonationsdollars=year=="alltime"?basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,"USD",{"cap":new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1)}):basicfunctions.getCollatedDonations(dashboarddata.donations,dashboarddata.recurringdonations,"USD",{"start":new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)});
      if(collateddonationsdollars.length==0){
        $("#"+year+"donationeffectsheader").hide();
      }
      else{
        $("#"+year+"donationeffectsheader").show();
        var charities=collateddonationsdollars.transpose()[0];
        for(var j=0;j<charities.length;j++){
          var k=fixeddata.topcharities.indexOf(charities[j]);
          if(k!=-1&&typeof(fixeddata.topcharitymetrics[charities[j]])!="undefined"){
            var charitymetrics=fixeddata.topcharitymetrics[charities[j]];
          }
          else{
            var charitymetrics=["donated",1,"Other.jpg","default"];
          }
          $("#"+year+"donationeffects").append("<p><img src=\""+fixeddata.modulepath+"/charityimages/"+charitymetrics[2]+"\" class=\"circle circle-charity-icon\"><strong>"+charities[j]+"</strong>:<br><strong>"+(charitymetrics[3]=="number"?basicfunctions.formatNumber(collateddonationsdollars[j][1]/charitymetrics[1]):(charitymetrics[3]=="dollars"?basicfunctions.formatCurrency("USD",collateddonationsdollars[j][1]/charitymetrics[1],false):basicfunctions.formatCurrency(dashboarddata.defaultcurrency,collateddonationsdefault[j][1]/charitymetrics[1],false)))+"</strong> "+charitymetrics[0]+"</p>");
        }
      }
    }
  };

  updateDonationEffects();

  //updates a timeline of donations
  function updateDonationsTimelines(year){//year determines which tab is updated
    if(fixeddata.othertabs.indexOf(year)==-1){
      if(year!="alltime"){
        year=year*1;
      }
      if(year=="alltime"&&dashboarddata.donations.length==0&&dashboarddata.recurringdonations.length==0){
        $("#alltimedonationstimelineheader").hide();
        $("#alltimedonationstimeline").hide();
      }
      else{
        var alldonations=basicfunctions.unpackRecurringDonations(dashboarddata.donations,dashboarddata.recurringdonations,new Date(fixeddata.endyear+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate).addDays(-1));
        var getTimes=function(donations){
          if(donations.length==0){
            return [-Infinity];
          }
          else{
            var times=donations.transpose()[0];
            for(var j=0;j<times.length;j++){
              times[j]=times[j].getTime();
            }
            return times;
          }
        };
        var startdate=year=="alltime"?(new Date(Math.min.apply(Math,getTimes(alldonations)))).addDays(-1):new Date(year,dashboarddata.yearstartmonth,dashboarddata.yearstartdate);
        var enddate=year=="alltime"?(new Date(Math.max.apply(Math,getTimes(alldonations)))).addDays(1):(new Date(year+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)).addDays(-1);
        if((year=="alltime"||year==fixeddata.endyear||year==getcurrentyear())&&fixeddata.today.getTime()>Math.max.apply(Math,getTimes(alldonations))){
          enddate=fixeddata.today;
        }

        //makes a line graph
        var donationindices=[];
        for(var j=0;j<alldonations.length;j++){
          donationindices.push(j);
        }
        donationindices.sort(function(a,b){if(alldonations[a][0].getTime()==alldonations[b][0].getTime()){return a<b?-1:1;}else{return (alldonations[a][0].getTime()<alldonations[b][0].getTime())?-1:1;}});
        $("#"+year+"donationstimelineheader").hide();
        $("#"+year+"donationstimeline").hide();
        var array=[["Date","Donations"]];
        var date=startdate;
        var cumulativedonations=0;
        var j=0;
        while(date.getTime()<=enddate.getTime()){
          if(j<donationindices.length&&alldonations[donationindices[j]][0].getDate()==date.getDate()&&alldonations[donationindices[j]][0].getMonth()==date.getMonth()&&alldonations[donationindices[j]][0].getFullYear()==date.getFullYear()){
            $("#"+year+"donationstimelineheader").show();
            $("#"+year+"donationstimeline").show();
            cumulativedonations+=alldonations[donationindices[j]][3]*basicfunctions.currencyConversionFactor(alldonations[donationindices[j]][2],dashboarddata.defaultcurrency,alldonations[donationindices[j]][0]);
            j++;
          }
          else if(j<donationindices.length&&alldonations[donationindices[j]][0].getTime()<startdate.getTime()){
            j++;
          }
          else{
            array.push([basicfunctions.formatDate(date),cumulativedonations]);
            date=date.addDays(1);
          }
        }
        if(visualizationLoaded){
          var data=google.visualization.arrayToDataTable(array);
          var formatter=new google.visualization.NumberFormat(typeof(fixeddata.currencysymbol[dashboarddata.defaultcurrency])=="undefined"?{"suffix": " "+dashboarddata.defaultcurrency}:{"prefix":fixeddata.currencysymbol[dashboarddata.defaultcurrency]});
          formatter.format(data,1);
          var options={
            "hAxis":{"title":"Date","textPosition":"none"},
            "vAxis":{"title":"Donations ("+(typeof(fixeddata.currencysymbol[dashboarddata.defaultcurrency])=="undefined"?dashboarddata.defaultcurrency:fixeddata.currencysymbol[dashboarddata.defaultcurrency])+")","minValue":0},
            "legend":{"position":"none"},
            "colors":["#6c0000"]
          };
          var chart=new google.visualization.LineChart(document.getElementById(year+"donationstimeline"));
          chart.draw(data,options);
        }

        //makes an annotated timeline
        /*var dates=[];
        var array=[];
        var date=startdate;
        while(date.getTime()<=enddate.getTime()){
          dates.push(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
          array.push([date,0]);
          date=date.addDays(1);
        }
        $("#"+year+"donationstimelineheader").hide();
        $("#"+year+"donationstimeline").hide();
        for(var j=0;j<alldonations.length;j++){
          var index=dates.indexOf(alldonations[j][0].getDate()+"/"+(alldonations[j][0].getMonth()+1)+"/"+alldonations[j][0].getFullYear());
          if(index!=-1){
            $("#"+year+"donationstimelineheader").show();
            $("#"+year+"donationstimeline").show();
            while(index<dates.length){
              array[index][1]+=alldonations[j][3]*basicfunctions.currencyConversionFactor(alldonations[j][2],dashboarddata.defaultcurrency,alldonations[j][0]);
              index++;
            }
          }
        }
        if(visualizationLoaded){
          var data=new google.visualization.DataTable();
          data.addColumn("date","Date");
          data.addColumn("number","Donations");
          data.addRows(array);
          var chart=new google.visualization.AnnotatedTimeLine(document.getElementById(year+"donationstimeline"));
          chart.draw(data,{"displayAnnotations":true});
        }*/

      }
    }
  };

  updateDonationsTimelines(fixeddata.activetab);

  function visualizationLoadedFunction(){
    visualizationLoaded=true;
    updatePledgeMeters();
    updateCollatedDonations();
    updateDonationsTimelines(fixeddata.activetab);
  };
  if(visualizationLoaded){
    visualizationLoadedFunction();
  }
  else{
    google.setOnLoadCallback(visualizationLoadedFunction);
  }

  $(".lastupdated").html(basicfunctions.formatDate(dashboarddata.lastupdated));

  //updates the "last updated" date to the given PHP timestamp
  function updateLastUpdated(timestamp){
    fixeddata.today=new Date(timestamp*1000);
    dashboarddata.lastupdated=fixeddata.today;
    $(".lastupdated").html(basicfunctions.formatDate(dashboarddata.lastupdated));
  };

  /*----------
   "EDIT" TAB
  ----------*/

  //configure default currency select
  (function(){
    for(var i=0;i<fixeddata.currencies.length;i++){
      $("#currencyselect").append("<option value=\""+fixeddata.currencies[i]+"\""+(dashboarddata.defaultcurrency==fixeddata.currencies[i]?" selected=\"selected\"":"")+">"+fixeddata.currencies[i]+"</option>");
    }
    $("#currencyselect").change(function(){
      dashboarddata.defaultcurrency=$("#currencyselect").val();
      $.post(fixeddata.ajaxformurl,{"action":"defaultcurrency","currency":dashboarddata.defaultcurrency,"userid":fixeddata.userid,"authentication":dashboarddata.authentication});
      updatePledgeMeters();
      updateCollatedDonations();
      updateIncomeTable();
    });
  })();

  //configure year start date select
  function updateYearStartDateSelect(){
    $("#yearstartdateselect").empty();
    for(var i=1;i<fixeddata.monthlengths[dashboarddata.yearstartmonth]+1;i++){
      $("#yearstartdateselect").append("<option value=\""+i+"\">"+i+"</option>");
    }
    $("#yearstartdateselect").val(dashboarddata.yearstartdate+"");
  };
  (function(){
    if((dashboarddata.yearstartdate==1&&dashboarddata.yearstartmonth%3==0)||(dashboarddata.yearstartdate==6&&dashboarddata.yearstartmonth==3)){
      $("#yearstartselect").val(dashboarddata.yearstartdate+"/"+(dashboarddata.yearstartmonth+1));
      $("#yearstartother").hide();
    }
    else{
      $("#yearstartselect").val("Other");
      updateYearStartDateSelect();
      $("#yearstartmonthselect").val(dashboarddata.yearstartmonth+"");
    }
    $("#yearstartselect").change(function(){
      if($("#yearstartselect").val()=="Other"){
        $("#yearstartother").show();
        dashboarddata.yearstartdate=$("#yearstartdateselect").val();
        dashboarddata.yearstartmonth=$("#yearstartmonthselect").val();
        $.post(fixeddata.ajaxformurl,{"action":"yearstart","date":dashboarddata.yearstartdate,"month":dashboarddata.yearstartmonth,"userid":fixeddata.userid,"authentication":dashboarddata.authentication});
      }
      else{
        $("#yearstartother").hide();
        dashboarddata.yearstartdate=$("#yearstartselect").val().split("/")[0]*1;
        dashboarddata.yearstartmonth=$("#yearstartselect").val().split("/")[1]-1;
        $.post(fixeddata.ajaxformurl,{"action":"yearstart","date":dashboarddata.yearstartdate,"month":dashboarddata.yearstartmonth,"userid":fixeddata.userid,"authentication":dashboarddata.authentication});
      }
      updateIncomeTable();
      updatePledgeMeters();
      updateCollatedDonations();
      updateDonationEffects();
    });
    $("#yearstartdateselect").change(function(){
      dashboarddata.yearstartdate=$("#yearstartdateselect").val();
      $.post(fixeddata.ajaxformurl,{"action":"yearstart","date":dashboarddata.yearstartdate,"month":dashboarddata.yearstartmonth,"userid":fixeddata.userid,"authentication":dashboarddata.authentication});
      updateIncomeTable();
      updatePledgeMeters();
      updateCollatedDonations();
      updateDonationEffects();
    });
    $("#yearstartmonthselect").change(function(){
      dashboarddata.yearstartmonth=$("#yearstartmonthselect").val();
      dashboarddata.yearstartdate=Math.min(dashboarddata.yearstartdate,fixeddata.monthlengths[dashboarddata.yearstartmonth]);
      $.post(fixeddata.ajaxformurl,{"action":"yearstart","date":dashboarddata.yearstartdate,"month":dashboarddata.yearstartmonth,"userid":fixeddata.userid,"authentication":dashboarddata.authentication});
      updateYearStartDateSelect();
      updateIncomeTable();
      updatePledgeMeters();
      updateCollatedDonations();
      updateDonationEffects();
    });
  })();

  var donationstable={
    "body":$("#donationstable>tbody"),
    "foot":$("#donationstable>tfoot"),

    "updatebody":function(){//draws the donation rows of the table of donations
      donationstable.body.empty();
      donationstable.selectedrow=-1;
      donationstable.rows=[];
      donationstable.cells=[];
      donationstable.spans=[];//these contain the displayed text
      donationstable.dateinputs=[];//input for specifying the donation dates
      donationstable.charityinputs=[];//charity radio buttons
      donationstable.charityinputlabels=[];
      donationstable.otherinputs=[];//for other charities
      donationstable.seemorebuttons=[];
      donationstable.amountinputs=[];//input for specifying the donation amount
      donationstable.currencyselects=[];//input for specifying the donation currency
      donationstable.editbuttons=[];
      donationstable.deletebuttons=[];
      donationstable.savebuttons=[];
      donationstable.savebuttoninfos=[];
      donationstable.cancelbuttons=[];
      for(var i=0;i<dashboarddata.donations.length;i++){

        donationstable.rows.push($("<tr></tr>"));
        donationstable.cells.push([$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>")]);

        donationstable.spans.push([$("<span></span>"),$("<span></span>"),$("<span></span>")]);
        donationstable.spans[i][0].html(basicfunctions.formatDate(dashboarddata.donations[i][0]));
        donationstable.spans[i][1].text(dashboarddata.donations[i][1]);
        donationstable.spans[i][2].html(basicfunctions.formatCurrency(dashboarddata.donations[i][2],dashboarddata.donations[i][3],false));
        for(var j=0;j<3;j++){
          donationstable.cells[i][j].append(donationstable.spans[i][j]);
        }

        donationstable.dateinputs.push($("<input>",{"type":"text"}));
        donationstable.cells[i][0].append(donationstable.dateinputs[i]);
        donationstable.dateinputs[i].datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(fixeddata.endyear,11,31)});

        donationstable.charityinputs.push([]);
        donationstable.charityinputlabels.push([]);
        for(var k=0;k<fixeddata.topcharities.length;k++){
          donationstable.charityinputlabels[i].push($("<label></label>"));
          donationstable.charityinputs[i].push($("<input>",{"type":"radio","name":"donationcharity"+i,"value":fixeddata.topcharities[k]}));
          donationstable.charityinputlabels[i][k].append(donationstable.charityinputs[i][k]," "+fixeddata.topcharities[k]);
          donationstable.cells[i][1].append(donationstable.charityinputlabels[i][k]);
        }
        k=fixeddata.topcharities.length;
        donationstable.charityinputlabels[i].push($("<label></label>"));
        donationstable.charityinputs[i].push($("<input>",{"type":"radio","name":"donationcharity"+i,"value":"Other"}));
        donationstable.charityinputs[i][k].click((function(i){
          return function(){
            donationstable.otherinputs[i].focus();
          };
        })(i));

        donationstable.otherinputs.push($("<input>",{"type":"text"}));
        donationstable.otherinputs[i].change((function(i,k){
          return function(){
            donationstable.charityinputs[i][k].prop("checked",true);
          };
        })(i,k));
        donationstable.charityinputlabels[i][k].append(donationstable.charityinputs[i][k]," Other: ",donationstable.otherinputs[i]);
        donationstable.cells[i][1].append(donationstable.charityinputlabels[i][k]);

        donationstable.seemorebuttons.push($("<button></button>"));
        donationstable.seemorebuttons[i].html("show other charities");
        donationstable.seemorebuttons[i].click((function(i){
          return function(){
            for(var k=fixeddata.editshowcharities;k<fixeddata.topcharities.length+1;k++){
              donationstable.charityinputlabels[i][k].show();
            }
            donationstable.seemorebuttons[i].hide();
          };
        })(i));
        donationstable.cells[i][1].append(donationstable.seemorebuttons[i]);

        donationstable.amountinputs.push($("<input>",{"type":"text"}));
        donationstable.amountinputs[i].keypress((function(i){
          return function(event){
            var keycode=(event.keyCode?event.keyCode:event.which);
            if(keycode==13){
              donationstable.savebuttons[i].triggerHandler("click");
            }
          };
        })(i));

        donationstable.currencyselects.push($("<select></select>"));
        for(var m=0;m<fixeddata.currencies.length;m++){
          donationstable.currencyselects[i].append("<option value=\""+fixeddata.currencies[m]+"\">"+fixeddata.currencies[m]+"</option>");
        }
        donationstable.cells[i][2].append(donationstable.amountinputs[i],donationstable.currencyselects[i]);

        donationstable.editbuttons.push($("<button></button>"));
        donationstable.editbuttons[i].html("edit");
        donationstable.editbuttons[i].click((function(i){
          return function(){
            //disable edit/delete buttons and add new donations button
            for(var j=0;j<dashboarddata.donations.length;j++){
              donationstable.editbuttons[j].prop("disabled",true);
              donationstable.deletebuttons[j].prop("disabled",true);
            }
            donationstable.addnewbutton.prop("disabled",true);
            //set values of inputs
            donationstable.dateinputs[i].datepicker("option","dateFormat","d/m/yy");
            donationstable.dateinputs[i].datepicker("setDate",dashboarddata.donations[i][0].getDate()+"/"+(dashboarddata.donations[i][0].getMonth()+1)+"/"+dashboarddata.donations[i][0].getFullYear());
            donationstable.dateinputs[i].datepicker("option","dateFormat","yy-mm-dd");
            var l=fixeddata.topcharities.indexOf(dashboarddata.donations[i][1]);
            if(l==-1){
              donationstable.charityinputs[i][fixeddata.topcharities.length].prop("checked",true);
              donationstable.otherinputs[i].val(dashboarddata.donations[i][1]);
            }
            else{
              donationstable.charityinputs[i][l].prop("checked",true);
            }
            donationstable.amountinputs[i].val(dashboarddata.donations[i][3]);
            donationstable.currencyselects[i].val(dashboarddata.donations[i][2]);
            //show and hide the appropriate elements
            for(var j=0;j<3;j++){
              donationstable.spans[i][j].hide();
            }
            donationstable.editbuttons[i].hide();
            donationstable.deletebuttons[i].hide();
            donationstable.dateinputs[i].show();
            for(var k=0;k<fixeddata.editshowcharities;k++){
              donationstable.charityinputlabels[i][k].show();
            }
            var l=fixeddata.topcharities.indexOf(dashboarddata.donations[i][1]);
            if(l==-1){
              donationstable.charityinputlabels[i][fixeddata.topcharities.length].show();
            }
            else{
              donationstable.charityinputlabels[i][l].show();
            }
            donationstable.seemorebuttons[i].show();
            donationstable.amountinputs[i].show();
            donationstable.currencyselects[i].show();
            donationstable.savebuttons[i].show();
            donationstable.savebuttoninfos[i].show();
            donationstable.cancelbuttons[i].show();
          };
        })(i));

        donationstable.deletebuttons.push($("<button></button>"));
        donationstable.deletebuttons[i].html("delete");
        donationstable.deletebuttons[i].click((function(i){
          return function(){
            if(confirm("Are you sure you want to delete this donation?\n\nNote that this will NOT cancel any payments you have made.")){
              for(var j=0;j<dashboarddata.donations.length;j++){
                donationstable.editbuttons[j].prop("disabled",true);
                donationstable.deletebuttons[j].prop("disabled",true);
              }
              donationstable.addnewbutton.prop("disabled",true);
              $.post(fixeddata.ajaxformurl,{"action":"deletedonation","number":dashboarddata.donations[i][4],"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                for(var j=0;j<dashboarddata.donations.length;j++){
                  donationstable.editbuttons[j].prop("disabled",false);
                  donationstable.deletebuttons[j].prop("disabled",false);
                }
                donationstable.addnewbutton.prop("disabled",false);
                if(data.status=="success"){
                  dashboarddata.donations.splice(i,1);
                  donationstable.updatebody();
                  updatePledgeMeters();
                  updateCollatedDonations();
                  updateDonationEffects();
                  updateIncomeTable();
                  updateLastUpdated(data.timestamp);
                }
                else if(data.status=="error"){
                  if(data.message=="donation not found"){
                    alert("Error: that donation has been deleted.\n\nPlease refresh the page, or contact webmaster@givingwhatwecan.org if the problem persists.");
                  }
                  else{
                    alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                  }
                }
                else{
                  alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
              },"json");
            }
          };
        })(i));

        donationstable.savebuttons.push($("<button></button>"));
        donationstable.savebuttons[i].html("save");
        donationstable.savebuttons[i].click((function(i){
          return function(){
            //validation
            var date=donationstable.dateinputs[i].datepicker("getDate");
            if(date===null){
              alert("Please enter a valid date in the format yyyy-mm-dd.");
            }
            else if(date.getTime()<(new Date(fixeddata.startyear,0,1)).getTime()){
              alert("Please enter a date no less recent than 1st January "+fixeddata.startyear+".");
            }
            else if(date.getTime()>(new Date(fixeddata.endyear,11,31)).getTime()){
              alert("Please enter a date no later than 31st December "+fixeddata.endyear+".");
            }
            else{
              var checkedcharity=$("input:radio[name=\"donationcharity"+i+"\"]:checked",donationstable.cells[i][1]).val();
              if(checkedcharity=="Other"){
                checkedcharity=donationstable.otherinputs[i].val();
              }
              if(!checkedcharity){
                alert("Please select a charity.");
              }
              else if(basicfunctions.numval(donationstable.amountinputs[i].val(),2)<=0){
                alert("Please enter a valid positive donation amount.");
                donationstable.amountinputs[i].focus();
              }
              else{
                donationstable.savebuttons[i].prop("disabled",true);
                donationstable.cancelbuttons[i].prop("disabled",true);
                $.post(fixeddata.ajaxformurl,{"action":"editdonation","number":dashboarddata.donations[i][4],"value0":Math.round(donationstable.dateinputs[i].datepicker("getDate").getTime()/1000),"value1":checkedcharity,"value2":donationstable.currencyselects[i].val(),"value3":basicfunctions.numval(donationstable.amountinputs[i].val(),2),"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                  donationstable.savebuttons[i].prop("disabled",false);
                  donationstable.cancelbuttons[i].prop("disabled",false);
                  if(data.status=="success"){
                    donationstable.addnewbutton.prop("disabled",false);
                    dashboarddata.donations[i]=[donationstable.dateinputs[i].datepicker("getDate"),checkedcharity,donationstable.currencyselects[i].val(),basicfunctions.numval(donationstable.amountinputs[i].val(),2),dashboarddata.donations[i][4]];
                    donationstable.updatebody();
                    updatePledgeMeters();
                    updateCollatedDonations();
                    updateDonationEffects();
                    updateDonationsTimelines(fixeddata.activetab);
                    updateIncomeTable();
                    updateLastUpdated(data.timestamp);
                  }
                  else if(data.status=="error"){
                    if(data.message=="donation not found"){
                      alert("Error: that donation has been deleted.\n\nPlease refresh the page, or contact webmaster@givingwhatwecan.org if the problem persists.");
                    }
                    else{
                      alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                    }
                  }
                  else{
                    alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                  }
                },"json");
              }
            }
          };
        })(i));

        donationstable.savebuttoninfos.push($("<div style=\"line-height:1em\"><small>Note that this will <b>not</b> modify any payments you have made.</small></div>"));

        donationstable.cancelbuttons.push($("<button></button>"));
        donationstable.cancelbuttons[i].html("cancel");
        donationstable.cancelbuttons[i].click((function(i){
          return function(){
            //reenable edit/delete buttons and add new donations button
            for(var j=0;j<dashboarddata.donations.length;j++){
              donationstable.editbuttons[j].prop("disabled",false);
              donationstable.deletebuttons[j].prop("disabled",false);
            }
            donationstable.addnewbutton.prop("disabled",false);
            //show and hide the appropriate elements
            donationstable.dateinputs[i].hide();
            for(var k=0;k<fixeddata.topcharities.length+1;k++){
              donationstable.charityinputlabels[i][k].hide();
            }
            donationstable.seemorebuttons[i].hide();
            donationstable.amountinputs[i].hide();
            donationstable.currencyselects[i].hide();
            donationstable.savebuttons[i].hide();
            donationstable.savebuttoninfos[i].hide();
            donationstable.cancelbuttons[i].hide();
            for(var j=0;j<3;j++){
              donationstable.spans[i][j].show();
            }
            donationstable.editbuttons[i].show();
            donationstable.deletebuttons[i].show();
          };
        })(i));

        donationstable.cells[i][3].append(donationstable.editbuttons[i],donationstable.deletebuttons[i],donationstable.savebuttons[i],donationstable.savebuttoninfos[i],donationstable.cancelbuttons[i]);

        for(var j=0;j<4;j++){
          donationstable.rows[i].append(donationstable.cells[i][j]);
        }

        //hide the appropriate elements
        donationstable.dateinputs[i].hide();
        for(var k=0;k<fixeddata.topcharities.length+1;k++){
          donationstable.charityinputlabels[i][k].hide();
        }
        donationstable.seemorebuttons[i].hide();
        donationstable.amountinputs[i].hide();
        donationstable.currencyselects[i].hide();
        donationstable.savebuttons[i].hide();
        donationstable.savebuttoninfos[i].hide();
        donationstable.cancelbuttons[i].hide();

        //row shading hover effect
        donationstable.rows[i].mouseover((function(i){
          return function(){
            if(i!=donationstable.selectedrow){
              donationstable.rows[i].css("background-color","#f5f5f5");
            }
          };
        })(i));
        donationstable.rows[i].mouseout((function(i){
          return function(){
            if(i!=donationstable.selectedrow){
              donationstable.rows[i].css("background-color","#ffffff");
            }
          };
        })(i));

        //row shading click effect
        donationstable.rows[i].click((function(i){
          return function(event){
            for(var j=0;j<dashboarddata.donations.length;j++){
              if(j==i){
                donationstable.rows[j].css("background-color","#d8dfea");
                donationstable.selectedrow=j;
              }
              else{
                donationstable.rows[j].css("background-color","#ffffff");
              }
            }
            event.stopPropagation();
          };
        })(i));
      }

      //append the rows in a sorted order
      var donationindices=[];
      for(var i=0;i<dashboarddata.donations.length;i++){
        donationindices.push(i);
      }
      donationindices.sort(function(a,b){if(dashboarddata.donations[a][0].getTime()==dashboarddata.donations[b][0].getTime()){return a<b?-1:1;}else{return (dashboarddata.donations[a][0].getTime()<dashboarddata.donations[b][0].getTime())?-1:1;}});
      for(var i=0;i<donationindices.length;i++){
        donationstable.body.append(donationstable.rows[donationindices[i]]);
      }

      //hide the column headers if there are no donations
      if(dashboarddata.donations.length==0){
        $("#donationstable>thead").hide();
      }
      else{
        $("#donationstable>thead").show();
      }
    },

    "updatefoot":function(){//draws the "add new donation" row - donationstable.footx is the corresponding element to donationstable.x[i] but in the table footer
      donationstable.foot.empty();
      donationstable.footrow=$("<tr></tr>");
      donationstable.addnewbuttoncell=$("<td></td>",{"colspan":"3"});
      donationstable.addnewbuttoncell.css("text-align","center");
      donationstable.addnewbutton=$("<button></button>");
      donationstable.addnewbutton.html("add new donation");
      donationstable.addnewbutton.click(function(){
        for(var j=0;j<dashboarddata.donations.length;j++){
          donationstable.editbuttons[j].prop("disabled",true);
          donationstable.deletebuttons[j].prop("disabled",true);
        }
        donationstable.footrow.empty();
        donationstable.footcells=[$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>")];
        donationstable.footdateinput=$("<input>",{"type":"text"});
        donationstable.footcells[0].append(donationstable.footdateinput);
        donationstable.footdateinput.datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(fixeddata.endyear,11,31)});
        donationstable.footdateinput.datepicker("option","dateFormat","d/m/yy");
        donationstable.footdateinput.datepicker("setDate",fixeddata.today.getDate()+"/"+(fixeddata.today.getMonth()+1)+"/"+fixeddata.today.getFullYear());
        donationstable.footdateinput.datepicker("option","dateFormat","yy-mm-dd");
        donationstable.footcharityinputs=[];
        donationstable.footcharityinputlabels=[];
        for(var k=0;k<fixeddata.topcharities.length;k++){
          donationstable.footcharityinputlabels.push($("<label></label>"));
          donationstable.footcharityinputs.push($("<input>",{"type":"radio","name":"donationcharitynew","value":fixeddata.topcharities[k]}));
          donationstable.footcharityinputlabels[k].append(donationstable.footcharityinputs[k]," "+fixeddata.topcharities[k]);
          donationstable.footcells[1].append(donationstable.footcharityinputlabels[k]);
        }
        k=fixeddata.topcharities.length;
        donationstable.footcharityinputlabels.push($("<label></label>"));
        donationstable.footcharityinputs.push($("<input>",{"type":"radio","name":"donationcharitynew","value":"Other"}));
        donationstable.footcharityinputs[k].click(function(){
          donationstable.foototherinput.focus();
        });
        donationstable.foototherinput=$("<input>",{"type":"text"});
        donationstable.foototherinput.change((function(k){
          return function(){
            donationstable.footcharityinputs[k].prop("checked",true);
          };
        })(k));
        donationstable.footcharityinputlabels[k].append(donationstable.footcharityinputs[k]," Other: ",donationstable.foototherinput);
        donationstable.footcells[1].append(donationstable.footcharityinputlabels[k]);
        donationstable.footseemorebutton=$("<button></button>");
        donationstable.footseemorebutton.html("show other charities");
        donationstable.footseemorebutton.click(function(event){
          for(var k=fixeddata.addshowcharities;k<fixeddata.topcharities.length+1;k++){
            donationstable.footcharityinputlabels[k].show();
          }
          donationstable.footseemorebutton.hide();
        });
        donationstable.footcells[1].append(donationstable.footseemorebutton);
        donationstable.footamountinput=$("<input>",{"type":"text"});
        donationstable.footamountinput.keypress(function(event){
          var keycode=(event.keyCode?event.keyCode:event.which);
          if(keycode=="13"){
            donationstable.footsavebutton.triggerHandler("click");
          }
        });
        donationstable.footcurrencyselect=$("<select></select>");
        for(var m=0;m<fixeddata.currencies.length;m++){
          donationstable.footcurrencyselect.append("<option value=\""+fixeddata.currencies[m]+"\""+(dashboarddata.defaultcurrency==fixeddata.currencies[m]?" selected=\"selected\"":"")+">"+fixeddata.currencies[m]+"</option>");
        }
        donationstable.footcells[2].append(donationstable.footamountinput,donationstable.footcurrencyselect);
        donationstable.footsavebutton=$("<button></button>");
        donationstable.footsavebutton.html("save");
        donationstable.footsavebutton.click(function(){
          var date=donationstable.footdateinput.datepicker("getDate");
          if(date===null){
            alert("Please enter a valid date in the format yyyy-mm-dd.");
          }
          else if(date.getTime()<(new Date(fixeddata.startyear,0,1)).getTime()){
            alert("Please enter a date no less recent than 1st January "+fixeddata.startyear+".");
          }
          else if(date.getTime()>(new Date(fixeddata.endyear,11,31)).getTime()){
            alert("Please enter a date no later than 31st December "+fixeddata.endyear+".");
          }
          else{
            var checkedcharity=$("input:radio[name=\"donationcharitynew\"]:checked",donationstable.footcells[1]).val();
            if(checkedcharity=="Other"){
              checkedcharity=donationstable.foototherinput.val();
            }
            if(!checkedcharity){
              alert("Please select a charity.");
            }
            else if(basicfunctions.numval(donationstable.footamountinput.val(),2)<=0){
              alert("Please enter a valid positive donation amount.");
              donationstable.footamountinput.focus();
            }
            else{
              donationstable.footsavebutton.prop("disabled",true);
              donationstable.footcancelbutton.prop("disabled",true);
              $.post(fixeddata.ajaxformurl,{"action":"adddonation","value0":Math.round(donationstable.footdateinput.datepicker("getDate").getTime()/1000),"value1":checkedcharity,"value2":donationstable.footcurrencyselect.val(),"value3":basicfunctions.numval(donationstable.footamountinput.val(),2,0),"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                donationstable.footsavebutton.prop("disabled",false);
                donationstable.footcancelbutton.prop("disabled",false);
                if(data.status=="success"){
                  dashboarddata.donationsadded++;
                  dashboarddata.donations.push([donationstable.footdateinput.datepicker("getDate"),checkedcharity,donationstable.footcurrencyselect.val(),basicfunctions.numval(donationstable.footamountinput.val(),2,0),dashboarddata.donationsadded]);
                  donationstable.updatebody();
                  donationstable.updatefoot();
                  updatePledgeMeters();
                  updateCollatedDonations();
                  updateDonationEffects();
                  updateIncomeTable();
                  updateLastUpdated(data.timestamp);
                }
                else if(data.status=="error"){
                  alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
                else{
                  alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
              },"json");
            }
          }
        });
        donationstable.footsavebuttoninfo=$("<div style=\"line-height:1em\"><small>Note that this will <b>not</b> make any payments.</small></div>");
        donationstable.footcancelbutton=$("<button></button>");
        donationstable.footcancelbutton.html("cancel");
        donationstable.footcancelbutton.click(function(){
          for(var j=0;j<dashboarddata.donations.length;j++){
            donationstable.editbuttons[j].prop("disabled",false);
            donationstable.deletebuttons[j].prop("disabled",false);
          }
          if(dashboarddata.donations.length==0){
            $("#donationstable>thead").hide();
          }
          donationstable.updatefoot();
        });
        donationstable.footcells[3].append(donationstable.footsavebutton,donationstable.footsavebuttoninfo,donationstable.footcancelbutton);
        for(var j=0;j<4;j++){
          donationstable.footrow.append(donationstable.footcells[j]);
        }
        for(var k=fixeddata.addshowcharities;k<fixeddata.topcharities.length+1;k++){
          donationstable.footcharityinputlabels[k].hide();
        }
        $("#donationstable>thead").show();
      });
      donationstable.addnewbuttoncell.append(donationstable.addnewbutton);
      donationstable.addnewbuttoncell.append("<div style=\"line-height:1em\"><small>This will not make any payments &ndash; My Giving currently only supports self-reported donations.<br>To set up a donation, please visit our page on <a href=\"https://www.givingwhatwecan.org/donate\" style=\"text-decoration:underline;\">how to donate</a>.</small></div>");
      donationstable.footrow.append(donationstable.addnewbuttoncell);
      donationstable.foot.append(donationstable.footrow);
    }
  };

  donationstable.updatebody();
  donationstable.updatefoot();

  var recurringdonationstable={
    "body":$("#recurringdonationstable>tbody"),
    "foot":$("#recurringdonationstable>tfoot"),

    "updatebody":function(){//draws the donation rows of the table of donations
      recurringdonationstable.body.empty();
      recurringdonationstable.selectedrow=-1;
      recurringdonationstable.rows=[];
      recurringdonationstable.cells=[];
      recurringdonationstable.spans=[];//these contain the displayed text
      recurringdonationstable.startdateinputs=[];//input for specifying the start dates
      recurringdonationstable.enddateinputs=[];//input for specifying the end dates
      recurringdonationstable.enddateclearers=[];
      recurringdonationstable.frequencyamountinputs=[];//input for specifying the frequency amount
      recurringdonationstable.frequencyselects=[];//input for specifying the frequency unit
      recurringdonationstable.charityinputs=[];//charity radio buttons
      recurringdonationstable.charityinputlabels=[];
      recurringdonationstable.otherinputs=[];//for other charities
      recurringdonationstable.seemorebuttons=[];
      recurringdonationstable.amountinputs=[];//input for specifying the donation amount
      recurringdonationstable.currencyselects=[];//input for specifying the donation currency
      recurringdonationstable.editbuttons=[];
      recurringdonationstable.deletebuttons=[];
      recurringdonationstable.savebuttons=[];
      recurringdonationstable.savebuttoninfos=[];
      recurringdonationstable.cancelbuttons=[];
      for(var i=0;i<dashboarddata.recurringdonations.length;i++){

        recurringdonationstable.rows.push($("<tr></tr>"));
        recurringdonationstable.cells.push([$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>")]);

        recurringdonationstable.spans.push([$("<span></span>"),$("<span></span>"),$("<span></span>"),$("<span></span>"),$("<span></span>")]);
        recurringdonationstable.spans[i][0].html(basicfunctions.formatDate(dashboarddata.recurringdonations[i][0]));
        recurringdonationstable.spans[i][1].html(basicfunctions.formatDate(dashboarddata.recurringdonations[i][1]));
        recurringdonationstable.spans[i][2].html(basicfunctions.formatFrequency(dashboarddata.recurringdonations[i][2],dashboarddata.recurringdonations[i][3]));
        recurringdonationstable.spans[i][3].text(dashboarddata.recurringdonations[i][4]);
        recurringdonationstable.spans[i][4].html(basicfunctions.formatCurrency(dashboarddata.recurringdonations[i][5],dashboarddata.recurringdonations[i][6],false));
        for(var j=0;j<5;j++){
          recurringdonationstable.cells[i][j].append(recurringdonationstable.spans[i][j]);
        }

        recurringdonationstable.startdateinputs.push($("<input size=\"10\">",{"type":"text"}));
        recurringdonationstable.cells[i][0].append(recurringdonationstable.startdateinputs[i]);
        recurringdonationstable.startdateinputs[i].datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(fixeddata.endyear,11,31)});

        recurringdonationstable.enddateinputs.push($("<input size=\"10\">",{"type":"text"}));
        recurringdonationstable.enddateclearers.push($("<button>clear</button>"));
        recurringdonationstable.cells[i][1].append(recurringdonationstable.enddateinputs[i]);
        recurringdonationstable.cells[i][1].append(recurringdonationstable.enddateclearers[i]);
        recurringdonationstable.enddateinputs[i].datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(2099,11,31)});
        recurringdonationstable.enddateclearers[i].click((function(i){
          return function(){
            recurringdonationstable.enddateinputs[i].val("");
          }
        })(i));

        recurringdonationstable.frequencyamountinputs.push($("<input size=\"2\">",{"type":"text"}));
        recurringdonationstable.frequencyselects.push($("<select></select>"));
        for(var m=0;m<fixeddata.frequencies.length;m++){
          recurringdonationstable.frequencyselects[i].append("<option value=\""+fixeddata.frequencies[m]+"\">"+fixeddata.frequencies[m]+"(s)</option>");
        }
        recurringdonationstable.cells[i][2].append(recurringdonationstable.frequencyamountinputs[i],recurringdonationstable.frequencyselects[i]);

        recurringdonationstable.charityinputs.push([]);
        recurringdonationstable.charityinputlabels.push([]);
        for(var k=0;k<fixeddata.topcharities.length;k++){
          recurringdonationstable.charityinputlabels[i].push($("<label></label>"));
          recurringdonationstable.charityinputs[i].push($("<input>",{"type":"radio","name":"donationcharity"+i,"value":fixeddata.topcharities[k]}));
          recurringdonationstable.charityinputlabels[i][k].append(recurringdonationstable.charityinputs[i][k]," "+fixeddata.topcharities[k]);
          recurringdonationstable.cells[i][3].append(recurringdonationstable.charityinputlabels[i][k]);
        }
        k=fixeddata.topcharities.length;
        recurringdonationstable.charityinputlabels[i].push($("<label></label>"));
        recurringdonationstable.charityinputs[i].push($("<input>",{"type":"radio","name":"donationcharity"+i,"value":"Other"}));
        recurringdonationstable.charityinputs[i][k].click((function(i){
          return function(){
            recurringdonationstable.otherinputs[i].focus();
          };
        })(i));

        recurringdonationstable.otherinputs.push($("<input>",{"type":"text"}));
        recurringdonationstable.otherinputs[i].change((function(i,k){
          return function(){
            recurringdonationstable.charityinputs[i][k].prop("checked",true);
          };
        })(i,k));
        recurringdonationstable.charityinputlabels[i][k].append(recurringdonationstable.charityinputs[i][k]," Other: ",recurringdonationstable.otherinputs[i]);
        recurringdonationstable.cells[i][3].append(recurringdonationstable.charityinputlabels[i][k]);

        recurringdonationstable.seemorebuttons.push($("<button></button>"));
        recurringdonationstable.seemorebuttons[i].html("show other charities");
        recurringdonationstable.seemorebuttons[i].click((function(i){
          return function(){
            for(var k=fixeddata.editshowcharities;k<fixeddata.topcharities.length+1;k++){
              recurringdonationstable.charityinputlabels[i][k].show();
            }
            recurringdonationstable.seemorebuttons[i].hide();
          };
        })(i));
        recurringdonationstable.cells[i][3].append(recurringdonationstable.seemorebuttons[i]);

        recurringdonationstable.amountinputs.push($("<input>",{"type":"text"}));
        recurringdonationstable.amountinputs[i].keypress((function(i){
          return function(event){
            var keycode=(event.keyCode?event.keyCode:event.which);
            if(keycode==13){
              recurringdonationstable.savebuttons[i].triggerHandler("click");
            }
          };
        })(i));

        recurringdonationstable.currencyselects.push($("<select></select>"));
        for(var m=0;m<fixeddata.currencies.length;m++){
          recurringdonationstable.currencyselects[i].append("<option value=\""+fixeddata.currencies[m]+"\">"+fixeddata.currencies[m]+"</option>");
        }
        recurringdonationstable.cells[i][4].append(recurringdonationstable.amountinputs[i],recurringdonationstable.currencyselects[i]);

        recurringdonationstable.editbuttons.push($("<button></button>"));
        recurringdonationstable.editbuttons[i].html("edit");
        recurringdonationstable.editbuttons[i].click((function(i){
          return function(){
            //disable edit/delete buttons and add new donations button
            for(var j=0;j<dashboarddata.recurringdonations.length;j++){
              recurringdonationstable.editbuttons[j].prop("disabled",true);
              recurringdonationstable.deletebuttons[j].prop("disabled",true);
            }
            recurringdonationstable.addnewbutton.prop("disabled",true);
            //set values of inputs
            recurringdonationstable.startdateinputs[i].datepicker("option","dateFormat","d/m/yy");
            recurringdonationstable.startdateinputs[i].datepicker("setDate",dashboarddata.recurringdonations[i][0].getDate()+"/"+(dashboarddata.recurringdonations[i][0].getMonth()+1)+"/"+dashboarddata.recurringdonations[i][0].getFullYear());
            recurringdonationstable.startdateinputs[i].datepicker("option","dateFormat","yy-mm-dd");
            if(dashboarddata.recurringdonations[i][1]===null){
              recurringdonationstable.enddateinputs[i].val("");
            }
            else{
              recurringdonationstable.enddateinputs[i].datepicker("option","dateFormat","d/m/yy");
              recurringdonationstable.enddateinputs[i].datepicker("setDate",dashboarddata.recurringdonations[i][1].getDate()+"/"+(dashboarddata.recurringdonations[i][1].getMonth()+1)+"/"+dashboarddata.recurringdonations[i][1].getFullYear());
            }
            recurringdonationstable.enddateinputs[i].datepicker("option","dateFormat","yy-mm-dd");
            recurringdonationstable.frequencyamountinputs[i].val(dashboarddata.recurringdonations[i][3]);
            recurringdonationstable.frequencyselects[i].val(dashboarddata.recurringdonations[i][2]);
            var l=fixeddata.topcharities.indexOf(dashboarddata.recurringdonations[i][4]);
            if(l==-1){
              recurringdonationstable.charityinputs[i][fixeddata.topcharities.length].prop("checked",true);
              recurringdonationstable.otherinputs[i].val(dashboarddata.recurringdonations[i][4]);
            }
            else{
              recurringdonationstable.charityinputs[i][l].prop("checked",true);
            }
            recurringdonationstable.amountinputs[i].val(dashboarddata.recurringdonations[i][6]);
            recurringdonationstable.currencyselects[i].val(dashboarddata.recurringdonations[i][5]);
            //show and hide the appropriate elements
            for(var j=0;j<5;j++){
              recurringdonationstable.spans[i][j].hide();
            }
            recurringdonationstable.editbuttons[i].hide();
            recurringdonationstable.deletebuttons[i].hide();
            recurringdonationstable.startdateinputs[i].show();
            recurringdonationstable.enddateinputs[i].show();
            recurringdonationstable.enddateclearers[i].show();
            recurringdonationstable.frequencyamountinputs[i].show();
            recurringdonationstable.frequencyselects[i].show();
            for(var k=0;k<fixeddata.editshowcharities;k++){
              recurringdonationstable.charityinputlabels[i][k].show();
            }
            var l=fixeddata.topcharities.indexOf(dashboarddata.recurringdonations[i][4]);
            if(l==-1){
              recurringdonationstable.charityinputlabels[i][fixeddata.topcharities.length].show();
            }
            else{
              recurringdonationstable.charityinputlabels[i][l].show();
            }
            recurringdonationstable.seemorebuttons[i].show();
            recurringdonationstable.amountinputs[i].show();
            recurringdonationstable.currencyselects[i].show();
            recurringdonationstable.savebuttons[i].show();
            recurringdonationstable.savebuttoninfos[i].show();
            recurringdonationstable.cancelbuttons[i].show();
          };
        })(i));

        recurringdonationstable.deletebuttons.push($("<button></button>"));
        recurringdonationstable.deletebuttons[i].html("delete");
        recurringdonationstable.deletebuttons[i].click((function(i){
          return function(){
            if(confirm("Are you sure you want to delete this donation?\n\nNote that this will NOT cancel any payments you have made.")){
              for(var j=0;j<dashboarddata.recurringdonations.length;j++){
                recurringdonationstable.editbuttons[j].prop("disabled",true);
                recurringdonationstable.deletebuttons[j].prop("disabled",true);
              }
              recurringdonationstable.addnewbutton.prop("disabled",true);
              $.post(fixeddata.ajaxformurl,{"action":"deleterecurringdonation","number":dashboarddata.recurringdonations[i][7],"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                for(var j=0;j<dashboarddata.recurringdonations.length;j++){
                  recurringdonationstable.editbuttons[j].prop("disabled",false);
                  recurringdonationstable.deletebuttons[j].prop("disabled",false);
                }
                recurringdonationstable.addnewbutton.prop("disabled",false);
                if(data.status=="success"){
                  dashboarddata.recurringdonations.splice(i,1);
                  recurringdonationstable.updatebody();
                  updatePledgeMeters();
                  updateCollatedDonations();
                  updateDonationEffects();
                  updateIncomeTable();
                  updateLastUpdated(data.timestamp);
                }
                else if(data.status=="error"){
                  if(data.message=="donation not found"){
                    alert("Error: that donation has been deleted.\n\nPlease refresh the page, or contact webmaster@givingwhatwecan.org if the problem persists.");
                  }
                  else{
                    alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                  }
                }
                else{
                  alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
              },"json");
            }
          };
        })(i));

        recurringdonationstable.savebuttons.push($("<button></button>"));
        recurringdonationstable.savebuttons[i].html("save");
        recurringdonationstable.savebuttons[i].click((function(i){
          return function(){
            //validation
            var startdate=recurringdonationstable.startdateinputs[i].datepicker("getDate");
            if(startdate!==null){
              var startdatetimestamp=startdate.getTime();
            }
            var enddate=recurringdonationstable.enddateinputs[i].datepicker("getDate");
            if(enddate===null){
              var enddatetimestamp=Infinity;
            }
            else{
              var enddatetimestamp=enddate.getTime();
            }
            if(startdate===null){
              alert("Please enter a valid start date in the format yyyy-mm-dd.");
            }
            else if(startdatetimestamp>enddatetimestamp){
              alert("Please enter an end date later than the start date.");
            }
            else if(startdatetimestamp<(new Date(fixeddata.startyear,0,1)).getTime()||enddatetimestamp<(new Date(fixeddata.startyear,0,1)).getTime()){
              alert("Please enter dates no less recent than 1st January "+fixeddata.startyear+".");
            }
            else if(startdatetimestamp>(new Date(fixeddata.endyear,11,31)).getTime()){
              alert("Please enter a start date no later than 31st December "+fixeddata.endyear+".");
            }
            else if(basicfunctions.numval(recurringdonationstable.frequencyamountinputs[i].val(),0)<=0){
              alert("Please enter a valid positive frequency amount.");
              recurringdonationstable.frequencyamountinputs[i].focus();
            }
            else{
              var checkedcharity=$("input:radio[name=\"donationcharity"+i+"\"]:checked",recurringdonationstable.cells[i][3]).val();
              if(checkedcharity=="Other"){
                checkedcharity=recurringdonationstable.otherinputs[i].val();
              }
              if(!checkedcharity){
                alert("Please select a charity.");
              }
              else if(basicfunctions.numval(recurringdonationstable.amountinputs[i].val(),2)<=0){
                alert("Please enter a valid positive donation amount.");
                recurringdonationstable.amountinputs[i].focus();
              }
              else{
                startdatetimestamp=Math.round(startdatetimestamp/1000);
                if(enddate===null){
                  enddatetimestamp="";
                }
                else{
                  enddatetimestamp=Math.round(enddatetimestamp/1000);
                }
                recurringdonationstable.savebuttons[i].prop("disabled",true);
                recurringdonationstable.cancelbuttons[i].prop("disabled",true);
                $.post(fixeddata.ajaxformurl,{"action":"editrecurringdonation","number":dashboarddata.recurringdonations[i][7],"value0":startdatetimestamp,"value1":enddatetimestamp,"value2":recurringdonationstable.frequencyselects[i].val(),"value3":basicfunctions.numval(recurringdonationstable.frequencyamountinputs[i].val(),0),"value4":checkedcharity,"value5":recurringdonationstable.currencyselects[i].val(),"value6":basicfunctions.numval(recurringdonationstable.amountinputs[i].val(),2),"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                  recurringdonationstable.savebuttons[i].prop("disabled",false);
                  recurringdonationstable.cancelbuttons[i].prop("disabled",false);
                  if(data.status=="success"){
                    recurringdonationstable.addnewbutton.prop("disabled",false);
                    dashboarddata.recurringdonations[i]=[recurringdonationstable.startdateinputs[i].datepicker("getDate"),recurringdonationstable.enddateinputs[i].datepicker("getDate"),recurringdonationstable.frequencyselects[i].val(),basicfunctions.numval(recurringdonationstable.frequencyamountinputs[i].val(),0),checkedcharity,recurringdonationstable.currencyselects[i].val(),basicfunctions.numval(recurringdonationstable.amountinputs[i].val(),2),dashboarddata.recurringdonations[i][7]];
                    recurringdonationstable.updatebody();
                    updatePledgeMeters();
                    updateCollatedDonations();
                    updateDonationEffects();
                    updateDonationsTimelines(fixeddata.activetab);
                    updateIncomeTable();
                    updateLastUpdated(data.timestamp);
                  }
                  else if(data.status=="error"){
                    if(data.message=="donation not found"){
                      alert("Error: that donation has been deleted.\n\nPlease refresh the page, or contact webmaster@givingwhatwecan.org if the problem persists.");
                    }
                    else{
                      alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                    }
                  }
                  else{
                    alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                  }
                },"json");
              }
            }
          };
        })(i));

        recurringdonationstable.savebuttoninfos.push($("<div style=\"line-height:1em\"><small>Note that this will <b>not</b> modify any payments you have made.</small></div>"));

        recurringdonationstable.cancelbuttons.push($("<button></button>"));
        recurringdonationstable.cancelbuttons[i].html("cancel");
        recurringdonationstable.cancelbuttons[i].click((function(i){
          return function(){
            //reenable edit/delete buttons and add new donations button
            for(var j=0;j<dashboarddata.recurringdonations.length;j++){
              recurringdonationstable.editbuttons[j].prop("disabled",false);
              recurringdonationstable.deletebuttons[j].prop("disabled",false);
            }
            recurringdonationstable.addnewbutton.prop("disabled",false);
            //show and hide the appropriate elements
            recurringdonationstable.startdateinputs[i].hide();
            recurringdonationstable.enddateinputs[i].hide();
            recurringdonationstable.enddateclearers[i].hide();
            recurringdonationstable.frequencyamountinputs[i].hide();
            recurringdonationstable.frequencyselects[i].hide();
            for(var k=0;k<fixeddata.topcharities.length+1;k++){
              recurringdonationstable.charityinputlabels[i][k].hide();
            }
            recurringdonationstable.seemorebuttons[i].hide();
            recurringdonationstable.amountinputs[i].hide();
            recurringdonationstable.currencyselects[i].hide();
            recurringdonationstable.savebuttons[i].hide();
            recurringdonationstable.savebuttoninfos[i].hide();
            recurringdonationstable.cancelbuttons[i].hide();
            for(var j=0;j<5;j++){
              recurringdonationstable.spans[i][j].show();
            }
            recurringdonationstable.editbuttons[i].show();
            recurringdonationstable.deletebuttons[i].show();
          };
        })(i));

        recurringdonationstable.cells[i][5].append(recurringdonationstable.editbuttons[i],recurringdonationstable.deletebuttons[i],recurringdonationstable.savebuttons[i],recurringdonationstable.savebuttoninfos[i],recurringdonationstable.cancelbuttons[i]);

        for(var j=0;j<6;j++){
          recurringdonationstable.rows[i].append(recurringdonationstable.cells[i][j]);
        }

        //hide the appropriate elements
        recurringdonationstable.startdateinputs[i].hide();
        recurringdonationstable.enddateinputs[i].hide();
        recurringdonationstable.enddateclearers[i].hide();
        recurringdonationstable.frequencyamountinputs[i].hide();
        recurringdonationstable.frequencyselects[i].hide();
        for(var k=0;k<fixeddata.topcharities.length+1;k++){
          recurringdonationstable.charityinputlabels[i][k].hide();
        }
        recurringdonationstable.seemorebuttons[i].hide();
        recurringdonationstable.amountinputs[i].hide();
        recurringdonationstable.currencyselects[i].hide();
        recurringdonationstable.savebuttons[i].hide();
        recurringdonationstable.savebuttoninfos[i].hide();
        recurringdonationstable.cancelbuttons[i].hide();

        //row shading hover effect
        recurringdonationstable.rows[i].mouseover((function(i){
          return function(){
            if(i!=recurringdonationstable.selectedrow){
              recurringdonationstable.rows[i].css("background-color","#f5f5f5");
            }
          };
        })(i));
        recurringdonationstable.rows[i].mouseout((function(i){
          return function(){
            if(i!=recurringdonationstable.selectedrow){
              recurringdonationstable.rows[i].css("background-color","#ffffff");
            }
          };
        })(i));

        //row shading click effect
        recurringdonationstable.rows[i].click((function(i){
          return function(event){
            for(var j=0;j<dashboarddata.recurringdonations.length;j++){
              if(j==i){
                recurringdonationstable.rows[j].css("background-color","#d8dfea");
                recurringdonationstable.selectedrow=j;
              }
              else{
                recurringdonationstable.rows[j].css("background-color","#ffffff");
              }
            }
            event.stopPropagation();
          };
        })(i));
      }

      //append the rows in a sorted order
      var donationindices=[];
      for(var i=0;i<dashboarddata.recurringdonations.length;i++){
        donationindices.push(i);
      }
      donationindices.sort(function(a,b){if(dashboarddata.recurringdonations[a][0].getTime()==dashboarddata.recurringdonations[b][0].getTime()){return a<b?-1:1;}else{return (dashboarddata.recurringdonations[a][0].getTime()<dashboarddata.recurringdonations[b][0].getTime())?-1:1;}});
      for(var i=0;i<donationindices.length;i++){
        recurringdonationstable.body.append(recurringdonationstable.rows[donationindices[i]]);
      }

      //hide the column headers if there are no donations
      if(dashboarddata.recurringdonations.length==0){
        $("#recurringdonationstable>thead").hide();
      }
      else{
        $("#recurringdonationstable>thead").show();
      }
    },

    "updatefoot":function(){//draws the "add new donation" row - recurringdonationstable.footx is the corresponding element to recurringdonationstable.x[i] but in the table footer
      recurringdonationstable.foot.empty();
      recurringdonationstable.footrow=$("<tr></tr>");
      recurringdonationstable.addnewbuttoncell=$("<td></td>",{"colspan":"5"});
      recurringdonationstable.addnewbuttoncell.css("text-align","center");
      recurringdonationstable.addnewbutton=$("<button></button>");
      recurringdonationstable.addnewbutton.html("add new donation");
      recurringdonationstable.addnewbutton.click(function(){
        for(var j=0;j<dashboarddata.recurringdonations.length;j++){
          recurringdonationstable.editbuttons[j].prop("disabled",true);
          recurringdonationstable.deletebuttons[j].prop("disabled",true);
        }
        recurringdonationstable.footrow.empty();
        recurringdonationstable.footcells=[$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>"),$("<td></td>")];
        recurringdonationstable.footstartdateinput=$("<input size=\"10\">",{"type":"text"});
        recurringdonationstable.footcells[0].append(recurringdonationstable.footstartdateinput);
        recurringdonationstable.footstartdateinput.datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(fixeddata.endyear,11,31)});
        recurringdonationstable.footstartdateinput.datepicker("option","dateFormat","d/m/yy");
        recurringdonationstable.footstartdateinput.datepicker("setDate",fixeddata.today.getDate()+"/"+(fixeddata.today.getMonth()+1)+"/"+fixeddata.today.getFullYear());
        recurringdonationstable.footstartdateinput.datepicker("option","dateFormat","yy-mm-dd");
        recurringdonationstable.footenddateinput=$("<input size=\"10\">",{"type":"text"});
        recurringdonationstable.footenddateclearer=$("<button>clear</button>");
        recurringdonationstable.footcells[1].append(recurringdonationstable.footenddateinput);
        recurringdonationstable.footcells[1].append(recurringdonationstable.footenddateclearer);
        recurringdonationstable.footenddateinput.datepicker({"minDate":new Date(fixeddata.startyear,0,1),"maxDate":new Date(2099,11,31)});
        recurringdonationstable.footenddateinput.val("");
        recurringdonationstable.footenddateinput.datepicker("option","dateFormat","yy-mm-dd");
        recurringdonationstable.footenddateclearer.click(function(){
          recurringdonationstable.footenddateinput.val("");
        });
        recurringdonationstable.footfrequencyamountinput=$("<input size=\"2\">",{"type":"text","class":"moo"});
        recurringdonationstable.footfrequencyamountinput.val("1");
        recurringdonationstable.footfrequencyselect=$("<select></select>");
        for(var m=0;m<fixeddata.frequencies.length;m++){
          recurringdonationstable.footfrequencyselect.append("<option value=\""+fixeddata.frequencies[m]+"\""+(m==2?" selected=\"selected\"":"")+">"+fixeddata.frequencies[m]+"(s)</option>");
        }
        recurringdonationstable.footcells[2].append(recurringdonationstable.footfrequencyamountinput,recurringdonationstable.footfrequencyselect);
        recurringdonationstable.footcharityinputs=[];
        recurringdonationstable.footcharityinputlabels=[];
        for(var k=0;k<fixeddata.topcharities.length;k++){
          recurringdonationstable.footcharityinputlabels.push($("<label></label>"));
          recurringdonationstable.footcharityinputs.push($("<input>",{"type":"radio","name":"donationcharitynew","value":fixeddata.topcharities[k]}));
          recurringdonationstable.footcharityinputlabels[k].append(recurringdonationstable.footcharityinputs[k]," "+fixeddata.topcharities[k]);
          recurringdonationstable.footcells[3].append(recurringdonationstable.footcharityinputlabels[k]);
        }
        k=fixeddata.topcharities.length;
        recurringdonationstable.footcharityinputlabels.push($("<label></label>"));
        recurringdonationstable.footcharityinputs.push($("<input>",{"type":"radio","name":"donationcharitynew","value":"Other"}));
        recurringdonationstable.footcharityinputs[k].click(function(){
          recurringdonationstable.foototherinput.focus();
        });
        recurringdonationstable.foototherinput=$("<input>",{"type":"text"});
        recurringdonationstable.foototherinput.change((function(k){
          return function(){
            recurringdonationstable.footcharityinputs[k].prop("checked",true);
          };
        })(k));
        recurringdonationstable.footcharityinputlabels[k].append(recurringdonationstable.footcharityinputs[k]," Other: ",recurringdonationstable.foototherinput);
        recurringdonationstable.footcells[3].append(recurringdonationstable.footcharityinputlabels[k]);
        recurringdonationstable.footseemorebutton=$("<button></button>");
        recurringdonationstable.footseemorebutton.html("show other charities");
        recurringdonationstable.footseemorebutton.click(function(){
          for(var k=fixeddata.addshowcharities;k<fixeddata.topcharities.length+1;k++){
            recurringdonationstable.footcharityinputlabels[k].show();
          }
          recurringdonationstable.footseemorebutton.hide();
        });
        recurringdonationstable.footcells[3].append(recurringdonationstable.footseemorebutton);
        recurringdonationstable.footamountinput=$("<input>",{"type":"text"});
        recurringdonationstable.footamountinput.keypress(function(event){
          var keycode=(event.keyCode?event.keyCode:event.which);
          if(keycode=="13"){
            recurringdonationstable.footsavebutton.triggerHandler("click");
          }
        });
        recurringdonationstable.footcurrencyselect=$("<select></select>");
        for(var m=0;m<fixeddata.currencies.length;m++){
          recurringdonationstable.footcurrencyselect.append("<option value=\""+fixeddata.currencies[m]+"\""+(dashboarddata.defaultcurrency==fixeddata.currencies[m]?" selected=\"selected\"":"")+">"+fixeddata.currencies[m]+"</option>");
        }
        recurringdonationstable.footcells[4].append(recurringdonationstable.footamountinput,recurringdonationstable.footcurrencyselect);
        recurringdonationstable.footsavebutton=$("<button></button>");
        recurringdonationstable.footsavebutton.html("save");
        recurringdonationstable.footsavebutton.click(function(){
          var startdate=recurringdonationstable.footstartdateinput.datepicker("getDate");
          if(startdate!==null){
            var startdatetimestamp=startdate.getTime();
          }
          var enddate=recurringdonationstable.footenddateinput.datepicker("getDate");
          if(enddate===null){
            var enddatetimestamp=Infinity;
          }
          else{
            var enddatetimestamp=enddate.getTime();
          }
          if(startdate===null){
            alert("Please enter a valid start date in the format yyyy-mm-dd.");
          }
          else if(startdatetimestamp>enddatetimestamp){
            alert("Please enter an end date later than the start date.");
          }
          else if(startdatetimestamp<(new Date(fixeddata.startyear,0,1)).getTime()||enddatetimestamp<(new Date(fixeddata.startyear,0,1)).getTime()){
            alert("Please enter dates no less recent than 1st January "+fixeddata.startyear+".");
          }
          else if(startdatetimestamp>(new Date(fixeddata.endyear,11,31)).getTime()){
            alert("Please enter a start date no later than 31st December "+fixeddata.endyear+".");
          }
          else if(basicfunctions.numval(recurringdonationstable.footfrequencyamountinput.val(),0)<=0){
            alert("Please enter a valid positive frequency amount.");
            recurringdonationstable.frequencyamountinput.focus();
          }
          else{
            var checkedcharity=$("input:radio[name=\"donationcharitynew\"]:checked",recurringdonationstable.footcells[3]).val();
            if(checkedcharity=="Other"){
              checkedcharity=recurringdonationstable.foototherinput.val();
            }
            if(!checkedcharity){
              alert("Please select a charity.");
            }
            else if(basicfunctions.numval(recurringdonationstable.footamountinput.val(),2)<=0){
              alert("Please enter a valid positive donation amount.");
              recurringdonationstable.footamountinput.focus();
            }
            else{
              startdatetimestamp=Math.round(startdatetimestamp/1000);
              if(enddate===null){
                enddatetimestamp="";
              }
              else{
                enddatetimestamp=Math.round(enddatetimestamp/1000);
              }
              recurringdonationstable.footsavebutton.prop("disabled",true);
              recurringdonationstable.footcancelbutton.prop("disabled",true);
              $.post(fixeddata.ajaxformurl,{"action":"addrecurringdonation","value0":startdatetimestamp,"value1":enddatetimestamp,"value2":recurringdonationstable.footfrequencyselect.val(),"value3":basicfunctions.numval(recurringdonationstable.footfrequencyamountinput.val(),0),"value4":checkedcharity,"value5":recurringdonationstable.footcurrencyselect.val(),"value6":basicfunctions.numval(recurringdonationstable.footamountinput.val(),2,0),"userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
                recurringdonationstable.footsavebutton.prop("disabled",false);
                recurringdonationstable.footcancelbutton.prop("disabled",false);
                if(data.status=="success"){
                  dashboarddata.recurringdonationsadded++;
                  dashboarddata.recurringdonations.push([recurringdonationstable.footstartdateinput.datepicker("getDate"),recurringdonationstable.footenddateinput.datepicker("getDate"),recurringdonationstable.footfrequencyselect.val(),basicfunctions.numval(recurringdonationstable.footfrequencyamountinput.val(),0),checkedcharity,recurringdonationstable.footcurrencyselect.val(),basicfunctions.numval(recurringdonationstable.footamountinput.val(),2,0),dashboarddata.recurringdonationsadded]);
                  recurringdonationstable.updatebody();
                  recurringdonationstable.updatefoot();
                  updatePledgeMeters();
                  updateCollatedDonations();
                  updateDonationEffects();
                  updateIncomeTable();
                  updateLastUpdated(data.timestamp);
                }
                else if(data.status=="error"){
                  alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
                else{
                  alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
                }
              },"json");
            }
          }
        });
        recurringdonationstable.footsavebuttoninfo=$("<div style=\"line-height:1em\"><small>Note that this will <b>not</b> make any payments.</small></div>");
        recurringdonationstable.footcancelbutton=$("<button></button>");
        recurringdonationstable.footcancelbutton.html("cancel");
        recurringdonationstable.footcancelbutton.click(function(){
          for(var j=0;j<dashboarddata.recurringdonations.length;j++){
            recurringdonationstable.editbuttons[j].prop("disabled",false);
            recurringdonationstable.deletebuttons[j].prop("disabled",false);
          }
          if(dashboarddata.recurringdonations.length==0){
            $("#recurringdonationstable>thead").hide();
          }
          recurringdonationstable.updatefoot();
        });
        recurringdonationstable.footcells[5].append(recurringdonationstable.footsavebutton,recurringdonationstable.footsavebuttoninfo,recurringdonationstable.footcancelbutton);
        for(var j=0;j<6;j++){
          recurringdonationstable.footrow.append(recurringdonationstable.footcells[j]);
        }
        for(var k=fixeddata.addshowcharities;k<fixeddata.topcharities.length+1;k++){
          recurringdonationstable.footcharityinputlabels[k].hide();
        }
        $("#recurringdonationstable>thead").show();
      });
      recurringdonationstable.addnewbuttoncell.append(recurringdonationstable.addnewbutton);
      recurringdonationstable.addnewbuttoncell.append("<div style=\"line-height:1em\"><small>This will not make any payments &ndash; My Giving currently only supports self-reported donations.<br>To set up a donation, please visit our page on <a href=\"https://www.givingwhatwecan.org/donate\" style=\"text-decoration:underline;\">how to donate</a>.</small></div>");
      recurringdonationstable.footrow.append(recurringdonationstable.addnewbuttoncell);
      recurringdonationstable.foot.append(recurringdonationstable.footrow);
    }
  };

  recurringdonationstable.updatebody();
  recurringdonationstable.updatefoot();

  //configure the option to publicise donations
  /*function updatePublicOption(){
    if(dashboarddata.public){
      var publicpage="/igivedisplay?publicid="+fixeddata.userid+"&publicauth="+dashboarddata.publicauth;
      $("#publicstatus").html("You have chosen to make your giving history (donations only) visible from the following page:<br><b><a href=\""+publicpage+"\">https://www.givingwhatwecan.org"+publicpage+"</a></b><br>You can disable this page using the button below.");
      $("#publicbutton").html("Make my donations private");
    }
    else{
      $("#publicstatus").html("Your giving history is currently kept completely confidential. If you would like to share your donations with your friends or others, then you can use the following feature. It will create a publicly visible page similar to this one but containing only your donations (not your income or any other personal information).");
      $("#publicbutton").html("Share my donations");
    }
  };
  updatePublicOption();
  $("#publicbutton").click(function(){
    if(dashboarddata.public||confirm("Are you sure? This will make your donations publicly visible to anyone with the right link.")){
      $("#publicbutton").prop("disabled",true);
      $.post(fixeddata.ajaxformurl,{"action":"public","public":dashboarddata.public?"0":"1","userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
        $("#publicbutton").prop("disabled",false);
        if(data.status=="success"){
          dashboarddata.public=!dashboarddata.public;
          updatePublicOption();
        }
        else if(data.status=="error"){
          alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
        }
        else{
          alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
        }
      },"json");
    }
  });*/

  //configure the income table
  var incometable={"rows":[],"yearcells":[],"incomecells":[],"donationcells":[],"pledgecells":[],"spans":[],"amountinputs":[],"currencyselects":[],"editbuttons":[],"savebuttons":[],"cancelbuttons":[],"studentmodecheckboxlabels":[],"studentmodecheckboxes":[],"selectedrow":-1};//cf. donationstable
  (function(){

    //calculate the first year not to be hidden by default
    if(fixeddata.ismember){
      if(fixeddata.joindate===null||fixeddata.joindate===false){
        var firstyear=false;
      }
      else{
        var firstyear=fixeddata.joindate.getFullYear();
      }
    }
    else if(fixeddata.istryinggiving){
      if(fixeddata.trygivingstartdate===null||fixeddata.trygivingstartdate===false){
        var firstyear=false;
      }
      else{
        var firstyear=fixeddata.trygivingstartdate.getFullYear();
      }
    }
    else{
      var firstyear=false;
    }
    if(firstyear==false){
      $("#incometableshowbuttonrow").hide();
    }

    for(var i=0;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      incometable.rows.push($("<tr></tr>"));

      incometable.yearcells.push($("<td></td>"));
      incometable.rows[i].append(incometable.yearcells[i]);
      incometable.incomecells.push($("<td></td>"));
      incometable.rows[i].append(incometable.incomecells[i]);
      incometable.donationcells.push($("<td></td>"));
      incometable.rows[i].append(incometable.donationcells[i]);
      incometable.pledgecells.push($("<td></td>"));
      incometable.rows[i].append(incometable.pledgecells[i]);

      incometable.spans.push($("<span></span>"));
      incometable.incomecells[i].append(incometable.spans[i]);

      incometable.amountinputs.push($("<input>",{"type":"text"}));
      incometable.amountinputs[i].keypress((function(i){
        return function(event){
          var keycode=(event.keyCode?event.keyCode:event.which);
          if(keycode==13){
            incometable.savebuttons[i].triggerHandler("click");
          }
        };
      })(i));
      incometable.incomecells[i].append(incometable.amountinputs[i]);

      incometable.currencyselects.push($("<select>"));
      for(var m=0;m<fixeddata.currencies.length;m++){
        incometable.currencyselects[i].append("<option value=\""+fixeddata.currencies[m]+"\">"+fixeddata.currencies[m]+"</option>");
      }
      incometable.incomecells[i].append(incometable.currencyselects[i]);

      incometable.editbuttons.push($("<button></button>"));
      incometable.editbuttons[i].html("edit");
      incometable.editbuttons[i].click((function(i){
        return function(){
          if(typeof(dashboarddata.income[fixeddata.startyear+i])=="undefined"){
            incometable.currencyselects[i].val(dashboarddata.defaultcurrency);
            incometable.amountinputs[i].val("");
            incometable.studentmodecheckboxes[i].prop("checked",false);
          }
          else{
            incometable.currencyselects[i].val(dashboarddata.income[fixeddata.startyear+i][0]);
            incometable.amountinputs[i].val(dashboarddata.income[fixeddata.startyear+i][1]);
            incometable.studentmodecheckboxes[i].prop("checked",!!dashboarddata.income[fixeddata.startyear+i][2]);
          }
          incometable.spans[i].hide();
          incometable.editbuttons[i].hide();
          incometable.amountinputs[i].show();
          incometable.currencyselects[i].show();
          incometable.savebuttons[i].show();
          incometable.cancelbuttons[i].show();
          incometable.studentmodecheckboxlabels[i].show();
          incometable.amountinputs[i].focus();
        };
      })(i));
      incometable.incomecells[i].append(incometable.editbuttons[i]);

      incometable.savebuttons.push($("<button></button>"));
      incometable.savebuttons[i].html("save");
      incometable.savebuttons[i].click((function(i){
        return function(){
          var amount=basicfunctions.numval(incometable.amountinputs[i].val(),2);
          if(amount<0){
            alert("Please enter a non-negative income amount.");
          }
          else{
            incometable.savebuttons[i].prop("disabled",true);
            incometable.cancelbuttons[i].prop("disabled",true);
            $.post(fixeddata.ajaxformurl,{"action":"income","year":fixeddata.startyear+i,"currency":incometable.currencyselects[i].val(),"amount":amount,"studentmode":incometable.studentmodecheckboxes[i].prop("checked")?"true":"false","userid":fixeddata.userid,"authentication":dashboarddata.authentication},function(data,textStatus,jqXHR){
              incometable.savebuttons[i].prop("disabled",false);
              incometable.cancelbuttons[i].prop("disabled",false);
              if(data.status=="success"){
                if(amount==0){
                  delete(dashboarddata.income[(fixeddata.startyear+i)+""]);
                }
                else{
                  dashboarddata.income[(fixeddata.startyear+i)+""]=[incometable.currencyselects[i].val(),amount,incometable.studentmodecheckboxes[i].prop("checked")];
                }
                updatePledgeMeters();
                updateIncomeTable();
                updateLastUpdated(data.timestamp);
                incometable.amountinputs[i].hide();
                incometable.currencyselects[i].hide();
                incometable.savebuttons[i].hide();
                incometable.cancelbuttons[i].hide();
                incometable.studentmodecheckboxlabels[i].hide();
                incometable.spans[i].show();
                incometable.editbuttons[i].show();
              }
              else if(data.status=="error"){
                alert("Error connecting to server: "+data.message+"\n\nPlease contact webmaster@givingwhatwecan.org.");
              }
              else{
                alert("Error connecting to server.\n\nPlease contact webmaster@givingwhatwecan.org.");
              }
            },"json");
          }
        };
      })(i));
      incometable.incomecells[i].append(incometable.savebuttons[i]);

      incometable.cancelbuttons.push($("<button></button>"));
      incometable.cancelbuttons[i].html("cancel");
      incometable.cancelbuttons[i].click((function(i){
        return function(){
          incometable.amountinputs[i].hide();
          incometable.currencyselects[i].hide();
          incometable.savebuttons[i].hide();
          incometable.cancelbuttons[i].hide();
          incometable.studentmodecheckboxlabels[i].hide();
          incometable.spans[i].show();
          incometable.editbuttons[i].show();
        };
      })(i));
      incometable.incomecells[i].append(incometable.cancelbuttons[i]);

      incometable.studentmodecheckboxes.push($("<input>",{"type":"checkbox"}));
      incometable.studentmodecheckboxlabels.push($("<label></label>").html(" student/1% mode <img src=\""+fixeddata.modulepath+"/help.png\" class=\"studentmodetooltip\" title=\"This is only for members keeping the &quot;1% of spending money&quot; pledge (such as students). This is recommended in case you have little to no income (and are supported by your family or a loan, for example). For more information, please see <a style='text-decoration:underline;' href='https://www.givingwhatwecan.org/about-us/frequently-asked-questions#18'>this FAQ</a>.<br><br>In this mode, enter your spending rather than your income. For the purposes of your &quot;All time&quot; percentage, this money will be counted towards your income at a rate of 1/10.\">").prepend(incometable.studentmodecheckboxes[i]));
      if(fixeddata.ismember){
        incometable.incomecells[i].append("<br>");
        incometable.incomecells[i].append(incometable.studentmodecheckboxlabels[i]);
      }

      $("#incometable>tbody").append(incometable.rows[i]);

      incometable.amountinputs[i].hide();
      incometable.currencyselects[i].hide();
      incometable.savebuttons[i].hide();
      incometable.cancelbuttons[i].hide();
      incometable.studentmodecheckboxlabels[i].hide();
      if(firstyear!=false&&fixeddata.startyear+i<firstyear){
        incometable.rows[i].hide();
      }

      //row shading hover effect
      incometable.rows[i].mouseover((function(i){
        return function(){
          if(i!=incometable.selectedrow){
            incometable.rows[i].css("background-color","#f5f5f5");
          }
        };
      })(i));
      incometable.rows[i].mouseout((function(i){
        return function(){
          if(i!=incometable.selectedrow){
            incometable.rows[i].css("background-color","#ffffff");
          }
        };
      })(i));

      //row shading click effect
      incometable.rows[i].click((function(i){
        return function(event){
          for(var j=0;j<fixeddata.endyear-fixeddata.startyear+1;j++){
            if(j==i){
              incometable.rows[j].css("background-color","#d8dfea");
              incometable.selectedrow=j;
            }
            else{
              incometable.rows[j].css("background-color","#ffffff");
            }
          }
          event.stopPropagation();
        };
      })(i));

    }

    //configure tooltip and "show earlier years" button
    $(".studentmodetooltip").tooltip();
    $("#incometableshowbutton").click(function(event){
      $("#incometableshowbuttonrow").hide();
      for(var i=0;i<incometable.rows.length;i++){
        incometable.rows[i].show();
      }
    });

    //clear row shading click effects
    $("body").click(function(){
      for(var j=0;j<dashboarddata.donations.length;j++){
        donationstable.rows[j].css("background-color","#ffffff");
      }
      for(var j=0;j<dashboarddata.recurringdonations.length;j++){
        recurringdonationstable.rows[j].css("background-color","#ffffff");
      }
      for(var j=0;j<fixeddata.endyear-fixeddata.startyear+1;j++){
        incometable.rows[j].css("background-color","#ffffff");
      }
      donationstable.selectedrow=-1;
      recurringdonationstable.selectedrow=-1;
      incometable.selectedrow=-1;
    });

  })();

  //updates what is displayed in the income table
  function updateIncomeTable(){
    for(var i=0;i<fixeddata.endyear-fixeddata.startyear+1;i++){
      incometable.yearcells[i].html("<strong>"+(fixeddata.startyear+i)+"</strong><br><small>("+basicfunctions.formatDate(new Date(fixeddata.startyear+i,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12))+" &ndash; "+basicfunctions.formatDate((new Date(fixeddata.startyear+i+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate,12)).addDays(-1))+")</small>");
      incometable.donationcells[i].html(basicfunctions.formatCurrency(dashboarddata.defaultcurrency,basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.defaultcurrency,{"start":new Date(fixeddata.startyear+i,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(fixeddata.startyear+i+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}),false));
      incometable.spans[i].html(typeof(dashboarddata.income[fixeddata.startyear+i])=="undefined"?"no income entered ":basicfunctions.formatCurrency(dashboarddata.income[fixeddata.startyear+i][0],dashboarddata.income[fixeddata.startyear+i][1],false)+(!!dashboarddata.income[fixeddata.startyear+i][2]?"<small> (student/1% mode)</small>":"")+" ");
      if(typeof(dashboarddata.income[fixeddata.startyear+i])=="undefined"){
        incometable.pledgecells[i].html("not applicable");
      }
      else{
        var percentage=(100*basicfunctions.getTotalDonations(dashboarddata.donations,dashboarddata.recurringdonations,dashboarddata.income[fixeddata.startyear+i][0],{"start":new Date(fixeddata.startyear+i,dashboarddata.yearstartmonth,dashboarddata.yearstartdate),"end":new Date(fixeddata.startyear+i+1,dashboarddata.yearstartmonth,dashboarddata.yearstartdate)}))/dashboarddata.income[fixeddata.startyear+i][1];
        if(percentage>100){
          incometable.pledgecells[i].html("donations exceed income!");
        }
        else{
          incometable.pledgecells[i].html(percentage.toFixed(2)*1+"%");
        }
      }
    }
  };

  updateIncomeTable();

  //configure the import/export settings function
  $("#portselectall").click(function(event){
    $("#porttext").select();
  });
  $("#portsavechanges").click(function(event){
    try{
      var igivecookie=JSON.parse(jQuery("#porttext").val());
      if(confirm("Are you sure? This will overwrite any previous data.")){
        Cookies.set("igive",JSON.stringify(igivecookie),{expires:3650});
        window.location.reload(false);
      }
    }
    catch(e){
      alert(e);
    }
  });
  (function(){
    var igivecookie={dashboarddata:dashboarddata,fixeddata:fixeddata};
    igivecookie.fixeddata={
      userid:igivecookie.fixeddata.userid,
      percentagepledged:igivecookie.fixeddata.percentagepledged,
      ismember:igivecookie.fixeddata.ismember,
      istryinggiving:igivecookie.fixeddata.istryinggiving,
      joindate:igivecookie.fixeddata.joindate,
      trygivingstartdate:igivecookie.fixeddata.trygivingstartdate,
      trygivingenddate:igivecookie.fixeddata.trygivingenddate,
      modulepath:igivecookie.fixeddata.modulepath
    };
    $("#porttext").val(JSON.stringify(igivecookie));
  })();

})(jQuery,igive.dashboarddata,igive.fixeddata,igive.basicfunctions,igive.visualizationLoaded);});