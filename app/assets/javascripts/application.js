// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require backbone
//= require handlebars
//= require_self
//= require_tree ./backbone/routers
//= require_tree ./backbone/models
//= require_tree ./backbone/collections
//= require_tree ./backbone/views
//= require_tree ./templates
//= require_tree .

//////////////////////////////////////
//         GLOBAL VARIABLES         //
//////////////////////////////////////

// currentColor is the color that the cells would change to if clicked.
var currentColor = '#000';

function setCurrentColor(selection){
	return currentColor = selection;
}

//////////////////////////////////////
//              ON_LOAD             //
//////////////////////////////////////

var graphModel = null;

// runs when the page has loaded
var ready;
ready = function() {	
	console.log('the page has loaded');	

	// checks to see if the container graphs-new is on the page. if so then it will run the js on page load
	if ($('#graphs-new').length === 1){
		if (graphModel == null){
			console.log('got here');
			graphModel = new Graph;
			graphModel.drawGraphTemplate();
			//graphModel.showInfo();
			graphModel.graphInfoForDevOnly();	
		}
		else {
			console.log("graph model is present");
			currentColor = '#000';
		}
		addEventListeners();
	}

	function addEventListeners(){
		console.log('event listeners added');

		// gets the graph and adds a click listener to each cell
		$('#graph').click(function(evt){
			// gets the position of the mouse
	    var mousePos = getMousePos(graphModel.element, evt);
	    var i = Math.floor(mousePos.x/20);
	    var j = Math.floor(mousePos.y/20);
	    graphModel.renderCell(i,j);
	    graphModel.updateLayout(i,j,currentColor);
  	});

		// add click listener to the download btn
		$('#downloadLnk').click(function(){
			console.log('graph has been downloaded');
		  this.href = graphModel.data();
		});

		// adds click listener to swatches btn 
		$('.swatch').click(function(){
			$('.swatch').removeClass('activeSwatch');
			$(this).addClass('activeSwatch');
		});

		//adds click event listener to savegraph button. saves button on click
		$("#saveGraph").click(function(){
			alert('Graph Was Saved!');
			// $('#graphs-new').prepend('Graph Was Saved!' + '<br>');
			graphModel.save();
		});

		$('#deleteGraph').click(function(){
			console.log('delete button was clicked');
			if (graphModel.id == null){
				console.log('Graph is not saved');
			}
			else {
				console.log(graphModel.id);
				$.ajax({
    			type: "DELETE",
    			url: "/graphs/" + graphModel.id,
			    success: function(data){   
			    	console.log("success!");
			      window.location = "/users/" + $('#graphs-new').attr('data-userid');
			    }
				});
			}
		});
	}
}

$(document).ready(ready);
$(document).on('page:load', ready);

// gets the mouse position
function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

