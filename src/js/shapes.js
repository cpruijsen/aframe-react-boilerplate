// TODO: experiment with rotation (roll, pitch, yaw)
// TODO: experiment with relative rotation:
//  https://aframe.io/docs/0.2.0/components/rotation.html
// could some of the below be more easily achieved using relative rotation?

// TODO: experiment w opacity https://aframe.io/aframe/examples/test-opacity/

// pyramid - rotated stacked boxes of varying size
// cube - adjacent boxes of equal size
// cylinder - stacked equal size circles
//

// scatterplot?
// bar chart --> adjacent boxes w 1 column // rotated lines && varying size?
//

// === DYNAMIC RENDERING === //
/*
Position input is a String "x y z"
Where x is plotted by the shape, and y and z need to be given

Shapes need to be rendered next / on top of each other
Layout components can be adjacent but not nested
Layout components can contain primitives

Both the layout and the primitives can have separate transforms
*/

// cylinder
// several variations possible:
// 1. same Y, different radius (nested circles // star shape if made of boxes)
// 2. different Y, different radius: pyramid / star
// 3. different Y, same radius: regular stacked circle cylinder

var circleIterator = datasq+1;
var circlePosition;
var changePosForCylinder = function(z) {   // change Y
  circleIterator--;
  var position = dataRangeToSqrt[circleIterator];
  circlePosition = '0 ' + position + ' ' + z;
};

{dataRangeToCbrt.map(function(i) {
  changePosForCylinder(15);

  return <Entity layout={{type: 'circle', radius: `${datacb}`}} position={circlePosition}>

  {/* additional animation on layout */}
  <Animation attribute="layout.radius" repeat="indefinite" to={`${datasq}`} direction="alternate" begin="2000"/>

    {data.slice(0, 15).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box"
              material={{src: `url(${person.image})`, color: that.state.color}}
              onClick={that.changeColor} >
      </Entity>; })}

  </Entity> })}

// 1. Y is set to {datasq}, radius to {position}
// 2. as above, but radius is also set to {position}
// 3. as above with fixed radius as {datasq}

// STAIRS
//=> 0 1 1 || 0 2 2 || 0 3 3 ...

var len = data.length;
var datasq = Math.floor(Math.sqrt(len));
var arr = _.range(0, datasq+1); // [1, 2, 3, 4, 5]
var iterator = len - 1;
var pos;
var changePos = function() {
  iterator--;
  position = arr[iterator];
  pos = '0 ' + position + ' ' + position;
};

{arr.map(function(i) {
  changePos();
   return <Entity key={i} layout="type: line, margin: 1.5"
          position={pos}>
    {data.slice(0, 5).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box"> </Entity>; })}
  </Entity> })}

// tunnel
// stairs and mirrored stairs (X and tunnel)
// for stairs instead of sqrt to optimize size,
// we could as for an optional width and height
// and optimize size based on those if given.
var dataRangeToSqrt = _.range(0, datasq+1); // [1, 2, 3, 4, 5]
var StairsIterator = datasq+1;
var StairsPos, mirroredStairsPos;
var changePosforStairs = function(mirror, cross) {
  if (dataRangeToSqrt[StairsIterator-1]) {
    StairsIterator--;
  } else {
    StairsIterator = datasq + 1;
    // if we have several separate entities calling this function
    // we need to reset iteration between renders.
  }
  var position = dataRangeToSqrt[StairsIterator];
  StairsPos = '0 ' + position + ' ' + position;
  if (mirror && !cross) { // dataRangeMax - position + transform
    var positionMirrorZ = (datasq+1) - dataRangeToSqrt[StairsIterator] + Math.round(datasq / 2) + 2; // must be a cleaner way...
    mirroredStairsPos = '0 ' + position + ' ' + positionMirrorZ;
  } else if (mirror && cross) {
    var positionMirrorZ = (datasq+1) - dataRangeToSqrt[StairsIterator];
    mirroredStairsPos = '0 ' + position + ' ' + positionMirrorZ;
  }
};
// original stairs as above, mirror calls `changePosforStairs(true, false);`


// pyramid


// cube
// adjacent box layouts
// note: need large dataset to render proper 3D cubes.
// to make cube proper n*n*n you have to Math.floor
// and render on the nearest number that has a non-floating point cube root.
var datacb = Math.floor(Math.cbrt(len));
var dataRangeToCbrt = _.range(0, datacb);
var cubeslice = datacb * datacb;
var CubeIterator = datacb;
var CubePosition;
var changePosForCube = function() {
  CubeIterator--;
  var position = dataRangeToCbrt[CubeIterator];
  CubePosition = '0 0 ' + position;
};

{dataRangeToCbrt.map(function(i) {
  changePosForCube();
  return <Entity layout={{type: 'box', margin: '2', columns: `${datacb}`}} position={CubePosition}>
    {data.slice(0, cubeslice).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box"> </Entity> })}
  </Entity>
})}

// Conway's Game of Life
