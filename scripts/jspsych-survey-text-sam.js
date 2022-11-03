/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['survey-text-sam'] = (function() {

    var plugin = {};

    plugin.info = {
	name: 'survey-text-sam',
	description: '',
	parameters: {
	    questions: {
		type: [jsPsych.plugins.parameterType.STRING],
		array: true,
		default: undefined,
		no_function: false,
		description: ''
	    },
	    premable: {
		type: [jsPsych.plugins.parameterType.STRING],
		default: '',
		no_function: false,
		description: ''
	    },
	    rows: {
		type: [jsPsych.plugins.parameterType.INT],
		array: true,
		default: 1,
		no_function: false,
		description: ''
	    },
	    columns: {
		type: [jsPsych.plugins.parameterType.INT],
		array: true,
		default: 40,
		no_function: false,
		description: ''
	    }
	}
    }

    plugin.trial = function(display_element, trial) {

	trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
	trial.input_type = typeof trial.input_type == 'undefined' ? "text" : trial.input_type;

	if (typeof trial.rows == 'undefined') {
	    trial.rows = [];
	    for (var i = 0; i < trial.questions.length; i++) {
		trial.rows.push(1);
	    }
	} else if (typeof trial.rows == 'number') {
	    var n = trial.rows;
	    trial.rows = [];
	    for (var i = 0; i < trial.questions.length; i++) {
		trial.rows.push(n);
	    }
	}
	if (typeof trial.columns == 'undefined') {
	    trial.columns = [];
	    for (var i = 0; i < trial.questions.length; i++) {
		trial.columns.push(40);
	    }
	} else if (typeof trial.columns == 'number') {
	    var n = trial.columns;
	    trial.columns = [];
	    for (var i = 0; i < trial.questions.length; i++) {
		trial.columns.push(n);
	    }
	}


	var value = trial.value || "";
	
	// if any trial variables are functions
	// this evaluates the function and replaces
	// it with the output of the function
	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

	
	// show preamble text
	display_element.empty().append($('<div>', {
	    "id": 'jspsych-survey-text-preamble',
	    "class": 'jspsych-survey-text-preamble'
	}));

	$('#jspsych-survey-text-preamble').html(trial.preamble);

	// Warning message area
	display_element.append($('<div>', {
	    id: 'warning',
	    css: {color: 'red'}
	}));

	display_element.append('<form id="jspsych-survey-likert-form">');
	// add likert scale questions
	for (var i = 0; i < 3; i++) {
	  form_element = $('#jspsych-survey-likert-form');
	  // add question
	  form_element.append('<div class="jspsych-survey-likert-statement" align="left">' + String(i+1) + ". " + trial.questions[i]);
	  // add options
	  var width = 100 / trial.labels.length;
	  var question_id = 'Q' + i
	  options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="' + question_id + '">';
	  options_string += '1 '
	  for (var j = 0; j < trial.labels.length; j++) {
		options_string += '<input type="radio" name="' + question_id + '" value="' + j + '" style="height:30px; width:30px; vertical-align: middle;" required><label class="jspsych-survey-likert-opt-label">' + "   " + '</label>';
	  }
	  options_string += ' 10'
	  options_string += '</ul></div><br>';
	  form_element.append(options_string);
	}		

	// add questions
	for (var i = 3; i < trial.questions.length; i++) {
	    // create div
	    display_element.append($('<div>', {
		"id": 'jspsych-survey-text-' + i,
		"class": 'jspsych-survey-text-question',
		"css": {
		    "margin": '2em 0em'
		}
	    }));

	    // add question text
	    $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');

	    if (trial.input_type[i] == "text") {
		// add text box
			$("#jspsych-survey-text-" + i).append('<input type="text" value="' + value + '" name="#jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></input>');
	    } else if (trial.input_type[i] == "textarea") {
			$("#jspsych-survey-text-" + i).append('<textarea placeholder="' + value + '" name="#jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></textarea>');
	    }
	}

	// add submit button
	display_element.append($('<button>', {
	    'id': 'jspsych-survey-text-next',
	    'class': 'jspsych-btn jspsych-survey-text'
	}));
	
	function myFunction(item,index) {
		console.log('validation index = ' + index);
	}	

	$("#jspsych-survey-text-next").html('Submit Answers');
	function validate( ) {
	    var validated = true;
	    var trial_data = {};
	    var $warning = $('<div>');
	    $("div.jspsych-survey-text-question").each(function(index) {
			var id = "Q" + index;
			myFunction(this,index)
			if (trial.input_type[index] == "text") {
				var val = $(this).children('input').val();
				console.log(val);
			} else if (trial.input_type[index] == "textarea") {
				console.log('textarea');
				var val = $(this).children('textarea').val();
				console.log(val);
			} else if (trial.input_type[index] == "likert") {
				console.log('likert');				
                var id = $(this).data('radio-group');
                var response = $('input[name="' + id + '"]:checked').val();
				console.log(val);				
			}
			var resp = trial.validation[index](val);
			console.log(resp);
			if (!resp) {
				$warning.append(
				$('<p>').html(trial.validationMessage[index])
				);
				validated = false;
			} else {
				trial_data[id] = val;
			}
	    });
	    if (validated){
		finishTrial(trial_data); 
	    }else {
		$('#warning').html($warning);
	    }
	}

	function finishTrial(resp) {
	    // measure response time
	    var endTime = (new Date()).getTime();
	    var response_time = endTime - startTime;


	    // create object to hold responses
	    var question_data = {};
	    $("div.jspsych-survey-text-question").each(function(index) {
			var id = "Q" + index;
			if (trial.input_type[index] == "text") {
				var val = $(this).children('input').val();
			} else if (trial.input_type[index] == "textarea") {
				console.log('textarea');
				var val = $(this).children('textarea').val();
			} else if (trial.input_type[index] == "likert") {
				console.log('likert');
				var id = $(this).data('radio-group');
				var val = $('input[name="' + id + '"]:checked').val();		
			} else {
				var val = $(this).children('input').val();
			}
			var obje = {};
			obje[id] = val;
			$.extend(question_data, obje);
	    });

	    // save data
	    var trialdata = {
		"rt": response_time,
		"responses": JSON.stringify(question_data),
	    };
	    $.extend(trialdata, question_data);

	    display_element.html('');

	    // next trial
	    jsPsych.finishTrial(trialdata);
	}
	$("#jspsych-survey-text-next").click(validate);

	var startTime = (new Date()).getTime();
    };

    return plugin;
})();
