//overwrite jQuery ajax function for the non-editable version
jQuery.post=function(a,b,c){
  if(typeof c=="function"){
    c({"status":"success","timestamp":Math.round((new Date()).getTime()/1000)},"","");
  }
}

//modify page appearance
jQuery(function(){
  jQuery("#dashboardtabs .pledge-completion-social-media-share").hide();
  jQuery("#dashboardtabs .progress-links").hide();
  jQuery("#edittab>a").html("View data");
  jQuery("#edit").prepend(jQuery("<p>You can edit this data, but your changes will not be saved once you leave this page.</p><br>"));
  jQuery("#publicheader").hide();
  jQuery("#publicstatus").hide();
  jQuery("#publictoggle").hide();
  if(jQuery.isEmptyObject(Drupal.settings.igive.dashboarddata.income)){
    jQuery("#incometableheader").hide();
    jQuery("#incometable").hide();
  }
  jQuery("#dashboardtabs").tabs("disable",Drupal.settings.igive.fixeddata.endyear-Drupal.settings.igive.fixeddata.startyear+Drupal.settings.igive.fixeddata.othertabs.indexOf("profile")+2);
});