(function($) {
	
	$.fn.scheduler = function(params) {
		
		// Get the days of the current week or a defined week (by 'date' parameter)
		function getWeek(date) {
			var daysArray = Array();
			var date = date || -1;
			var today;
			
			if (date == -1) {
				today = new Date();
			} else {
				today = new Date(date);
			}
			
			var dayIndexFromWeek = today.getDay();
			
			today.addDays(-dayIndexFromWeek-1);
			
			firstDay = new Date(today.toString());
			firstDay.addDays(1);
			
			for (var i = 0; i < 7; i++) {
				daysArray.push(today.addDays(1).getDate() + '/' + (today.getMonth() + 1));
				
				// Add day informations to each TD
				var monthTwoNumbers = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
				var dayTwoNumbers = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
				var dateYearMonthDay = today.getFullYear() + '-' + monthTwoNumbers + '-' + dayTwoNumbers;
				
				$('#agenda tr td').eq(i).attr('data-date', dateYearMonthDay);
			}
			
			lastDay = new Date(today.toString());
			
			return daysArray;
		}
		
		// Fill the agenda header (name + date)
		function fillTh(th, isCreation) {
			var isCreation = isCreation || false;
			
			if (isCreation) {
				th.appendChild(document.createTextNode(daysList[i] + ' ' + daysNum[i]));
				$('#agenda thead tr').append(th);
			} else {
				th.each(function(index, element) {
					$(element).html((document.createTextNode(daysList[index] + ' ' + daysNum[index])));
				});
			}
		}
		
		// Read the eventList variable and create the events
		function readEvents() {
			// Hide all events on the screen
			$('.hourSelected').hide();
			
			var $tmpTd = $('#agenda tbody tr td');
			
			$.each(eventList, function(key, value) {
				$tmpTd.each(function() {
					if ($(this).attr('data-date') == value[0]) {
						value[1].show();
						
						return false;
					}
				});
			});
		}
		
		// Action on each selected element in the group
		function eltSelection(event, ui) {
			if (ui.selected.nodeName == 'SPAN') {
				lastSelectedElt.push($(ui.selected));
			}
		}
		
		// Action after the end of selection
		function selectionEnd(event, ui) {
			if (lastSelectedElt.length > 0) {
				var groupLength = lastSelectedElt.length;
				var $columnId = $('#agenda tbody tr td').index(event.target);
				
				var evtHeight = groupLength * (params.cell_height + BORDER_CELL_LENGTH) - 2 * BORDER_CELL_LENGTH;
				var evtTop = $(lastSelectedElt[0]).offset().top;
				var evtBottom = evtTop + evtHeight;
				var evtLeft = TAB_LEFT + ($columnId * (params.cell_width + BORDER_CELL_LENGTH)) + 1;
				
				if ($.browser.msie && parseInt($.browser.version, 10) === 9) {
					evtLeft -= 1;
				}
				
				var boolCollision = false;
				
				// Check the collision between old elements and the created one
				$('#agenda tbody tr td:eq(' + $columnId + ') div:not(.ui-selectee)').each(function() {
					var evtOldStart = $(this).offset().top;
					var evtOldEnd = evtOldStart + $(this).height();
					
					if ((evtBottom >= evtOldStart && evtOldEnd >= evtTop) || (evtOldEnd >= evtTop && evtBottom >= evtOldStart) ||
						(evtBottom <= evtOldEnd && evtOldStart <= evtTop) || (evtOldEnd <= evtBottom && evtTop <= evtOldStart)) {
						boolCollision = true;
						return false;
					}
				});
				
				if (!boolCollision) {
					var evt = document.createElement('div');
					evt.className = 'hourSelected';
					
					// Add attribute with the start hour and the duration (number of half-hours) on the created event
					$(evt).attr('data-start', $(lastSelectedElt[0]).attr('data-time'));
					$(evt).attr('data-duration', lastSelectedElt.length);
					
					$(evt).css({
						width: params.cell_width,
						height: evtHeight,
						top: evtTop,
						left: evtLeft
					});
					
					$('#agenda tbody tr td:eq(' + $columnId + ')').append(evt);
					
					$lastCreatedElt = $(evt);
					
					// Show the create form
					Shadowbox.open({
						content: $('#formCreationEvt').html(),
						title: 'Event properties',
						player: 'html',
						width: 360,
						height: 325
					});
					
					$(evt)
					.draggable({
						containment: '#agenda tbody tr',
						grid: [params.cell_width + BORDER_CELL_LENGTH, params.cell_height + BORDER_CELL_LENGTH],
						start: dragStart,
						stop: dragStop
					})
					.droppable({
						tolerance: 'touch',
						drop: function(event, ui) {
							$(ui.draggable).draggable('disable');
							
							isDropped = true;
							
							$(ui.draggable).animate({
								left: lastEvtPosX,
								top: lastEvtPosY
							}, 'fast', function() {
								$(ui.draggable).draggable('enable');
							});
						}
					})
					.resizable({
						containment: '#fixResize',
						handles: 's',
						minHeight: EVT_MIN_HEIGHT,
						grid: [0, params.cell_height + BORDER_CELL_LENGTH],
						resize: function(event, ui) {
							//ui.element.children('.evtName').hide();
							ui.element.children('.evtName').fadeOut('fast');
						},
						stop: function(event, ui) {
							var isCollide = false;
							
							var oldEvtHeight = ui.originalSize.height;
							
							var evtTop = ui.position.top;
							var evtHeight = ui.size.height;
							var evtBottom = evtTop + evtHeight;
							
							ui.element.parent().children('div:not(.ui-selectee)').not(ui.element).each(function() {
								var tmpTop = $(this).offset().top;
								
								if (evtTop < tmpTop && evtBottom >= tmpTop) {
									isCollide = true;
									
									ui.element.animate({
										height: oldEvtHeight
									}, 'fast', function() {
										if (ui.element.height() > EVT_MIN_HEIGHT) {
											//ui.element.children('.evtName').show();
											ui.element.children('.evtName').fadeIn('fast');
										}
									});
									
									return false;
								}
							});
							
							if (!isCollide) {
								if (ui.element.height() > EVT_MIN_HEIGHT) {
									//ui.element.children('.evtName').show();
									ui.element.children('.evtName').fadeIn('fast');
								}
								
								ui.element.children('.evtName').css({
									height: ui.element.css('height'),
									lineHeight: ui.element.css('height')
								});
								
								var durationNew = 0;
								var tmpHeight = ui.element.height();
								
								if (tmpHeight == EVT_MIN_HEIGHT) {
									durationNew = 1;
								} else {
									durationNew = (tmpHeight - EVT_MIN_HEIGHT) / (params.cell_height + BORDER_CELL_LENGTH) + 1;
								}
								
								if (durationNew != ui.element.attr('data-duration')) {
									ui.element.attr('data-duration', durationNew);
								}
							}
						}
					})
					.dblclick(function() {
						isModif = true;
						$modifElt = $(evt);
						
						// Activate the delete button
						$('#delCreationEvt').attr('disabled', false);
						
						// Show the modification form
						Shadowbox.open({
							content: $('#formCreationEvt').html(),
							title: 'Event properties',
							player: 'html',
							width: 360,
							height: 325
						});
					});
					
					$(evt).children('.ui-resizable-handle').css('width', params.cell_width);
					
					lastColumnId = $('#agenda tbody tr td:eq(' + $columnId + ')').attr('data-date');
				}
				
				// Reset the array that contains last selected elements
				lastSelectedElt = new Array();
			}
			
			$('body').css('overflow', 'visible');
		}
		
		// Save (temporary) the position of the last moving element
		function dragStart(event, ui) {
			lastEvtPosX = ui.offset.left;
			lastEvtPosY = ui.offset.top;
			
			columnDayStart = ui.helper.parent();
		}
		
		// Move the element div into the correct day div
		function dragStop(event, ui) {
			if (!isDropped) {
				var evt = ui.helper;
				
				var evtLeft = evt.offset().left;
				var evtRight = evtLeft + evt.width();
				
				var columnDate = -1;
				var idColumn = -1;
				
				$('#agenda tbody tr td').each(function(index) {
					var tdLeft = $(this).offset().left;
					var tdRight = tdLeft + $(this).width();
					
					if (tdRight >= evtRight && evtLeft >= tdLeft) {
						$(this).append(evt);
						
						columnDate = $('#agenda tbody tr td:eq(' + index + ')').attr('data-date');
						idColumn = index;
						
						return false;
					}
				});
				
				var testDate = new Date();
				testDate.setSeconds(0);
				testDate.setMinutes($(evt).attr('data-start').split(':')[1]);
				testDate.setHours($(evt).attr('data-start').split(':')[0]);
				
				// Add (or substract) vertical distance between the old and new position  ;  Multiply the result by a half-hour (30)
				testDate.addMinutes(((ui.offset.top - lastEvtPosY) / (params.cell_height + BORDER_CELL_LENGTH)) * 30);
				
				var tmpDate = $(evt).parent().attr('data-date');
				var tmpHour = (testDate.getHours() < 10 ? '0' + testDate.getHours() : testDate.getHours()) + ':' + (testDate.getMinutes() < 10 ? '0' + testDate.getMinutes() : testDate.getMinutes());
				
				$(evt).attr('data-start', tmpHour);
				
				$.each(eventList, function(key, value) {
					if ($(value[1]).attr('data-id') == $(evt).attr('data-id')) {
						value[0] = columnDate;
						
						return false;
					}
				});
				
				highlightEvents();
			} else {
				isDropped = false;
			}
		}
		
		// Update masks with the vertical slider's value
		function limitsChange(event, ui) {
			params.hour_mask[MASK_START] = HOUR_END - parseInt(ui.values[1], 10);
			params.hour_mask[MASK_END] = HOUR_END - parseInt(ui.values[0], 10);
			LINES_NUMBER = (params.hour_mask[MASK_END] - params.hour_mask[MASK_START]) * 2;
			
			$('#topMask').css('height', params.hour_mask[MASK_START] * ((params.cell_height + BORDER_CELL_LENGTH) * 2));

			$('#bottomMask').css('height', (HOUR_END - params.hour_mask[MASK_END] - HOUR_START) * ((params.cell_height + BORDER_CELL_LENGTH) * 2));
			$('#bottomMask').offset({top: TAB_BOTTOM - (HOUR_END - HOUR_START - params.hour_mask[MASK_END]) * ((params.cell_height + BORDER_CELL_LENGTH) * 2)});
		}
		
		// Update masks with the horizontal slider's value
		function limitsChangeHorizontal(event, ui) {
			params.day_mask[MASK_START] = parseInt(ui.values[0], 10);
			params.day_mask[MASK_END] = parseInt(ui.values[1], 10);
			
			$('#leftMask').css('width', params.day_mask[MASK_START] * (params.cell_width + BORDER_CELL_LENGTH));
			
			$('#rightMask').css('width', (DAYS_NUMBER - params.day_mask[MASK_END]) * (params.cell_width + BORDER_CELL_LENGTH));
			$('#rightMask').offset({left: ((TAB_LEFT + TAB_WIDTH) - (((DAYS_NUMBER - params.day_mask[MASK_END]) * (params.cell_width + BORDER_CELL_LENGTH))))});
		}
		
		// CSS init
		function initCSS() {
			$('#hoursList tr').css('height', (params.cell_height + BORDER_CELL_LENGTH) * 2);
			$('#hoursList').css({
				width: HOURS_LIST_WIDTH,
				marginRight: HOURS_LIST_MARGIN_RIGHT,
				marginTop: TH_HEIGHT - 6
			});
			$('.ui-slider-vertical').css('height', DIV_HEIGHT);
			$('.ui-slider-horizontal').css('width', TAB_WIDTH);
			$('#limitsChoice').css({
				marginTop: TH_HEIGHT + TH_BORDER_LENGTH + 2,
				marginRight: SLIDER_VERTICAL_MARGIN_RIGHT,
				marginBottom: 0,
				marginLeft: 0
			});
			$('#limitsChoiceHorizontal.ui-widget-content').css('width', TAB_WIDTH);
			$('#limitsChoiceHorizontal').css({
				marginTop: SLIDER_HORIZONTAL_MARGIN_TOP,
				marginLeft: TAB_LEFT - HOURS_LIST_LEFT - 6
			});
			$('#agenda th').css({
				width: params.cell_width,
				height: TH_HEIGHT,
				borderBottomWidth: TH_BORDER_LENGTH
			});
			$('#agenda tr td div').css({
				width: params.cell_width,
				height: DIV_HEIGHT,
				borderLeft: BORDER_CELL_LENGTH + 'px solid #CCC'
			});
			$('.hour').css({
				width: params.cell_width,
				height: params.cell_height,
				borderTopWidth: BORDER_CELL_LENGTH
			});
			$('.hourZebra').css('borderTopWidth', BORDER_CELL_LENGTH);
			$('#fixResize').css({
				styleFloat: 'left',
				height: DIV_HEIGHT,
				paddingTop: TAB_TOP + TH_HEIGHT + BORDER_CELL_LENGTH,
				display: 'none'
			});
			$('#topMask').css({
				width: TAB_WIDTH,
				height: (params.hour_mask[MASK_START] - HOUR_START) * ((params.cell_height + BORDER_CELL_LENGTH) * 2),
				left: TAB_LEFT,
				top: TAB_TOP + TH_HEIGHT + TH_BORDER_LENGTH
			});
			$('#bottomMask').css({
				width: TAB_WIDTH,
				height: (HOUR_END - params.hour_mask[MASK_END]) * ((params.cell_height + BORDER_CELL_LENGTH) * 2),
				left: TAB_LEFT,
				top: TAB_BOTTOM - ((HOUR_END - params.hour_mask[MASK_END]) * ((params.cell_height + BORDER_CELL_LENGTH) * 2))
			});
			$('#leftMask').css({
				width: params.day_mask[MASK_START] * (params.cell_width + BORDER_CELL_LENGTH),
				height: DIV_HEIGHT,
				left: TAB_LEFT,
				top: TAB_TOP + TH_HEIGHT + BORDER_CELL_LENGTH
			});
			$('#rightMask').css({
				width: (DAYS_NUMBER - params.day_mask[MASK_END]) * (params.cell_width + BORDER_CELL_LENGTH),
				height: DIV_HEIGHT,
				left: (TAB_LEFT + TAB_WIDTH) - ((DAYS_NUMBER - params.day_mask[MASK_END]) * (params.cell_width + BORDER_CELL_LENGTH)),
				top: TAB_TOP + TH_HEIGHT + BORDER_CELL_LENGTH
			});
			
			$('.ui-selecting').css('borderTopColor', '#569DE8');
			
			// NAV
			$('#nav').css('marginLeft', HOURS_LIST_WIDTH + HOURS_LIST_MARGIN_RIGHT + SLIDER_VERTICAL_MARGIN_RIGHT + SLIDER_WIDTH + BORDER_CELL_LENGTH + SLIDER_OFFSET);
			
			// CONTAINER
			$('#agenda').parent().css('width', TAB_LEFT + TAB_WIDTH);
			
			// Fix masks position in IE8 (1px)
			if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
				$('#topMask').css('top', parseInt($('#topMask').css('top'), 10) + 1);
				$('#bottomMask').css('top', parseInt($('#bottomMask').css('top'), 10) + 1);
				$('#leftMask').css('top', parseInt($('#leftMask').css('top'), 10) + 1);
				$('#rightMask').css('top', parseInt($('#rightMask').css('top'), 10) + 1);
			}
		}
		
		// MiniMonthCalendar
		function miniMonthCalendar(date) {
			// Delete the calendar content
			$('#miniMonthCalendar').children().remove();
			$('#currentMonth').contents().remove();
			
			date = date || new Date();
			
			var allDays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
			
			// Obtain the first day of the month
			var firstDayOfMonth = new Date(date.toString()).moveToFirstDayOfMonth();
			var lastDayNumberOfMonth = new Date(date.toString()).moveToLastDayOfMonth().getDate();
			var tmpDay = firstDayOfMonth.clone();
			
			$('#currentMonth').append(document.createTextNode(allMonths[tmpDay.getMonth()] + ' ' + tmpDay.getFullYear()));
			
			// Table lines creation
			$('#miniMonthCalendar').append(document.createElement('tr'));
			$('#miniMonthCalendar').append(document.createElement('tr'));
			
			// Add the days name & days number for the wanted month
			for (var i = 1; i <= lastDayNumberOfMonth; i++) {
				var dayName = allDays[tmpDay.getDay()].substring(0, 2);
				var dayNumber = tmpDay.getDate();
				
				// Day name
				var dayName_td = document.createElement('td');
				dayName_td.appendChild(document.createTextNode(dayName));
				
				// Day number
				var dayNumber_td = document.createElement('td');
				dayNumber_td.appendChild(document.createTextNode((dayNumber < 10) ? '0' + dayNumber : dayNumber));
				
				$(dayNumber_td).click(function() {
					daysNum = getWeek(new Date(date.getFullYear(), date.getMonth(), $(this).text()));
					
					fillTh($('#agenda tr th'));
					
					readEvents();
				});
				
				// Add day info to the calendar
				$('#miniMonthCalendar tr').eq(0).append(dayName_td);
				$('#miniMonthCalendar tr').eq(1).append(dayNumber_td);
				
				// Go to the next day
				tmpDay.addDays(1);
			}
			
			highlightEvents();
		}
		
		// Highlight events from the MiniMonthCalendar
		function highlightEvents() {
			if (eventList != undefined) {
				// Reset highlighted elements
				$('#miniMonthCalendar tr').eq(1).children().removeClass('isEvent');
				
				var miniCalendarYear = $('#monthManagement #currentMonth').text().split(' ')[1];
				var miniCalendarMonth = $('#monthManagement #currentMonth').text().split(' ')[0];
				
				$(allMonths).each(function(i) {
					if (allMonths[i] == miniCalendarMonth) {
						miniCalendarMonth = i + 1;
						return false;
					}
				});
				
				$.each(eventList, function(key, value) {
					$('#miniMonthCalendar tr').eq(1).children().each(function() {
						if (value[0].split('-')[0] == miniCalendarYear && value[0].split('-')[1] == miniCalendarMonth) {
							if (value[1].filter(':visible') && value[0].split('-')[2] == $(this).text()) {
								$(this).addClass('isEvent');
								
								return false;
							}
						}
					});
				});
			}
		}
		
		// Update coordinates (external function)
		this.redraw = function() {
			var oldTabTop = TAB_TOP;
			var oldTabLeft = TAB_LEFT;
			
			HOURS_LIST_LEFT = $('#hoursList').offset().left;
			TAB_LEFT = HOURS_LIST_LEFT + HOURS_LIST_WIDTH + HOURS_LIST_MARGIN_RIGHT + SLIDER_VERTICAL_MARGIN_RIGHT + SLIDER_WIDTH + BORDER_CELL_LENGTH + SLIDER_OFFSET;
			TAB_TOP = $('#agenda').offset().top;
			TAB_BOTTOM = TAB_TOP + TH_HEIGHT + BORDER_CELL_LENGTH + LINES_NUMBER * (params.cell_height + BORDER_CELL_LENGTH);

			// Replace masks and events
			$('.hourSelected, #topMask, #bottomMask, #leftMask, #rightMask').each(function() {
				var evtLeft = $(this).offset().left;
				var evtTop = $(this).offset().top;
				
				$(this).css({
					left: evtLeft + TAB_LEFT - oldTabLeft,
					top: evtTop + TAB_TOP - oldTabTop
				});
			});
		}
		
		
		// Constants for params.hour_mask & params.day_mask arrays
		var MASK_START = 0, MASK_END = 1;
		
		// Constants for params.cell_width & params.cell_height
		var CELL_MIN_WIDTH = 30, CELL_MIN_HEIGHT = 7;
		
		// Default args
        var defaults = {
			hour_mask:		new Array(8, 20),
			day_mask:		new Array(1, 7),
			cell_width:		150,
			cell_height:	9
        };
		
        var params = $.extend(defaults, params);
		
		// Minimum values (CELL_MIN_WIDTH ; CELL_MIN_HEIGHT)
		params.cell_width = (params.cell_width < CELL_MIN_WIDTH) ? CELL_MIN_WIDTH : params.cell_width;
		params.cell_height = (params.cell_height < CELL_MIN_HEIGHT) ? CELL_MIN_HEIGHT : params.cell_height;
		
		
		// Months list
		var allMonths = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
		
		// MiniMonthCalendar (fast day chooser)
		var date = new Date();
		var $monthManagement = $('#monthManagement');
		
		$monthManagement.children('#prevYear').click(function() {
			miniMonthCalendar(date.moveToFirstDayOfMonth().addYears(-1));
		});
		
		$monthManagement.children('#nextYear').click(function() {
			miniMonthCalendar(date.moveToFirstDayOfMonth().addYears(1));

		});
		
		$monthManagement.children('#prevMonth').click(function() {
			miniMonthCalendar(date.moveToFirstDayOfMonth().addMonths(-1));
		});
		
		$monthManagement.children('#nextMonth').click(function() {
			miniMonthCalendar(date.moveToFirstDayOfMonth().addMonths(1));
		});
		
		miniMonthCalendar();
		
		
		
		/* -- --------------- -- */
		/* -- TIME MANAGEMENT -- */
		/* -- --------------- -- */
		
		// Start & end
		var HOUR_START = 0;
		var HOUR_END = 24;

		// Hours
		var HOURS_NUMBER = HOUR_END - HOUR_START;  // Do not modify
		
		// Half hours (lines)
		var LINES_NUMBER = HOURS_NUMBER * 2;  // Do not modify
		
		
		/* -- --------------- -- */
		/* -- DAYS MANAGEMENT -- */
		/* -- --------------- -- */
		
		// Start & end
		var DAY_START = 0;
		var DAY_END = 7;
		
		// Days (columns)
		var DAYS_NUMBER = DAY_END - DAY_START;  // Do not modify
		
		
		/* -- ---------------- -- */
		/* -- CELLS MANAGEMENT -- */
		/* -- ---------------- -- */
		
		// Border length between cells
		var BORDER_CELL_LENGTH = 1; // Do not modify
		
		
		/* -- ----------------- -- */
		/* -- EVENTS MANAGEMENT -- */
		/* -- ----------------- -- */
		
		// Possible height to handle elements
		var DIV_HEIGHT = LINES_NUMBER * (params.cell_height + BORDER_CELL_LENGTH);  // Do not modify
		
		// Element's minimal height
		var EVT_MIN_HEIGHT = params.cell_height - BORDER_CELL_LENGTH;  // Do not modify
		
		// Maximum character count displayed on an event
		var DISPLAYED_CHAR_COUNT = 15;  // To modify with your needs
		
		
		/* -- --------------------- -- */
		/* -- HOURS LIST MANAGEMENT -- */
		/* -- --------------------- -- */
		
		// Left position of the hours list
		var HOURS_LIST_LEFT = $('#hoursList').offset().left;  // Do not modify
		
		// Width of the hours list (increases the container's width only)
		var HOURS_LIST_WIDTH = 18;
		
		// Margin-right of the hours list
		var HOURS_LIST_MARGIN_RIGHT = 20;
		
		
		/* -- ------------------ -- */
		/* -- SLIDERS MANAGEMENT -- */
		/* -- ------------------ -- */
		
		// Margin-right of the hours slider
		var SLIDER_VERTICAL_MARGIN_RIGHT = 30;
		
		// Width of the hours slider
		var SLIDER_WIDTH = 2;  // Do not modify
		
		// Margin-top of the days slider
		var SLIDER_HORIZONTAL_MARGIN_TOP = 25;

		// Offset for the masks to be well placed
		var SLIDER_OFFSET = 3;
		
		
		/* -- -------------------------- -- */
		/* -- AGENDA'S HEADER MANAGEMENT -- */
		/* -- -------------------------- -- */
		
		// Header border length
		var TH_BORDER_LENGTH = 1;  // Do not modify
		
		// Header height (+ border length)
		var TH_HEIGHT = TH_BORDER_LENGTH + 39;
		
		
		/* -- ---------------- -- */
		/* -- TABLE MANAGEMENT -- */
		/* -- ---------------- -- */
		
		// Table height
		var TAB_WIDTH = (params.cell_width + BORDER_CELL_LENGTH) * DAYS_NUMBER;  // Do not modify
		
		// Left position of the table
		var TAB_LEFT = HOURS_LIST_LEFT + HOURS_LIST_WIDTH + HOURS_LIST_MARGIN_RIGHT + SLIDER_VERTICAL_MARGIN_RIGHT + SLIDER_WIDTH + BORDER_CELL_LENGTH + SLIDER_OFFSET;  // Do not modify
		
		// Top position of the table
		var TAB_TOP = $('#agenda').offset().top;  // Do not modify
		
		// Bottom position of the table
		var TAB_BOTTOM = TAB_TOP + TH_HEIGHT + BORDER_CELL_LENGTH + LINES_NUMBER * (params.cell_height + BORDER_CELL_LENGTH);  // Do not modify
		
		
		/* -- --------------- -- */
		/* -- PROCESSING VARS -- */
		/* -- --------------- -- */
		
		var $hoursList = $('#hoursList');
		var lastSelectedElt = new Array();
		
		var eventList = new Array();
		var currentId = 0;
		var lastColumnId = -1;
		
		// Save the previous coordinates (replace the element if a collision occurs)
		var lastEvtPosX = -1;
		var lastEvtPosY = -1;
		
		// Save the origin day (drag event)
		var columnDayStart = -1;
		
		// Test if the last element is dropped
		var isDropped = false;
		
		// Save the last created element
		var $lastCreatedElt = false;
		
		// Save the modified element
		var $modifElt = false;
		
		// Check if it is an element modification
		var isModif = false;
		
		// SPANS creation (lines) for each columns
		//var daysList = Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
		var daysList = Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
		
		// Days of the current week
		var daysNum = getWeek();
		
		// First day (sunday) of the week - Date
		var firstDay;
		
		// Last day (saturday) of the week - Date
		var lastDay;
		
		// Lightbox init
		Shadowbox.init({
			modal: true,
			enableKeys: false,
			resizeDuration: 0.1,
			
			onFinish: function() {
				// Create the color-chooser
				$('#sb-container #colorChoose').miniColors({
					letterCase: 'uppercase'
				});
				
				if (isModif) {
					$('#sb-container #name').val($modifElt.children('.evtName').text());
					$('#sb-container #desc').val($modifElt.children('.evtDesc').text());
					$('#sb-container #colorChoose').miniColors('value', $modifElt.attr('data-color'));
				}
				
				$('#sb-container #valCreationEvt').click(function() {
					if ($('#sb-container #name').val().length > 0) {
						// ADD
						if (!isModif) {
							var $form_name = $.trim($('#sb-container #name').val()).replace(/\s+/gi, ' ');
							var $form_desc = $.trim($('#sb-container #desc').val()).replace(/\s+/gi, ' ');
							var $form_color = $('#sb-container #colorChoose').val();
							var $evt_height = $lastCreatedElt.css('height');
							
							var evtName = document.createElement('div');
							evtName.className = 'evtName';
							
							$(evtName).css({
								height: $evt_height,
								width: params.cell_width,
								lineHeight: $evt_height
							});
							
							if ($form_name.length > DISPLAYED_CHAR_COUNT) {
								evtName.appendChild(document.createTextNode($form_name.substring(0, DISPLAYED_CHAR_COUNT) + '..'));
								evtName.title = $form_name;
							} else {
								evtName.appendChild(document.createTextNode($form_name));
							}
							
							if (parseInt($evt_height, 10) <= 8) {
								$(evtName).hide();
							}
							
							var evtDesc = document.createElement('div');
							evtDesc.className = 'evtDesc';
							$(evtDesc).css('display', 'none');
							
							evtDesc.appendChild(document.createTextNode($form_desc));
							
							$lastCreatedElt.css({
								backgroundColor: $form_color,
								borderTopColor: $form_color
							});
							
							$lastCreatedElt.append(evtName);
							$lastCreatedElt.append(evtDesc);
							
							Shadowbox.close();
							
							$lastCreatedElt.attr('data-color', $form_color.substring(1));
							$lastCreatedElt.attr('data-id', currentId++);
							eventList[eventList.length] = new Array(lastColumnId, $lastCreatedElt);
							
							highlightEvents();
						} else {
							var $form_name = $.trim($('#sb-container #name').val()).replace(/\s+/gi, ' ');
							var $form_desc = $.trim($('#sb-container #desc').val()).replace(/\s+/gi, ' ');
							var $form_color = $('#sb-container #colorChoose').val();
							
							if ($form_name.length > DISPLAYED_CHAR_COUNT) {
								$modifElt.children('.evtName').text($form_name.substring(0, DISPLAYED_CHAR_COUNT) + '..');
							} else {
								$modifElt.children('.evtName').text($form_name);
							}
							
							$modifElt.children('.evtDesc').text($form_desc);
							$modifElt.css('backgroundColor', $form_color);
							$modifElt.css('borderTopColor', $form_color);
							
							Shadowbox.close();
							
							isModif = false;
							
							$lastCreatedElt.attr('data-color', $form_color.substring(1));
						}
					} else {
						$('#sb-container #name').addClass('error');
					}
					
					// Deactivate the delete button
					$('#delCreationEvt').attr('disabled', true);
				});
				
				$('#sb-container #cancelCreationEvt').click(function() {
					// ADD
					if (!isModif) {
						// Delete the element
						$lastCreatedElt.remove();
					} else {
						isModif = false;
					}
					
					// Deactivate the delete button
					$('#delCreationEvt').attr('disabled', true);
					
					Shadowbox.close();
				});
				
				$('#sb-container #delCreationEvt').click(function() {
					isModif = false;
					
					var deleteId = $modifElt.attr('data-id');
					
					$.each(eventList, function(key, value) {
						if (value[1].attr('data-id') == deleteId) {
							eventList.splice(key, 1);
							return false;
						}
					});
					
					$modifElt.remove();
					
					// Deactivate the delete button
					$('#delCreationEvt').attr('disabled', true);
					
					Shadowbox.close();
					
					highlightEvents();
				});
				
				// $('#sb-wrapper').draggable({containment: 'html'});
			}
		});
		
		// Hours list creation
		for (var i = HOUR_START; i < HOUR_END; i++) {
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			
			td.appendChild(document.createTextNode(i + 'h'));
			tr.appendChild(td);
			
			$hoursList.append(tr);
		}
		
		for (var i = DAY_START; i < DAY_END; i++) {
			var th = document.createElement('th');
			var td = document.createElement('td');
			var div = document.createElement('div');
			
			// HEAD
			fillTh(th, true);
			
			// BODY
			$(div).attr('id', daysList[i]);
			
			td.appendChild(div);
			
			var $day = $(td);
			
			// Add an attribute with the hour on each span
			var tmpHour = new Date();
			tmpHour.setSeconds(0);
			tmpHour.setMinutes(0);
			tmpHour.setHours(0);
			
			for (var j = 0; j < LINES_NUMBER; j++) {
				var span = document.createElement('span');
				span.className = 'hour';
				
				var tmpStrHours = tmpHour.getHours() < 10 ? '0' + tmpHour.getHours() : tmpHour.getHours();
				var tmpStrMinutes = tmpHour.getMinutes() < 10 ? '0' + tmpHour.getMinutes() : tmpHour.getMinutes();
				
				$(span).attr('data-time', tmpStrHours + ':' + tmpStrMinutes);
				tmpHour.addMinutes(30);
				
				if (j % 2 == 1) {
					span.className += ' hourZebra';
				}
				
				$day.append(span);
			}
			
			$day.selectable({
				filter: ':not(.hourSelected)',
				selected: eltSelection,
				start: function(event, ui) {
					$('body').css('overflow', 'hidden');
				},
				stop: selectionEnd
			});
			
			$('#agenda tbody tr').append($day);
		}
		
		// Refresh TD with date informations
		daysNum = getWeek();
		
		// Nav
		$('#nav_previous').click(function() {
			daysNum = getWeek(firstDay.addDays(-1));
			
			fillTh($('#agenda tr th'));
			
			readEvents();
		});
		
		$('#nav_next').click(function() {
			daysNum = getWeek(lastDay.addDays(1));
			
			fillTh($('#agenda tr th'));
			
			readEvents();
		});
		
		// Sliders creation
		$('#limitsChoice').slider({
			orientation: 'vertical',
			range: true,
			min: HOUR_START,
			max: HOUR_END,
			values: [HOUR_END - params.hour_mask[MASK_END] + HOUR_START, HOUR_END - params.hour_mask[MASK_START] + HOUR_START],
			slide: limitsChange
		});
		
		$('#limitsChoiceHorizontal').slider({
			orientation: 'horizontal',
			range: true,
			min: 0,
			max: DAYS_NUMBER,
			values: [params.day_mask[MASK_START], params.day_mask[MASK_END]],
			slide: limitsChangeHorizontal
		});
		
		readEvents();
		
		// CSS Init
		initCSS();
		
		return this;
	}

})(jQuery);