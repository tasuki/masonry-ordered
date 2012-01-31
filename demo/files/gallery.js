$(document).ready(function(){
	$('#images').imagesLoaded(function() {
		this.masonry({
			itemSelector: '.pic',
			columnWidth: 20,
			isAnimated: true,
			layoutPriorities: {
				shelfOrder: 1.21
			}
		});
	});

	// temporary numbers overlay
	$('.pic').prepend(function() {
		var title = $(this).find('img').attr('src').replace(/.*(\d\d).*/, '\$1');
		var content = '<div style="position: absolute; left: 20px; top: 10px; ">'
				+ title + '</div>';
		return content;
	})
	.css('color', '#FFF')
	.css('font-size', '30px')
	.css('text-decoration', 'none')
	.css('text-shadow', '#000 2px 2px 1px');

	$("#slider").slider({
		value: 55,
		step: 5,

		slide: function(event, ui) {
			$('#images').masonry({
				layoutPriorities: {
					shelfOrder: Math.pow((ui.value / 50), 2)
				}
			});
		}
	});
});

//var title = $(prevBrick.$el.context.childNodes[1]).attr('src').replace(/.*(\d\d).*/, '\$1');
//var tit = $('#_' + title);
//if (tit.length) {
//  tit
//  .css('top', anchorPoint.top)
//  .css(dir, anchorPoint[ dir ]);
//} else {
//  $('<div class="anchorpoint" id="_' + title + '"/>')
//  .css('top', anchorPoint.top)
//  .css(dir, anchorPoint[ dir ])
//  .prependTo('#images');
//} 
//console.log(title + ': anchorPoint: ' + anchorPoint[dir]
//  + ', colSpan: ' + colSpan
//  + ', columnWidth: ' + this.columnWidth
//  + ', container_new: ' + this.cols * this.columnWidth
//  );
