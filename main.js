var study = "studyname";
var NBLOCKS = 6; // 6
var NSTIMS = 8; //8
var NPEERS = 3; // 3

var subjID = getSubjID(8);
var testing = $.url().param('testing');
if (testing == 1) {
    testing = true;
} else {
    testing = false;
}

var block;

var timing = {
    timeoutBeforePrompt		: 0,
    timeoutBeforeStim		: 0,
    timeoutBeforeResponse	: 500, // Before they can make resp after prompt/stim, WAS 1000
    timeoutBeforeMystery	: 1000, // WAS 2000
    timeoutBeforeFeedback	: 0, // This is evil. Don't use it
    timeoutAfterFeedback	: 500, // WAS 1000
    timeoutAfterFeedbackMystery	: 500, // WAS 1000
    timing_post_trial		: 250, // WAS 500
};

var you_timing = {
    timeoutBeforePrompt		: 0,
    timeoutBeforeStim		: 0,
    timeoutBeforeResponse	: 1000, // Before they can make resp after prompt/stim, WAS 2000
};

var peerC = [12.5, 87.5].rep(4);  // 4 blocks, half-and-half

var main_questions = [
	'Kurssi auttaa sinua etenemään työurallasi.',
	'Kurssilla opit hakemaan alaasi liittyvää tietoa itsenäisesti.',
	'Kurssilla opit muistamaan alasi asioita paremmin.',
	'Kurssin vetäjät ohjeistavat sinua tarkasti tehtävien suorittamisessa.',
	'Kurssi auttaa sinua hyödyntämään alasi tieteellisiä artikkeleita ja kirjoja.',
	'Saatat jäädä “koukkuun” kurssin asioihin niin, että haluat jatkaa niiden parissa kurssin jälkeenkin.',
	'Kurssi auttaa edustamaasi yritystä pärjäämään kilpailussa.',
	'Kurssi auttaa tukemaan edustamasi yrityksen toimintoja tehokkaammin.', 
	'Kurssi auttaa muuttamaan edustamasi yrityksen nykyisiä käytäntöjä.',
	'Kurssilla opit ratkaisemaan paljon ajattelua edellyttäviä ongelmia edustamassasi yrityksessä.',
	'Kurssilla opit ratkaisemaan selkeästi määriteltyjä tehtäviä edustamassasi yrityksessä.',
	'Kurssi auttaa sinua selviytymään arjen työtehtävistä paremmin.',] 
main_questions.shuffle()

var likert_block = {
  type: 'survey-likert',
  preamble: '<h4>Osio 1</h4> Seuraavat kuvaukset liittyvät työssäkäyvien henkilöiden täydennyskoulutuskursseihin. Kukin kuvaus liittyy yksittäiseen kurssiin, joten arvioi niitä yksi kerrallaan itsenäisesti. Harkitse kutakin kuvausta tarkoin ennen arviotasi. Arvio siis, kuinka paljon haluat osallistua kuvauksen mukaiselle kurssille asteikolla yhdestä kymmeneen (1...10). (1=en missään tapauksessa halua osallistua ... 10 = ehdottomasti haluan osallistua)<p> </p>',
  questions: main_questions,
  //style : "width: 650px",
  on_finish: function(){
	var progress = jsPsych.progress();
	console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');
  },  
  //jsPsych.setProgressBar(0.85);  
};

//ONLY TEXT, PREAMBLES, AND HTML SHOULD BE CHANGED BEYOND THIS POINT.
var peers = {'f': females, 'm': males, 'a': mixed_genders};

