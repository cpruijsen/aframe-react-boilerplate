// NOTE: can do this more easily with rotation="0 0 180" ?? try out rotation.

// stairs and mirrored stairs (X and tunnel)
// for stairs instead of sqrt to optimize size,
// we could as for an optional width and height
// and optimize size based on those if given.
var StairsIterator = datasq+1;
var StairsPos, mirroredStairsPos;
var changePosforStairs = function(mirror, cross) {
  if (dataRangeToSqrt[StairsIterator-1]) {
    StairsIterator--;
  } else {
    StairsIterator = datasq;
    // if we have several separate entities calling this function
    // we need to reset iteration between renders.
  }
  var position = dataRangeToSqrt[StairsIterator];
  StairsPos = `0 ${position} ${position}`;
  if (mirror && !cross) { // dataRangeMax - position + transform
    var positionMirrorZ = (datasq+1) - dataRangeToSqrt[StairsIterator] + Math.round(datasq / 2) + 2; // must be a cleaner way...
    mirroredStairsPos = `0 ${position} ${positionMirrorZ}`;
  } else if (mirror && cross) {
    var positionMirrorZ = (datasq+1) - dataRangeToSqrt[StairsIterator];
    mirroredStairsPos = `0 ${position} ${positionMirrorZ}`;
  }
};

{/* Stairs layout container */}
{ dataRangeToSqrt.map(function(i) {
  changePosforStairs();

   return <Entity key={i} layout="type: line, margin: 1.5"
          position={StairsPos}>

    {data.slice(0, 5).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box"
              material={{src: `url(${person.image})`, color: that.state.color}}
              onClick={that.changeColor}
              >
        <Animation attribute="rotation"
                  dur="5000"
                  repeat="indefinite"
                  to="0 360 360"
                  />
        </Entity>;
    })}

  </Entity>
  })
}

{/* tunnel as two mirrored stairs */}
  { dataRangeToSqrt.map(function(i) {
    changePosforStairs();

     return <Entity key={i} layout="type: line, margin: 1.5"
            position={StairsPos}>

      {data.slice(0, 5).map(function(person) {
        return <Entity key={person.id} data={person}
                geometry="primitive: box"
                material={{src: `url(${person.image})`, color: that.state.color}}
                onClick={that.changeColor}
                >
          </Entity>;
      })}

    </Entity>
    })
  }

  { dataRangeToSqrt.map(function(i) {
    changePosforStairs(true, false);

     return <Entity key={i} layout="type: line, margin: 1.5"
            position={mirroredStairsPos}>

      {data.slice(0, 5).map(function(person) {
        return <Entity key={person.id} data={person}
                geometry="primitive: box"
                material={{src: `url(${person.image})`, color: that.state.color}}
                onClick={that.changeColor}
                >
          </Entity>;
      })}

    </Entity>
    })
  }
