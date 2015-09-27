// WUG Experiment 4
// Overview: (i) Helper (ii) Parameters (iii) Control Flow
// Condtion equalizer filename and counts
var filename = "MLL_wug5"
var condCounts = "1,75;2,75" //Example: "1,20;2,20;3,20"
var train_click = 0;

// ---------------- HELPER ------------------
function random(a, b) {
    if (typeof b == "undefined") {
        a = a || 2;
        return Math.floor(Math.random() * a);
    } else {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

var paper0
var paper1
var width = $(window).width();

//teacher circle coordinates
var c2x
var c2y
var c3x
var c3y

function addImage(id2,catName,setName,setNum, x, y) {
	var img = "images/" + catName + "-" + setName + "-" + setNum + ".jpg"
	if ((catName == withinTarget && setName == 1 && setNum==1) || sample == 0) {
		$('#' + id2).prepend('<img width=50px src="' + img + '" STYLE="position:absolute; TOP:' + y + 'px; LEFT:' + x + 'px;"/>')
	} else {
    	$('#' + id2).prepend('<img width=50px src="' + img + '" STYLE="position:absolute; TOP:' + y + 'px; LEFT:' + x + 'px;" onClick="experiment.drawCircle2(' + x + ',' + y + ',30,\''+ catName +'\','+setName+','+setNum+')" />')
	}
}

//Array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#" + id).show(); //jquery - element with given id - show
}


//Call the maker getter to get the cond variable  (determines list)
var xmlHttp = null;
xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + condCounts +"&filename=" + filename, false );
xmlHttp.send( null );
// var cond = xmlHttp.responseText;
//var cond = random(2) + 1; // (1-2)
var cond=1



// ---------------- PARAMETERS ------------------
// Label and Sample manipulations
var label; //label vs. no label 
var sample; // learner vs. teacher

if (cond == 1) {
   	label = 1;
   	sample = 0;
} else if (cond == 2) {
	label = 1;
  	sample = 1;
}


//if (cond == 1) {
 //  label = 0;
//    sample = 0;
//} else if (cond == 2) {
//    label = 1;
//    sample = 0;
//} else if (cond == 3) {
//   label = 0;
 //  sample = 1;
//} else if (cond == 4) {
  //  label = 1;
//	sample = 1;
//}

//sample = 1; // FOR TESTING
//label = 1; //FOR TESTING

// Nonce Words
if (label == 1) {
    var nonceWords = ['blicket', 'tupa', 'wug', 'fep']
    shuffle(nonceWords)
    var withinLabel = nonceWords[0]
    var acrossLabel = nonceWords[1]
} else {
    var withinLabel = "NA"
    var acrossLabel = "NA"
}

// Image Sets (randomly mapped to category type)
var imageSets = ['a', 'b', 'c', 'd']
shuffle(imageSets)

var withinTarget = imageSets[0]
var withinOther = imageSets[1]
var acrossTarget = imageSets[2]
var acrossOther = imageSets[3]


// ---------------- CONTROL FLOW ------------------
//PRE-LOAD IMAGES
var images = new Array() // By creating image object and setting source, images preload
for (i = 1; i < 61; i++) {
	 images[i] = new Image()
}

var i =1 
for (c = 0; c < 4 ; c++){
	for (a = 1; a < 4; a++) {
      for (b = 1; b < 6; b++) {
			images[i].src = "images/" + imageSets[c] + "-" + a + "-" + b + ".jpg"
			i++
		}
	}
}
			

