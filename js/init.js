$(document).ready
(
	function()
	{
		// instantiate slider
		var slider = new PanelSlider
		(
			$("div#panelSlider"),
			{
				transition: PanelSlider.prototype.Transitions.SLIDE_H,
				autoSlide:
				{
					enabled: true,
					delay: 2000
				},
				showControls: true
			}
		);
		// assign action to prev button
		$("button#btnPrev").click
		(
			function()
			{
				slider.prev();
			}
		);
		// assign action to next button
		$("button#btnNext").click
		(
			function()
			{
				slider.next();
			}
		);
		// assign action to goto 3 button
		$("button#btnThree").click
		(
			function()
			{
				slider.goto(3);
			}
		);
		// listen for panel changes
		$(slider).bind
		(
			PanelSlider.prototype.events.PANEL_CHANGED,
			function(event)
			{
				console.log(event.currentPanel);
			}
		);
	}
);