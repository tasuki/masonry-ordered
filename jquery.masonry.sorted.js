// JQuery Masonry Sorted plugin
// Depends on: http://masonry.desandro.com/
(function( window, $, undefined ) {

  $.Mason.settings.distanceBadnessWeight = 50;

  // layout logic
  $.Mason.prototype._placeBrick = function( brick ) {
    var $brick = $(brick),
        dir = this.horizontalDirection,
        colSpan, groupCount, groupY, groupColY;

    //how many columns does this brick span
    colSpan = Math.ceil( $brick.outerWidth(true) /
      ( this.columnWidth + this.options.gutterWidth ) );
    colSpan = Math.min( colSpan, this.cols );

    if ( colSpan === 1 ) {
      // if brick spans only one column, just like singleMode
      groupY = this.colYs
    } else {
      // brick spans more than one column
      // how many different places could this brick fit horizontally
      groupCount = this.cols + 1 - colSpan;
      groupY = [];

      // for each group potential horizontal position
      for ( var j=0; j < groupCount; j++ ) {
        // make an array of colY values for that one group
        groupColY = this.colYs.slice( j, j+colSpan );
        // and get the max value of the array
        groupY[j] = Math.max.apply( Math, groupColY );
      }
    }

    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, groupY );

    // point near which the next brick should be
    var anchorPoint = { top: 0 }
    anchorPoint[ dir ] = 0;

    // get previous brick details
    var prevBrick = this.styleQueue.slice(-1)[0];
    if ( prevBrick != undefined ) {
      var width  = prevBrick.$el.outerWidth(true);
      var offset = prevBrick.style[ dir ];

      // align anchor point with previous brick
      anchorPoint[ dir ] = offset + width;
      anchorPoint.top = prevBrick.style.top;

      // brick doesn't fit in row (anchor + new brick width > container width)
      var container_width = this.element.width();
      if ( anchorPoint[ dir ] + colSpan * this.columnWidth > container_width ) {
        // reset horizontal position
        anchorPoint[ dir ] = 0;
      }
    }

    var badness = [];

    // count badness of each column
    for ( var i=0, len = groupY.length; i < len; i++ ) {
      // actual distance from anchor point
      var width  = Math.abs( anchorPoint[ dir ] - this.columnWidth * i );
      var height = Math.abs( anchorPoint.top  - groupY[i] );
      var sum_of_powers = Math.pow( width, 2 ) + Math.pow( height, 2 );
      var distanceBadness = Math.round( Math.sqrt( sum_of_powers ) );

      // vertical distance from the most top available spot
      var heightBadness = groupY[i] - minimumY;

      // TODO name this better!
      var dbw = this.options.distanceBadnessWeight / 100;
      var hbw = 1 - dbw;
      // total badness for column
      badness[i] = dbw * distanceBadness + hbw * heightBadness;
    }

    // get minimum badness
    var minBadness = Math.min.apply( null, badness );

    // find column with minimum badness
    for ( i=0, len = badness.length; i < len; i++ ) {
      if ( badness[i] === minBadness ) {
        shortCol = i;
        break;
      }
    }

    // position the brick
    var position = {
      top: groupY[shortCol] + this.offset.y
    };
    // position.left or position.right
    position[ dir ] = this.columnWidth * shortCol + this.offset.x;
    this.styleQueue.push({ $el: $brick, style: position });

    // apply setHeight to necessary columns
    var setHeight = groupY[ shortCol ] + $brick.outerHeight(true),
        setSpan = this.cols + 1 - len;
    for ( i=0; i < setSpan; i++ ) {
      this.colYs[ shortCol + i ] = setHeight;
    }
  }
})( window, jQuery );

/* vi: set ts=2 sw=2 expandtab: */
