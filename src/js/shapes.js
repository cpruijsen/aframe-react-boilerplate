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
              geometry="primitive: box">
        </Entity>;
    })}
  </Entity>
  })}

// tunnel
// ## one way to do this: stairs + a transformed stairs (mirrored)

var len = data.length;
var datasq = Math.floor(Math.sqrt(len)); // 43 => 6

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
// original stairs as above, mirror as below.
{ dataRangeToSqrt.map(function(i) {
  changePosforStairs(true, false);
   return <Entity key={i} layout="type: line, margin: 1.5"
          position={mirroredStairsPos}>
    {data.slice(0, 5).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box">
        </Entity>;
    })}
  </Entity>
  })}


// pyramid


// cube


// Conway
