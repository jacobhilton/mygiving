//requires Drupal.settings.igive to have been set

var igive={};

jQuery(function(){

  igive.dashboarddata=Drupal.settings.igive.dashboarddata;
  igive.fixeddata=Drupal.settings.igive.fixeddata;

  (function(dashboarddata,fixeddata){

    //constants
    fixeddata.currencies=["USD","EUR","GBP","INR","AUD","CAD","ZAR","NZD","JPY","CHF","SEK","NOK","HKD"];
    fixeddata.exchangerates={
      "date":[new Date(2016,11,1),new Date(2016,10,1),new Date(2016,9,1),new Date(2016,8,1),new Date(2016,7,1),new Date(2016,6,1),new Date(2016,5,1),new Date(2016,4,1),new Date(2016,3,1),new Date(2016,2,1),new Date(2016,1,1),new Date(2016,0,1),new Date(2015,11,1),new Date(2015,10,1),new Date(2015,9,1),new Date(2015,8,1),new Date(2015,7,1),new Date(2015,6,1),new Date(2015,5,1),new Date(2015,4,1),new Date(2015,3,1),new Date(2015,2,1),new Date(2015,1,1),new Date(2015,0,1),new Date(2014,11,1),new Date(2014,10,1),new Date(2014,9,1),new Date(2014,8,1),new Date(2014,7,1),new Date(2014,6,1),new Date(2014,5,1),new Date(2014,4,1),new Date(2014,3,1),new Date(2014,2,1),new Date(2014,1,1),new Date(2014,0,1),new Date(2013,11,1),new Date(2013,10,1),new Date(2013,9,1),new Date(2013,8,1),new Date(2013,7,1),new Date(2013,6,1),new Date(2013,5,1),new Date(2013,4,1),new Date(2013,3,1),new Date(2013,2,1),new Date(2013,1,1),new Date(2013,0,1),new Date(2012,11,1),new Date(2012,10,1),new Date(2012,9,1),new Date(2012,8,1),new Date(2012,7,1),new Date(2012,6,1),new Date(2012,5,1),new Date(2012,4,1),new Date(2012,3,1),new Date(2012,2,1),new Date(2012,1,1),new Date(2012,0,1),new Date(2011,11,1),new Date(2011,10,1),new Date(2011,9,1),new Date(2011,8,1),new Date(2011,7,1),new Date(2011,6,1),new Date(2011,5,1),new Date(2011,4,1),new Date(2011,3,1),new Date(2011,2,1),new Date(2011,1,1),new Date(2011,0,1),new Date(2010,11,1),new Date(2010,10,1),new Date(2010,9,1),new Date(2010,8,1),new Date(2010,7,1),new Date(2010,6,1),new Date(2010,5,1),new Date(2010,4,1),new Date(2010,3,1),new Date(2010,2,1),new Date(2010,1,1),new Date(2010,0,1)],
      "USD":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      "EUR":[0.9405506496,0.9056166837,0.88962,0.8933319088,0.894807513,0.8977652874,0.8956415642,0.8732546896,0.8787847529,0.9219957387,0.9183837201,0.920945,0.9178,0.9317,0.8911,0.89,0.8984,0.9086,0.8913,0.8954,0.9266,0.9227,0.8808,0.8576,0.8117,0.8015,0.7891,0.7746,0.7503,0.738,0.7353,0.7277,0.7243,0.7233,0.7329,0.7335,0.7302,0.741,0.7334,0.7494,0.7508,0.7649,0.759,0.7702,0.7684,0.7707,0.7473,0.7531,0.763,0.7796,0.771,0.7781,0.8075,0.8125,0.7978,0.779,0.7593,0.7568,0.7564,0.7756,0.7585,0.736,0.7301,0.7246,0.6971,0.699,0.6953,0.6974,0.6927,0.7142,0.7328,0.749,0.7567,0.7304,0.7197,0.7677,0.7746,0.784,0.8188,0.7928,0.7439,0.7364,0.7309,0.7003],
      "GBP":[0.7941148766,0.8181225702,0.7708911502,0.7534598385,0.7570597666,0.7530931364,0.6947362615,0.6844064827,0.7040011911,0.7171452399,0.6961699261,0.6782635048,0.6666,0.6582,0.6523,0.652,0.6417,0.6428,0.642,0.6473,0.6703,0.667,0.6532,0.6588,0.6397,0.6334,0.622,0.6129,0.5984,0.5853,0.5916,0.5936,0.5977,0.6013,0.6044,0.6072,0.6108,0.6215,0.6214,0.6315,0.6458,0.659,0.6467,0.6533,0.6534,0.6628,0.6441,0.6255,0.6201,0.6263,0.6219,0.6215,0.6367,0.641,0.6434,0.627,0.625,0.632,0.633,0.645,0.6411,0.6318,0.6349,0.632,0.6109,0.6194,0.6162,0.6114,0.6117,0.6187,0.6204,0.6347,0.6407,0.6256,0.6305,0.643,0.6384,0.6552,0.6791,0.6804,0.6526,0.6641,0.6401,0.6191],
      "INR":[68.3273220716,66.6978653946,66.5565,66.8708162316,66.6999793797,67.228276517,67.4512256924,66.424,66.3476501408,67.6726616099,67.9390113256,66.235,66.4547,66.1097,65.0056,66.2538,65.0807,63.5268,63.8049,63.7345,62.6054,62.4735,62.0674,62.2229,62.8488,61.5681,61.3266,60.8211,60.8311,59.9509,59.6299,59.2274,60.376,61.0507,62.0576,61.8865,61.7503,62.5164,61.2725,63.9121,62.8417,59.8033,58.2265,54.7299,54.2778,54.4498,53.8254,54.3005,54.6399,54.7691,52.9499,54.3219,55.4412,55.306,56.0424,54.6654,52.4056,50.9143,49.5958,52.1322,53.2707,50.9556,49.7351,47.8332,45.4736,44.7475,45.3638,45.0901,44.8105,45.5433,45.704,45.8592,45.6605,45.2001,44.5148,46.1871,46.5875,46.9017,46.6076,45.8,44.5171,45.4883,46.3804,46.0911],
      "AUD":[1.3495470634,1.3058390646,1.3058154491,1.3261956061,1.3213255935,1.3362555833,1.3804604809,1.3152356902,1.3036204956,1.3942766918,1.4121305496,1.3693940431,1.3798,1.3988,1.3879,1.4174,1.3696,1.3491,1.2969,1.2674,1.2959,1.2926,1.2833,1.2363,1.213,1.1542,1.1414,1.1028,1.0744,1.0647,1.0678,1.0748,1.0734,1.1031,1.1173,1.1285,1.113,1.0714,1.051,1.0806,1.1057,1.0914,1.0597,1.0065,0.9635,0.9676,0.9683,0.9531,0.9562,0.9618,0.9717,0.9617,0.9539,0.9716,1.0041,1.0004,0.9658,0.9472,0.933,0.9631,0.9874,0.9889,0.9896,0.9726,0.9525,0.9285,0.9433,0.9351,0.9464,0.9897,0.9917,1.0026,1.0089,1.0105,1.0191,1.071,1.1101,1.1451,1.1724,1.1447,1.0802,1.0978,1.1283,1.0977],
      "CAD":[1.3328207936,1.3375946548,1.31305,1.3105512032,1.3097155475,1.2900074122,1.3089343413,1.2555,1.304710992,1.340269681,1.4006598913,1.3854,1.3711,1.328,1.3066,1.3265,1.3145,1.2832,1.2353,1.2167,1.2382,1.2609,1.2523,1.204,1.1538,1.1315,1.1219,1.0997,1.0925,1.0723,1.0831,1.0897,1.1001,1.1111,1.1059,1.0898,1.0638,1.0479,1.0354,1.0368,1.0393,1.0416,1.0318,1.0194,1.019,1.0243,1.0073,0.9919,0.9904,0.9974,0.9862,0.9792,0.9937,1.0143,1.0281,1.0085,0.9936,0.9931,0.9978,1.0154,1.0236,1.0244,1.0222,0.998,0.9813,0.9563,0.9787,0.9669,0.9584,0.9771,0.988,0.9942,1.0092,1.0123,1.0184,1.0349,1.0391,1.045,1.038,1.0398,1.0055,1.0247,1.0563,1.044],
      "ZAR":[14.0819041084,13.5768518545,13.730555,14.686242213,13.9021732897,14.5844554116,15.6017017012,14.23318,14.764443498,15.5428923671,15.9598071672,15.5142503357,15.0323,14.1474,13.4961,13.6491,12.8901,12.4471,12.308,11.9552,12.0038,12.0599,11.5913,11.5609,11.4876,11.0855,11.0933,10.9593,10.664,10.6576,10.6614,10.4054,10.5489,10.7516,10.9924,10.8265,10.3545,10.1925,9.9059,9.9974,10.0489,9.9277,10.0248,9.2866,9.1136,9.1743,8.8797,8.7617,8.6441,8.7973,8.6521,8.2786,8.253,8.2394,8.4029,8.1267,7.829,7.5922,7.6649,8.0252,8.1902,8.1324,7.9598,7.5029,7.0749,6.7825,6.7953,6.8453,6.7237,6.9187,7.1932,6.8956,6.8449,6.9694,6.9128,7.1455,7.2917,7.5597,7.6486,7.628,7.3379,7.4232,7.6795,7.4552],
      "NZD":[1.4145740944,1.393613921,1.3727307046,1.3734721422,1.3899033417,1.3957134308,1.469158103,1.4326134451,1.4501744781,1.5110958298,1.5363106532,1.4606003067,1.4816,1.5229,1.4962,1.5779,1.5247,1.5049,1.4331,1.3507,1.3184,1.3388,1.345,1.3052,1.2891,1.277,1.2719,1.2257,1.1845,1.1492,1.1604,1.1619,1.1611,1.1744,1.2091,1.2089,1.2174,1.2105,1.1982,1.2325,1.2619,1.2698,1.2654,1.21,1.1809,1.2073,1.1908,1.1963,1.205,1.2207,1.22,1.2229,1.233,1.2519,1.2861,1.2885,1.2214,1.2171,1.1999,1.2538,1.2978,1.2959,1.2685,1.2242,1.1941,1.1829,1.2274,1.2549,1.27,1.3495,1.3119,1.3047,1.3335,1.2934,1.3315,1.377,1.3974,1.407,1.4456,1.4289,1.4059,1.4231,1.4342,1.3778],
      "JPY":[114.3716723869,104.5445314838,101.3355,103.2323335984,102.2862013916,102.5703875701,109.57138654,106.38,112.0896723884,113.9345536752,121.0606434224,120.625,121.59,122.56,120.13,120.11,123.17,123.32,123.76,120.67,119.49,120.33,118.65,118.49,119.54,115.86,107.97,107.18,102.93,101.65,102.05,101.85,102.51,102.27,102.13,104.05,103.47,99.91,97.8,99.13,97.84,99.74,97.59,100.87,97.78,94.7,93.06,88.94,83.64,80.86,78.92,78.2,78.68,79.06,79.24,79.75,81.43,82.42,78.39,76.96,77.84,77.52,76.62,76.84,77.07,79.44,80.45,81.1,83.29,81.63,82.61,82.51,83.37,82.45,81.86,84.48,85.56,87.61,90.96,92.04,93.44,90.59,90.16,91.39],
      "CHF":[1.0129388781,0.9790001104,0.971275,0.9791918482,0.9669761998,0.9732050896,0.989213566,0.95908,0.9590921851,0.9993936374,1.0204017588,1.0015,0.9935,1.0098,0.9688,0.9722,0.9679,0.9529,0.9313,0.9321,0.9619,0.9789,0.9335,0.9453,0.9761,0.9641,0.9533,0.9355,0.9093,0.8966,0.8958,0.8881,0.8831,0.8804,0.8955,0.9028,0.8945,0.9128,0.9032,0.9243,0.9258,0.9456,0.9357,0.9552,0.9371,0.9451,0.9196,0.9245,0.9219,0.9397,0.9328,0.9405,0.9699,0.9758,0.9581,0.9358,0.9127,0.9128,0.9132,0.9393,0.9313,0.9063,0.8975,0.8662,0.7809,0.8244,0.8409,0.8741,0.8997,0.9195,0.9506,0.9553,0.9715,0.9838,0.9692,1.0045,1.0400,1.0555,1.1301,1.1263,1.0667,1.0666,1.0721,1.0339],
      "SEK":[9.2484271861,8.9528308738,8.564645,8.5522066367,8.5707613992,8.4373176767,8.3048513208,8.0348,8.12000134,8.6314605478,8.5386480389,8.459945,8.4916,8.6864,8.3343,8.3591,8.5483,8.5271,8.2647,8.3364,8.6573,8.5351,8.3581,8.0878,7.6366,7.4118,7.2323,7.1247,6.8952,6.8125,6.6837,6.5698,6.5518,6.4138,6.4996,6.4789,6.547,6.5783,6.4107,6.5071,6.5324,6.6243,6.5839,6.6011,6.4882,6.4411,6.3679,6.4949,6.6078,6.7081,6.6408,6.5994,6.6785,6.9589,7.0897,7.0074,6.726,6.7264,6.6707,6.8635,6.844,6.7281,6.663,6.6115,6.4003,6.3803,6.3244,6.2529,6.2059,6.3478,6.4437,6.6854,6.8591,6.8121,6.6713,7.089,7.3003,7.4473,7.8412,7.6708,7.1946,7.1569,7.2783,7.1455],
      "NOK":[8.4447102291,8.2089744196,7.9826,8.3272813992,8.4765831097,8.3366017669,8.3129751359,8.05185,8.3131832041,8.6541920716,8.7120899865,8.84459,8.6817,8.6373,8.27,8.2833,8.2439,8.1141,7.8109,7.5534,7.9007,7.9844,7.5966,7.6706,7.3054,6.8168,6.5490,6.3472,6.1994,6.1961,6.0389,5.9396,5.9808,6.0013,6.1313,6.1542,6.1440,6.0821,5.9511,5.9807,5.9586,6.0337,5.8775,5.8219,5.7916,5.7768,5.5569,5.5583,5.6170,5.7229,5.7104,5.7462,5.9097,6.0652,6.0155,5.9119,5.7512,5.7006,5.7136,5.9531,5.8852,5.7404,5.6540,5.6085,5.4423,5.4413,5.4461,5.4753,5.3993,5.5910,5.7324,5.8593,5.9815,5.9604,5.8285,6.0606,6.1499,6.2827,6.4760,6.2810,5.9147,5.9211,5.9228,5.7481],
      "HKD":[7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76,7.76]
    };//according to http://www.oanda.com/currency/historical-rates/ (until the end of 2015) and http://www.xe.com/currencytables/
    fixeddata.currencyhtml={"USD":"$","GBP":"&pound;","EUR":"&euro;","JPY":"&yen;"};
    fixeddata.currencysymbol={"USD":"$","GBP":"£","EUR":"€","JPY":"¥"};
    fixeddata.topcharities=["Against Malaria Foundation","Schistosomiasis Control Initiative","Deworm the World Initiative","GiveDirectly",".impact","80,000 Hours","Abdul Latif Jameel Poverty Action Lab","Animal Charity Evaluators","Center for Applied Rationality","Centre for Effective Altruism","Charity Entrepreneurship","Charity Science","Cool Earth","Development Media International","Doctors Without Borders","EA Policy Analytics","Effective Altruism Foundation","Effective Altruism Funds","END Fund","Evidence Action","Fistula Foundation","Food Fortification Initiative","Founders Pledge","Fred Hollows Foundation","Future of Humanity Institute","Future of Life Institute","GiveWell","GiveWell (regrant)","Giving What We Can","Giving What We Can Trust","Global Alliance for Improved Nutrition","Innovations for Poverty Action","Iodine Global Network","Living Goods","Machine Intelligence Research Institute","Malaria Consortium","Mercy for Animals","Oxfam","Partners in Health","Possible Health","Project Healthy Children","Raising for Effective Giving","RESULTS","Seva Foundation","Sightsavers","Stiftung für Effektiven Altruismus","The Fistula Foundation","The Humane League","The Life You Can Save","UNICEF","Vegan Outreach"];//charities that have their own radio button
    fixeddata.editshowcharities=0;//number of top charities to intially display when "edit" is pressed
    fixeddata.addshowcharities=4;//number of top charities to intially display when "add new donation" is pressed
    fixeddata.topcharitymetrics={
      "Against Malaria Foundation":[
        "long-lasting insecticidal mosquito nets distributed",
        //(5.80+6.15)/2,//$5.80-$6.15 per net according to http://www.givewell.org/international/top-charities/amf
        5.31,//$5.31 per net according to http://www.givewell.org/international/top-charities/AMF#CostperLLINdistributed
        "Against Malaria Foundation.jpg",
        "number"
      ],
      "Schistosomiasis Control Initiative":[
        "neglected tropical disease treatments provided",
        //(0.73+0.99)/2,//73-99 cents per treatment according to http://www.givewell.org/international/top-charities/schistosomiasis-control-initiative
        1.26,//$1.26 per treatment according to http://www.givewell.org/international/top-charities/schistosomiasis-control-initiative#Whatdoyougetforyourdollar
        "Schistosomiasis Control Initiative.jpg",
        "number"
      ],
      "GiveDirectly":[
        "donated directly to the world's poorest",
        //1/((90.6+87.6)/200),//90.6% of funds transferred in Kenya and 87.6% of funds transferred in Uganda according to http://www.givewell.org/international/top-charities/give-directly
        1/(86.7/100),//cash grants make up 86.7% of expenses according to http://www.givewell.org/international/top-charities/give-directly#WhatpercentageofGiveDirectlysexpensesendupinthehandsofrecipients
        "GiveDirectly.jpg",
        "dollars"
      ],
      "Deworm the World Initiative":[
        "neglected tropical disease treatments provided",
        //0.35,//35 cents per treatment according to http://www.givewell.org/international/top-charities/deworm-world-initiative
        0.8,//80 cents per treatment according to http://www.givewell.org/international/top-charities/deworm-world-initiative#dollar
        "Deworm the World Initiative.jpg",
        "number"
      ],
      "Project Healthy Children":[
        "donated",
        1,
        "Project Healthy Children.jpg",
        "default"
      ],
      "Development Media International":[
        "donated",
        1,
        "Development Media International.jpg",
        "default"
      ],
      "International Council for the Control of Iodine Deficiency Disorders":[
        "donated",
        1,
        "International Council for the Control of Iodine Deficiency Disorders.jpg",
        "default"
      ],
      "Global Alliance for Improved Nutrition":[
        "donated",
        1,
        "Global Alliance for Improved Nutrition.jpg",
        "default"
      ],
      "Living Goods":[
        "donated",
        1,
        "Living Goods.jpg",
        "default"
      ],
      "80,000 Hours":["donated",1,"80,000 Hours.jpg","default"],
      "Abdul Latif Jameel Poverty Action Lab":["donated",1,"Abdul Latif Jameel Poverty Action Lab.jpg","default"],
      "Amnesty International":["donated",1,"Amnesty International.jpg","default"],
      "Apopo":["donated",1,"Apopo.jpg","default"],
      "Camfed":["donated",1,"Camfed.jpg","default"],
      "Centre for Effective Altruism":["donated",1,"Centre for Effective Altruism.jpg","default"],
      "Cool Earth":["donated",1,"Cool Earth.jpg","default"],
      "Copenhagen Consensus Center":["donated",1,"Copenhagen Consensus Center.jpg","default"],
      "CrossCurrents International Institute":["donated",1,"CrossCurrents International Institute.jpg","default"],
      "Dispensers for Safe Water":["donated",1,"Dispensers for Safe Water.jpg","default"],
      "Doctors Without Borders":["donated",1,"Doctors Without Borders.jpg","default"],
      "GiveWell":["donated",1,"GiveWell.jpg","default"],
      "Giving What We Can":["donated",1,"Giving What We Can.jpg","default"],
      "Giving What We Can Trust":["donated",1,"Giving What We Can Trust.jpg","default"],
      "Global Network":["donated",1,"Global Network.jpg","default"],
      "Innovations for Poverty Action":["donated",1,"Innovations for Poverty Action.jpg","default"],
      "Oxfam":["donated",1,"Oxfam.jpg","default"],
      "Possible Health":["donated",1,"Possible Health.jpg","default"],
      "Pratham":["donated",1,"Pratham.jpg","default"],
      "RESULTS":["donated",1,"RESULTS.jpg","default"],
      "Sabin Vaccine Institute":["donated",1,"Sabin Vaccine Institute.jpg","default"],
      "Stop TB Partnership":["donated",1,"Stop TB Partnership.jpg","default"],
      "UNICEF":["donated",1,"UNICEF.jpg","default"],
      "War on Want":["donated",1,"War on Want.jpg","default"],
      "WaterAid":["donated",1,"WaterAid.jpg","default"],
      "Women for Women International":["donated",1,"Women for Women International.jpg","default"],
      "World Toilet Organisation":["donated",1,"World Toilet Organisation.jpg","default"],
      "Worldwide Fistula Fund":["donated",1,"Worldwide Fistula Fund.jpg","default"],
    };
    fixeddata.monthlengths=[31,28,31,30,31,30,31,31,30,31,30,31];
    fixeddata.frequencies=["day","week","month","year"];
    fixeddata.startyear=2009;
    fixeddata.chartwidth=550;//in pixels
    fixeddata.chartheight=350;//in pixels
    fixeddata.timelinewidth=850;//in pixels
    fixeddata.timelineheight=350;//in pixels
    fixeddata.othertabs=["edit"];
    fixeddata.ajaxformurl="/igiveajax";
    fixeddata.pledgepercentageerrormargin=0.005;

    //add recurring donations to dashboarddata in case it isn't defined
    if(typeof(dashboarddata.recurringdonations)=="undefined"){
      dashboarddata.recurringdonations=[];
      dashboarddata.recurringdonationsadded=0;
    }

    //convert PHP timestamps to JavaScript dates and set times to midnight
    var phptimestamptomidnightdate=function(timestamp){
      timestamp=new Date(timestamp);//timestamp=new Date(timestamp*1000);
      timestamp.setHours(0,0,0,0);
      return timestamp;
    };
    for(var i=0;i<dashboarddata.donations.length;i++){
      dashboarddata.donations[i][0]=phptimestamptomidnightdate(dashboarddata.donations[i][0]);
    }
    for(var i=0;i<dashboarddata.recurringdonations.length;i++){
      dashboarddata.recurringdonations[i][0]=phptimestamptomidnightdate(dashboarddata.recurringdonations[i][0]);
      dashboarddata.recurringdonations[i][1]=dashboarddata.recurringdonations[i][1]===""?null:phptimestamptomidnightdate(dashboarddata.recurringdonations[i][1]);
    }
    if(dashboarddata.lastupdated!==null){
      dashboarddata.lastupdated=phptimestamptomidnightdate(dashboarddata.lastupdated);
    }
    fixeddata.today=phptimestamptomidnightdate(new Date());//fixeddata.today);
    if(fixeddata.joindate!==false&&fixeddata.joindate!==null){
      fixeddata.joindate=phptimestamptomidnightdate(fixeddata.joindate);
    }
    if(fixeddata.trygivingstartdate!==false&&fixeddata.trygivingstartdate!==null){
      fixeddata.trygivingstartdate=phptimestamptomidnightdate(fixeddata.trygivingstartdate);
    }
    if(fixeddata.trygivingenddate!==false&&fixeddata.trygivingenddate!==null){
      fixeddata.trygivingenddate=phptimestamptomidnightdate(fixeddata.trygivingenddate);
    }

    //more constants
    fixeddata.endyear=fixeddata.today.getFullYear();
    fixeddata.activetab=window.location.hash.length>1?window.location.hash.substr(1):fixeddata.endyear+"";

    //set ajax error handler
    jQuery(document).ajaxError(function(event,jqXHR,ajaxSettings,thrownError){
      if(jqXHR.readyState==4){
        alert("Error connecting to server: "+thrownError+".\n\nPlease contact webmaster@givingwhatwecan.org.");
      }
    });

  })(igive.dashboarddata,igive.fixeddata);

});