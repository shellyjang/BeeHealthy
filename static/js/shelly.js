$(function() {
	$( "#slider_votes" ).slider({
	orientation: "horizontal",
	range: "min",
	min: 0,
	max: 1000,
	step: 20,
	value: 1,
	// slide: function( event, ui) { normfunction() }
	});
});

$(function() {
	$( "#slider_alpha" ).slider({
	orientation: "horizontal",
	range: "min",
	min: 0,
	max: 1,
	step: 0.1,
	value: 0.,
	slide: function( event, ui) { normfunction() }
	});
});

function initialize() {
	var votes = $('#slider_votes').val();
	var alpha = $('#slider_alpha').val();
	recompute();
};

function recompute(ev, alpha, votes) {
	// console.log("I'm at recompute");
	if (ev)
	{ 
		//do something cool
	};
	var cond = "{{ cond }}";
	// console.log(cond);
  $.getJSON('/search_get',{alpha:alpha, votes:votes, cond:cond }, function(jsresult) {
		result = eval(jsresult);
		// console.log(typeof result);  
		var LIST = [0, 1, 2]	
		for(var i = 0; i < LIST.length; i++) {
			LIST[i] = result.out[i];
		};
		insertParameters(result.alpha, result.votes, LIST);		
		});
};

// initialize();

// function renderParameters(data_alpha, data_votes, data_out, ind) {
//     html = ''
// 		var alpha = data_alpha;
// 		var votes = data_votes;
// 		var out = data_out;
// 		var ind = ind;
// 		
// 		alpha = alpha.toString();
// 		votes = votes.toString();
// 		
// 		html += '<a style="top:0px; color: teal;">' +out[ind].treatment+ '</a>'
//     return $(html)
// }
function renderTreatments(data_alpha, data_votes, data_out, ind) {
		var alpha = data_alpha;
		var votes = data_votes;
		var out = data_out;
		var ind = ind;
				
		html = ''
		html += '<a href="' +out[ind].url+ '" target="_blank" style="position: absolute; top:20%; color: white; font-size:26px;">' +out[ind].treatment+ '</a>'
		// console.log(html)
    return $(html)
};

function renderModalText(data_alpha, data_votes, data_out, ind) {
		var alpha = data_alpha;
		var votes = data_votes;
		var out = data_out;
		var ind = ind;
		var star5 = ( Number(out[ind].major_improvement) ) / Number(out[ind].sum);
		var star4 = ( Number(out[ind].moderate_improvement) ) / Number(out[ind].sum);
		var star3 = ( Number(out[ind].no_effect) ) / Number(out[ind].sum);
		var star2 = ( Number(out[ind].slightly_worse) ) / Number(out[ind].sum);
		var star1 = ( Number(out[ind].much_worse) ) / Number(out[ind].sum);
		
		star5 = (100 * star5).toFixed(2);
		star4 = (100 * star4).toFixed(2);
		star3 = (100 * star3).toFixed(2);
		star2 = (100 * star2).toFixed(2);
		star1 = (100 * star1).toFixed(2);
		
		star5 = 'major improvement: ' +star5.toString();
		star4 = 'moderate improvement: ' +star4.toString();
		star3 = 'no effect: ' +star3.toString();
		star2 = 'slightly worse: ' +star2.toString();
		star1 = 'much worse: ' +star1.toString();
			
		html = ''
		html += '<h4 style="text-align: left;">' +star5+ '%</h4>'
		html += '<h4 style="text-align: left;">' +star4+ '%</h4>'
		html += '<h4 style="text-align: left;">' +star3+ '%</h4>'
		html += '<h4 style="text-align: left;">' +star2+ '%</h4>'
		html += '<h4 style="text-align: left;">' +star1+ '%</h4>'
		
		// console.log(html)
		// console.log(html)
    return $(html)
};

// function renderHoverText(data_alpha, data_votes, data_out, ind) {
// 		var alpha = data_alpha;
// 		var votes = data_votes;
// 		var out = data_out;
// 		var ind = ind;
// 		var star5 = ( Number(out[ind].major_improvement) ) / Number(out[ind].sum);
// 		var star4 = ( Number(out[ind].moderate_improvement) ) / Number(out[ind].sum);
// 		var star3 = ( Number(out[ind].no_effect) ) / Number(out[ind].sum);
// 		var star2 = ( Number(out[ind].slightly_worse) ) / Number(out[ind].sum);
// 		var star1 = ( Number(out[ind].much_worse) ) / Number(out[ind].sum);
// 		
// 		star5 = (100 * star5).toFixed(2);
// 		star4 = (100 * star4).toFixed(2);
// 		star3 = (100 * star3).toFixed(2);
// 		star2 = (100 * star2).toFixed(2);
// 		star1 = (100 * star1).toFixed(2);
// 		
// 		star5 = 'major improvement: ' +star5.toString();
// 		star4 = 'moderate improvement: ' +star4.toString();
// 		star3 = 'no effect: ' +star3.toString();
// 		star2 = 'slightly worse: ' +star2.toString();
// 		star1 = 'much worse: ' +star1.toString();
// 			
// 		html = ''
// 		html += '<h4 style="text-align: left;">' +star5+ '%</h4>'
// 		html += '<h4 style="text-align: left;">' +star4+ '%</h4>'
// 		html += '<h4 style="text-align: left;">' +star3+ '%</h4>'
// 		html += '<h4 style="text-align: left;">' +star2+ '%</h4>'
// 		html += '<h4 style="text-align: left;">' +star1+ '%</h4>'
// 		
// 		// console.log(html)
// 		// console.log(html)
//     return $(html)
// };