//Use this to edit instruction prompts
function practiceGenPoli(opts) {
    var timeline = [
      {
	    "type":"similarity",
	    "prompt":"<span>Mikä on <u>${peer}</u>n mielipide asiaan ja miten hän valitsee?</span>",
	    "peers":["Sinä", "Väiski","Repe"],
	    "peer_agree":[1,0,1],
	    "peer_compare":[0,1,1],
	    "peer_label":['Self', 'A', 'B'],
	    "stimuli":["xes/example/example.jpg","oes/example/example.jpg"],
	    "choices":["e","i"], // must be lowercase!
	    "peerExt": ".jpg",
	    "trialButtonLabel": 'Kun olet lukenut ohjeet, paina Jatka nappia: <br>',
	    "feedbackButtonLabel": "Paina nappia jatkaaksesi: <br>",
	    "practice": true,
	    "stimDir" : "",
	    "timeline":[
        {"phase": "FIRST",
        "prompt":"<br>Kyselyn aikana sinulle esitetään erilaisia mielipiteitä. Harkitse kunkin kysymyksen kohdalla hetki ennen kuin vastaat kannattavasi tai vastustavasi esitettyä mielipidettä. Kun kukin uusi mielipide esitetään, sinua pyydetään osoittamaan oma mielipiteesi <strong>painamalla E tai I näppäintä</strong>.<br>Huomaa myös ruudun oikeassa yläkulmassa oleva taulukko, joka näyttää sinun ja muiden tekemät valinnat sitä mukaan, kun niitä kertyy.<br><br> Harkitse nyt seuraavaa mielipidettä:<br><strong>Pitääkö sarjakuvissa olla juoneen liittyvää ankanmetsästystä?</strong>\
<br>Valitsetko KYLLÄ vai EI? Punainen X merkitsee aina EI ja vihreä väkänen tarkoittaa aina KYLLÄ<br>",
		 "instructsAfterClick":"<br>Tee valintasi nyt kysymykseen:\
<br>Pitääkö sarjakuvissa olla juoneen liittyvää ankanmetsästystä?\
<br>(Huomio, että punainen X merkitsee aina EI ja vihreä väkänen tarkoittaa aina KYLLÄ.)<br>",
		 "peer":0,
		 "feedbackChoices": "mouse",
		 "feedbackPrompt": "<br>Hyvä! Seuraavaksi sinua pyydetään arvaamaan muiden henkilöiden valintoja samasta asiasta.",
		},
		{"peer":1,
		 "prompt":"<br>Nyt kun olet valinnut oman kantasi, yritä arvata muiden henkilöiden mielipidettä samasta asiasta.\
<br>Pitääkö sarjakuvissa olla juoneen liittyvää ankanmetsästystä?\
<br>Miten arvelet että ${peer} valitsi?",
		 'feedbackPrompt': '<br>Saat palautteen muiden henkilöiden mielipiteistä nuolella, joka osoittaa kyseisen henkilön oikean vastauksen esitettyyn kysymykseen.\
<br>Tämä palaute näkyy ruudulla yhden sekunnin ennen kuin voit arvata seuraavan henkilön valintaa. Huomaa, että muiden henkilöiden oikeat vastaukset jäävät näkyviin ruudun oikeassa yläkulmassa olevaan taulukkoon.',
		 "instructsAfterClick":"<br>Tee valintasi nyt kysymykseen: \
<br>Pitääkö sarjakuvissa olla juoneen liittyvää ankanmetsästystä?\
<br>Miten arvelet että ${peer} valitsi?",
		 "feedbackChoices": "mouse",
		},
		{"peer":2,
		 "prompt":"<br>Huomaa, että toiset henkilöt voivat olla yksimielisiä tai erimielisiä kunkin esitetyn mielipiteen suhteen.\
<br>Pitääkö sarjakuvissa olla juoneen liittyvää ankanmetsästystä?\
<br>Miten arvelet että ${peer} valitsi?",
		 'feedbackPrompt': '<br>Voit parantaa omia arvauksiasi tarkkailemalla muiden tekemiä valintoja kokeen aikana.',
		 "feedbackChoices": "mouse",
		},
		{"phase":"MYSTERY",
		"prompt":"<br>Määräajoin (8 kysymyksen välein) näet kahden henkilön valinnat siten, että toinen kannattaa ensimmäistä kuvausta ja toinen toista kuvausta. Heidän valintansa osoitetaan nuolilla. Nämä henkilöt ovat samoja joiden päätöksiä arvioit jo aikaisemmin. Tehtävänäsi on arvioida kuvaukset uudelleen.<br>",
		 //Select the box you would prefer based on the other participants' choices to continue.
		 "peer1":1,
		 "peer2":2,
		 "mystery_questions": ['Kurssilla vietetään paljon vapaa-aikaa','Kurssilla syödään usein'],	
		 "response_ends_trial": true,
		},
	  ]}];

    var info_screen = {
      "type": "instructions",
      "show_clickable_nav": true,
      "key_forward": " ",
      "pages": ['<br><br>Harjoitus on nyt ohi. Seuraavaksi aloitamme kyselyn varsinaisilla kysymyksillä.<br><br><strong>Paina nappia jatkaaksesi.</strong>']	  
    };
    timeline.push(info_screen);
    return timeline;
}

var practice_timeline = practiceGenPoli({});

