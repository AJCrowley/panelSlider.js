PanelSlider.js
==============

To set up, create a div to contain your slider, with each child div being a panel within your slider
```html
<div id="panelSlider">
	<div>This is panel 1</div>
	<div>This is panel 2</div>
	<div>This is panel 3</div>
	<div>This is panel 4</div>
	<div>This is panel 5</div>
</div>
```
Initialize with the following syntax:
```js
var slider = new PanelSlider
(
	$("div#panelSlider"),
	{
		[...options]
	}
);
```
No options are required, here is the full list
```js
initialPanel: [int(1): 1 based index of panel on which to start];
wrap: [boolean(true): wrap around when prev/next from beginning/end];
transition:
[
	string(SLIDE_H): possible values are:
		PanelSlider.prototype.Transitions.CROSSFADE,
		PanelSlider.prototype.Transitions.FADE,
		PanelSlider.prototype.Transitions.SLIDE_H,
		PanelSlider.prototype.Transitions.SLIDE_V
],
transitionLength: [int: transition time in ms],
easing: [string: easing function, linear and swing are built into jQuery, more in jQueryUI];
autoSlide:
{
	enabled: [boolean(false): enable auto slideshow],
	delay: [int(5000): time in ms between slides],
	pauseOnMouseOver: [bool(true): pause slideshow when mouse is over]
}
```
Functions:
```js
slider.prev(); // go to previous panel
slider.next(); // go to next panel
slider.goto([int: 1 based index of panel to switch to]); // go to specified panel
```
Once the panel has fully transitioned, an event is dispatched. You can listen for the event with the following code:
```js
$(slider).bind
(
	PanelSlider.prototype.events.PANEL_CHANGED,
	function(event)
	{
		console.log(event.currentPanel);
	}
);
```