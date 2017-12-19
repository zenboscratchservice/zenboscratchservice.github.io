(function (ext) {

    var flagArray = {
        data:[]
    };
	
    ip = "127.0.0.1";
    port = ":8080";

    var getValueIndex  = function() {

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
        console.log("stopAll");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=stopAll',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
            }
        });


    };
	
    ext._shutdown = function () {
        ext.stop_sending_commands_to_target();
        console.log('Shutting down...');

    };

    ext._getStatus = function () {
         return {status: 2, msg: 'Ready'};
    };

    ext.Setting_targetIP = function (onlyIPAddress, callback) {
        console.log("Setting_targetIP");
        ip = onlyIPAddress;
        console.log("ip: "+ ip + "onlyIPAddress: "+ onlyIPAddress);
 
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
              
               flagArray.data.push( { device: ip, correctedSentence: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false, 
               sentence_4_flag: false, sentence_5_flag: false, number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init: "+ flagIndex_init);

         }
   
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Add_and_update_sentence' + '&p1=' + 'IP' + '&p2=' + 'switch',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
             console.log("success handler");


      			  if  ( flagArray.data[flagIndex_init].recursionFlag === true) {
             			 flagArray.data[flagIndex_init].recursionFlag = false;

    			    $.ajax({
          			url: 'http://' + ip + port + '/?extension=education' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
        			dataType: 'text',
           			crossDomain: true,
           			success: function (data) {
                 
            			console.log("success handler");
         			getSentencesRecursion(flagIndex_init);
 
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

    var getSentencesRecursion = function(flagIndex) {

		if ( flagArray.data[flagIndex].get_sentences_flag === true ) {  	 
			 flagArray.data[flagIndex].get_sentences_flag = false;  
			 
		$.ajax({
			type: 'GET',
			url: 'http://' + ip + port + '/?extension=education' + '&name=Get_sentences',
			dataType: 'text',
			crossDomain: true,
			success: function (data) {
			console.log("Get_sentences-success handler");
                               
                console.log('splitedData[0]' + data.split(",")[0]);
                                
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
                        flagArray.data[flagIndex].correctedSentence = data.split(",")[1];
                        console.log('correctedSentence:' + flagArray.data[flagIndex].correctedSentence);
                                              
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
					   
		}  

                    flagArray.data[flagIndex].get_sentences_flag = true;
                    getSentencesRecursion(flagIndex);
				
		},
		error: function (jqXHR, textStatus, errorThrown) {
		    console.log("error handler");
			 
                    flagArray.data[flagIndex].get_sentences_flag = true;
                    getSentencesRecursion(flagIndex);	 
					
		}
		});
				
            }    
	
	
    };
	
    ext.Head_movement = function (p1, p2, callback) {
        console.log("Head_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Head_movement' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback();
             
                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');              

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Body_movement = function (p1, p2, p3, callback) {
        console.log("Body_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        console.log(p3);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Body_movement' + '&p1=' + p1 + '&p2=' + p2 + '&p3=' + p3,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback();

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Body_turn = function (p1, p2, callback) {
        console.log("Body_turn");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Body_turn' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback(); 

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');              
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Remote_control_body = function (p1){
        console.log("Remote_control_body");
        console.log(ip);
        console.log(p1);

           $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Remote_control_body' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP'); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
            });

    };

    ext.Stop_moving = function (callback){

	console.log("Stop_moving");
	console.log("Remote_control_body-Stop");
	console.log(ip);
	$.ajax({
	    url: 'http://' + ip + port + '/?extension=education' + '&name=Remote_control_body' + '&p1=' + '停止',
	    dataType: 'text',
 	    crossDomain: true,
 	    success: function (data) {
	    console.log("success handler");

            if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');

	    console.log(ip);
            $.ajax({
                url: 'http://' + ip + port + '/?extension=education' + '&name=Stop_moving',
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
                alert('請先設置 Zenbo IP');
 	    }
	});	
	
    };

    ext.Action = function (callback){
        console.log("Action");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Action' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                
                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP'); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Facial = function (p1, callback) {
        console.log("Facial");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Facial' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });
 
    };

    ext.TTS = function (p1, callback) {
        console.log("Tts");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=TTS' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback();
    
                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP'); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.TTS_editor = function (p1, callback) {
        console.log("TTS_editor");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=TTS_editor' + '&p1=' + p1,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback();

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP'); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Cancel_actionset = function (callback){
        console.log("Cancel_actionset");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Cancel_actionset',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Adjust_stream_volume = function (p1, p2, callback) {
        console.log("Adjust_stream_volume");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Adjust_stream_volume' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });
 
    };

    ext.Add_and_update_sentence = function (p1, p2) {
        
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
              
               flagArray.data.push( { device: ip, correctedSentence: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false, 
               sentence_4_flag: false, sentence_5_flag: false, number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init_2 = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init_2: "+ flagIndex_init_2);

        }
   	
        console.log("Add_and_update_sentence");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Add_and_update_sentence' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("success handler");

            if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP'); 

            if  ( flagArray.data[flagIndex_init_2].recursionFlag === true) {
                  flagArray.data[flagIndex_init_2].recursionFlag = false;

     	          $.ajax({
                      url: 'http://' + ip + port + '/?extension=education' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
                      dataType: 'text',
                      crossDomain: true,
                      success: function (data) {

                      console.log("success handler");
                      getSentencesRecursion(flagIndex_init_2);

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
                alert('請先設置 Zenbo IP');
            }
        });

    };    

	
    ext.Delete_instance = function (callback){
        console.log("Delete_instance");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Delete_instance',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP'); 
            }
        });

    };

    ext.Speak_and_listen = function (){
        console.log("Speak_and_listen");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Speak_and_listen',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("Speak_and_listen-success handler");
 
            if (data == 'Must set Zenbo IP')
            alert('請先設置 Zenbo IP');	 				               				   
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Play_music = function (p1, p2, callback) {
        console.log("Play_music");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Play_music' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP'); 
            }
        });

    };

    ext.Adjust_tts_and_speed = function (p1, p2, callback) {
        console.log("Adjust_tts_and_speed");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=Adjust_tts_and_speed' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
                callback();

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.Get_sentences = function (p1, callback){
        console.log("Get_sentences");
        console.log(ip);
        console.log(p1);
        $.ajax({
            type: 'GET',  
            url: 'http://' + ip + port + '/?extension=education' + '&name=Get_sentences',
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

    ext.when_listen_and_run = function(p1) {
       
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
       
       	}

      	return false;
    };

	
    ext.when_listen_number_and_run = function() {
       
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
	
    ext.getCorrectedSentence = function( ) {
       
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


    ext.playVideosInYoutube = function (p1, p2) {
        console.log("playVideosInYoutube");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=playVideosInYoutube' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.displayUrlPictures = function (p1, p2) {
        console.log("displayUrlPictures");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=displayUrlPictures' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");
               
                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP'); 
            }
        });

    };
	
    ext.playUrlMusic = function (p1, p2) {
        console.log("playUrlMusic");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=playUrlMusic' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.hideFace = function () {
        console.log("hideFace");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=hideFace',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.openDriveUrl = function (p1, p2) {
        console.log("openDriveUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=openDriveUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.openDriveVideoUrl = function (p1, p2) {
        console.log("openDriveVideoUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=openDriveVideoUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.openDriveAudioUrl = function (p1, p2) {
        console.log("openDriveAudioUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=openDriveAudioUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.openDrivePictureUrl = function (p1, p2) {
        console.log("openDrivePictureUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=openDrivePictureUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };

    ext.openDriveDocumentUrl = function (p1, p2) {
        console.log("openDriveDocumentUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?extension=education' + '&name=openDriveDocumentUrl' + '&p1=' + p1 + '&p2=' + p2,
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
                console.log("success handler");

                if (data == 'Must set Zenbo IP')
                alert('請先設置 Zenbo IP');            
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
                alert('請先設置 Zenbo IP');
            }
        });

    };


   ext.Add_and_update_sentence_number = function () {
       
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
              
               flagArray.data.push( { device: ip, correctedSentence: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false, 
               sentence_4_flag: false, sentence_5_flag: false, number_flag: false, touch_head_flag: false, get_sentences_flag: true, recursionFlag: true } );
               console.log("add new device IP and its flags");
               flagIndex_init_3 = flagArray.data.length -1 ;
               console.log("true " + "flagIndex_init_3: "+ flagIndex_init_3);

         }
   		
	if  ( flagArray.data[flagIndex_init_3].recursionFlag === true) {
              flagArray.data[flagIndex_init_3].recursionFlag = false;

              $.ajax({
                  url: 'http://' + ip + port + '/?extension=education' + '&name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
                  dataType: 'text',
                  crossDomain: true,
                  success: function (data) {
           
                  console.log("success handler");
                  getSentencesRecursion(flagIndex_init_3);
 
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                  console.log("error handler");
                  flagArray.data[flagIndex_init_3].recursionFlag = true;
                  }
              }); 

         } 
         
    }; 

   ext.when_touch_head_and_run = function() {
       
       var valueIndex_touch_head = -1;

       for(var j = 0; j < flagArray.data.length; j++){

             if ( ip == flagArray.data[j].device) {          
                  valueIndex_touch_head = j;
             }
       }

       if ( valueIndex_touch_head === -1 ) {
	
              console.log('valueIndex_touch_head === -1');  	
	      return false;
       }
         
       if (flagArray.data[valueIndex_touch_head].touch_head_flag === true) {
		   console.log('true touch head'); 
                   flagArray.data[valueIndex_touch_head].touch_head_flag = false;             
               return true;
       }

       return false;
   };

   ext.stop_sending_commands_to_target = function () {
     
        ext._stop();      
        console.log("stop_sending_commands_to_target");
        ip = "127.0.0.1";    

   };
	
    var descriptor = {
        blocks: [
            ['w', '設定 Zenbo IP: %s', 'Setting_targetIP', "127.0.0.1"],
            ['w', '移動 %m.move_direction %m.move_far 公尺 %m.move_speed 速度', 'Body_movement', "前進", "0.25", "一般"],
            ['', '停止動作', 'Stop_moving' ],
            ['w', '轉動頭部 向 %m.head_direction %m.head_degree 度', 'Head_movement', "左", "45"], 
            ['w', '轉動身體 向 %m.body_turn_direction %m.body_turn_degree 度', 'Body_turn', "左轉", "90"],
            ['', '控制身體 %m.remote_control_body', 'Remote_control_body', "右轉"],
           // ['', 'Zenbo 做動作 %m.action_type', 'Action', '打招呼'],
            ['', '做出表情 %m.facial_type', 'Facial', '期待'],
            ['', '隱藏表情', 'hideFace' ],
            ['w', '說話 %m.tts_type ', 'TTS', '嗨,你好'],
            ['w', '說話 %s', 'TTS_editor', '請填入文字'],
            ['', '調整 %m.volume_option_type 音量 %m.volume_type', 'Adjust_stream_volume', '說話', '大聲點'],
            ['w', '說話 %s 速度 %m.tts_speed_type', 'Adjust_tts_and_speed', '請填入文字', 'L2'],
            ['', '準備要聽 %m.sentence_type 是 %s', 'Add_and_update_sentence', '語句一', '吃飯'], 
            ['', 'Zenbo 要開始聽', 'Speak_and_listen'], 
            ['h', '當 Zenbo  聽到 %m.sentence_type', 'when_listen_and_run', '語句一'],
            ['', '刪除全部語句', 'Delete_instance' ],
       //     ['', '準備要聽數字', 'Add_and_update_sentence_number'],
       //     ['h', '當我聽到數字', 'when_listen_number_and_run'],
       //     ['r', '目前聽到的數字 ', 'getCorrectedSentence'],
            ['', ' %m.playVideosInYoutubeItems 播放 Youtube 網址: %s', 'playVideosInYoutube' , '開始', 'https://www.youtube.com/watch?v=Ou21RusvBcg'],
            ['', ' %m.playUrlMusicItems 播放線上音樂: %s', 'playUrlMusic' , '開始', 'https://zenboscratch.github.io/examples/zenbo_music.mp3'],
            ['', ' %m.displayUrlPicturesItems 瀏覽線上圖片: %s', 'displayUrlPictures', '開始', 'https://zenboscratch.github.io/images/zenbo.jpg'],
            ['', ' %m.openDriveVideoUrlItems 播放 Google Drive 影片: %s', 'openDriveVideoUrl' , '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiUUhrTW12Ql9tcUk'],
            ['', ' %m.openDriveAudioUrlItems 播放 Google Drive 音樂: %s', 'openDriveAudioUrl' , '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaibHJ0LWtHN0JtVFU'], 
            ['', ' %m.openDrivePictureUrlItems 瀏覽 Google Drive 圖片: %s', 'openDrivePictureUrl', '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiSVJ0S3JKeEZwODA'],
            ['', ' %m.openDriveDocumentUrlItems 瀏覽 Google Drive 文件: %s', 'openDriveDocumentUrl', '開始', 'https://drive.google.com/open?id=0B5o6VwYT7NaiN1h3SXZHTjRsc2s'],
	    ['h', '當摸到 Zenbo 的頭', 'when_touch_head_and_run'],
            ['', '斷線', 'stop_sending_commands_to_target'], 
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
        },
        url: 'https://zenboscratchservice.github.io/' // Link to extension documentation, homepage, etc.
    };

    // Register the extension
    ScratchExtensions.register('ZenboScratchService', descriptor, ext);
})({});
