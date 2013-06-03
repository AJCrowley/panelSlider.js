(
	function()
	{
		window.PanelSlider = function(element, options, $)
		{
			$ = $ || jQuery;
			// return immediately if element doesn't exist
			if(!element)
			{
				console.error("No element specified");
				return;
			}

			this.element = element;
			this.transitioning = false;
			this.currentPanel = 0;
			this.panelCount = 0;
			this.autoSlideTimer = 0;
			this.defaults =
			{
				autoSlide:
				{
					enabled: false,
					delay: 5000,
					pauseOnMouseOver: true
				},
				showControls: false,
				initialPanel: 1,
				wrap: true,
				transition: this.Transitions.SLIDE_H,
				transitionLength: 500,
				easing: "swing"
			};

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

			events:
			{
				PANEL_CHANGED: "panelChanged"
			},

			init: function(element, options)
			{
				// store self ref
				var self = this;
				// merge autoslide options, otherwise they'll get overwritten
				if(options.autoSlide !== undefined)
				{
					options.autoSlide = $.extend({}, this.defaults.autoSlide, options.autoSlide);
				}
				// merge option defaults
				this.options = $.extend({}, this.defaults, options);
				// store reference to element
				this.element = element;
				// hide all child divs
				this.panelCount = $(this.element).children("div").length;
				// add panel class to children
				$(this.element).children("div").addClass("panel");
				// set initial panel
				this.currentPanel = this.options.initialPanel;
				// and show with no direction
				this.showCurrent(0);
				// make sure we're visible
				$(this.element).show();
				// are we on auto slide?
				if(this.options.autoSlide.enabled)
				{
					// if we want to pause on mouseover
					if(this.options.autoSlide.pauseOnMouseOver)
					{
						// monitor mouseover for slide show
						$(element).bind
						(
							"mouseenter",
							function()
							{
								clearInterval(self.autoSlideTimer);
							}
						).bind
						(
							"mouseleave",
							function()
							{
								self.resetTimer();
							}
						);
					}
					this.autoSlideTimer = setInterval
					(
						function()
						{
							self.next();
						},
						this.options.autoSlide.delay
					);
				}
				// are we showing controls?
				if(options.showControls)
				{
					// add an anchor for prev
					$(this.element).append
					(
						$("<div>").attr("id", "panelSliderControls").append
						(
							$("<a>").attr("id", "panelSliderPrev").click
							(
								function()
								{
									self.prev();
								}
							)
						).append
						(
							$("<a>").attr("id", "panelSliderNext").click
							(
								function()
								{
									self.next();
								}
							)
						)
					);
				}
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
				if(!this.transitioning)
				{
					// assume by default the panel will change
					var panelChanged = true,
					// calculate direction
					direction = this.currentPanel > index ? -1 : 1;
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
						// flag transition as in progress
						this.transitioning = true;
						// flag previous panel as closing
						$(this.element).children("div:nth-child(" + this.currentPanel + ")").addClass("closing");
						// set index
						this.currentPanel = index;
						// and display
						this.showCurrent(direction);
					}
				}
			},

			resetTimer: function()
			{
				var self = this;
				clearInterval(self.autoSlideTimer);
				self.autoSlideTimer = setInterval
				(
					function()
					{
						self.next();
					},
					self.options.autoSlide.delay
				);
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
									self.transitionComplete(this);
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
									// store ref to closing element
									var closingEl = this;
									// fade in the new panel
									$(self.element).children("div:nth-child(" + self.currentPanel + ")").fadeIn(self.options.transitionLength).promise().done
									(
										function()
										{
											self.transitionComplete(closingEl);
										}
									);
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
								self.transitionComplete(this);
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
								self.transitionComplete(this);
							}
						);
						break;
				}
			},

			transitionComplete: function(closingEl)
			{
				// did we receive a closing element?
				if($(closingEl).hasClass("closing"))
				{
					// hide
					$(closingEl).hide();
					// clean up class
					$(closingEl).removeClass("closing");
					// transition finished
				}
				this.transitioning = false;
				var eventObj = $.Event(this.events.PANEL_CHANGED);
				eventObj.currentPanel = this.currentPanel;
				$(this).triggerHandler(eventObj);
			}
		};
	}
)();