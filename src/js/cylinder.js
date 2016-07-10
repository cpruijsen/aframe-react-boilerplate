// circles and cylinders
// need to provide an x and z value to position cylinder.
var circleIterator = numCircles;
var circlePosition, circleSliceEnd, circleSliceStart = -10;
var changePosForCylinder = function(z) {   // change Y
  circleIterator--;
  var position = dataRangeCircles[circleIterator];
  circlePosition = `0 ${position} ${z}`;
};
// there is no 'optimal' for circles unless we set it
// as you can make circle shapes with any number of primitives
// more circles just makes the outline more smooth

// could make a version that will always render *all* members of a dataset

var determineSlicingCylinder = function(options, i) {
  if (options.all) { // naive - top circle is bigger.
    circleSliceStart += 10;
    if (i === numCircles - 1) { // this makes for very ugle cylinders.
      circleSliceEnd = circleSliceStart + 10 + (len % 10);
    } else {
      circleSliceEnd = circleSliceStart + 10;
    }
  } else {
    circleSliceStart += 10;
    circleSliceEnd = circleSliceStart + 10;
  }
};

{/* cylinder as stacked circles */}
{/*
  TODO: onMouseEnter: () => {}, // show infobox
        onMouseLeave: () => {}, // hide infobox
  infobox: curvedsurface? // pane with opacity and text?
*/}

{dataRangeCircles.map(function(i) {
  changePosForCylinder(10);
  determineSlicingCylinder({all: true}, i);

  return <Entity layout={{type: 'circle', radius: `${datacb}`}} position={circlePosition}>
  <Animation attribute="layout.radius" repeat="indefinite" to={`${datasq}`} direction="alternate" begin="5000"/>

  {/* might need to change the kick-off of the animation */}

    {data.slice(circleSliceStart, circleSliceEnd).map(function(person) {

      return <Entity key={person.id} data={person}
              geometry="primitive: box"
              material={{src: `url(${person.image})`, color: that.state.color}}
              onClick={that.changeColor}
              >
              <Entity text={`text:  ${person.name}`}
                      material="color: #66E1B4"
                      scale="0.3 0.3 0.3"
                      position="0 .5 -1"
                      rotation="0 180 0"
                      visible="true" />

      </Entity>; })}

  </Entity> })}