var toShuffle = shuffleTogether(stims.stimuli, stims.prompts);
stims.stimuli = toShuffle[0];
stims.prompts = toShuffle[1];

var timeline = [];

var welcome_block = {
    type: "text",
    text: "<div class='center-content'><br><br><br><br>Tervetuloa LEADBEHA kyselyyn!<br><br><p> <strong>Tekniset vaatimukset:</strong><br> Kysely vaatii Javascriptin toimiakseen.<br>Pyydämme varmuuden vuoksi laittamaan mainosten tai skriptien estäjät pois päältä kyselyn ajaksi.</p> <p>Ethän päivitä tai lataa sivua uudestaan kesken kyselyn.<br>Muutoin kysely on aloitettava kokonaan alusta ja kaikki edelliset vastaukset katoavat.</p><p>Klikkaa alla olevaa nappia jatkaaksesi.</p><input type='button' value='Aloita'/>",
    choices: 'mouse',
	on_finish: function(){  
		var progress = jsPsych.progress();
		console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');
		//jsPsych.setProgressBar(0.05)  $('#' + trial.prefix + 'progressbar-container').hide();
	}		
};

var comments_block = {
    type: 'survey-text-sam',
    questions: ['Jos haluat osallistua arvontaan, syötä email osoitteesi tai muu haluamasi yhteystieto','Avoimet kommentit ja palaute'],
    //value: MID,
    validation: [function(x){return true},function(x){return true}], // we don't really check these
    rows: [4,5],
    input_type: ['textarea','textarea'],
    preamble: ["<div> Haluaisimme vielä saada yhteystietosi arvontaa varten ja kuulla palautteesi kyselyyn liittyen. Nämä ovat vapaaehtoisia tietoja ja voit siirtyä suoraan eteenpäin.</div>"]	
};

var g = 'a'
var demo_block = {
    type: 'survey-text-sam',	
	questions: [
		'Oletko osallistunut täydennyskoulutukseen viimeisen 12kk aikana?',	
		'Mikä on sukupuolesi?',
		'Mikä on korkein tutkintosi?',
		'Mikä on ikäsi vuosissa?', // number
		'Mikä on ammattisi?', // text
		'Millä toimialla työskentelet?', // text
		'Kuinka monta vuotta olet ollut työelämässä yhteensä?', // number
	],
	value: [], // REMOVE IN PRODUCTION
	input_type: ['likert','likert','likert','text','text','text','text'], // ['text','text','text','text']
	label: [['en','kyllä'],['nainen','mies','en halua sanoa / muu'],['peruskoulu','ammattikoulu / lukio','korkeakoulu','lisensiaatti / tohtori','muu'],'','','',''], //['','','','']
    validation: [function(x){return (x!='undefined')},function(x){return (x!='undefined')},function(x){return (x!='undefined')},
		function(x){if (x=='') {return false;}; return ((Number(x)<=90) & (Number(x)>=18));},
		function(x){return x.length > 0;},
		function(x){return x.length > 0;},		
		function(x){if (x=='') {return false;}; return ((Number(x)>=0) & (Number(x)<=80));},
	],		
    validationMessage: [
		'täydennyskoulutus puuttuu',	
		'sukupuoli puuttuu',
		'tutkinto puuttuu',		
		'ikä virheellinen (oltava valillä 15...90 vuotta)',
		'ammatti puuttuu',
		'toimiala puuttuu',
		'työelämän pituus virheellinen (oltava välillä 0...80 vuotta)',
	],
    preamble:[" <div>\
    <h4>Osio 2</h4>\
    <p> Tässä osiossa tulet arvioimaan väitteitä liittyen työssäkäyvien henkilöiden täydennyskoulutuskursseihin. Sinun tulee arvioida yhteensä 48 väitettä. Tämä kyselyn loppuosa kestää tyypillisesti alle XX minuuttia. </p>\
    <p> Aluksi kysymme sinulta perustietoja. Vastaa alla oleviin kysymyksiin ja paina \"Lähetä vastaus\" nappia jatkaaksesi. </p>\
    </div>"],
    on_finish: function(trial_data){
      var gender = trial_data['Q1_Mikä_on_sukupuolesi?'];
      if (gender=='nainen') {
        g = 'f';
        jsPsych.data.addDataToLastTrial({gender: 'nainen'});
      } else if (gender == 'mies') {
        g = 'm';
        jsPsych.data.addDataToLastTrial({gender: 'mies'});
      }
      else {
        g = 'a';
        jsPsych.data.addDataToLastTrial({gender: 'muu'});
	  }
	  console.log('valittu sukupuoli ' + g)
	  var progress = jsPsych.progress();
	  console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');

		var current_stim = 0
		for(var i = 0; i < NBLOCKS; i++) {		
			var stim = stims.stimuli.splice(0,NSTIMS);
			var prompts = stims.prompts.splice(0,NSTIMS);
			var peer = peers[g][0].splice(0, NPEERS);
			var names = peers[g][1].splice(0, NPEERS);
			var opts = {
				includeLikert: false,
				testing: testing,
				stimDir: stims.stimDir,
				block_num: i,
				peerAgreement: [50, {percent: 50, ref: "A", func: inverseVotes}, {percent: peerC[i], ref: "B", func: addVotes}],
				testing: testing,
				peerCPercent: peerC[i],
				stim_regex: /.*\/(.*)\.jpg/,
				prompt_regex: /How (.*) is this.*/,
				timing: timing,
				you_timing: you_timing,
				mystery_questions : [main_questions[current_stim],main_questions[current_stim+1]]
				};

			  block = poliTimelineGenNames(stim, prompts, peer, names, opts);
			  block.type = 'similarity';
			  for(var j = 0; j < block.length; j++) {
				jsPsych.addNodeToEndOfTimeline(block[j], function(){});
			  }
			//jsPsych.endCurrentTimeline()
			
			lblock = {
				  type: 'survey-likert',
				  preamble: 'Arvio nyt kuinka paljon haluat osallistua kuvauksen mukaiselle kurssille asteikolla yhdestä kymmeneen (1...10). (1=en missään tapauksessa halua osallistua ... 10 = ehdottomasti haluan osallistua)',
				  questions: [main_questions[current_stim],main_questions[current_stim+1]],
				  location_after: "#jspsych-stim",  // put likert after main block, not sidebar table
				  //display_element: $("#jspsych-stim"),  // DOES NOT WORK
			}
			jsPsych.addNodeToEndOfTimeline(lblock)
			console.log('Block ' + String(i)+ ': question 1 = ' + opts.mystery_questions[0] + ', question 2 = ' + opts.mystery_questions[1])
			
			current_stim = current_stim+2 // proceed by two
		}
		jsPsych.addNodeToEndOfTimeline(comments_block);
		console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');
  }
};

