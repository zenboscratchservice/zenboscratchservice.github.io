(function (ext) {

    var flagArray = {
        data:[]
    };
	
	port = ":8080";
	
    ext._shutdown = function () {
        console.log('Shutting down...');

    };

    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.Setting_targetIP = function (ip) {
        console.log("Setting_targetIP");
        return ip;
    };

    var getSentencesRecursion = function(ip, flagIndex) {

		if ( flagArray.data[flagIndex].get_sentences_flag === true ) {  	 
			 flagArray.data[flagIndex].get_sentences_flag = false;  
			 
			$.ajax({
				type: 'GET',
				url: 'http://' + ip + port + '/?name=Get_sentences',
				dataType: 'text',
				crossDomain: true,
				success: function (data) {
				console.log("Get_sentences-success handler");
                               
                console.log('splitedData[0]' + data.split(",")[0]);
                                
				switch(data.split(",")[0]) {

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
	
    ext.Head_movement = function (ip, p1, p2, callback) {
		
		for(var i = 0; i < translate.head_direction.length; i++){

            if ( p1 == translate.head_direction[i]) {
                                         
				p1 = TRANSLATIONS.tw.head_direction[i];
            }   
	  
        }
		
		for(var j = 0; j < translate.head_degree.length; j++){

            if ( p2 == translate.head_degree[j]) {
                                         
				p2 = TRANSLATIONS.tw.head_degree[j];
            }   
	  
        }
		
		
        console.log("Head_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Head_movement' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.Body_movement = function (ip, p1, p2, p3, callback) {
		
		for(var i = 0; i < translate.move_direction.length; i++){

            if ( p1 == translate.move_direction[i]) {
                                         
				p1 = TRANSLATIONS.tw.move_direction[i];
            }   
	  
        }
		
		for(var j = 0; j < translate.move_far.length; j++){

            if ( p2 == translate.move_far[j]) {
                                         
				p2 = TRANSLATIONS.tw.move_far[j];
            }   
	  
        }
		
		for(var k = 0; k < translate.move_speed.length; k++){

            if ( p3 == translate.move_speed[k]) {
                                         
				p3 = TRANSLATIONS.tw.move_speed[k];
            }   
	  
        }
		
		
		
        console.log("Body_movement");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        console.log(p3);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Body_movement' + '&p1=' + p1 + '&p2=' + p2 + '&p3=' + p3,
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

    ext.Body_turn = function (ip, p1, p2, callback) {
        console.log("Body_turn");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Body_turn' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.Remote_control_body = function (ip, p1, callback){
        console.log("Remote_control_body");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Remote_control_body' + '&p1=' + p1,
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

    ext.Stop_moving = function (ip,callback){
        console.log("Stop_moving");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Stop_moving',
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

    ext.Action = function (ip, p1,callback){
        console.log("Action");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Action' + '&p1=' + p1,
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

    ext.Facial = function (ip, p1, callback) {
        console.log("Facial");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Facial' + '&p1=' + p1,
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

    ext.TTS = function (ip, p1, callback) {
        console.log("Tts");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?name=TTS' + '&p1=' + p1,
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

    ext.TTS_editor = function (ip, p1, callback) {
        console.log("TTS_editor");
        console.log(ip);
        console.log(p1);
        $.ajax({
            url: 'http://' + ip + port + '/?name=TTS_editor' + '&p1=' + p1,
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

    ext.Cancel_actionset = function (ip,callback){
        console.log("Cancel_actionset");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Cancel_actionset',
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

    ext.Adjust_stream_volume = function (ip, p1, p2, callback) {
        console.log("Adjust_stream_volume");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Adjust_stream_volume' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.Add_and_update_sentence = function (ip, p1, p2) {
        
        $.ajax({
            url: 'http://' + ip + port + '/?name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("success handler");

                        var setupFlag = true;
                        var flagIndex = 0;

                        for(var i=0; i < flagArray.data.length; i++){

                                 if ( ip == flagArray.data[i].device) {
                                          setupFlag = false;
                                          flagIndex = i;
                                          console.log("false " + "flagIndex: "+ flagIndex);
                                 }
                        }

                        if (setupFlag == true) {
                                flagArray.data.push( { device: ip, correctedSentence: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false, sentence_4_flag: false, sentence_5_flag: false, number_flag: false, get_sentences_flag: true } );
                                console.log("add new device IP and its flags");
                                flagIndex = flagArray.data.length -1 ;
                                console.log("true " + "flagIndex: "+ flagIndex);
                         }

                         getSentencesRecursion(ip, flagIndex);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
            }
        }); 
         
        console.log("Add_and_update_sentence");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Add_and_update_sentence' + '&p1=' + p1 + '&p2=' + p2,
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

	
    ext.Delete_instance = function (ip,callback){
        console.log("Delete_instance");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Delete_instance',
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

    ext.Speak_and_listen = function (ip){
        console.log("Speak_and_listen");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Speak_and_listen',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("Speak_and_listen-success handler");	 
				               				   
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
            }
        });
    };

    ext.Play_music = function (ip, p1, p2, callback) {
        console.log("Play_music");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Play_music' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.Adjust_tts_and_speed = function (ip, p1, p2, callback) {
        console.log("Adjust_tts_and_speed");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=Adjust_tts_and_speed' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.Get_sentences = function (ip, p1, callback){
        console.log("Get_sentences");
        console.log(ip);
        console.log(p1);
        $.ajax({
            type: 'GET',  
            url: 'http://' + ip + port + '/?name=Get_sentences',
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


    ext.playVideosInYoutube = function (ip, p1, p2) {
        console.log("playVideosInYoutube");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=playVideosInYoutube' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.displayUrlPictures = function (ip, p1, p2) {
        console.log("displayUrlPictures");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=displayUrlPictures' + '&p1=' + p1 + '&p2=' + p2,
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
	
    ext.playUrlMusic = function (ip, p1, p2) {
        console.log("playUrlMusic");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=playUrlMusic' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.hideFace = function (ip) {
        console.log("hideFace");
        console.log(ip);
        $.ajax({
            url: 'http://' + ip + port + '/?name=hideFace',
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

    ext.openDriveUrl = function (ip, p1, p2) {
        console.log("openDriveUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=openDriveUrl' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.openDriveVideoUrl = function (ip, p1, p2) {
        console.log("openDriveVideoUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=openDriveVideoUrl' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.openDriveAudioUrl = function (ip, p1, p2) {
        console.log("openDriveAudioUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=openDriveAudioUrl' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.openDrivePictureUrl = function (ip, p1, p2) {
        console.log("openDrivePictureUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=openDrivePictureUrl' + '&p1=' + p1 + '&p2=' + p2,
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

    ext.openDriveDocumentUrl = function (ip, p1, p2) {
        console.log("openDriveDocumentUrl");
        console.log(ip);
        console.log(p1);
        console.log(p2);
        $.ajax({
            url: 'http://' + ip + port + '/?name=openDriveDocumentUrl' + '&p1=' + p1 + '&p2=' + p2,
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


ext.Add_and_update_sentence_number = function (ip) {
        
        $.ajax({
            url: 'http://' + ip + port + '/?name=Add_and_update_sentence' + '&p1=' + 'test' + '&p2=' + 'zenbo',
            dataType: 'text',
            crossDomain: true,
            success: function (data) {
            console.log("success handler");

                        var setupFlag = true;
                        var flagIndex = 0;

                        for(var i=0; i < flagArray.data.length; i++){

                                 if ( ip == flagArray.data[i].device) {
                                          setupFlag = false;
                                          flagIndex = i;
                                          console.log("false " + "flagIndex: "+ flagIndex);
                                 }
                        }

                        if (setupFlag == true) {
                                flagArray.data.push( { device: ip, correctedSentence: "", sentence_1_flag: false, sentence_2_flag: false, sentence_3_flag: false, sentence_4_flag: false, sentence_5_flag: false, number_flag: false, get_sentences_flag: true } );
                                console.log("add new device IP and its flags");
                                flagIndex = flagArray.data.length -1 ;
                                console.log("true " + "flagIndex: "+ flagIndex);
                         }

                         getSentencesRecursion(ip, flagIndex);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error handler");
            }
        }); 
         

    };    

	
    var TRANSLATIONS = {
        us: {
            Setting_targetIP: 'Set target IP: %s',
            Body_movement: 'IP %s move %m.move_direction by %m.move_far Meter %m.move_speed',
            Stop_moving: 'IP %s stop',
            Head_movement: 'IP %s turn head to the %m.head_direction by %m.head_degree degree(s)',
            Body_turn: 'IP %s turn body to the  %m.body_turn_direction by %m.body_turn_degree degree(s)',
            Remote_control_body: 'IP %s control body to %m.remote_control_body_type',
            Action: 'IP %s perform the canned action %m.action_type',
            Cancel_actionset: 'IP %s stop the canned action',
            Facial: 'IP %s make the %m.facial_type expression', 
            hideFace: 'IP %s hide the expression',
            TTS: 'IP %s speak:  %m.tts_type ',
	    TTS_editor: 'IP %s speak:  %s',
	    Adjust_stream_volume: 'IP %s make %m.volume_option_type volume %m.volume_type',
	    Adjust_tts_and_speed: 'IP %s speak: %s by %m.tts_speed_type speed',
	    Add_and_update_sentence: 'IP %s is ready to listen %m.sentence_type which is %s',
	    Speak_and_listen: 'IP %s would start listening',
	    when_listen_and_run: 'When IP %s heard %m.sentence_type',
	    Delete_instance: 'IP %s delete all sentences',
	    Add_and_update_sentence_number: 'IP %s is ready to listen to numbers',
	    when_listen_number_and_run: 'When IP %s heard numbers',
	    getCorrectedSentence: 'Current number heard by IP %s',
	    playVideosInYoutube: 'IP %s %m.playVideosInYoutubeItems playing a Youtube URL: %s',
	    playUrlMusic: 'IP %s %m.playUrlMusicItems playing an online audio file: %s',
	    displayUrlPictures: 'IP %s %m.displayUrlPicturesItems browsing an online image file: %s',
	    openDriveVideoUrl: 'IP %s %m.openDriveVideoUrlItems playing a Google Drive video shareable link: %s',
	    openDriveAudioUrl: 'IP %s %m.openDriveAudioUrlItems playing Google Drive audio shareable link: %s',
	    openDrivePictureUrl: 'IP %s %m.openDrivePictureUrlItems browsing a Google Drive image shareable link: %s',
            openDriveDocumentUrl: 'IP %s %m.openDriveDocumentUrlItems browsing a Google Drive document shareable link: %s',
	    head_direction: ["left", "right", "top", "bottom"],
            head_degree: ["0", "15", "30", "45"],
            move_direction: ["forward", "backward"],
            move_far: ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            move_speed: ["slowly", "normally", "fast"],
            body_turn_direction: ["left", "right"],
            body_turn_degree: ["0", "15", "30", "45", "60", "75", "90", "105", "120", "135", "150", "165", "180"],
            remote_control_body_type: ["stop", "move forward", "turn left", "turn right"],
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
            playVideosInYoutubeItems: ["start", "end"],
            displayUrlPicturesItems: ["start", "end"],
            playUrlMusicItems: ["start", "end"],
            openDriveVideoUrlItems: ["start", "end"],
            openDriveAudioUrlItems: ["start", "end"],
            openDrivePictureUrlItems: ["start", "end"],
            openDriveDocumentUrlItems: ["start", "end"],
	    ttsEditorDefaultText: 'please fill the sentence',
	    defaultAddedSentence: 'eating'
        },
	tw: {
            Setting_targetIP: '設定目標IP: %s',
            Body_movement: 'IP %s 移動 %m.move_direction %m.move_far 公尺 %m.move_speed 速度',
            Stop_moving: 'IP %s 停止移動',
            Head_movement: 'IP %s 轉動頭部 向 %m.head_direction %m.head_degree 度',
            Body_turn: 'IP %s 轉動身體 向 %m.body_turn_direction %m.body_turn_degree 度',
            Remote_control_body: 'IP %s 控制身體 %m.remote_control_body_type',
            Action: 'IP %s 做出罐頭動作 %m.action_type',
            Cancel_actionset: 'IP %s 停止罐頭動作',
            Facial: 'IP %s 做出表情 %m.facial_type', 
            hideFace: 'IP %s 隱藏表情',
            TTS: 'IP %s 說話 %m.tts_type',
	    TTS_editor: 'IP %s 說話 %s',
	    Adjust_stream_volume: 'IP %s 調整 %m.volume_option_type 音量 %m.volume_type',
	    Adjust_tts_and_speed: 'IP %s 說話 %s 速度 %m.tts_speed_type',
	    Add_and_update_sentence: 'IP %s 準備要聽 %m.sentence_type 是 %s',
	    Speak_and_listen: 'IP %s 我要開始聽',
	    when_listen_and_run: '當我聽到 IP %s 的 %m.sentence_type',
	    Delete_instance: 'IP %s 刪除全部語句',
	    Add_and_update_sentence_number: 'IP %s 準備要聽數字',
	    when_listen_number_and_run: '當我聽到 IP %s 的數字',
	    getCorrectedSentence: '目前 IP %s 聽到的數字 ',
	    playVideosInYoutube: 'IP %s %m.playVideosInYoutubeItems 播放 Youtube 網址: %s',
	    playUrlMusic: 'IP %s %m.playUrlMusicItems 播放線上音樂: %s',
	    displayUrlPictures: 'IP %s %m.displayUrlPicturesItems 瀏覽線上圖片: %s',
	    openDriveVideoUrl: 'IP %s %m.openDriveVideoUrlItems 播放 Google Drive 影片: %s',
	    openDriveAudioUrl: 'IP %s %m.openDriveAudioUrlItems 播放 Google Drive 音樂: %s',
	    openDrivePictureUrl: 'IP %s %m.openDrivePictureUrlItems 瀏覽 Google Drive 圖片: %s',
            openDriveDocumentUrl: 'IP %s %m.openDriveDocumentUrlItems 瀏覽 Google Drive 文件: %s',
	    head_direction: ["左", "右", "上", "下"],
            head_degree: ["0", "15", "30", "45"],
            move_direction: ["前進", "後退"],
            move_far: ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            move_speed: ["慢", "一般", "快"],
            body_turn_direction: ["左轉", "右轉"],
            body_turn_degree: ["0", "15", "30", "45", "60", "75", "90", "105", "120", "135", "150", "165", "180"],
            remote_control_body_type: ["停止", "前進", "左轉", "右轉"],
            action_type: ["輕鬆(預設)", "Listen to the command/briefing(high)", "Complete the task/satisfaction", "打招呼", "一般訊息一", "待機(無聊)", "充電(滿足)", "聽指令/briefing(矮)", "連續任務衝突", "失望(使用者結束)",
                            "沮喪(使用者結束)", "待機(疲倦)", "快沒電", "充電(愉悅)", "充電(慵懶)", "跳舞一大點", "聽懂", "音樂播放", "向左慢轉", "向左急轉", "搖頭(回答否定)", "跳舞一小點", 
                            "害羞", "聽不懂", "跳舞二", "連續搖頭", "搖頭晃腦", "跳舞極快", "搖頭", "結束打招呼", "一般訊息二", "向右慢轉", "向右急轉", "結束向左慢轉", "結束向右慢轉",
                            "結束向左急轉", "結束向右急轉", "解除連續任務衝突"],
            facial_type: ["有興趣", "疑惑", "驕傲", "輕鬆愉快(預設)", "開心", "期待", "愣一下", "質疑", "不耐煩", "自信", "有活力一", "得意", "無奈", "嚴肅", "煩惱", "裝平靜", "慵懶", "察覺", 
                            "倦怠", "害羞", "無辜", "有活力二", "察覺", "預設"],
            tts_type: ["Hi,你好", "看這裡", "WoW", "YA"],
            volume_type: ["大聲點", "小聲點"],
            music_type: ["開始", "暫停", "繼續", "停止", "重新"],
            volume_option_type: ["音樂", "鬧鐘", "通知", "說話"],
            tts_speed_type: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
            sentence_type: ["語句一", "語句二", "語句三", "語句四", "語句五"],
            playVideosInYoutubeItems: ["開始", "關閉"],
            displayUrlPicturesItems: ["開始", "關閉"],
            playUrlMusicItems: ["開始", "關閉"],
            openDriveVideoUrlItems: ["開始", "關閉"],
            openDriveAudioUrlItems: ["開始", "關閉"],
            openDrivePictureUrlItems: ["開始", "關閉"],
            openDriveDocumentUrlItems: ["開始", "關閉"],
	    ttsEditorDefaultText: '請填入文字',
            defaultAddedSentence: '吃飯'			
        },  		
	cn: {
            Setting_targetIP: '设定目标IP: %s',
            Body_movement: 'IP %s 移动 %m.move_direction %m.move_far 公尺 %m.move_speed 速度',
            Stop_moving: 'IP %s 停止移动',
            Head_movement: 'IP %s 转动头部 向 %m.head_direction %m.head_degree 度',
            Body_turn: 'IP %s 转动身体 向 %m.body_turn_direction %m.body_turn_degree 度',
            Remote_control_body: 'IP %s 控制身体 %m.remote_control_body_type',
            Action: 'IP %s 做出罐头动作 %m.action_type',
            Cancel_actionset: 'IP %s 停止罐头动作',
            Facial: 'IP %s 做出表情 %m.facial_type', 
            hideFace: 'IP %s 隐藏表情',
            TTS: 'IP %s 说话 %m.tts_type',
	    TTS_editor: 'IP %s 说话 %s',
	    Adjust_stream_volume: 'IP %s 调整 %m.volume_option_type 音量 %m.volume_type',
	    Adjust_tts_and_speed: 'IP %s 說話 %s 速度 %m.tts_speed_type',
	    Add_and_update_sentence: 'IP %s 准备要听 %m.sentence_type 是 %s',
	    Speak_and_listen: 'IP %s 我要开始听',
	    when_listen_and_run: '当我听到 IP %s 的 %m.sentence_type',
	    Delete_instance: 'IP %s 删除全部语句',
	    Add_and_update_sentence_number: 'IP %s 准备要听数字',
	    when_listen_number_and_run: '当我听到 IP %s 的数字',
	    getCorrectedSentence: '目前 IP %s 听到的数字 ',
	    playVideosInYoutube: 'IP %s %m.playVideosInYoutubeItems 播放 Youtube 网址: %s',
	    playUrlMusic: 'IP %s %m.playUrlMusicItems 播放线上音乐: %s',
	    displayUrlPictures: 'IP %s %m.displayUrlPicturesItems 浏览线上图像: %s',
	    openDriveVideoUrl: 'IP %s %m.openDriveVideoUrlItems 播放 Google Drive 视频: %s',
	    openDriveAudioUrl: 'IP %s %m.openDriveAudioUrlItems 播放 Google Drive 音乐: %s',
	    openDrivePictureUrl: 'IP %s %m.openDrivePictureUrlItems 浏览 Google Drive 图像: %s',
            openDriveDocumentUrl: 'IP %s %m.openDriveDocumentUrlItems 浏览 Google Drive 文件: %s',
	    head_direction: ["左", "右", "上", "下"],
            head_degree: ["0", "15", "30", "45"],
            move_direction: ["前进", "后退"],
            move_far: ["0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00"],
            move_speed: ["慢", "一般", "快"],
            body_turn_direction: ["左转", "右转"],
            body_turn_degree: ["0", "15", "30", "45", "60", "75", "90", "105", "120", "135", "150", "165", "180"],
            remote_control_body_type: ["停止", "前进", "左转", "右转"],
            action_type: ["轻松(预设)", "听指令/briefing(高)", "完成任务/满足", "打招呼", "一般讯息一", "待机(无聊)", "充电(满足)", "听指令/briefing(矮)", "连续任务冲突", "失望(使用者结束)",
                            "沮丧(使用者结束)", "待机(疲倦)", "快没电", "充电(愉悦)", "充电(慵懒)", "跳舞一大点", "听懂", "音乐播放", "向左慢转", "向左急转", "摇头(回答否定)", "跳舞一小点",
                            "害羞", "听不懂", "跳舞二", "连续摇头", "摇头晃脑", "跳舞极快", "摇头", "结束打招呼", "一般讯息二", "向右慢转", "向右急转", "结束向左慢转", "结束向右慢转",
                            "结束向左急转", "结束向右急转", "解除连续任务冲突"],
            facial_type: ["有兴趣", "疑惑", "骄傲", "轻松愉快(预设)", "开心", "期待", "愣一下", "质疑", "不耐烦", "自信", "有活力一", "得意", "无奈", "严肃", "烦恼", "装平静", "慵懒", "察觉",
                            "倦怠", "害羞", "无辜", "有活力二", "察觉", "预设"],
            tts_type: ["Hi,你好", "看这里", "WoW", "YA"],
            volume_type: ["大声点", "小声点"],
            music_type: ["开始", "暂停", "继续", "停止", "重新"],
            volume_option_type: ["音乐", "闹钟", "通知", "说话"],
            tts_speed_type: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
            sentence_type: ["语句一", "语句二", "语句三", "语句四", "语句五"],
            playVideosInYoutubeItems: ["开始", "关闭"],
            displayUrlPicturesItems: ["开始", "关闭"],
            playUrlMusicItems: ["开始", "关闭"],
            openDriveVideoUrlItems: ["开始", "关闭"],
            openDriveAudioUrlItems: ["开始", "关闭"],
            openDrivePictureUrlItems: ["开始", "关闭"],
            openDriveDocumentUrlItems: ["开始", "关闭"],
	    ttsEditorDefaultText: '请填入文字',
	    defaultAddedSentence: '吃饭' 
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
               case "zh-cn":
                    return TRANSLATIONS.cn;
               default:
                    return TRANSLATIONS.us;
            
        }
    }
	
    // how which language translation is chosen (increasing priority):
    //   1 - explicit 'lang' parameter in the url (e.g: http://scratchx.org/?url=https://zenboscratch.github.io/extentions/ZenboScratchServiceExtension_Multilingualism.js&lang=en#scratch)
    //   2 - browser first preferred language (navigator.languages[0])
    //   3 - default (en-us)
		
    var urlParams = new URLSearchParams(window.location.search);
    var lang = ( urlParams.get('lang') || navigator.browserLanguage || navigator.language ).toLowerCase();
    console.log("lang:" + lang);
	
    var translate = getTranslationForLang(lang);
	
	
    var descriptor = {
        blocks: [
            ['r', translate.Setting_targetIP, 'Setting_targetIP', "192.168.0.1"],
            ['', translate.Body_movement, 'Body_movement', "192.168.0.1", translate.move_direction[0], translate.move_far[0], translate.move_speed[0]],
            ['', translate.Stop_moving, 'Stop_moving', "192.168.0.1"],
            ['', translate.Head_movement, 'Head_movement', "192.168.0.1", translate.head_direction[0], translate.head_degree[3]], 
            ['', translate.Body_turn, 'Body_turn', "192.168.0.1", translate.body_turn_direction[0], translate.body_turn_degree[6]],
            ['', translate.Remote_control_body, 'Remote_control_body', "192.168.0.1", translate.remote_control_body_type[3]],
            ['', translate.Action, 'Action', "192.168.0.1", translate.action_type[3]],
            ['', translate.Cancel_actionset, 'Cancel_actionset', "192.168.0.1"],
            ['', translate.Facial, 'Facial', "192.168.0.1", translate.facial_type[5]],
            ['', translate.hideFace, 'hideFace', "192.168.0.1"],
            ['', translate.TTS, 'TTS', "192.168.0.1", translate.tts_type[0]],
            ['', translate.TTS_editor, 'TTS_editor', "192.168.0.1", translate.ttsEditorDefaultText],
            ['', translate.Adjust_stream_volume, 'Adjust_stream_volume', "192.168.0.1", translate.volume_option_type[3], translate.volume_type[0]],
            ['', translate.Adjust_tts_and_speed, 'Adjust_tts_and_speed', "192.168.0.1", translate.ttsEditorDefaultText, translate.tts_speed_type[1]],
            ['', translate.Add_and_update_sentence, 'Add_and_update_sentence', "192.168.0.1", translate.sentence_type[0], translate.defaultAddedSentence], 
            ['', translate.Speak_and_listen, 'Speak_and_listen', "192.168.0.1"], 
            ['h', translate.when_listen_and_run, 'when_listen_and_run', "192.168.0.1", translate.sentence_type[0]],
            ['', translate.Delete_instance, 'Delete_instance', "192.168.0.1"],
            ['', translate.Add_and_update_sentence_number, 'Add_and_update_sentence_number', "192.168.0.1"],
            ['h', translate.when_listen_number_and_run, 'when_listen_number_and_run', "192.168.0.1"],
            ['r', translate.getCorrectedSentence, 'getCorrectedSentence', "192.168.0.1"],
            ['', translate.playVideosInYoutube, 'playVideosInYoutube', "192.168.0.1", translate.playVideosInYoutubeItems[0], 'https://www.youtube.com/watch?v=Ou21RusvBcg'],
            ['', translate.playUrlMusic, 'playUrlMusic', "192.168.0.1", translate.displayUrlPicturesItems[0], 'https://zenboscratch.github.io/examples/zenbo_music.mp3'],
            ['', translate.displayUrlPictures, 'displayUrlPictures', "192.168.0.1", translate.playUrlMusicItems[0], 'https://zenboscratch.github.io/images/zenbo.jpg'],
            ['', translate.openDriveVideoUrl, 'openDriveVideoUrl', "192.168.0.1", translate.openDriveVideoUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiUUhrTW12Ql9tcUk'],
            ['', translate.openDriveAudioUrl, 'openDriveAudioUrl', "192.168.0.1", translate.openDriveAudioUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaibHJ0LWtHN0JtVFU'], 
            ['', translate.openDrivePictureUrl, 'openDrivePictureUrl', "192.168.0.1", translate.openDrivePictureUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiSVJ0S3JKeEZwODA'],
            ['', translate.openDriveDocumentUrl, 'openDriveDocumentUrl', "192.168.0.1", translate.openDriveDocumentUrlItems[0], 'https://drive.google.com/open?id=0B5o6VwYT7NaiN1h3SXZHTjRsc2s'],
        ],
        menus: {
            "head_direction": translate.head_direction,
            "head_degree": translate.head_degree,
            "move_direction": translate.move_direction,
            "move_far": translate.move_far,
            "move_speed": translate.move_speed,
            "body_turn_direction": translate.body_turn_direction,
            "body_turn_degree": translate.body_turn_degree,
            "remote_control_body_type": translate.remote_control_body_type,
            "action_type": translate.action_type,
            "facial_type": translate.facial_type,
            "tts_type": translate.tts_type,
            "volume_type": translate.volume_type,
            "music_type": translate.music_type,
            "volume_option_type": translate.volume_option_type,
            "tts_speed_type": translate.tts_speed_type,
            "sentence_type": translate.sentence_type,
            "playVideosInYoutubeItems": translate.playVideosInYoutubeItems,
            "displayUrlPicturesItems": translate.displayUrlPicturesItems,
            "playUrlMusicItems": translate.playUrlMusicItems,
            "openDriveVideoUrlItems": translate.openDriveVideoUrlItems,
            "openDriveAudioUrlItems": translate.openDriveAudioUrlItems,
            "openDrivePictureUrlItems": translate.openDrivePictureUrlItems,
            "openDriveDocumentUrlItems": translate.openDriveDocumentUrlItems,
        },
        url: 'https://zenboscratchservice.github.io/' // Link to extension documentation, homepage, etc.
    };

    // Register the extension
    ScratchExtensions.register('ZenboScratchService', descriptor, ext);
})({});
