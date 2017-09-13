define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('reportBuilderCtrl', ['$scope', function ($scope) {
    	console.log("hi");
    	/*
    	console.log("hi");
    	
    	
    	$scope.simpleBarChartShow = false;
    	To avoid $apply is already in progress error. then instead of $scope.$apply use $scope.safeApply
		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};
		fix height of main portion
		$scope.resizeDashboard= function (){
			$scope.safeApply(function(){
				console.log("height", window.innerHeight-angular.element("#header").outerHeight()-angular.element("footer").outerHeight());
				angular.element("#componentPanel").outerHeight(window.innerHeight-angular.element("#header").outerHeight()-angular.element("footer").outerHeight()-100);
				angular.element("#reportPanel").outerHeight(window.innerHeight-angular.element("#header").outerHeight()-angular.element("footer").outerHeight()-100);
			});	
		}
		$scope.resizeDashboard();
		window.addEventListener("resize", function(){
			$scope.resizeDashboard();
		});
		fix height of main portion ends
*/
		//bootstrap report builder js starts
		var webpage = "";
		function supportstorage() {
			 if (typeof window.localStorage=='object')
				 return true;
			else
				return false;
		}

		function handleSaveLayout() {
			var e = $(".demo").html();
			if (!stopsave && e != window.demoHtml) {
				stopsave++;
				window.demoHtml = e;
				saveLayout();
				stopsave--;
			}
		}

		var layouthistory;
		function saveLayout(){
			var data = layouthistory;
			if (!data) {
				data={};
				data.count = 0;
				data.list = [];
			}
			if (data.list.length>data.count) {
				for (i=data.count;i<data.list.length;i++)
					data.list[i]=null;
			}
			data.list[data.count] = window.demoHtml;
			data.count++;
			if (supportstorage()) {
				localStorage.setItem("layoutdata",JSON.stringify(data));
			}
			layouthistory = data;
			
		}


		// start 


		function saveLayout1(r_response){
			console.log("parameter------",r_response);
			var data = r_response;
			
			data = window.demoHtml;
			
			if (supportstorage()) {
				localStorage.setItem("layoutdata",JSON.stringify(data));
			}
			layouthistory = data;
			
			
		}



		 function downloadLayout(){

			$.ajax({
				type: "POST",
				url: "/build/downloadLayout",
				data: { layout: $('#download-layout').html() },
				success: function(data) { window.location.href = '/build/download'; }
			});
		}

		function downloadHtmlLayout(){
			$.ajax({
				type: "POST",
				url: "/build/downloadLayout",
				data: { layout: $('#download-layout').html() },
				success: function(data) { window.location.href = '/build/downloadHtml'; }
			});
		}

		function undoLayout() {
			var data = layouthistory;
			//console.log(data);
			if (data) {
				if (data.count<2) return false;
				window.demoHtml = data.list[data.count-2];
				data.count--;
				$('.demo').html(window.demoHtml);
				if (supportstorage()) {
					localStorage.setItem("layoutdata",JSON.stringify(data));
				}
				return true;
			}
			return false;
			
		}

		function redoLayout() {
			var data = layouthistory;
			if (data) {
				if (data.list[data.count]) {
					window.demoHtml = data.list[data.count];
					data.count++;
					$('.demo').html(window.demoHtml);
					if (supportstorage()) {
						localStorage.setItem("layoutdata",JSON.stringify(data));
					}
					return true;
				}
			}
			return false;
			
		}

		function handleJsIds() {
			handleModalIds();
			handleAccordionIds();
			handleCarouselIds();
			handleTabsIds();
		}
		function handleAccordionIds() {
			var e = $(".demo #myAccordion");
			var t = randomNumber();
			var n = "accordion-" + t;
			var r;
			e.attr("id", n);
			e.find(".accordion-group").each(function(e, t) {
				r = "accordion-element-" + randomNumber();
				$(t).find(".accordion-toggle").each(function(e, t) {
					$(t).attr("data-parent", "#" + n);
					$(t).attr("href", "#" + r);
				});
				$(t).find(".accordion-body").each(function(e, t) {
					$(t).attr("id", r);
				});
			});
		}
		function handleCarouselIds() {
			var e = $(".demo #myCarousel");
			var t = randomNumber();
			var n = "carousel-" + t;
			e.attr("id", n);
			e.find(".carousel-indicators li").each(function(e, t) {
				$(t).attr("data-target", "#" + n);
			});
			e.find(".left").attr("href", "#" + n);
			e.find(".right").attr("href", "#" + n);
		}
		function handleModalIds() {
			var e = $(".demo #myModalLink");
			var t = randomNumber();
			var n = "modal-container-" + t;
			var r = "modal-" + t;
			e.attr("id", r);
			e.attr("href", "#" + n);
			e.next().attr("id", n);
		}
		function handleTabsIds() {
			var e = $(".demo #myTabs");
			var t = randomNumber();
			var n = "tabs-" + t;
			e.attr("id", n);
			e.find(".tab-pane").each(function(e, t) {
				var n = $(t).attr("id");
				var r = "panel-" + randomNumber();
				$(t).attr("id", r);
				$(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r);
			});
		}
		function randomNumber() {
			return randomFromInterval(1, 1e6);
		}
		function randomFromInterval(e, t) {
			return Math.floor(Math.random() * (t - e + 1) + e);
		}
		function gridSystemGenerator() {
			$(".lyrow .preview input").bind("keyup", function() {
				var e = 0;
				var t = "";
				var n = $(this).val().split(" ", 12);
				$.each(n, function(n, r) {
					e = e + parseInt(r);
					t += '<div class="span' + r + ' column"></div>';
				});
				if (e == 12) {
					$(this).parent().next().children().html(t);
					$(this).parent().prev().show();
				} else {
					$(this).parent().prev().hide();
				}
			});
		}
		function configurationElm(e, t) {

			$(".demo").delegate(".configuration > a", "click", function(e) {
				e.preventDefault();
				var t = $(this).parent().next().next().children();
				$(this).toggleClass("active");
				t.toggleClass($(this).attr("rel"));
			});
			$(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
				e.preventDefault();
				var t = $(this).parent().parent();
				var n = t.parent().parent().next().next().children();
				t.find("li").removeClass("active");
				$(this).parent().addClass("active");
				var r = "";
				t.find("a").each(function() {
					r += $(this).attr("rel") + " ";
				});
				t.parent().removeClass("open");
				n.removeClass(r);
				n.addClass($(this).attr("rel"));
			});
		}
		function removeElm() {
			$(".demo").delegate(".remove", "click", function(e) {
				e.preventDefault();
				$(this).parent().remove();
				if (!$(".demo .lyrow").length > 0) {
					clearDemo();
				}
			});
		}
		function clearDemo() {
			$(".demo").empty();
			layouthistory = null;
			if (supportstorage())
				localStorage.removeItem("layoutdata");
		}
		function removeMenuClasses() {
			$("#menu-layoutit li button").removeClass("active");
		}
		function changeStructure(e, t) {
			$("#download-layout ." + e).removeClass(e).addClass(t);
		}
		function cleanHtml(e) {
			$(e).parent().append($(e).children().html());
		}
		function downloadLayoutSrc() {
			var e = "";
			$("#download-layout").children().html($(".demo").html());
			var t = $("#download-layout").children();
			console.log('-----downloadLayoutSrc---',t);
			console.log('-----gdxgdxsg---',t.context.defaultView.demoHtml);
			var sourceCode=t.context.defaultView.demoHtml;
			t.find(".preview, .configuration, .drag, .remove").remove();
			t.find(".lyrow").addClass("removeClean");
			t.find(".box-element").addClass("removeClean");
			t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".lyrow .lyrow .removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".lyrow .removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".removeClean").each(function() {
				cleanHtml(this);
			});
			t.find(".removeClean").remove();
			$("#download-layout .column").removeClass("ui-sortable");
			$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
			if ($("#download-layout .container").length > 0) {
				changeStructure("row-fluid", "row");
			}
			formatSrc = $.htmlClean($("#download-layout").html(), {
				format: true,
				allowedAttributes: [
					["id"],
					["class"],
					["data-toggle"],
					["data-target"],
					["data-parent"],
					["role"],
					["data-dismiss"],
					["aria-labelledby"],
					["aria-hidden"],
					["data-slide-to"],
					["data-slide"]
				]
			});
			
			$("#download-layout").html(sourceCode);
			$("#downloadModal textarea").empty();
			$("#downloadModal textarea").val(sourceCode);
			webpage = sourceCode;
		}

		var currentDocument = null;
		var timerSave = 1000;
		var stopsave = 0;
		var startdrag = 0;
		var demoHtml = $(".demo").html();
		var currenteditor = null;

		function restoreData(){
			if (supportstorage()) {
				layouthistory = JSON.parse(localStorage.getItem("layoutdata"));
				if (!layouthistory) return false;
				if(layouthistory.list != undefined && layouthistory.count != undefined){
				window.demoHtml = layouthistory.list[layouthistory.count-1];
				}
				if (window.demoHtml) $(".demo").html(window.demoHtml);
			}
		}

		function initContainer(){
			$(".demo, .demo .column").sortable({
				connectWith: ".column",
				opacity: .35,
				handle: ".drag",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			configurationElm();
		}
		$(document).ready(function() {
			CKEDITOR.disableAutoInline = true;
			restoreData();
			var contenthandle = CKEDITOR.replace( 'contenteditor' ,{
				language: 'en',
				contentsCss: ['scripts/css/bootstrap-combined.min.css'],
				allowedContent: true
			});
			// $("body").css("min-height", $(window).height() - 50);
			// $(".demo").css("min-height", $(window).height() - 130);
			$(".sidebar-nav .lyrow").draggable({
				connectToSortable: ".demo",
				helper: "clone",
				handle: ".drag",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				drag: function(e, t) {
					t.helper.width(400);
				},
				stop: function(e, t) {
					$(".demo .column").sortable({
						opacity: .35,
						connectWith: ".column",
						start: function(e,t) {
							if (!startdrag) stopsave++;
							startdrag = 1;
						},
						stop: function(e,t) {
							if(stopsave>0) stopsave--;
							startdrag = 0;
						}
					});
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			$(".sidebar-nav .box").draggable({
				connectToSortable: ".column",
				helper: "clone",
				handle: ".drag",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				drag: function(e, t) {
					t.helper.width(400);
				},
				stop: function() {
					handleJsIds();
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			initContainer();
			$('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
				e.preventDefault();
				currenteditor = $(this).parent().parent().find('.view');
				var eText = currenteditor.html();
				contenthandle.setData(eText);
			});
			$("#savecontent").click(function(e) {
				e.preventDefault();
				currenteditor.html(contenthandle.getData());
			});
			$("[data-target=#downloadModal]").click(function(e) {
				e.preventDefault();
				downloadLayoutSrc();
			});
			$("[data-target=#shareModal]").click(function(e) {
				e.preventDefault();
				handleSaveLayout();
			});
			$("#download").click(function() {
				downloadLayout();
				return false;
			});
			$("#downloadhtml").click(function() {
				downloadHtmlLayout();
				return false;
			});
			$("#edit").click(function() {
				$("body").removeClass("devpreview sourcepreview");
				$("body").addClass("edit");
				removeMenuClasses();
				$(this).addClass("active");
				return false;
			});
			$("#clear").click(function(e) {
				e.preventDefault();
				clearDemo();
			});
			$("#devpreview").click(function() {
				$("body").removeClass("edit sourcepreview");
				$("body").addClass("devpreview");
				removeMenuClasses();
				$(this).addClass("active");
				return false;
			});
			$("#sourcepreview").click(function() {
				$("body").removeClass("edit");
				$("body").addClass("devpreview sourcepreview");
				removeMenuClasses();
				$(this).addClass("active");
				return false;
			});
			$("#fluidPage").click(function(e) {
				e.preventDefault();
				changeStructure("container", "container-fluid");
				$("#fixedPage").removeClass("active");
				$(this).addClass("active");
				downloadLayoutSrc();
			});
			$("#fixedPage").click(function(e) {
				e.preventDefault();
				changeStructure("container-fluid", "container");
				$("#fluidPage").removeClass("active");
				$(this).addClass("active");
				downloadLayoutSrc();
			});
			$(".nav-header").click(function() {
				$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
				$(this).next().slideDown();
			});
			$('#undo').click(function(){
				stopsave++;
				if (undoLayout()) initContainer();
				stopsave--;
			});
			$('#redo').click(function(){
				stopsave++;
				if (redoLayout()) initContainer();
				stopsave--;
			});
			removeElm();
			gridSystemGenerator();
			setInterval(function() {
				handleSaveLayout();
			}, timerSave);
		        var prevalue_sv = $('.sidebar-nav').css('overflow');
		        $('.popover-info').hover(function(){
		               $('.sidebar-nav').css('overflow', 'inherit'); 
		        }, function(){
		               $('.sidebar-nav').css('overflow', prevalue_sv);
		        });
		});

		var webpaget ="";
		 
		function saveHtml()
			{
				    var webpageParam;
				    var linkArray =[];
				    var links = document.getElementsByTagName("link");
				    var cpath = window.location.href;
		            cpath = cpath.substring(0, cpath.lastIndexOf("/"));
					webpaget = '<html>\n<head>\n<script type="text/javascript" src="'+cpath+'/scripts/js/jquery-2.0.0.min.js"></script>\n<script type="text/javascript" src="'+cpath+'/scripts/js/jquery-ui.js"></script>\n<link href="'+cpath+'/scripts/css/bootstrap-combined.min.css" rel="stylesheet" media="screen">\n<script type="text/javascript" src="'+cpath+'/scripts/js/bootstrap.min.js"></script>\n';
					var webLinks="";
					for (var i = 0, len = links && links.length; i < len; ++i)
						{
					     		var link = links[i];
					     		var href = link.href;
					         	webLinks=webLinks+' <link rel="import" href="'+href+'">\n';
					         }
					webpaget=  webpaget+ webLinks +' </head>\n<body>\n'+ webpage +'\n</body>\n</html>'  

					if (navigator.appName =="Microsoft Internet Explorer" && window.ActiveXObject)
					{
					var locationFile = location.href.toString();
					var dlg = false;
					with(document){
					ir=createElement('iframe');
					ir.id='ifr';
					ir.location='about.blank';
					ir.style.display='none';
					body.appendChild(ir);
					with(getElementById('ifr').contentWindow.document){
					open("text/html", "replace");
					charset = "utf-8";
					write(webpaget);
					close();
					document.charset = "utf-8";
					console.log('--document  in if part---',document);
					console.log('webpage----',webpaget);
					dlg = execCommand('SaveAs', false, locationFile+"webpage.html");
					}
		            return dlg;
					}
					}
					else{
					webpaget = webpaget;
					var blob = new Blob([webpaget], {type: "text/html;charset=utf-8"});
					console.log('--document  in else part---',document.head);
			
				    $.ajax({
		            type: 'POST',
				    url: "http://localhost:8081/pmms-api/saveLayout",
				    data:{layout : webpaget},
				   
			        success: function(resultData) 
				    { 
		            console.log('success');
				    alert("Your report has been successfully saved and your report reference number is" + resultData)
				    },
				    error: function(xhr)
				    {
				    console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
				    } 
					});
				saveAs(blob, "webpage.html");
				}
		}
		  ------------------- Removing extra classes from the buttton-----------------------------  
			
		       function removeClasses(){
					//$( "div:even" ).remove( ".box" );
					 $( "div" ).remove( ".preview" );
				     $( "a" ).remove();
					 $( "span" ).remove( "drag" );
		             $( "span" ).remove( ".configuration" );
					

				}
			 ------------------- responsive function-----------------------------  	 
				
		      function resizeCanvas(size)
		      {

		      var containerID = document.getElementsByClassName("changeDimension");
		      var containerDownload = document.getElementById("download-layout").getElementsByClassName("container-fluid")[0];
		      var row = document.getElementsByClassName("demo ui-sortable");
		      var container1 = document.getElementsByClassName("container1");
		      if (size == "md")
		      {
		      $(containerID).width('id', "MD");
		      $(row).attr('id', "MD");
		      $(container1).attr('id', "MD");
		      $(containerDownload).attr('id', "MD");
		      }
		      if (size == "lg")
		      {
		      $(containerID).attr('id', "LG");
		      $(row).attr('id', "LG");
		      $(container1).attr('id', "LG");
		      $(containerDownload).attr('id', "LG");
		      }
		      if (size == "sm")
		      {
		      $(containerID).attr('id', "SM");
		      $(row).attr('id', "SM");
		      $(container1).attr('id', "SM");
		      $(containerDownload).attr('id', "SM");
		      }
		      if (size == "xs")
		      {
		      $(containerID).attr('id', "XS");
		      $(row).attr('id', "XS");
		      $(container1).attr('id', "XS");
		      $(containerDownload).attr('id', "XS");

		      }
		      }

		 ------------------- responsive function Ends-----------------------------  
				function reloadHomePage(){
					location.reload();
					document.getElementById("changeDimensionId").innerHTML="";
				}
				
				function openMyModal(){
					$('#myModal').modal('show');
				}
				  ------------------- Setting the attribute of the Report-----------------------------  
				 function submitQuery(){
					var queryNm = document.getElementById("queryNameId").value;
					
					 $.ajax({
		            type: 'POST',
				    url: "http://localhost:8081/pmms-api/submitQuery",
				    data:{queryNm:'queryNm'},
				   
			        success: function(resultData) 
				    { 
		            console.log('success');
				    alert("Your query has been saved,Kindly use the same query name for future reference"  )
				    },
				    error: function(xhr)
				    {
				    console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
				    } 
					});
					
				     $('#myAttributeModal').modal('hide');
				 }
				 
				 function saveQuery()
				 {
					var queryNm = document.getElementById("queryNameId").value;
					var queryDesc= document.getElementById("queryDescID").value;
					 $.ajax({
		            type: 'POST',
				    url: "http://localhost:8081/pmms-api/saveQuery",
				    data:{queryNm:'queryNm', queryDesc:'queryDesc'},
				   
			        success: function(resultData) 
				    { 
		            console.log('success');
				    alert("Your query has been saved,Kindly use the same query name for future reference"  )
				    },
				    error: function(xhr)
				    {
				    console.log('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
				    } 
					});
					$('#SaveQueryModal').modal('hide');
				 }
				 
				 ------------------- reloading the report by passing the id-----------------------------  
				  function reloadFunction(){ 
		 
					
					var responseTextValue; 
					var id = document.getElementById("textId").value; 
				   
				    var xhttp = new XMLHttpRequest(); 
					xhttp.open("GET", "http://localhost:8081/pmms-api/getLayoutById?id="+id+"", true); 
					xhttp.send(); 
				    xhttp.onreadystatechange = function() { 
					if (this.readyState == 4 && this.status == 200) {
						
				    replacing all the extra braces and double quotes
					window.responseTextValue=this.responseText.replace(/(?:\\[tn])+/g, "");
					//window.responseTextValue = window.responseTextValue.replace(/[\[\]']+/g,'');
					window.responseTextValue = window.responseTextValue.replace(/\\/g, '');
					
					
					var result = window.responseTextValue.substring(1, window.responseTextValue.length-1);
					
					console.log("Before apending",result)
					 creating custom Div and Button
						var myDiv = document.createElement("div");
						myDiv.setAttribute("id","myDivId");
						myDiv.innerHTML=result;
						console.log("After apending",result)
					Create a <button> element
						var cancelBtn = document.createElement("BUTTON");         
						var cancelBtnName = document.createTextNode("Cancel");
						cancelBtn.setAttribute("id","cancelBtnId");
						cancelBtn.setAttribute("onclick","reloadHomePage()");
						cancelBtn.appendChild(cancelBtnName);
						
						var attributeBtn = document.createElement("BUTTON");         
						var attributeBtnName = document.createTextNode("Attributes");
						attributeBtn.setAttribute("id","attributeBtnId");
						attributeBtn.setAttribute("data-target","#myAttributeModal");
						//$('#attributeBtnId').attr('data-toggle','modal'); 
						attributeBtn.setAttribute('data-toggle','modal');
						attributeBtn.appendChild(attributeBtnName);
						
						
						myDiv.appendChild(cancelBtn);
						myDiv.append('');
						myDiv.appendChild(attributeBtn);
						
						document.getElementById("changeDimensionId").innerHTML="";
						
						
						document.getElementById("changeDimensionId").append(myDiv);
						//console.log("Before classes remove---",document.getElementById("changeDimensionId").innerHTML)
					    removeClasses();
						//console.log("After classes remove---",document.getElementById("changeDimensionId").innerHTML)
						
						
						
				  
					 } 
				 }; 
				   
				  
			}

		//bootstrap report builder js ends
		
		
		
    //*/
    }]);
});
