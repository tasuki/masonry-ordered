/**
 * jQuery Masonry Ordered 2.1-beta2
 * http://masonry-ordered.tasuki.org/
 *
 * Enhanced layout strategy for jQuery Masonry:
 * http://masonry.desandro.com/
 *
 * Licensed under the MIT license.
 * Copyleft 2012 Vit 'tasuki' Brunner
 */

(function( window, $, undefined ) {

  $.extend(true, $.Mason.settings, {
    layoutPriorities: {
      // Masonry default: Try to occupy highest available position.
      // Weight: Pixels of vertical distance from most upper spot.
      upperPosition: 1,
      // Shelf order: Try to display bricks in original order.
      //   (increases ordered-ness, decreases space-efficiency)
      // Weight: Pixels of distance of current brick's top left corner
      //         from previous brick's top right corner.
      shelfOrder: 1
    }
  });

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
      // subtract container's horizontal offset to prevent overflow
      var offset = prevBrick.style[ dir ] - this.offset.x;

      // align anchor point with previous brick
      anchorPoint[ dir ] = offset + width;
      anchorPoint.top = prevBrick.style.top;

      // check if brick fits in row
      var spaceForBrick = anchorPoint[ dir ] + colSpan * this.columnWidth;
      var availableSpace = this.cols * this.columnWidth;
      if ( spaceForBrick > availableSpace ) {
        // brick doesn't fit in row - reset horizontal position
        anchorPoint[ dir ] = 0;
      }
    }

    // priorities weights for brick laying
    var priorities = this.options.layoutPriorities;
    // total penalty for given position
    var penalty = [];

    // calculate penalty of each position
    for ( var i=0, len = groupY.length; i < len; i++ ) {
      // distance of upper left corner from anchor point
      var horizontal = Math.abs( anchorPoint[ dir ] - this.columnWidth * i );
      var vertical   = Math.abs( anchorPoint.top  - groupY[i] );
      var sum_of_powers = Math.pow( horizontal, 2 ) + Math.pow( vertical, 2 );
      var distance      = Math.round( Math.sqrt( sum_of_powers ) );
      var shelfPenalty  = priorities.shelfOrder * distance;

      // vertical distance from the most top available spot
      var upperPenalty = priorities.upperPosition * ( groupY[i] - minimumY );

      // total penalty for column
      penalty[i] = upperPenalty + shelfPenalty;
    }

    // get minimum penalty
    var minPenalty = Math.min.apply( null, penalty );

    // find column with minimum penalty
    for ( i=0, len = penalty.length; i < len; i++ ) {
      if ( penalty[i] === minPenalty ) {
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
