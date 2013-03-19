window.PanelSlider = function(element, options)
{
	// return immediately if element doesn't exist
	if(!element)
	{
		console.error("No element specified");
		return;
	}
	this.element = element;
	this.currentPanel = 0;
	this.panelCount = 0;
	this.defaults =
	{
		initialPanel: 1,
		wrap: true,
		transition: this.Transitions.SLIDE_H,
		transitionLength: 500,
		easing: "swing"
	}

	element.addClass("panelSlider");
	this.init(element, options);
};

PanelSlider.prototype =
{
	Transitions:
	{
		CROSSFADE: "panelTransitionCrossfade",
		FADE: "panelTransitionFade",
		SLIDE_H: "panelTransitionSlideH",
		SLIDE_V: "panelTransitionSlideV"
	},

	init: function(element, options)
	{
		// merge option defaults
		this.options = $.extend({}, this.defaults, options);
		// store reference to element
		this.element = element;
		// hide all child divs
		this.panelCount = $(this.element).children("div").length;
		// set initial panel
		this.currentPanel = this.options.initialPanel;
		// and show with no direction
		this.showCurrent(0);
	},

	prev: function()
	{
		// flag previous panel as closing
		$(this.element).children("div:nth-child(" + this.currentPanel + ")").addClass("closing");
		// show with reverse direction
		this.goto(this.currentPanel - 1, -1);
	},

	next: function()
	{
		// flag previous panel as closing
		$(this.element).children("div:nth-child(" + this.currentPanel + ")").addClass("closing");
		// show with forward direction
		this.goto(this.currentPanel + 1, 1);
	},

	goto: function(index)
	{
		// assume by default the panel will change
		var panelChanged = true;
		// did we go past the start?
		if(index < 1)
		{
			// if we're wrapping
			if(this.options.wrap)
			{
				// go to the end
				index = this.panelCount;
			}
			else
			{
				// flag panel not changed
				panelChanged = false;
			}
		}
		// or past the end
		if(index > this.panelCount)
			{
			// if we're wrapping
			if(this.options.wrap)
			{
				// go to the start
				index = 1;
			}
			else
			{
				// flag panel not changed
				panelChanged = false;
			}
		}
		// did anything change?
		if(panelChanged)
		{
			// flag previous panel as closing
			$(this.element).children("div:nth-child(" + this.currentPanel + ")").addClass("closing");
			// calculate direction
			var direction = this.currentPanel > index ? -1 : 1;
			// set index
			this.currentPanel = index;
			// and display
			this.showCurrent(direction);
		}
	},

	showCurrent: function(direction)
	{
		// store reference to self to access across scope
		var self = this;
		// which transition type?
		switch(this.options.transition)
		{
			case this.Transitions.CROSSFADE:
				// do we have a previous panel?
				if($(this.element).children(".closing").length === 0)
				{
					// nope, just show the default panel
					$(this.element).children("div:nth-child(" + this.currentPanel + ")").show();
				}
				else
				{
					// yep, fade out the old panel
					$(this.element).children(".closing").fadeOut
					(
						self.options.transitionLength,
						function()
						{
							// hide it
							$(this).hide();
							// remove the closing class
							$(this).removeClass("closing");
						}
					);
					// fade in the new panel
					$(this.element).children("div:nth-child(" + this.currentPanel + ")").fadeIn(this.options.transitionLength);
				}
				break;

			case this.Transitions.FADE:
				// do we have a previous panel?
				if($(this.element).children(".closing").length === 0)
				{
					// nope, just show the default panel
					$(this.element).children("div:nth-child(" + this.currentPanel + ")").show();
				}
				else
				{
					// yep, fade out the old panel
					$(this.element).children(".closing").fadeOut
					(
						self.options.transitionLength
					).promise().done
					(
						function()
						{
							// hide it
							$(this).hide();
							// remove the closing class
							$(this).removeClass("closing");
							// fade in the new panel
							$(self.element).children("div:nth-child(" + self.currentPanel + ")").fadeIn(self.options.transitionLength);
						}
					);
				}
				break;

			case this.Transitions.SLIDE_H:
				// position new panel
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").css("left", $(this.element).width() * direction);
				// make it visible
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").show();
				// and animate it in
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").animate
				(
					{
						left: 0
					},
					this.options.transitionLength,
					this.options.easing
				);
				// take our old panel and animate it out
				$(this.element).children(".closing").animate
				(
					{
						left: $(this.element).width() * (direction * -1)
					},
					this.options.transitionLength,
					this.options.easing
				).promise().done
				(
					function()
					{
						// hide
						$(this).hide();
						// clean up class
						$(this).removeClass("closing");
					}
				);
				break;

			case this.Transitions.SLIDE_V:
				// position new panel
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").css("top", $(this.element).height() * direction);
				// make it visible
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").show();
				// and animate it in
				$(this.element).children("div:nth-child(" + this.currentPanel + ")").animate
				(
					{
						top: 0
					},
					self.options.transitionLength,
					self.options.easing
				);
				// take our old panel and animate it out
				$(this.element).children(".closing").animate
				(
					{
						top: $(this.element).height() * (direction * -1)
					},
					self.options.transitionLength,
					self.options.easing
				).promise().done
				(
					function()
					{
						// hide
						$(this).hide();
						// clean up class
						$(this).removeClass("closing");
					}
				);
				break;
		}
	}
};