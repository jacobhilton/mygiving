jQuery(function(){
  jQuery("#showgiftaidcalculator").click(function(event){
    jQuery("#showgiftaidcalculator").hide();
    var resultspan=jQuery("<span></span>").css({"font-weight":"bold"}).text("£0.00");
    var updatefunction=function(event){
      var amount=donationinput.val()*1.25;
      if(isNaN(amount)){
        amount=0;
      }
      resultspan.text("£"+amount.toFixed(2));
    };
    var donationinput=jQuery("<input type=\"text\">").css({"width":"4em"}).change(updatefunction).keyup(updatefunction);
    jQuery("#giftaidcalculator").append(document.createTextNode("(A donation of £"),donationinput,document.createTextNode(" is worth "),resultspan,document.createTextNode(" after Gift Aid)"));
  });
  jQuery("#showgiftaidcalculator").click();
});