(function (ext) {

    var flagArray = {
        data:[]
    };
	
    port = ":8080";

	zenboIPWarningWindowFlag = true; 

    function checkValueAndSwitchZenboIPWarningWindowFlag() 
    { 
       console.log("checkValueAndSwitchZenboIPWarningWindowFlag");       	    
       var ckValue = $("input:checkbox:checked").val();
       console.log(ckValue);   	 
	      if  (ckValue == "true") {
	       zenboIPWarningWindowFlag = false;	    
	      } 
    }	
	
    var getValueIndex  = function(ip) {

        var returnValueIndex = -1;

        for(var r = 0; r < flagArray.data.length; r++){

             if ( ip == flagArray.data[r].device) {
                  returnValueIndex = r;
             }
        }

        if ( returnValueIndex === -1 ) {
               console.log('returnValueIndex  === -1');
        }      

       
        return returnValueIndex;

    };

    function sleep(milliseconds) 
    { 
       var start = new Date().getTime(); 
       while(1)
       if ((new Date().getTime() - start) > milliseconds)
          break;
    }

    ext._stop = function () {   
        console.log('stop...');

        for(var ipIndex = 0; ipIndex < flagArray.data.length; ipIndex++) {

            var ipLoop = flagArray.data[ipIndex].device;
            console.log(ipLoop);							
	    console.log("stopAll");
	    $.ajax({
 	        url: 'http://' + ipLoop + port + '/?extension=advance' + '&name=stopAll',
	        dataType: 'text',
	        crossDomain: true,
	        success: function (data) {
	        console.log("success handler");

	        },
  	        error: function (jqXHR, textStatus, errorThrown) {
	        console.log("error handler");
                }
   	    });

            sleep(100);
			
        }
 
    };
	
    ext._shutdown = function () {
        console.log('Shutting down...');
	ext._stop();

    };

    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.Setting_targetIP = function (ip, callback) {
        console.log("Setting_targetIP");
        console.log("ip: "+ ip );

        var setupFlag_init = true;
        var flagIndex_init = 0; 

        for(var g = 0; g < flagArray.data.length; g++) {

              console.log("flagArray.data[g].device: "+  flagArray.data[g].device ); 
             if ( ip == flagArray.data[g].device) {
               setupFlag_init = false;
               flagIndex_init = g; 
               console.log("false" + "flagIndex_init: "+ flagIndex_init);
             }    
        }     

        if ( setupFlag_init == true) {
     
               flagArray.data.push( { device: ip, correctedSentence: "", index: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false,
               sentence_4_flag: false, sentence_5_flag: false, otherSentence_flag: false,  number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init: "+ flagIndex_init);

        }

        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Add_and_update_sentence' + '&p1=' + 'IP' + '&p2=' + 'switch',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
             console.log("success handler");		 
	     console.log("proceed callback 0 " + flagArray.data[flagIndex_init].recursionFlag );

	     if  ( flagArray.data[flagIndex_init].recursionFlag === true) {
		   flagArray.data[flagIndex_init].recursionFlag = false;

		   console.log("proceed callback 1 " + flagArray.data[flagIndex_init].recursionFlag );

		   $.ajax({
		       url: 'http://' + ip + port + '/?extension=advance' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
		       dataType: 'text',
		       crossDomain: true,
		       success: function (data) {
		       console.log("Add_and_update_sentence test zenbo success handler");
		       getSentencesRecursion(ip, flagIndex_init);

		       },
		       error: function (jqXHR, textStatus, errorThrown) {
		       console.log("error handler");
		       flagArray.data[flagIndex_init].recursionFlag = true;
		       }
		   });

	      }
              callback(); 

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                callback();
            }
        });
        
    };

    var getSentencesRecursion = function(ip, flagIndex) {

		if ( flagArray.data[flagIndex].get_sentences_flag === true ) {  	 
			 flagArray.data[flagIndex].get_sentences_flag = false;  
			 
			$.ajax({
				type: 'GET',
				url: 'http://' + ip + port + '/?extension=advance' + '&name=Get_sentences',
				dataType: 'text',
				crossDomain: true,
				success: function (data) {
				console.log("Get_sentences-success handler");
                               
                                console.log('splitedData[0]:' + data.split(",")[0]);
                                
				// console.log('splitedData[2]:' + data.split(",")[2]);	
				
				if (data.split(",")[2]) {
				
				 switch(data.split(",")[2]) {

    		                        case 'touchHead':

                                        console.log('touchHead');
                                        console.log( ip + " "  + flagIndex + " " + "touch_head_flag true");
                                        flagArray.data[flagIndex].touch_head_flag = true;

                                        break; 

                                        case 'number':
                                 
                                        console.log('recognize number');
                                        console.log( ip + " "  + flagIndex + " " + "number_flag true");
                                        flagArray.data[flagIndex].number_flag = true;
                                        flagArray.data[flagIndex].index = data.split(",")[1];
                                        console.log('index:' + flagArray.data[flagIndex].index);
                                              
                                        break; 

					case 'sentence1':
						
						console.log('recognize sentence1'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_1_flag true");
						flagArray.data[flagIndex].sentence_1_flag = true;

						break;

					case 'sentence2':
						
  				        console.log('recognize sentence2'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_2_flag true");
						flagArray.data[flagIndex].sentence_2_flag = true;

						break;

					case 'sentence3':
						

						console.log('recognize sentence3');  
						console.log( ip + " "  + flagIndex + " " + "sentence_3_flag true");
						flagArray.data[flagIndex].sentence_3_flag = true;

						break;

					case 'sentence4':
						
						console.log('recognize sentence4'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_4_flag true");
						flagArray.data[flagIndex].sentence_4_flag = true;

						break;


					case 'sentence5':

						console.log('recognize sentence5');                   
						console.log( ip + " "  + flagIndex + " " + "sentence_5_flag true");
						flagArray.data[flagIndex].sentence_5_flag = true;

					   break;
					
                                        case 'otherSentence':

					        console.log('recognize otherSentence');                   
						console.log( ip + " "  + flagIndex + " " + "otherSentence_flag true");
						flagArray.data[flagIndex].otherSentence_flag = true;
						flagArray.data[flagIndex].correctedSentence = data.split(",")[1];
                                                console.log('correctedSentence:' + flagArray.data[flagIndex].correctedSentence);
                                           break;  					
			                }  	
					
				}
				else {	
					
				    switch(data.split(",")[0]) {

    		                        case 'touchHead':

                                        console.log('摸到頭了');
                                        console.log( ip + " "  + flagIndex + " " + "touch_head_flag true");
                                        flagArray.data[flagIndex].touch_head_flag = true;

                                        break; 

                                        case 'number':
                                 
                                        console.log('辨識到number');
                                        console.log( ip + " "  + flagIndex + " " + "number_flag true");
                                        flagArray.data[flagIndex].number_flag = true;
                                        flagArray.data[flagIndex].index = data.split(",")[1];
                                        console.log('index:' + flagArray.data[flagIndex].index);
                                              
                                        break; 

					case '語句一':
						
						console.log('辨識到語句一'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_1_flag true");
						flagArray.data[flagIndex].sentence_1_flag = true;

						break;

					case '語句二':
						
  				        console.log('辨識到語句二'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_2_flag true");
						flagArray.data[flagIndex].sentence_2_flag = true;

						break;

					case '語句三':
						

						console.log('辨識到語句三');  
						console.log( ip + " "  + flagIndex + " " + "sentence_3_flag true");
						flagArray.data[flagIndex].sentence_3_flag = true;

						break;

					case '語句四':
						
						console.log('辨識到語句四'); 
						console.log( ip + " "  + flagIndex + " " + "sentence_4_flag true");
						flagArray.data[flagIndex].sentence_4_flag = true;

						break;


					case '語句五':

						console.log('辨識到語句五');                   
						console.log( ip + " "  + flagIndex + " " + "sentence_5_flag true");
						flagArray.data[flagIndex].sentence_5_flag = true;

					   break;
					
                                        case 'otherSentence':

					        console.log('辨識到其他語句');                   
						console.log( ip + " "  + flagIndex + " " + "otherSentence_flag true");
						flagArray.data[flagIndex].otherSentence_flag = true;
						flagArray.data[flagIndex].correctedSentence = data.split(",")[1];
                                                console.log('correctedSentence:' + flagArray.data[flagIndex].correctedSentence);
                                           break;  					
			                }  
				}

                                        flagArray.data[flagIndex].get_sentences_flag = true;
                                        getSentencesRecursion(ip, flagIndex);  				 
				
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("error handler");
			 
			                flagArray.data[flagIndex].get_sentences_flag = true;
                                        getSentencesRecursion(ip, flagIndex);	 
					
				}
			});
				
            }    
	
    };

function showAlertMessage()  
{  
 	
     $("<div align=\"center\"> <div id=\"dialog\"></div> <div id=\"background\"></div> </div>").appendTo("body");	
   
     jQuery.fn.center = function () {
		this.css("position","absolute");
		this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
		this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
		return this;
     }


	$("#background").css({ 
	
	"display": "none",
	"position": "absolute",
	"height": "100%",
	"width": "100%",
	"top": "0",
	"left": "0",
	"background": "#000000",	
	"z-index": "1"
        
	}); 	
	
	
	$("#dialog").css({ 
	    "position": "absolute",  	
            "display": "block",
	    "border-radius": "5px",
            "border": "#333 solid 1px",
	    "background-color": "#fefefe", 	
	    "width": "240px", 	
            "height": "135px",
	    "font-size": "14px",
	    "text-align": "center",
	    "z-index": "10"
        }); 
	
	$( "#dialog" ).html( '<div id="alertHeader" > <br> <h2>'+ translate.pleaseSetupZenboIP +'</h2> <input id="myCheckBox" type="checkbox" name="ck" value="true">' + translate.checkBoxMessage +'</div>  <div id="alertButtonDiv"> <button id="myButton">' + translate.alertButtonText + '</button>  </div>');

	$("#alertHeader").css({
		  "position": "absolute",
		  "top":"-1px",
                  "left":"-1px",
		  "border-top-left-radius": "5px",
		  "border-top-right-radius": "5px",
		  "border": "#333 solid 1px", 
	          "background-color": "#31669b",
	          "color": "#fff",
	          "font-size": "14px",
	          "text-align": "center",
		  "width": "240px", 	
                  "height": "90px"
	        
        }); 
	
	$("#myCheckBox").css({ 
	    "cursor": "pointer"
        }); 
	
	$("#alertButtonDiv").css({
	    "position": "absolute",  
	    "bottom":"4px",
            "left":"90px",
            "width": "60px", 	
            "height": "35px",
	    "background-color": "#fefefe",	

        }); 
	
        $("#myButton").css({
	    "background-color": "@blue",
	    "color": "#fff",
	    "border": "@blue-dark solid 1px",
	    "border-radius": "3px",
	    "width": "60px", 	
            "height": "35px",
	    "font-size": "14px",
	    "text-align": "center",
	    "padding": "8px 15px",
	    "cursor": "pointer",
	    "text-decoration": "none",
        }); 
	
	
     $( '#myButton' ).click(function(){
		
		  console.log("checkValueAndSwitchZenboIPWarningWindowFlag");       	    
                  var ckValue = $("input:checkbox:checked").val();
                  console.log("ckValue");   	 
	          if  (ckValue == "true") {
	          zenboIPWarningWindowFlag = false;	    
	          } 
		
		  $("#background").fadeOut("slow");
	          $("#dialog").fadeOut("slow");
	         // $("#alertHeader").fadeOut("slow");
	});
 
     $("#myButton").hover(
	     function(){		
             $(this).css("background-color", "blue-dark");
        }, 
	     function(){
             $(this).css("background-color", "@blue");
        }
     );	
	 
     $("#background").css({"opacity" : "0.7"}).fadeIn("slow");	
     $("#dialog").center().fadeIn("slow");		

   };  		
	
    ext.Head_movement = function (ip, p1, p2, callback) {
		
		for(var i = 0; i < translate.head_direction.length; i++){

            if ( p1 == translate.head_direction[i]) {                                        
		         p1 = TRANSLATIONS.us.head_direction[i];
            }   
	  
        }
		
	     for(var j = 0; j < translate.head_degree.length; j++){

            if ( p2 == translate.head_degree[j]) {                                         
		         p2 = TRANSLATIONS.us.head_degree[j];
            }   
	  
        }
		
        console.log("Head_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Head_movement' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
          
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Body_movement = function (ip, p1, p2, p3, callback) {
		
		for(var i = 0; i < translate.move_direction.length; i++){

            if ( p1 == translate.move_direction[i]) {                                         
		      p1 = TRANSLATIONS.us.move_direction[i];
            }   
	  
        }
		
	    for(var j = 0; j < translate.move_far.length; j++){

            if ( p2 == translate.move_far[j]) {                                         
		      p2 = TRANSLATIONS.us.move_far[j];
            }   
	  
        }
		
	    for(var k = 0; k < translate.move_speed.length; k++){

            if ( p3 == translate.move_speed[k]) {                                         
		      p3 = TRANSLATIONS.us.move_speed[k];
            }   
	  
        }
						
        console.log("Body_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        console.log(p3);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Body_movement' + '&p1=' + p1 + '&p2=' + p2 + '&p3=' + p3,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Body_turn = function (ip, p1, p2, callback) {
		
	for(var i = 0; i < translate.body_turn_direction.length; i++){

            if ( p1 == translate.body_turn_direction[i]) {                                         
		         p1 = TRANSLATIONS.us.body_turn_direction[i];
            }   
	  
        }
		
	for(var j = 0; j < translate.body_turn_degree.length; j++){

            if ( p2 == translate.body_turn_degree[j]) {                                         
		         p2 = TRANSLATIONS.us.body_turn_degree[j];
            }   
	  
        }		
				
        console.log("Body_turn");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Body_turn' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Remote_control_body = function (ip, p1){
		
    	for(var i = 0; i < translate.remote_control_body.length; i++){

            if ( p1 == translate.remote_control_body[i]) {                                         
		         p1 = TRANSLATIONS.us.remote_control_body[i];
            }   
	  
        }		
		
        console.log("Remote_control_body");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Remote_control_body' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Stop_moving = function (ip,callback){
        console.log("Stop_moving");
	    console.log("Remote_control_body-Stop");
        console.log(ip);
       	$.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Remote_control_body' + '&p1=' + 'stop',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("success handler");

	    if (data == 'Must set Zenbo IP')
            if (zenboIPWarningWindowFlag === true) showAlertMessage();  
				
            console.log(ip);
            $.ajax({
                url: 'http://' + ip + port + '/?extension=advance' + '&name=Stop_moving',
                dataType: 'text',
                crossDomain: true,
                success: function (data) {
                console.log("success handler");					        		
                },
                error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                }
            });
					
	    },
            error: function (jqXHR, textStatus, errorThrown) {
            console.log("error handler");
            if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });   		 
    };

    ext.Action = function (ip, p1,callback){
		
		for(var i = 0; i < translate.action_type.length; i++){

            if ( p1 == translate.action_type[i]) {                                         
		         p1 = TRANSLATIONS.us.action_type[i];
            }   
	  
        }	
		
        console.log("Action");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Action' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Facial = function (ip, p1, callback) {
		
		for(var i = 0; i < translate.facial_type.length; i++){

            if ( p1 == translate.facial_type[i]) {                                         
		         p1 = TRANSLATIONS.us.facial_type[i];
            }   
	  
        }
		
        console.log("Facial");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Facial' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.TTS = function (ip, p1, callback) {
        console.log("Tts");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=TTS' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.TTS_editor = function (ip, p1, callback) {
        console.log("TTS_editor");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=TTS_editor' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Cancel_actionset = function (ip){
        console.log("Cancel_actionset");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Cancel_actionset',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Adjust_stream_volume = function (ip, p1, p2, callback) {
		
		for(var i = 0; i < translate.volume_option_type.length; i++){

            if ( p1 == translate.volume_option_type[i]) {                                         
		        p1 = TRANSLATIONS.us.volume_option_type[i];
            }   
	  
        }
		
	    for(var j = 0; j < translate.volume_type.length; j++){

            if ( p2 == translate.volume_type[j]) {                                         
		         p2 = TRANSLATIONS.us.volume_type[j];
            }   
	  
        }
		
        console.log("Adjust_stream_volume");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Adjust_stream_volume' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Add_and_update_sentence = function (ip, p1, p2) {
 
	    for(var i = 0; i < translate.sentence_type.length; i++){

            if ( p1 == translate.sentence_type[i]) {                                         
		         p1 = TRANSLATIONS.us.sentence_type[i];
            }   
	  
        }
		 
        var setupFlag_init_2 = true;
        var flagIndex_init_2 = 0;

        for(var h = 0; h < flagArray.data.length; h++) {

              console.log("flagArray.data[h].device: "+  flagArray.data[h].device ); 
             if ( ip == flagArray.data[h].device) {
               setupFlag_init_2 = false;
               flagIndex_init_2 = h;
               console.log("false" + "flagIndex_init_2: "+ flagIndex_init_2);
             }
        }         

        if ( setupFlag_init_2 == true) {
              
               flagArray.data.push( { device: ip, correctedSentence: "", index: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false,
               sentence_4_flag: false, sentence_5_flag: false, otherSentence_flag: false,  number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init_2 = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init_2: "+ flagIndex_init_2);

        }
   
        console.log("Add_and_update_sentence");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Add_and_update_sentence' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("success handler");

            if (data == 'Must set Zenbo IP')
            if (zenboIPWarningWindowFlag === true) showAlertMessage(); 

               if  ( flagArray.data[flagIndex_init_2].recursionFlag === true) {
                     flagArray.data[flagIndex_init_2].recursionFlag = false;

                     $.ajax({
                         url: 'http://' + ip + port + '/?extension=advance' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
                         dataType: 'text',
                         crossDomain: true,
                         success: function (data) {
           
                         console.log("success handler");
                         getSentencesRecursion(ip, flagIndex_init_2);
 
                         },
                         error: function (jqXHR, textStatus, errorThrown) {
                         console.log("error handler");
                         flagArray.data[flagIndex_init_2].recursionFlag = true; 
                         }
                     }); 

               } 

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };    

	
    ext.Delete_instance = function (ip,callback){
        console.log("Delete_instance");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Delete_instance',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Speak_and_listen = function (ip){
        console.log("Speak_and_listen");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Speak_and_listen',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("Speak_and_listen-success handler");	 
	    if (data == 'Must set Zenbo IP')
            if (zenboIPWarningWindowFlag === true) showAlertMessage();  			               				   
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Adjust_tts_and_speed = function (ip, p1, p2, callback) {
		
		for(var i = 0; i < translate.tts_speed_type.length; i++){

            if ( p2 == translate.tts_speed_type[i]) {                                         
		         p2 = TRANSLATIONS.us.tts_speed_type[i];
            }   
	  
        }
				
        console.log("Adjust_tts_and_speed");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Adjust_tts_and_speed' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.Get_sentences = function (ip, p1, callback){
        console.log("Get_sentences");
        console.log(ip);
        console.log(p1);
        $.ajax({
            type: 'GET',  
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Get_sentences',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                callback(textStatus);
            }
        });        
    };

    ext.when_listen_and_run = function(ip, p1) {
		
    for(var s = 0; s < translate.sentence_type.length; s++){

            if ( p1 == translate.sentence_type[s]) {                                         
		         p1 = TRANSLATIONS.us.sentence_type[s];
            }   
	  
    }		
       
    var checkFlag = false;
   	var valueIndex = 0;

   	for(var i = 0; i < flagArray.data.length; i++){

             if ( ip == flagArray.data[i].device) {
                  checkFlag = true;
                  valueIndex = i;
             }
   	}

  	if ( checkFlag === false )
        return false;

        switch(p1) {

            case 'sentence1':
        
            if (flagArray.data[valueIndex].sentence_1_flag === true) {
                flagArray.data[valueIndex].sentence_1_flag = false;
		        console.log('true sentence1'); 
                return true;
            }

            break;

            case 'sentence2':
        
            if (flagArray.data[valueIndex].sentence_2_flag === true) {
                flagArray.data[valueIndex].sentence_2_flag = false;
		        console.log('true sentence2'); 
                return true;
            }

            break;

            case 'sentence3':
         
            if (flagArray.data[valueIndex].sentence_3_flag === true) {
                flagArray.data[valueIndex].sentence_3_flag = false;
	            console.log('true sentence3'); 
                return true;
            }

            break;

            case 'sentence4':
        
            if (flagArray.data[valueIndex].sentence_4_flag === true) {
                flagArray.data[valueIndex].sentence_4_flag = false;
		        console.log('true sentence4'); 
                return true;
            }

            break;

            case 'sentence5':
               
            if (flagArray.data[valueIndex].sentence_5_flag === true) {
                flagArray.data[valueIndex].sentence_5_flag = false;
		        console.log('true sentence5');    
                return true;
            }

            break;
			
	        case 'otherSentence':
               
            if (flagArray.data[valueIndex].otherSentence_flag === true) {
                flagArray.data[valueIndex].otherSentence_flag = false;
		        console.log('true otherSentence');    
                return true;
            }

            break;			
		
            case '語句一':
        
            if (flagArray.data[valueIndex].sentence_1_flag === true) {
                flagArray.data[valueIndex].sentence_1_flag = false;
		        console.log('true 語句一'); 
                return true;
            }

            break;

            case '語句二':
        
            if (flagArray.data[valueIndex].sentence_2_flag === true) {
                flagArray.data[valueIndex].sentence_2_flag = false;
		        console.log('true 語句二'); 
                return true;
            }

            break;

            case '語句三':
         
            if (flagArray.data[valueIndex].sentence_3_flag === true) {
                flagArray.data[valueIndex].sentence_3_flag = false;
	            console.log('true 語句三'); 
                return true;
            }

            break;

            case '語句四':
        
            if (flagArray.data[valueIndex].sentence_4_flag === true) {
                flagArray.data[valueIndex].sentence_4_flag = false;
		        console.log('true 語句四'); 
                return true;
            }

            break;

            case '語句五':
               
            if (flagArray.data[valueIndex].sentence_5_flag === true) {
                flagArray.data[valueIndex].sentence_5_flag = false;
		        console.log('true 語句五');    
                return true;
            }

            break;
			
	        case '其他語句':
               
            if (flagArray.data[valueIndex].otherSentence_flag === true) {
                flagArray.data[valueIndex].otherSentence_flag = false;
		        console.log('true 其他語句');    
                return true;
            }

            break;	
       
        }
        return false;
    };
	
    ext.when_listen_number_and_run = function(ip) {
		   	       
       var valueIndex_2 = -1;

       for(var j = 0; j < flagArray.data.length; j++){

             if ( ip == flagArray.data[j].device) {          
                  valueIndex_2 = j;
             }
       }

       if ( valueIndex_2 === -1 ) {
	
             console.log('valueIndex_2 === -1');  	
	     return false;
       }
         
       if (flagArray.data[valueIndex_2].number_flag === true) {
	     console.log('true number'); 
             flagArray.data[valueIndex_2].number_flag = false;             
             return true;
       }

       return false;
    };

	
    ext.getCorrectedSentence = function(ip) {
       
        var valueIndex_3 = -1;

        for(var k = 0; k < flagArray.data.length; k++){

             if ( ip == flagArray.data[k].device) {               
                  valueIndex_3 = k;
             }
        }
	
        if ( valueIndex_3 === -1 ) {
	
              console.log('valueIndex_3 === -1');  	
	     return 'no device';
	}

        console.log('getCorrectedSentence: ' + flagArray.data[valueIndex_3].correctedSentence);   		
        return flagArray.data[valueIndex_3].correctedSentence;
    };
	
	
	ext.getIndex = function(ip) {
       
        var valueIndex_4 = -1;

        for(var m = 0; m < flagArray.data.length; m++){

             if ( ip == flagArray.data[m].device) {               
                  valueIndex_4 = m;
             }
        }
	
        if ( valueIndex_4 === -1 ) {
	
              console.log('valueIndex_4 === -1');  	
	     return 'no device';
	}

        console.log('getIndex: ' + flagArray.data[valueIndex_4].index);   		
        return flagArray.data[valueIndex_4].index;
    };


    ext.playVideosInYoutube = function (ip, p1, p2) {
				
		for(var i = 0; i < translate.playVideosInYoutubeItems.length; i++){

            if ( p1 == translate.playVideosInYoutubeItems[i]) {                                         
		         p1 = TRANSLATIONS.us.playVideosInYoutubeItems[i];
            }   
	  
        }
		
        console.log("playVideosInYoutube");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=playVideosInYoutube' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.displayUrlPictures = function (ip, p1, p2) {
		
		for(var i = 0; i < translate.displayUrlPicturesItems.length; i++){

            if ( p1 == translate.displayUrlPicturesItems[i]) {                                         
		         p1 = TRANSLATIONS.us.displayUrlPicturesItems[i];
            }   
	  
        }		
		
        console.log("displayUrlPictures");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=displayUrlPictures' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };
	
    ext.playUrlMusic = function (ip, p1, p2) {
		
		for(var i = 0; i < translate.playUrlMusicItems.length; i++){

            if ( p1 == translate.playUrlMusicItems[i]) {                                         
		         p1 = TRANSLATIONS.us.playUrlMusicItems[i];
            }   
	  
        }
				
        console.log("playUrlMusic");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=playUrlMusic' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.hideFace = function (ip) {
        console.log("hideFace");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=hideFace',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage();
            }
        });
    };
	
    ext.openDriveVideoUrl = function (ip, p1, p2) {
				
		for(var i = 0; i < translate.openDriveVideoUrlItems.length; i++){

            if ( p1 == translate.openDriveVideoUrlItems[i]) {                                         
		         p1 = TRANSLATIONS.us.openDriveVideoUrlItems[i];
            }   
	  
        }
		
        console.log("openDriveVideoUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=openDriveVideoUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.openDriveAudioUrl = function (ip, p1, p2) {
		
		for(var i = 0; i < translate.openDriveAudioUrlItems.length; i++){

            if ( p1 == translate.openDriveAudioUrlItems[i]) {                                        
		         p1 = TRANSLATIONS.us.openDriveAudioUrlItems[i];
            }   
	  
        }
		
        console.log("openDriveAudioUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=openDriveAudioUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.openDrivePictureUrl = function (ip, p1, p2) {
		
		for(var i = 0; i < translate.openDrivePictureUrlItems.length; i++){

            if ( p1 == translate.openDrivePictureUrlItems[i]) {                                         
		         p1 = TRANSLATIONS.us.openDrivePictureUrlItems[i];
            }   
	  
        }
		
        console.log("openDrivePictureUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=openDrivePictureUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    ext.openDriveDocumentUrl = function (ip, p1, p2) {
				
		for(var i = 0; i < translate.openDriveDocumentUrlItems.length; i++){

            if ( p1 == translate.openDriveDocumentUrlItems[i]) {                                         
		         p1 = TRANSLATIONS.us.openDriveDocumentUrlItems[i];
            }   
	  
        }
		
        console.log("openDriveDocumentUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=openDriveDocumentUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage();  
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };


ext.Add_and_update_sentence_number = function (ip) {
       
    var setupFlag_init_3 = true;
    var flagIndex_init_3 = 0;

    for(var f = 0; f < flagArray.data.length; f++) {

        console.log("flagArray.data[f].device: "+  flagArray.data[f].device ); 
        if ( ip == flagArray.data[f].device) {
               setupFlag_init_3 = false;
               flagIndex_init_3 = f;
               console.log("false" + "flagIndex_init_3: "+ flagIndex_init_3);
        }
    }         

    if ( setupFlag_init_3 == true) {
              
               flagArray.data.push(  { device: ip, correctedSentence: "", index: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false,
               sentence_4_flag: false, sentence_5_flag: false, otherSentence_flag: false,  number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init_3 = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init_3: "+ flagIndex_init_3);

    }
   
    if  ( flagArray.data[flagIndex_init_3].recursionFlag === true) {
          flagArray.data[flagIndex_init_3].recursionFlag = false;

        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {           
             console.log("success handler");

             if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 

             getSentencesRecursion(ip, flagIndex_init_3);
 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
                flagArray.data[flagIndex_init_3].recursionFlag = true; 
            }
        }); 

    } 

   };    

   ext.when_touch_head_and_run = function(ip) {
       
       var valueIndex_touch_head =  getValueIndex(ip);

       if ( valueIndex_touch_head === -1 ) {
	
              console.log('return false, valueIndex_touch_head === -1');  	
	      return false;
       }
         
       if (flagArray.data[valueIndex_touch_head].touch_head_flag === true) {
		   console.log('return true, touch head'); 
                   flagArray.data[valueIndex_touch_head].touch_head_flag = false;             
               return true;
       }

       return false;
   };

   ext.recordAudio = function (ip, p1, p2) {
	   	
		for(var i = 0; i < translate.recordAudioItems.length; i++){

            if ( p1 == translate.recordAudioItems[i]) {                                         
		         p1 = TRANSLATIONS.us.recordAudioItems[i];
            }   
	  
        }
	   	   
        console.log("recordAudio");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=recordAudio' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
     
            },   
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }    
        });  
    }; 

   ext.recordVideo = function (ip, p1, p2, p3 ) {
	   
	   	for(var i = 0; i < translate.recordVideoItems.length; i++){

            if ( p1 == translate.recordVideoItems[i]) {                                         
		         p1 = TRANSLATIONS.us.recordVideoItems[i];
            }   
	  
        }
	   
        console.log("recordVideo");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        console.log(p3);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=advance' + '&name=recordVideo' + '&p1=' + p1 + '&p2=' + p2 + '&p3=' + p3 ,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                if (data == 'Must set Zenbo IP')
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                if (zenboIPWarningWindowFlag === true) showAlertMessage(); 
            }
        });
    };

    var TRANSLATIONS = {
        us: {
            Setting_targetIP: 'setup Zenbo IP: %s',
            Body_movement: 'IP %s move %m.move_direction by %m.move_far meter %m.move_speed',
            Stop_moving: 'IP %s stop action',
            Head_movement: 'IP %s turn head to the %m.head_direction by %m.head_degree degree(s)',
            Body_turn: 'IP %s turn body to the  %m.body_turn_direction by %m.body_turn_degree degree(s)',
            Remote_control_body: 'IP %s control body to %m.remote_control_body',
            Action: 'IP %s Zenbo do the action %m.action_type',
            Cancel_actionset: 'IP %s stop the canned action',
            Facial: 'IP %s make the %m.facial_type expression', 
            hideFace: 'IP %s hide the expression',
            TTS: 'IP %s speak:  %m.tts_type ',
	    TTS_editor: 'IP %s speak:  %s',
	    Adjust_stream_volume: 'IP %s make %m.volume_option_type volume %m.volume_type',
	    Adjust_tts_and_speed: 'IP %s speak: %s by %m.tts_speed_type speed',
	    Add_and_update_sentence: 'IP %s is ready to listen %m.sentence_type which is %s',
	    Speak_and_listen: 'IP %s would start listening',
	    when_listen_and_run: 'when IP %s heard %m.second_sentence_type',
	    Delete_instance: 'IP %s delete all sentences',
	    Add_and_update_sentence_number: 'IP %s is ready to listen to numbers',
	    when_listen_number_and_run: 'when IP %s heard numbers',
	    getIndex: 'current number heard by IP %s',
	    playVideosInYoutube: 'IP %s %m.playVideosInYoutubeItems playing a Youtube URL: %s',
	    playUrlMusic: 'IP %s %m.playUrlMusicItems playing an online audio file: %s',
	    displayUrlPictures: 'IP %s %m.displayUrlPicturesItems browsing an online image file: %s',
	    openDriveVideoUrl: 'IP %s %m.openDriveVideoUrlItems playing a Google Drive video shareable link: %s',
	    openDriveAudioUrl: 'IP %s %m.openDriveAudioUrlItems playing Google Drive audio shareable link: %s',
	    openDrivePictureUrl: 'IP %s %m.openDrivePictureUrlItems browsing a Google Drive image shareable link: %s',
            openDriveDocumentUrl: 'IP %s %m.openDriveDocumentUrlItems browsing a Google Drive document shareable link: %s',
	when_touch_head_and_run: 'when the head of IP %s is touched',
		recordAudio: 'IP %s %m.recordAudioItems audio recording, file name: %s',
		recordVideo: 'IP %s %m.recordVideoItems %m.recordVideoSizes video recording, file name: %s',
	    head_direction: ["left", "right", "top", "bottom"],
            head_degree: ["0", "15", "30", "45"],
            move_direction: ["forward", "backward"],
            move_far: ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            move_speed: ["slowly", "normally", "fast"],
            body_turn_direction: ["left", "right"],
            body_turn_degree: ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"],
            remote_control_body: ["stop", "move forward", "turn left", "turn right"],
            action_type: ["relax(default)", "listen to the command/briefing(high)", "complete the task/satisfaction", "greet", "there is a general message-1", "standby(boring)",
                          "charge(satisfaction)", "listen to the command/briefing(low)", "there are continuous task conflicts", "be disappointed(user finishing)", 
                          "be frustrated(user finishing)", "standby(tired)", "there is no electricity soon", "charge(pleasure)", "charge(lazy)", "dance-1 more powerfully", 
                          "understand", "play music", "turn left slowly", "turn left fast", "shake the head(a negative answer)", "dance-1 more powerlessly", "be shy", 
                          "do not understand", "dance-2", "shake the head continuously", "shake and twist the head", "dance-fast", "shake the head", "finish greeting", 
                          "there is a general message-2", "turn right slowly", "turn right fast", "end turning left slowly and reverse", "end turning right slowly and reverse",
                          "end turning left fast and reverse", "end turning right fast and reverse",  "eliminate continuous task conflicts"], 
            facial_type: ["interested", "doubting", "proud", "defualt", "happy", "expecting", "shocked", "questioning", "impatient", "confident", "active", "pleased", 
                          "helpless", "serious", "worried", "pretending", "lazy", "aware_R", "tired", "shy", "innocent", "singing", "aware_L", "default_still"],
            tts_type: ["Hi, welcome to zenbo scratch service", "Look here", "WoW", "YA"],
            volume_type: ["louder", "quieter"],
            music_type: ["start", "pause", "resume", "stop", "restart"],
            volume_option_type: ["music", "alarm clock", "notification", "robot speaking"],
            tts_speed_type: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
            sentence_type: ["sentence1", "sentence2", "sentence3", "sentence4", "sentence5"],
			second_sentence_type: ["sentence1", "sentence2", "sentence3", "sentence4", "sentence5", "other sentence"],
            playVideosInYoutubeItems: ["start", "end"],
            displayUrlPicturesItems: ["start", "end"],
            playUrlMusicItems: ["start", "end"],
            openDriveVideoUrlItems: ["start", "end"],
            openDriveAudioUrlItems: ["start", "end"],
            openDrivePictureUrlItems: ["start", "end"],
            openDriveDocumentUrlItems: ["start", "end"],
	        ttsEditorDefaultText: 'please fill the sentence',
	        defaultAddedSentence: 'eating',
 			recordAudioItems: ["start", "end"],
			recordVideoItems: ["start", "end"],
			recordVideoSizes: ["720P", "480P", "240P"],
			pleaseSetupZenboIP: 'Please setup Zenbo IP!',
			checkBoxMessage   : 'never prompt again',
			alertButtonText   : 'OK',
        },
	tw: {
            Setting_targetIP: '設定Zenbo IP: %s',
            Body_movement: 'IP %s 移動 %m.move_direction %m.move_far 公尺 %m.move_speed 速度',
            Stop_moving: 'IP %s 停止動作',
            Head_movement: 'IP %s 轉動頭部 向 %m.head_direction %m.head_degree 度',
            Body_turn: 'IP %s 轉動身體 向 %m.body_turn_direction %m.body_turn_degree 度',
            Remote_control_body: 'IP %s 控制身體 %m.remote_control_body',
            Action: 'IP %s Zenbo 做動作 %m.action_type',
            Cancel_actionset: 'IP %s 停止罐頭動作',
            Facial: 'IP %s 做出表情 %m.facial_type', 
            hideFace: 'IP %s 隱藏表情',
            TTS: 'IP %s 說話 %m.tts_type',
	    TTS_editor: 'IP %s 說話 %s',
	    Adjust_stream_volume: 'IP %s 調整 %m.volume_option_type 音量 %m.volume_type',
	    Adjust_tts_and_speed: 'IP %s 說話 %s 速度 %m.tts_speed_type',
	    Add_and_update_sentence: 'IP %s 準備要聽 %m.sentence_type 是 %s',
	    Speak_and_listen: 'IP %s 我要開始聽',
	    when_listen_and_run: '當我聽到 IP %s 的 %m.second_sentence_type',
	    Delete_instance: 'IP %s 刪除全部語句',
	    Add_and_update_sentence_number: 'IP %s 準備要聽數字',
	    when_listen_number_and_run: '當我聽到 IP %s 的數字',
	    getIndex: '目前 IP %s 聽到的數字 ',
	    playVideosInYoutube: 'IP %s %m.playVideosInYoutubeItems 播放 Youtube 網址: %s',
	    playUrlMusic: 'IP %s %m.playUrlMusicItems 播放線上音樂: %s',
	    displayUrlPictures: 'IP %s %m.displayUrlPicturesItems 瀏覽線上圖片: %s',
	    openDriveVideoUrl: 'IP %s %m.openDriveVideoUrlItems 播放 Google Drive 影片: %s',
	    openDriveAudioUrl: 'IP %s %m.openDriveAudioUrlItems 播放 Google Drive 音樂: %s',
	    openDrivePictureUrl: 'IP %s %m.openDrivePictureUrlItems 瀏覽 Google Drive 圖片: %s',
            openDriveDocumentUrl: 'IP %s %m.openDriveDocumentUrlItems 瀏覽 Google Drive 文件: %s',
		when_touch_head_and_run: '當摸到 IP %s 的頭',
		recordAudio: 'IP %s %m.recordAudioItems 錄音, 檔名: %s',
		recordVideo: 'IP %s %m.recordVideoItems %m.recordVideoSizes 錄影, 檔名: %s',
	    head_direction: ["左", "右", "上", "下"],
            head_degree: ["0", "15", "30", "45"],
            move_direction: ["前進", "後退"],
            move_far: ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            move_speed: ["慢", "一般", "快"],
            body_turn_direction: ["左轉", "右轉"],
            body_turn_degree: ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"],
            remote_control_body: ["停止", "前進", "左轉", "右轉"],
            action_type: ["輕鬆(預設)", "Listen to the command/briefing(high)", "Complete the task/satisfaction", "打招呼", "一般訊息一", "待機(無聊)", "充電(滿足)", "聽指令/briefing(矮)", "連續任務衝突", "失望(使用者結束)",
                            "沮喪(使用者結束)", "待機(疲倦)", "快沒電", "充電(愉悅)", "充電(慵懶)", "跳舞一大點", "聽懂", "音樂播放", "向左慢轉", "向左急轉", "搖頭(回答否定)", "跳舞一小點", 
                            "害羞", "聽不懂", "跳舞二", "連續搖頭", "搖頭晃腦", "跳舞極快", "搖頭", "結束打招呼", "一般訊息二", "向右慢轉", "向右急轉", "結束向左慢轉", "結束向右慢轉",
                            "結束向左急轉", "結束向右急轉", "解除連續任務衝突"],
            facial_type: ["有興趣", "疑惑", "驕傲", "輕鬆愉快(預設)", "開心", "期待", "愣一下", "質疑", "不耐煩", "自信", "有活力一", "得意", "無奈", "嚴肅", "煩惱", "裝平靜", "慵懶", "察覺", 
                            "倦怠", "害羞", "無辜", "有活力二", "察覺", "預設"],
            tts_type: ["嗨,你好", "看這裡", "WoW", "YA"],
            volume_type: ["大聲點", "小聲點"],
            music_type: ["開始", "暫停", "繼續", "停止", "重新"],
            volume_option_type: ["音樂", "鬧鐘", "通知", "說話"],
            tts_speed_type: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
            sentence_type: ["語句一", "語句二", "語句三", "語句四", "語句五"],
			second_sentence_type: ["語句一", "語句二", "語句三", "語句四", "語句五", "其他語句"],
            playVideosInYoutubeItems: ["開始", "關閉"],
            displayUrlPicturesItems: ["開始", "關閉"],
            playUrlMusicItems: ["開始", "關閉"],
            openDriveVideoUrlItems: ["開始", "關閉"],
            openDriveAudioUrlItems: ["開始", "關閉"],
            openDrivePictureUrlItems: ["開始", "關閉"],
            openDriveDocumentUrlItems: ["開始", "關閉"],
   	        ttsEditorDefaultText: '請填入文字',
            defaultAddedSentence: '吃飯',
 			recordAudioItems: ["開始", "關閉"],
			recordVideoItems: ["開始", "關閉"],
			recordVideoSizes: ["720P", "480P", "240P"],
			pleaseSetupZenboIP: '請先設置 Zenbo IP！',
			checkBoxMessage   : '永遠不再提示',
			alertButtonText   : '確定',
        },  		
    }	
	

    function getTranslationForLang( lang ){
        switch (lang){
               case "en":
		    return TRANSLATIONS.us;
	       case "en-us":
		    return TRANSLATIONS.us; 			
               case "zh":
		    return TRANSLATIONS.tw; 	
               case "zh-tw":
		    return TRANSLATIONS.tw; 
               default:
                    return TRANSLATIONS.us;
            
        }
    }
	
    // how which language translation is chosen (increasing priority):
    //   1 - explicit 'lang' parameter in the url (e.g: http://scratchx.org/?url=https://zenboscratchservice.github.io/extentions/ZenboScratchServiceExtensionAdvance.js&lang=en#scratch)
    //   2 - browser first preferred language (navigator.languages[0])
    //   3 - default (en-us)
		
    var urlParams = new URLSearchParams(window.location.search);
    var lang = ( urlParams.get('lang') || navigator.browserLanguage || navigator.language ).toLowerCase();
    console.log("lang:" + lang);
	
    var translate = getTranslationForLang(lang);

	    var descriptor = {
        blocks: [
            ['w', translate.Setting_targetIP, 'Setting_targetIP', "192.168.0.1"],
            ['', translate.Body_movement, 'Body_movement', "192.168.0.1", translate.move_direction[0], translate.move_far[0], translate.move_speed[0]],
            ['', translate.Stop_moving, 'Stop_moving', "192.168.0.1"],
            ['', translate.Head_movement, 'Head_movement', "192.168.0.1", translate.head_direction[0], translate.head_degree[3]], 
            ['', translate.Body_turn, 'Body_turn', "192.168.0.1", translate.body_turn_direction[0], translate.body_turn_degree[3]],
            ['', translate.Remote_control_body, 'Remote_control_body', "192.168.0.1", translate.remote_control_body[3]],
          //  ['', translate.Action, 'Action', "192.168.0.1", translate.action_type[3]],
          //  ['', translate.Cancel_actionset, 'Cancel_actionset', "192.168.0.1"],
            ['', translate.Facial, 'Facial', "192.168.0.1", translate.facial_type[5]],
            ['', translate.hideFace, 'hideFace', "192.168.0.1"],
            ['', translate.TTS, 'TTS', "192.168.0.1", translate.tts_type[0]],
            ['', translate.TTS_editor, 'TTS_editor', "192.168.0.1", translate.ttsEditorDefaultText],
            ['', translate.Adjust_stream_volume, 'Adjust_stream_volume', "192.168.0.1", translate.volume_option_type[3], translate.volume_type[0]],
            ['', translate.Adjust_tts_and_speed, 'Adjust_tts_and_speed', "192.168.0.1", translate.ttsEditorDefaultText, translate.tts_speed_type[1]],
            ['', translate.Add_and_update_sentence, 'Add_and_update_sentence', "192.168.0.1", translate.sentence_type[0], translate.defaultAddedSentence], 
            ['', translate.Speak_and_listen, 'Speak_and_listen', "192.168.0.1"], 
            ['h', translate.when_listen_and_run, 'when_listen_and_run', "192.168.0.1", translate.second_sentence_type[0]],
            ['', translate.Delete_instance, 'Delete_instance', "192.168.0.1"],
          //  ['', translate.Add_and_update_sentence_number, 'Add_and_update_sentence_number', "192.168.0.1"],
            ['h', translate.when_listen_number_and_run, 'when_listen_number_and_run', "192.168.0.1"],
            ['r', translate.getIndex, 'getIndex', "192.168.0.1"],
            ['', translate.playVideosInYoutube, 'playVideosInYoutube', "192.168.0.1", translate.playVideosInYoutubeItems[0], 'https://www.youtube.com/watch?v=Ou21RusvBcg'],
            ['', translate.playUrlMusic, 'playUrlMusic', "192.168.0.1", translate.playUrlMusicItems[0], 'https://zenboscratch.github.io/examples/zenbo_music.mp3'],
            ['', translate.displayUrlPictures, 'displayUrlPictures', "192.168.0.1", translate.displayUrlPicturesItems[0], 'https://zenboscratch.github.io/images/zenbo.jpg'],
            ['', translate.openDriveVideoUrl, 'openDriveVideoUrl', "192.168.0.1", translate.openDriveVideoUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiUUhrTW12Ql9tcUk'],
            ['', translate.openDriveAudioUrl, 'openDriveAudioUrl', "192.168.0.1", translate.openDriveAudioUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaibHJ0LWtHN0JtVFU'], 
            ['', translate.openDrivePictureUrl, 'openDrivePictureUrl', "192.168.0.1", translate.openDrivePictureUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiSVJ0S3JKeEZwODA'],
            ['', translate.openDriveDocumentUrl, 'openDriveDocumentUrl', "192.168.0.1", translate.openDriveDocumentUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiN1h3SXZHTjRsc2s'],
			['h', translate.when_touch_head_and_run, 'when_touch_head_and_run', "192.168.0.1"],
			['', translate.recordAudio, 'recordAudio', "192.168.0.1", translate.recordAudioItems[0], 'testAudio'],
            ['', translate.recordVideo, 'recordVideo', "192.168.0.1", translate.recordVideoItems[0], translate.recordVideoSizes[0], 'testVideo'],  
        ],
        menus: {
            "head_direction": translate.head_direction,
            "head_degree": translate.head_degree,
            "move_direction": translate.move_direction,
            "move_far": translate.move_far,
            "move_speed": translate.move_speed,
            "body_turn_direction": translate.body_turn_direction,
            "body_turn_degree": translate.body_turn_degree,
            "remote_control_body": translate.remote_control_body,
            "action_type": translate.action_type,
            "facial_type": translate.facial_type,
            "tts_type": translate.tts_type,
            "volume_type": translate.volume_type,
            "music_type": translate.music_type,
            "volume_option_type": translate.volume_option_type,
            "tts_speed_type": translate.tts_speed_type,
            "sentence_type": translate.sentence_type,
			"second_sentence_type": translate.second_sentence_type,
            "playVideosInYoutubeItems": translate.playVideosInYoutubeItems,
            "displayUrlPicturesItems": translate.displayUrlPicturesItems,
            "playUrlMusicItems": translate.playUrlMusicItems,
            "openDriveVideoUrlItems": translate.openDriveVideoUrlItems,
            "openDriveAudioUrlItems": translate.openDriveAudioUrlItems,
            "openDrivePictureUrlItems": translate.openDrivePictureUrlItems,
            "openDriveDocumentUrlItems": translate.openDriveDocumentUrlItems,
			"recordAudioItems": translate.recordAudioItems,
			"recordVideoItems": translate.recordVideoItems,
			"recordVideoSizes": translate.recordVideoSizes,		
        },
        url: 'https://zenboscratchservice.github.io/' // Link to extension documentation, homepage, etc.
    };
	
	
	/*
    var descriptor = {
        blocks: [
            ['w', '設定Zenbo IP: %s', 'Setting_targetIP', "192.168.0.1"],
            ['', 'IP %s 移動 %m.move_direction %m.move_far 公尺 %m.move_speed 速度', 'Body_movement', "192.168.0.1", "前進", "0.25", "一般"],
            ['', 'IP %s 停止動作', 'Stop_moving', "192.168.0.1"],
            ['', 'IP %s 轉動頭部 向 %m.head_direction %m.head_degree 度', 'Head_movement', "192.168.0.1", "左", "45"], 
            ['', 'IP %s 轉動身體 向 %m.body_turn_direction %m.body_turn_degree 度', 'Body_turn', "192.168.0.1", "左轉", "90"],
            ['', 'IP %s 控制身體 %m.remote_control_body', 'Remote_control_body', "192.168.0.1", "右轉"],
       //   ['', 'IP %s Zenbo 做動作 %m.action_type', 'Action', "192.168.0.1", '打招呼'],
            ['', 'IP %s 做出表情 %m.facial_type', 'Facial', "192.168.0.1", '期待'],
            ['', 'IP %s 隱藏表情', 'hideFace', "192.168.0.1"],
            ['', 'IP %s 說話 %m.tts_type ', 'TTS', "192.168.0.1", '嗨,你好'],
            ['', 'IP %s 說話 %s', 'TTS_editor', "192.168.0.1", '請填入文字'],
            ['', 'IP %s 調整 %m.volume_option_type 音量 %m.volume_type', 'Adjust_stream_volume', "192.168.0.1", '說話', '大聲點'],
            ['', 'IP %s 說話 %s 速度 %m.tts_speed_type', 'Adjust_tts_and_speed', "192.168.0.1", '請填入文字', 'L2'],
            ['', 'IP %s 準備要聽 %m.sentence_type 是 %s', 'Add_and_update_sentence', "192.168.0.1", '語句一', '吃飯'], 
            ['', 'IP %s 我要開始聽', 'Speak_and_listen', "192.168.0.1"], 
            ['h', '當我聽到 IP %s 的 %m.second_sentence_type', 'when_listen_and_run', "192.168.0.1", '語句一'],
            ['', 'IP %s 刪除全部語句', 'Delete_instance', "192.168.0.1"],
          //  ['', 'IP %s 準備要聽數字', 'Add_and_update_sentence_number', "192.168.0.1"],
            ['h', '當我聽到 IP %s 的數字', 'when_listen_number_and_run', "192.168.0.1"],
            ['r', '目前 IP %s 聽到的數字 ', 'getIndex', "192.168.0.1"],
            ['', 'IP %s %m.playVideosInYoutubeItems 播放 Youtube 網址: %s', 'playVideosInYoutube', "192.168.0.1", '開始', 'https://www.youtube.com/watch?v=Ou21RusvBcg'],
            ['', 'IP %s %m.playUrlMusicItems 播放線上音樂: %s', 'playUrlMusic', "192.168.0.1", '開始', 'https://zenboscratch.github.io/examples/zenbo_music.mp3'],
            ['', 'IP %s %m.displayUrlPicturesItems 瀏覽線上圖片: %s', 'displayUrlPictures', "192.168.0.1", '開始', 'https://zenboscratch.github.io/images/zenbo.jpg'],
            ['', 'IP %s %m.openDriveVideoUrlItems 播放 Google Drive 影片: %s', 'openDriveVideoUrl', "192.168.0.1", '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiUUhrTW12Ql9tcUk'],
            ['', 'IP %s %m.openDriveAudioUrlItems 播放 Google Drive 音樂: %s', 'openDriveAudioUrl', "192.168.0.1", '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaibHJ0LWtHN0JtVFU'], 
            ['', 'IP %s %m.openDrivePictureUrlItems 瀏覽 Google Drive 圖片: %s', 'openDrivePictureUrl', "192.168.0.1", '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiSVJ0S3JKeEZwODA'],
            ['', 'IP %s %m.openDriveDocumentUrlItems 瀏覽 Google Drive 文件: %s', 'openDriveDocumentUrl', "192.168.0.1", '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiN1h3SXZHTjRsc2s'],
            ['h', '當摸到 IP %s 的頭', 'when_touch_head_and_run', "192.168.0.1"],
            ['', 'IP %s %m.recordAudioItems 錄音, 檔名: %s', 'recordAudio', "192.168.0.1", '開始', 'testAudio'],
            ['', 'IP %s %m.recordVideoItems %m.recordVideoSizes 錄影, 檔名: %s', 'recordVideo', "192.168.0.1", '開始', '720P', 'testVideo'],    
        ],
        menus: {
            "head_direction": ["左", "右", "上", "下"],
            "head_degree": ["0", "15", "30", "45"],
            "move_direction": ["前進", "後退"],
            "move_far": ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            "move_speed": ["慢", "一般", "快"],
            "body_turn_direction": ["左轉", "右轉"],
            "body_turn_degree": ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"],
            "remote_control_body": ["停止", "前進", "左轉", "右轉"],
            "action_type": ["輕鬆(預設)", "聽指令/briefing(高)", "完成任務/滿足", "打招呼", "一般訊息一", "待機(無聊)", "充電(滿足)", "聽指令/briefing(矮)", "連續任務衝突", "失望(使用者結束)",
                            "沮喪(使用者結束)", "待機(疲倦)", "快沒電", "充電(愉悅)", "充電(慵懶)", "跳舞一大點", "聽懂", "音樂播放", "向左慢轉", "向左急轉", "搖頭(回答否定)", "跳舞一小點", 
                            "害羞", "聽不懂", "跳舞二", "連續搖頭", "搖頭晃腦", "跳舞極快", "搖頭", "結束打招呼", "一般訊息二", "向右慢轉", "向右急轉", "結束向左慢轉", "結束向右慢轉",
                            "結束向左急轉", "結束向右急轉", "解除連續任務衝突"],
            "facial_type": ["有興趣", "疑惑", "驕傲", "輕鬆愉快(預設)", "開心", "期待", "愣一下", "質疑", "不耐煩", "自信", "有活力一", "得意", "無奈", "嚴肅", "煩惱", "裝平靜", "慵懶", "察覺", 
                            "倦怠", "害羞", "無辜", "有活力二", "察覺", "預設"],
            "tts_type": ["嗨,你好", "看這裡", "WoW", "YA"],
            "volume_type": ["大聲點", "小聲點"],
            "music_type": ["開始", "暫停", "繼續", "停止", "重新"],
            "volume_option_type": ["音樂", "鬧鐘", "通知", "說話"],
            "tts_speed_type": ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
            "sentence_type": ["語句一", "語句二", "語句三", "語句四", "語句五"],
            "playVideosInYoutubeItems": ["開始", "關閉"],
            "displayUrlPicturesItems": ["開始", "關閉"],
            "playUrlMusicItems": ["開始", "關閉"],
            "openDriveVideoUrlItems": ["開始", "關閉"],
            "openDriveAudioUrlItems": ["開始", "關閉"],
            "openDrivePictureUrlItems": ["開始", "關閉"],
            "openDriveDocumentUrlItems": ["開始", "關閉"],
            "recordAudioItems": ["開始", "關閉"], 
            "recordVideoItems": ["開始", "關閉"],
            "recordVideoSizes": ["720P", "480P", "240P"],  
        },
        url: 'https://zenboscratchservice.github.io/' // Link to extension documentation, homepage, etc.
    };
    */     
    // Register the extension
    ScratchExtensions.register('ZenboScratchService', descriptor, ext);
})({});
