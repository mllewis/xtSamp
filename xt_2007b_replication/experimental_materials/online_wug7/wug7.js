// WUG Experiment 6
// Overview: (i) Helper (ii) Parameters (iii) Control Flow
// Condtion equalizer filename and counts
var filename = "MLL_wug7"
var condCounts = "1,50;2,50" //Example: "1,20;2,20;3,20"

// ---------------- HELPER ------------------
function random(a, b) {
    if (typeof b == "undefined") {
        a = a || 2;
        return Math.floor(Math.random() * a);
    } else {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

var width = $(window).width();

//teacher circle coordinates
var c2x
var c2y
var c3x
var c3y

// image display offsets
var y_offset_train = 275
var y_offset_test = 100

var circled = new Array()
var selected = new Array()
var test = false;
var threeOrLess = true;
var train_click = 0;


function addImage(id2,catName,setName,setNum, x, y, a, b) {
	var img = "images/" + catName + "-" + setName + "-" + setNum + ".jpg"
	if ((catName == withinTarget && setName == 1 && setNum==1) || sample == 0) {
		$('#' + id2).prepend('<img width=50px src="' + img + '" STYLE="position:absolute; TOP:' + y + 'px; LEFT:' + x + 'px;"/>')
	} else {
    	$('#' + id2).prepend('<img width=50px src="' + img + '" STYLE="position:absolute; TOP:' + y + 'px; LEFT:' + x + 'px;" onClick="experiment.drawCircle2(' + x + ',' + y + ',30,\''+ catName +'\','+setName+','+setNum+',' + a + ',' + b + ')" />')
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
xmlHttp.open( "GET", "http://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + condCounts +"&filename=" + filename, false );
xmlHttp.send( null );
var cond = xmlHttp.responseText;
//var cond = random(2) + 1; // (1-2)
var cond=2



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


// Trial types (randomize order)
var testTrials = [ ['Qsub1', withinTarget + '-1-4.jpg'], 
				['Qsub2', withinTarget + '-1-5.jpg' ],
				['Qcheck1', withinOther + '-1-1.jpg'],
				['Qcheck2',  withinOther + '-1-2.jpg'],
				['Qbasic1', withinTarget + '-3-1.jpg'],
				['Qbasic2', withinTarget + '-3-2.jpg'],
				['Qbasic3', withinTarget + '-2-2.jpg'],
				['Qproper1', withinTarget + '-1-1.jpg'],
				['Qproper2',''],
				['Qproper3', ''] ]
				
shuffle(testTrials) //randomize order


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
    Qsub1: 0,
    Qcheck1: 0,
    Qbasic1: 0,
    Qsub2: 0,
    Qbasic2: 0,
    Qproper1: 0,
    Qbasic3: 0,
    Qproper2: 0,
    Qcheck2: 0,
    Qproper3: 0,
    click1: "",
    click2: "",
    mainNum: 0,
    question1: false,
    question2: false,
    question3: false,
    question4: false,
    target:[],
    dist:[],
    inst_line: 0,

    // END FUNCTION
    end: function () {
        showSlide("finished");
        setTimeout(function () {

            //Decrement			
            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "http://langcog.stanford.edu/cgi-bin/subject_equalizer/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
            xmlHttp.send(null);

            turk.submit(experiment);
        }, 1500); //function() - anonymous function
    },

    // MAIN DISPLAY FUNCTION
    next: function () {
        
        // Instructions
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
                        addImage("wt2", withinOther, dist[c][0], dist[c][1], center + 30 + (a * 70), y_offset_train +((b - 1) * 70), a, b)
                        addImage("wt2",  withinTarget,target[c][0],target[c][1] , center - 30 - (a * 70) , y_offset_train +((b - 1) * 70), a, b)
                        if (target[c][0] == 1 && target[c][1] == 1) {
                        	experiment.drawCircle2(center - 30 - (a * 70), y_offset_train +((b - 1) * 70), 30 , withinTarget, 1, 1, a, b)
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
             	 learnTeach_html= '<p class="block-text"> Find the object that is circled below. That object could be called a <b>' + experiment.withinLabel + '</b>. When you click on the "See Another" button, I will show you another ' + experiment.withinLabel + '. <p>'
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
                        addImage("wt1", withinOther, dist[c][0], dist[c][1], center + 30 + (a * 70), y_offset_train +((b - 1) * 70), a, b)
                        addImage("wt1",  withinTarget,target[c][0],target[c][1] , center - 30 - (a * 70) , y_offset_train +((b - 1) * 70), a, b)
                        if (target[c][0] == 1 && target[c][1] == 1) {
                        	experiment.drawCircle2(center - 30 - (a * 70), y_offset_train +((b - 1) * 70), 30 , withinTarget, 1, 1, a, b)
                        }
                        c = c + 1
                    }
                }

       
			  if (label== 1){
				learnInst_html= '<p class="block-text"> The object circled below could be called a <b>' + experiment.withinLabel + '</b>. Click on two more objects that you think might also be called ' + experiment.withinLabel + 's. <p>'
			  } else if (label == 0) {
				 learnInst_html= '<p class="block-text"> Find the object that is circled below. Click on two more objects that are the same kind as this object.<p>'
			  }
              $("#learn_inst").html(learnInst_html);
   
            }
        }


        // Test - WITHIN (2-11)
        if (experiment.mainNum > 1 && experiment.mainNum < 12) {		
			mainSlide = "test";
			test = true;

			// load testing images
			center=width/2
			c = 0
			for (a = 1; a < 4; a++) {
				for (b = 1; b < 6; b++) {
					addImage("testdisplay", withinOther, dist[c][0], dist[c][1], center + 10 + (a * 47), y_offset_test+((b - 1) * 47), a, b)
					addImage("testdisplay",  withinTarget,target[c][0],target[c][1] , center - 10 - (a * 47) , y_offset_test +((b - 1) * 47), a, b) 
					c = c + 1
				}
			}
			
			// add testing circles
			threeOrLess=true;
			for (i = 0; i<3; i++) {
				if (circled[i][0] == withinOther) {
					experiment.drawCircle2(center + 10 + (circled[i][1] * 47), y_offset_test+((circled[i][2] - 1) * 47), 30 , circled[i][0], 1, 1, circled[i][1], circled[i][2])
				} else {
					experiment.drawCircle2(center - 10 - (circled[i][1] * 47), y_offset_test+((circled[i][2] - 1) * 47), 30 , circled[i][0], 1, 1, circled[i][1], circled[i][2])
				}
			}
			threeOrLess=false;

        	var breaks_html = '<br><br><br><br><br><br><br><br><br><br><HR>'
            var testPic_html;
            var testQuestion_html;

			
			if ((testTrials[experiment.mainNum-2][0] == 'Qproper2') && (experiment.sample == 1)) {
			 	pic = selected[0][0] + '-' + selected[0][1] + '-' + selected[0][2] + '.jpg'
			} else if ((testTrials[experiment.mainNum-2][0] == 'Qproper3') && (experiment.sample == 1 )) {
			 	pic = selected[1][0] + '-' +selected[1][1] + '-' + selected[1][2] +'.jpg'
			} else if  ((testTrials[experiment.mainNum-2][0] == 'Qproper2') && (experiment.sample == 0)) {
				pic = withinTarget + '-1-2.jpg'
			} else if  ((testTrials[experiment.mainNum-2][0] == 'Qproper3') && (experiment.sample == 0 )) {
				pic = withinTarget + '-1-3.jpg'
			} else {
				pic = testTrials[experiment.mainNum-2][1]
			}
			
            testPic_html += '<td><img  src="images/' + pic + '" align="middle" class="centerImage" width="115"/>' 

			// add test question
            if (experiment.label == 0) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Is this object the same kind as the objects you learned? <p>'
            } else if (experiment.label == 1) {
                testQuestion_html = '<p class="block-text"> Look at the object below. Could this be called a <b>' + withinLabel + '</b>? <p>'
            }
            
            if (experiment.sample == 0) {
					testHeader_html = '<p class="block-text"> I showed you these objects were ' + withinLabel + 's: <p>'
			} else if (experiment.sample == 1) {
               	 testHeader_html = '<p class="block-text"> You identified the objects below as ' + withinLabel + 's: <p>'
            }
			
			$("#breaks").html(breaks_html);
			$("#testHeader").html(testHeader_html);
            $("#testQ").html(testQuestion_html);
            $("#testP").html(testPic_html);

        }
        
        // Add Filter Question
       if (experiment.mainNum == 12 & experiment.label == 1) {
				mainSlide = "qslide";
				Q2display_html = '<td><img  src="images/' + acrossTarget + '-1-1.jpg" align="middle" class="centerImage" width="115"/>' 
				$("#Q2display").html(Q2display_html);
				Q3display_html = '<td><img  src="images/' + acrossOther + '-1-1.jpg" align="middle" class="centerImage" width="115"/>' 
				$("#Q3display").html(Q3display_html);
				Q4display_html = '<td><img  src="images/' + withinTarget + '-1-5.jpg" align="middle" class="centerImage" width="115"/>' 
				$("#Q4display").html(Q4display_html);
        	} else if (experiment.mainNum == 12 & experiment.label == 0) { 
				experiment.question1 = true;
				experiment.question2 = true;
				setTimeout(experiment.end, 500);
        }
        
        showSlide(mainSlide);
    },


    // SELECT FUNCTION 
    select: function () {
    	var go = true

        // Testing
        if (experiment.mainNum > 1 && experiment.mainNum != 12 && go == true) { // Not at end
            var answer = $("input[name='testQuestion']:checked").attr('id');
			
			// record answer
            if (answer != undefined) {
                if (answer == 'yes') {
                	if (testTrials[experiment.mainNum - 2][0]  == 'Qsub1') {
                		experiment.Qsub1 =1;
                	 } else if  (testTrials[experiment.mainNum - 2][0]  == 'Qsub2')  {
                	 	experiment.Qsub2 =1;
                	 } else if (testTrials[experiment.mainNum - 2][0]  == 'Qcheck1') {
                		experiment.Qcheck1 =1;
                	 } else if (testTrials[experiment.mainNum - 2][0] == 'Qcheck2') {
                	  	experiment.Qcheck2 =1;
                	} else if (testTrials[experiment.mainNum - 2][0] == 'Qbasic1') {
                		experiment.Qbasic1 =1;
                	} else if (testTrials[experiment.mainNum - 2][0] == 'Qbasic2') {
                		experiment.Qbasic2 =1;
                	} else if (testTrials[experiment.mainNum - 2][0] == 'Qbasic3') {
                		experiment.Qbasic3 =1;
                	} else if (testTrials[experiment.mainNum - 2][0] == 'Qproper1') {
                		experiment.Qproper1 =1;
                	} else if (testTrials[experiment.mainNum - 2][0] == 'Qproper2') {
                		experiment.Qproper2 =1;
					} else if (testTrials[experiment.mainNum - 2][0]=='Qproper3')
						experiment.Qproper3=1;
				}
                
                document.getElementById("yes").checked = false; // reset radio buttons
                document.getElementById("no").checked = false;
                experiment.mainNum++;
                $("#qmessage").html("");
                if (experiment.mainNum == 12){ //remove papers
                	for (i=3; i<33; i++){
                		eval('paper'+i+'.remove()')
                	}
				  go = false;
	        	}
                experiment.next();

            } else {
                $("#qmessage").html('<font color="red" class="centerText"> Please answer the question. </font>');
            }
        }
        
        // Training
        if (experiment.mainNum == 1) {
        	if (sample == 0) {	
        		// add circles on "See Another" button
				if (train_click == 1) {
					experiment.drawCircle2(center - 30 - (c2x * 70), y_offset_train + ((c2y - 1) * 70), 30 , withinTarget, 1, 1, c2x, c2y)
				 } else if (train_click == 2) {
					experiment.drawCircle2(center - 30 - (c3x * 70), y_offset_train + ((c3y - 1) * 70), 30 , withinTarget, 1, 1, c3x, c3y)
					teach_button_html =  '<button type="button" onClick="this.blur();experiment.select()">Next</button>'
            	   	$("#teach_button").html(teach_button_html);
				 } else if ( train_click == 3) {
					experiment.mainNum++;
					paper0.remove() //remove circles
					paper1.remove()
					paper2.remove()
					experiment.next();
				}
        	} else if (sample == 1) {
        		// advance after user adds 2 circles
				if ((train_click == 3)){
					experiment.mainNum++;
					paper0.remove() // remove circles
					paper1.remove()
					paper2.remove()
					experiment.next();
					$("#qt_message").html("");
				} else {
					$("#qt_message").html('<font color="red" class="centerText" style="position:absolute; TOP: 420; LEFT:' + ((width/2)-95) +'"> Please select another object. </font>');
				}
			}
        }
        

        // Filter Question slide         
        if (experiment.mainNum == 12 && go == true) { // if end
        		
        	var selectedID1 = $("input[name='Q1']:checked").attr('id');
        	var selectedID2 = $("input[name='Q2']:checked").attr('id');
        	var selectedID3 = $("input[name='Q3']:checked").attr('id');
        	var selectedID4 = $("input[name='Q4']:checked").attr('id');
        	
        	if (selectedID1 != undefined && selectedID2 !=undefined && selectedID3 !=undefined && selectedID4 !=undefined) {	 //if all Qs answered
				// Record responses
				if (selectedID1 == 'a' & nonceWords[0] == 'wug') {
						experiment.question1 = true;
				} else if (selectedID1 == 'b' & nonceWords[0] == 'fep') {
						experiment.question1 = true; 
				} else if (selectedID1 == 'c' & nonceWords[0] == 'tupa') {
						experiment.question1 = true;
				} else if (selectedID1 == 'd' & nonceWords[0] == 'blicket') {
						experiment.question1 = true;
				}
				
				if (selectedID2 == 'no') {
						experiment.question2 = true;
				}
				
				if (selectedID3 == 'no') {
						experiment.question3 = true;
				}
				
				if (selectedID4 == 'yes') {
						experiment.question4 = true;
				}
				
				//End experiment
				setTimeout(experiment.end, 500); // end experiment if last slide
				
			} else {
				$("#qmessage2").html('<font color="red"> Please answer all four questions. </font>');
			}
		}
    },
    
    // ISELECT FUNCTION 
    iSelect: function () {
    	var button_html =  '<table align="center"><tr> <td> <button type="button" onClick="this.blur();experiment.iSelect()">Continue</button> </td></tr></table>'
    	if (experiment.sample == 0){ //teacher
    		if (experiment.inst_line == 0){
    		   inst_line1_html= 'Hi, my name is Natalie.'
    		   $("#inst_line1").html(inst_line1_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000) 
    		} else if (experiment.inst_line == 1){
    		   inst_line2_html= 'In the first part of the experiment, you will see pictures of objects.'
    		   $("#inst_line2").html(inst_line2_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000) 
    		} else if (experiment.inst_line == 2) {
    			$("#button2").html("")
    			 if (label == 0) {
    					inst_line3_html= 'Some of the objects are the same kind.'
           		 } else if (label == 1) {
               		   inst_line3_html= 'Some of the objects could be called <b>' + experiment.withinLabel + 's</b>.'
            	 }
				$("#inst_line3").html(inst_line3_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},4000)   		   
    		} else if (experiment.inst_line == 3) {
    			$("#button2").html("")
    			
    			if (label == 0) {
    				inst_line4_html= 'In order for you to learn which objects are the same kind, I will circle three of them for you.'
           		} else if (label == 1) {
    				inst_line4_html= 'In order for you to learn which objects could be called <b>' + experiment.withinLabel + 's</b>, I will circle three of them for you.'
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
    		if (experiment.inst_line == 0){
    		   inst_line1_html= 'Hi, my name is Natalie.'
    		   $("#inst_line1").html(inst_line1_html)	 
    		   setTimeout(function() {$("#button2").html(button_html)},2000) 
    		} else if (experiment.inst_line == 1){
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
    		   setTimeout(function() {$("#button2").html(button_html)},4000)  
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
    
    drawCircle2: function (x, y, r, catName, setName, setNum, a, b) {	
    
    	temp = new Array();
		temp = [catName, a, b];
		circled.push(temp); // position in matrix of picture selected
		
		
		// determine if correct
		if (train_click == 1 ) {
				selected.push([catName, setName, setNum])
				if (catName == withinTarget && setName == 1) {
					experiment.click1 = "correct"
				} else {experiment.click1 = "false"}
		} else if (train_click == 2) {
				selected.push([catName, setName, setNum])
				if (catName == withinTarget && setName == 1) {
					experiment.click2 = "correct"
				} else { experiment.click2 = "false"}	
				$("#qt_message").html("");
		}
	
		 // draw circle
		if (train_click <= 2 || (test && threeOrLess)){
			if (test){
				eval('paper' + train_click + ' = Raphael(x,y,70,70)')
			} else { eval('paper' + train_click + ' = Raphael(x,y,90,90)')}
			
			var circle = eval('paper' + train_click + '.circle(r+1,r+1,r)')
			circle.attr("stroke-width",3);
			
			if (train_click > 0 && sample == 1 && train_click <= 2){

				if (label == 1) {
					var alertmsg = "Yeah, that's a "+ withinLabel + "."
					 alert(alertmsg); 
			  		if ( train_click == 2 ) { $('#learnerNext').show() } 
				} else { 
					alert("You're correct!")
				}
			}
			
			train_click = train_click + 1
		}
    }  
}