// INSTRUCTIONS SLIDE
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
    cond: cond,
    label: label,
    sample: sample,
    withinTarget: withinTarget,
    withinOther: withinOther,
    acrossTarget: acrossTarget,
    acrossOther: acrossOther,
    withinLabel: withinLabel,
    acrossLabel: acrossLabel,
    Qwsm1: 0,
    Qwcheck: 0,
    Qwsmm1: 0,
    Qwsm2: 0,
    Qwsmm2: 0,
    Qasm1: 0,
    Qacheck: 0,
    Qasmm1: 0,
    Qasm2: 0,
    Qasmm2: 0,
    click1: "",
    click2: "",
    mainNum: 0,
    question1: false,
    question2: false,
    target:[],
    dist:[],
    inst_line: 1,

    // END FUNCTION
    end: function () {
        showSlide("finished");
        setTimeout(function () {

            //Decrement			
            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
            xmlHttp.send(null);

            turk.submit(experiment);
        }, 1500); //function() - anonymous function
    },

    // MAIN DISPLAY FUNCTION
    next: function () {
    
    	if (experiment.mainNum == 0){
    		mainSlide = "instructions2";
    		 experiment.iSelect()
    	}

        // Training- teacher or learner (1)
        if (experiment.mainNum == 1) {
            if (experiment.sample == 0) { //teacher
                mainSlide = "train_teacher";
                
                // shuffle stimuli completely
                c = 0
                target = new Array()
                for (i = 0; i < 15; ++i) target[i] = new Array(2);
                dist = new Array()
                for (i = 0; i < 15; ++i) dist[i] = new Array(2);
                for (a = 1; a < 4; a++) {
                    for (b = 1; b < 6; b++) {
                        target[c] = [a, b]
                        dist[c] = [a, b]
                        c = c + 1
                    }
                }

                target = shuffle(target)
                dist = shuffle(dist)
				
				center=width/2
                c = 0
                for (a = 1; a < 4; a++) {
                    for (b = 1; b < 6; b++) {
                        addImage("wt2", withinOther, dist[c][0], dist[c][1], center + 30 + (a * 70), 70+((b - 1) * 70))
                        addImage("wt2",  withinTarget,target[c][0],target[c][1] , center - 30 - (a * 70) , 70+((b - 1) * 70))
                        if (target[c][0] == 1 && target[c][1] == 1) {
                        	experiment.drawCircle2(center - 30 - (a * 70), 70+((b - 1) * 70), 30 , withinTarget, 1, 1)
						} else if (target[c][0] == 1 && target[c][1] == 2) {
							c2x = a
							c2y = b
						} else if (target[c][0] == 1 && target[c][1] == 3) {
							c3x = a
							c3y = b
                        }
                             
                        c = c + 1
                    }
                }
            	
               teach_button_html =  '<button type="button" onClick="this.blur();experiment.select()">See Another</button>'

              if (label== 1) {
             	 learnTeach_html= '<p class="block-text"> Find the object that is circled below. That object is a <b>' + experiment.withinLabel + '</b>. When you click on the "See Another" button, I will show you another ' + experiment.withinLabel + '. <p>'
              } else if (label == 0) {
                 learnTeach_html= '<p class="block-text"> Find the object that is circled below. When you click on the "See Another" button, I will show you another object that is the same kind. </b><p>'
              }
              
              $("#teach_inst").html(learnTeach_html);
              $("#teach_button").html(teach_button_html);


            } else { //learner
                mainSlide = "train_learner";

                // shuffle stimuli completely
                c = 0
                target = new Array()
                for (i = 0; i < 15; ++i) target[i] = new Array(2);
                dist = new Array()
                for (i = 0; i < 15; ++i) dist[i] = new Array(2);
                for (a = 1; a < 4; a++) {
                    for (b = 1; b < 6; b++) {
                        target[c] = [a, b]
                        dist[c] = [a, b]
                        c = c + 1
                    }
                }

                target = shuffle(target)
                dist = shuffle(dist)
				
				center=width/2
                c = 0
                for (a = 1; a < 4; a++) {
                    for (b = 1; b < 6; b++) {
                        addImage("wt1", withinOther, dist[c][0], dist[c][1], center + 30 + (a * 70), 70+((b - 1) * 70))
                        addImage("wt1",  withinTarget,target[c][0],target[c][1] , center - 30 - (a * 70) , 70+((b - 1) * 70))
                        if (target[c][0] == 1 && target[c][1] == 1) {
                        	experiment.drawCircle2(center - 30 - (a * 70), 70+((b - 1) * 70), 30 , withinTarget, 1, 1)
                        }
                        c = c + 1
                    }
                }

       
			  if (label== 1){
				learnInst_html= '<p class="block-text"> The object circled below is a <b>' + experiment.withinLabel + '</b>. Click on two more ' + experiment.withinLabel + 's. <p>'
			  } else if (label == 0) {
				 learnInst_html= '<p class="block-text"> Find the object that is circled below. Click on two more objects that are the same kind as this object.<p>'
			  }
              $("#learn_inst").html(learnInst_html);
   
            }
        }


        // Test - WITHIN (2-6)
        if (experiment.mainNum > 1 && experiment.mainNum < 7) {		
			mainSlide = "test";
			
			center=width/2
			c = 0
			for (a = 1; a < 4; a++) {
				for (b = 1; b < 6; b++) {
					addImage("testdisplay", withinOther, dist[c][0], dist[c][1], center + 10 + (a * 47), 47+((b - 1) * 47))
					addImage("testdisplay",  withinTarget,target[c][0],target[c][1] , center - 10 - (a * 47) , 47+((b - 1) * 47))                         
					c = c + 1
				}
			}
        	var breaks_html = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><HR>'
            var testPic_html;
            var testQuestion_html;

            if (experiment.mainNum == 2) {
                testPic_html += '<td><img  src="images/' + withinTarget + '-1-4.jpg" align="middle" class="centerImage" width="115"/>' //submatch
            } else if (experiment.mainNum == 3) {
                testPic_html += '<td align="center"><img  src="images/' + withinOther + '-1-1.jpg" width="115"/>' //non-match
            } else if (experiment.mainNum == 4) {
                testPic_html += '<td align="center"><img  src="images/' + withinTarget + '-2-1.jpg" width="115"/>' //submismatch
            } else if (experiment.mainNum == 5) {
                testPic_html += '<td align="center"><img  src="images/' + withinTarget + '-1-5.jpg" width="115"/>' //submatch
            } else if (experiment.mainNum == 6) {
                testPic_html += '<td align="center"><img  src="images/' + withinTarget + '-3-1.jpg" width="115"/>' //submismatch
            }

            if (experiment.label == 0) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Is this object the same kind as the objects you learned? <p>'
            } else if (experiment.label == 1) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Is this a <b>' + withinLabel + '</b>? <p>'
            }
			
			$("#breaks").html(breaks_html);
            $("#testQ").html(testQuestion_html);
            $("#testP").html(testPic_html);
        }

        // Train- ACROSS (7)
        if (experiment.mainNum == 7) {
            mainSlide = "trainacross";
            
            var testPic_html = '<td align="center"><img  src="images/' + acrossTarget + '-1-1.jpg" width="115"/>' //match
            var testQuestion_html;

            if (experiment.label == 0) {
                testQuestion_html = '<p class="block-text">Here is a new kind of object.<p>'
            } else if (experiment.label == 1) {
                testQuestion_html = '<p class="block-text">Here is a new kind of object. This object is called a <b>' + acrossLabel + '.</b> <p>'
            }

            $("#testQ7").html(testQuestion_html);
            $("#testP7").html(testPic_html);
        }


        // Test- ACROSS (8-12)
        if (experiment.mainNum > 7 && experiment.mainNum < 13) {
            mainSlide = "test";
            $("#testdisplay").html("");
            $("#breaks").html("");
            var testPic_html;
            var testQuestion_html;

            if (experiment.mainNum == 8) {
                testPic_html += '<td align="center"><img  src="images/' + acrossTarget + '-1-4.jpg" width="115"/>' //submatch
            } else if (experiment.mainNum == 9) {
                testPic_html += '<td align="center"><img  src="images/' + acrossOther + '-1-1.jpg" width="115"/>' //non-match
            } else if (experiment.mainNum == 10) {
                testPic_html += '<td align="center"><img  src="images/' + acrossTarget + '-2-1.jpg" width="115"/>' //submismatch
            } else if (experiment.mainNum == 11) {
                testPic_html += '<td align="center"><img  src="images/' + acrossTarget + '-1-5.jpg" width="115"/>' //submatch
            } else if (experiment.mainNum == 12) {
                testPic_html += '<td align="center"><img  src="images/' + acrossTarget + '-3-1.jpg" width="115"/>' //submismatch
            }

            if (label == 0) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Does this object go together with the new kind of object? <p>'
            } else if (label == 1) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Is this a <b>' + acrossLabel + '</b>? <p>'
            }

            $("#testQ").html(testQuestion_html);
            $("#testP").html(testPic_html);
        }
        
       if (experiment.mainNum == 13 & experiment.label == 1) {
        	mainSlide = "qslide";
        	} else if (experiment.mainNum == 13 & experiment.label == 0) { 
        	experiment.question1 = true;
        	experiment.question2 = true;
        	setTimeout(experiment.end, 500);
        }
        showSlide(mainSlide);
    },


    // SELECT FUNCTION wug5
    select: function () {
    	var go = true

        if (experiment.mainNum == 7) {
            experiment.mainNum++;
            experiment.next();
            go = false
        }

        // Testing
        if (experiment.mainNum > 1 && experiment.mainNum != 7 && go == true) { // Not at end
            var answer = $("input[name='testQuestion']:checked").attr('id');

            if (answer != undefined) {
                if (answer == 'yes') {
                    if (experiment.mainNum == 2) {
                        experiment.Qwsm1 = 1
                    } else if (experiment.mainNum == 3) {
                        experiment.Qwcheck = 1
                    } else if (experiment.mainNum == 4) {
                        experiment.Qwsmm1 = 1
                    } else if (experiment.mainNum == 5) {
                        experiment.Qwsm2 = 1
                    } else if (experiment.mainNum == 6) {
                        experiment.Qwsmm2 = 1
                    } else if (experiment.mainNum == 8) {
                        experiment.Qasm1 = 1
                    } else if (experiment.mainNum == 9) {
                        experiment.Qacheck = 1
                    } else if (experiment.mainNum == 10) {
                        experiment.Qasmm1 = 1
                    } else if (experiment.mainNum == 11) {
                        experiment.Qasm2 = 1
                    } else if (experiment.mainNum == 12) {
                        experiment.Qasmm2 = 1
                    }
                }

                document.getElementById("yes").checked = false;
                document.getElementById("no").checked = false;
                $("#qmessage").html("");
                experiment.mainNum++;
                experiment.next();

            } else {
                $("#qmessage").html('<font color="red" class="centerText"> Please answer the question. </font>');
            }
        }
        
        // Training
        if (experiment.mainNum == 1) {
        	if (sample == 0) {	
				if (train_click ==1) {
					experiment.drawCircle2(center - 30 - (c2x * 70), 70+((c2y - 1) * 70), 30 , withinTarget, 1, 1)
				 } else if (train_click == 2) {
					experiment.drawCircle2(center - 30 - (c3x * 70), 70+((c3y - 1) * 70), 30 , withinTarget, 1, 1)
					teach_button_html =  '<button type="button" onClick="this.blur();experiment.select()">Next</button>'
            	   	$("#teach_button").html(teach_button_html);
				 } else if ( train_click ==3) {
					experiment.mainNum++;
					paper0.remove()
					paper1.remove()
					paper2.remove()
					experiment.next();
				}
        	} else if (sample ==1){
				if ((train_click == 3)){
					experiment.mainNum++;
					paper0.remove()
					paper1.remove()
					paper2.remove()
					experiment.next();
					$("#qt_message").html("");
				} else {
					$("#qt_message").html('<font color="red" class="centerText" style="position:absolute; TOP: 420; LEFT:' + ((width/2)-95) +'"> Please select another object. </font>');
				}
			}
        }
        

        // Qslide         
        if (experiment.mainNum == 13) { // IF END
        	var selectedID1 = $("input[name='Q1']:checked").attr('id');
        	var selectedID2 = $("input[name='question2']:checked").attr('id');
        	if (selectedID1 != undefined && selectedID2 !=undefined) {	
				
				if (selectedID1 == 'a' & nonceWords[0] == 'wug') {
						experiment.question1 = true;
				} else if (selectedID1 == 'b' & nonceWords[0] == 'fep') {
						experiment.question1 = true; 
				} else if (selectedID1 == 'c' & nonceWords[0] == 'tupa') {
						experiment.question1 = true;
				} else if (selectedID1 == 'd' & nonceWords[0] == 'blicket') {
						experiment.question1 = true;
				}
				
				if (selectedID2 == 'e' & nonceWords[1] == 'wug') {
						experiment.question2 = true;
				} else if (selectedID2 == 'f' & nonceWords[1] == 'fep') {
						experiment.question2 = true; 
				} else if (selectedID2 == 'g' & nonceWords[1] == 'tupa') {
						experiment.question2 = true;
				} else if (selectedID2 == 'h' & nonceWords[1] == 'blicket') {
						experiment.question2 = true;
				}
				
				setTimeout(experiment.end, 500); // end experiment if last slide
				
			} else {
				$("#qmessage").html('<font color="red"> Please answer both questions </font>');
			}
		}
    },
    
    // ISELECT FUNCTION 
    iSelect: function () {
    	var button_html =  '<table align="center"><tr> <td> <button type="button" onClick="this.blur();experiment.iSelect()">Continue</button> </td></tr></table>'
    	if (experiment.sample == 0){ //teacher
    		if (experiment.inst_line == 1){
    		   inst_line2_html= 'In the first part of the experiment, you will see pictures of objects.'
    		   $("#inst_line2").html(inst_line2_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000) 
    		} else if (experiment.inst_line == 2) {
    			$("#button2").html("")
    			 if (label == 0) {
    					inst_line3_html= 'Some of the objects are the same kind.'
           		 } else if (label == 1) {
               		   inst_line3_html= 'Some of the objects are called <b>' + experiment.withinLabel + 's</b>.'
            	 }
				$("#inst_line3").html(inst_line3_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000)   		   
    		} else if (experiment.inst_line == 3) {
    			$("#button2").html("")
    			
    			if (label == 0) {
    				inst_line4_html= 'In order for you to learn which objects are the same kind, I will circle three of them for you.'
           		} else if (label == 1) {
    				inst_line4_html= 'In order for you to learn which objects are <b>' + experiment.withinLabel + 's</b>, I will circle three of them for you.'
            	 }
            	 
    		   $("#inst_line4").html(inst_line4_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 4) {
    			$("#button2").html("")
    		   	if (label == 0) {
    		   		inst_line5_html= 'After you learn which objects are the same kind, you will be asked questions about them.'
           		 } else if (label == 1) {
    		   		inst_line5_html= 'After you learn about the <b>' + experiment.withinLabel + 's</b>, you will be asked questions about them.'
            	 }
    		   $("#inst_line5").html(inst_line5_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 5) {
    			$("#button2").html("")
    			inst_line6_html= 'When you are ready, click the Continue button to begin.'
    		   	$("#inst_line6").html(inst_line6_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 6) {
    			experiment.mainNum++;
       			experiment.next();  
       		}
       		
    	} else if (experiment.sample == 1) { //learner
    		if (experiment.inst_line == 1){
    		   inst_line2_html= 'In the first part of the experiment, you will see pictures of objects.'
    		   $("#inst_line2").html(inst_line2_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000) 
    		} else if (experiment.inst_line == 2) {
    			$("#button2").html("")
    			 if (label == 0) {
    					inst_line3_html= 'Some of the objects are the same kind.'
           		 } else if (label == 1) {
               		   inst_line3_html= 'Some of the objects are called <b>' + experiment.withinLabel + 's</b>.'
            	 }    
            	 $("#inst_line3").html(inst_line3_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000)  
    		} else if (experiment.inst_line == 3) {
    			$("#button2").html("")
       			inst_line4_html= 'In order for you to learn which objects are <b>' + experiment.withinLabel + 's</b>, you will try to find two of them. I will tell you whether you are right or wrong.' 
    		     if (label == 0) {
       				inst_line4_html= 'In order for you to learn which objects are the same kind, you will try to find two of them. I will tell you whether you are right or wrong.' 
           		 } else if (label == 1) {
       				inst_line4_html= 'In order for you to learn which objects are <b>' + experiment.withinLabel + 's</b>, you will try to find two of them. I will tell you whether you are right or wrong.' 
            	 } 
    		    $("#inst_line4").html(inst_line4_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 4) {
    			$("#button2").html("")
    		   	if (label == 0) {
    		   		inst_line5_html= 'After you learn which objects are the same kind, you will be asked questions about them.'
           		 } else if (label == 1) {
    		   		inst_line5_html= 'After you learn about the <b>' + experiment.withinLabel + 's</b>, you will be asked questions about them.'
            	 }
            	 $("#inst_line5").html(inst_line5_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 5) {
    			$("#button2").html("")
    			inst_line6_html= 'When you are ready, click the Continue button to begin.'
    		   	$("#inst_line6").html(inst_line6_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000) 
    		} else if (experiment.inst_line == 6) {
    			experiment.mainNum++;
       			experiment.next();  
       		}
    	}	
    	experiment.inst_line++;
    },
    
    drawCircle2: function (x, y, r,catName,setName,setNum) {	
	
		if (train_click == 1 ) {
				if (catName == withinTarget && setName ==1) {
					experiment.click1 = "correct"
				} else { experiment.click1 = "false"}
		} else if (train_click == 2) {
				if (catName == withinTarget && setName ==1) {
					experiment.click2 = "correct"
				} else { experiment.click2 = "false"}	
				$("#qt_message").html("");
		}
	

		if (train_click <= 2) {
			eval('paper' + train_click + ' = Raphael(x,y,90,90)')
			var circle = eval('paper' + train_click + '.circle(r+1,r+1,r)')
			circle.attr("stroke-width",3);
			
			if (train_click > 0 && sample ==1){
				if (label == 1) {
					var alertmsg = "You're correct! That's a "+ withinLabel + "."
					alert(alertmsg);
					//alert(alertmsg) 
				} else { 
					alert("You're correct!")
				}
			}
			
			train_click = train_click + 1
		}
    }  
}