var fullscreen_block = {
    "type": "instructions",
    "show_clickable_nav": true,
    "key_forward": "",
    "pages": ['Ole hyvä ja siirry kokoruudun tilaan, jollet jo ole sellaisessa. Paina joko F11 näppäintä tai valitse selaimestasi kokoruudun tila.<br><br><strong>Paina nappia jatkaaksesi.</strong>'],
	"on_finish": function(){  
		var progress = jsPsych.progress();
		console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');
	}
};

var practice_warning_block = {
    type: "instructions",
    show_clickable_nav: true,
	show_progress_bar: false,
    key_forward: "",
    pages: ['Seuraavaksi opit lisää kyselystä ja teet harjoitusosuuden.<br><br><strong>Paina nappia jatkaaksesi.</strong>'],
	on_finish: function(){  
		var progress = jsPsych.progress();
		console.log('You have completed approximately '+progress.percent_complete+'% of the experiment');
	}	
};

timeline.push(welcome_block);
timeline.push(likert_block);

main_questions.shuffle()
timeline.push(demo_block);
//timeline.push(fullscreen_block);
timeline.push(practice_warning_block);

timeline.push.apply(timeline,practice_timeline);  // appending list to list

peerC.shuffle();

jsPsych.pluginAPI.preloadImages(stims, function () {

    if (testing) {
      timeline = [id_block, demo_block];
      var fs = false;
    }
    else {
      var fs = true; // WAS true;   
    }

    jsPsych.init({
      timeline: timeline,
      show_progress_bar: true,
      fullscreen: fs,
      on_finish: function() {
        var data = jsPsych.data.getDataAsCSV();

     try {
       var d = jsPsych.data.getDataAsJSON({trial_type: 'survey-text'})
     }
     catch (e) {
		 console.log('ERROR: Could not retrieve data on finishing!')
	 }

     $('#jspsych-content').empty()
     .css('visibility', 'visible')
     .html('Kysely on ohi ja tiedot tallennettu! Kiitos osallistumisestasi ja kärsivällisyydestäsi.<br><br>' + subjID);

     var filename = subjID+'_'+study+'.csv';
     jsPsych.data.localSave(filename,'csv');
	 	 
    }
  });
});
