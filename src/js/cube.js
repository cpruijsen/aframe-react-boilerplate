// cubes
var cubeslice = datacb * datacb;
var cubeSliceStart = 0; // TODO: make dynamic.
var CubeIterator = datacb;
var CubePosition = 0;
var changePosForCube = function() {
  CubeIterator--;
  var position = dataRangeToCbrt[CubeIterator];
  CubePosition = `-20 0 ${position}`;
};

{/* cube as adjacent boxes */}
{/* TODO: make dynamic slice */}
{dataRangeToCbrt.map(function(i) {
  changePosForCube();
  return <Entity layout={{type: 'box', margin: '1', columns: `${datacb}`}} position={CubePosition}>

    {data.slice(0, cubeslice).map(function(person) {
      return <Entity key={person.id} data={person}
              geometry="primitive: box"
              material={{src: `url(${person.image})`, color: that.state.color}}
              onClick={that.changeColor}
              >
        </Entity>;
    })}
  </Entity>
})}