function renderModalIDs(data_alpha, data_votes, data_out, ind) {
		var alpha = data_alpha;
		var votes = data_votes;
		var out = data_out;
		var ind = ind;
			
		html = ''
		var HTMLstring = out[ind].treatment.split(' ')[0]
		// console.log(HTMLstring);
		html += '<div class="modal fade" id="Dark" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
		// console.log(html)
    return $(html)
};

function insertParameters(data_alpha, data_votes, data_out){
    //console.log(data[0][0]);
    // $('#connections').html(renderParameters(data_alpha, data_votes, data_out))
		// $('#newnew').html(renderParameters(data_alpha, data_votes))
		// $('#firstTreatment').html(renderParameters(data_alpha, data_votes, data_out, 0))
		// $('#secondTreatment').html(renderParameters(data_alpha, data_votes, data_out, 1))
		// $('#thirdTreatment').html(renderParameters(data_alpha, data_votes, data_out, 2))
		$('#firstTreatment').html(renderTreatments(data_alpha, data_votes, data_out, 0))
		$('#secondTreatment').html(renderTreatments(data_alpha, data_votes, data_out, 1))
		$('#thirdTreatment').html(renderTreatments(data_alpha, data_votes, data_out, 2))
		
		$('#firstModalText').html(renderModalText(data_alpha, data_votes, data_out, 0))		
		$('#secondModalText').html(renderModalText(data_alpha, data_votes, data_out, 1))		
		$('#thirdModalText').html(renderModalText(data_alpha, data_votes, data_out, 2))		
		
		// $('#firstModalID').html(renderModalIDs(data_alpha, data_votes, data_out, 0))
		// $('#secondModalID').html(renderModalIDs(data_alpha, data_votes, data_out, 1))
		// $('#thirdModalID').html(renderModalIDs(data_alpha, data_votes, data_out, 2))
};

$( "#firstTreatment" ).hover(
  function() {
		var ii = 0;
		insertHoverText(ii);
});
$( "#secondTreatment" ).hover(
  function() {
		var ii = 1;
		insertHoverText(ii);
});
	
$( "#thirdTreatment" ).hover(
  function() {
		var ii = 2;
		insertHoverText(ii);
});

function insertHoverText(ind) {
	var alpha = $('#slider_alpha').val();
	var votes = $('#slider_votes').val();
	var cond = "{{ cond }}";
	console.log(cond)
  $.getJSON('/search_get',{alpha:alpha, votes:votes, cond:cond }, function(jsresult) {
		result = eval(jsresult);
		var LIST = result.out[ind];
		var out = result.treatment_all;
	
		html = renderHoverText(alpha, votes, out, ind);					
		$('#treatment_desc').html(html)
	});
	
};


function renderHoverText(data_alpha, data_votes, data_out, ind) {
		var alpha = data_alpha;
		var votes = data_votes;
		var out = data_out;
		var ind = ind;
		var star5 = ( Number(out[ind].major_improvement) ) / Number(out[ind].sum);
		var star4 = ( Number(out[ind].moderate_improvement) ) / Number(out[ind].sum);
		var star3 = ( Number(out[ind].no_effect) ) / Number(out[ind].sum);
		var star2 = ( Number(out[ind].slightly_worse) ) / Number(out[ind].sum);
		var star1 = ( Number(out[ind].much_worse) ) / Number(out[ind].sum);

		star5 = (100 * star5).toFixed(1);
		star4 = (100 * star4).toFixed(1);
		star3 = (100 * star3).toFixed(1);
		star2 = (100 * star2).toFixed(1);
		star1 = (100 * star1).toFixed(1);

		star5 = 'major improvement: ' +star5.toString();
		star4 = 'moderate improvement: ' +star4.toString();
		star3 = 'no effect: ' +star3.toString();
		star2 = 'slightly worse: ' +star2.toString();
		star1 = 'much worse: ' +star1.toString();
	
		html = ''
		html += '<h5 style="text-align: left;">' +star5+ '%</h5>'
		html += '<h5 style="text-align: left;">' +star4+ '%</h5>'
		html += '<h5 style="text-align: left;">' +star3+ '%</h5>'
		html += '<h5 style="text-align: left;">' +star2+ '%</h5>'
		html += '<h5 style="text-align: left;">' +star1+ '%</h5>'

		// console.log(html)
		// console.log(html)
    return $(html)
};

$('#slider_votes').slider().on('slideStop', function(ev){
	var alpha = $('#slider_alpha').val()
	var votes = $('#slider_votes').val()
	// console.log('javascript: alpha = ' +alpha+ ', votes = ' +votes)
	
	recompute(ev, alpha, votes);
});	
// $('#slider_price').slider().on('slideStop', function(ev){
	// recompute(ev);
// })
$('#slider_alpha').slider().on('slideStop', function(ev){
	var alpha = $('#slider_alpha').val()
	var votes = $('#slider_votes').val()
	console.log('alpha = ' +alpha+ ', votes = ' +votes)
	
	recompute(ev, alpha, votes);
	console.log('I sent it to recompute');
});	

$(document).ready(function() {
   $("#MyModal").modal();
});

$(function (){
  $('[data-toggle="modal"]')
  .popover({trigger: 'click', html: 'true', placement: "bottom"})
  .click(function(e) {e.preventDefault();});
});