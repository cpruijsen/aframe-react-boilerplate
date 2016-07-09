import 'aframe';
import 'aframe-layout-component';
import 'babel-polyfill';
import _ from 'underscore';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import data from '../data/data';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'yellow',
      layout: 'circle'
    }
  }

  changeColor = () => {
    const colors = ['orange', 'yellow', 'green', 'blue']; // experiment colors.
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    }); // why the trailing comma ?
  };

  changeLayout = () => {
    const layoutTypes = ['box', 'circle', 'cube', 'dodecahedron', 'line', 'pyramid'];
    this.setState({
      layout: layoutTypes[Math.floor(Math.random() * layoutTypes.length)],
    });
  };

  getLayoutOptions = () => {
    if (this.state.layout === 'circle') {
      return {
        margin: 0,
        radius: 7,
        columns: 0
      };
    } else if (this.state.layout === 'box') {
      return {
        margin: 1.5,
        radius: 0,
        columns: 8
      };
    } else if (this.state.layout === 'line') {
      return {
        margin: 1.5,
        radius: 0,
        columns: 0
      };
    } else if (this.state.layout === 'dodecahedron') {
      return {
        margin: 0, // takes 20 (do deca) boxes
        radius: 20, // leaves rest in prev. config.
        columns: 0
      };
    } else if (this.state.layout === 'pyramid') {
      return {
        margin: 0,
        radius: 20, // this seems to only take 4 entity boxes into a pyramic
        columns: 0 // leaving the rest in the previous configuration.
      };
    } else if (this.state.layout === 'cube') {
      return {
        margin: 0, // as pyramid, but using 6 boxes
        radius: 20, // rest is left in prev. config.
        columns: 0
      }
    }
  };

  render () {
    var that = this;
    // layout shapes demo
    var currentLayoutOptions = that.getLayoutOptions();

    // general internal
    var len = data.length;
    var datasq = Math.floor(Math.sqrt(len)); // 43 => 6
    var datacb = Math.floor(Math.cbrt(len));
    var dataRangeToSqrt = _.range(0, datasq + 1); // [0, 1, 2, 3, 4, 5, 6]
    var dataRangeToCbrt = _.range(0, datacb ); // 43 => [0, 1, 2, 3]

    // pyramids
    // n*n | n-1*n-1 | n-2 * n-2 | ...
    // filled pyramid made of primitives
    // each layer is n*n where layer++ => n--;
    // margin needs to be 2 to not make it lopsided.
    // as you cannot place a 3*3 on a 4*4 without overlap
    // you could make the 'jump' on n be -2 and margin 1

    var sliceArr = []; // if (i+1) slice (i, i+1) else slice to count
    var numBoxesUsedInPyramid,
        leftOverBoxes,
        pyramidCurrentN,
        pyramidPosition,
        pyramidSliceStart,
        pyramidSliceEnd,
        pyramidIterator = 0; // boxes to use in Pyramid
    var calculatePyramid = function(n, base, count) {
      var count = count || 1;
      var base = base || 2;
      if (count === n) {
        numBoxesUsedInPyramid = count;
        leftOverBoxes = n - count;
        sliceArr.push(count);
        return base-1;
      } else if (count > n) {
        return base - 2;
      } else {
        numBoxesUsedInPyramid = count;
        leftOverBoxes = n - count;
        sliceArr.push(count);
        return calculatePyramid(n, base + 1, count + base*base);
      }
    };
    calculatePyramid(len);
    sliceArr = sliceArr.reverse();
    var pyramidPositionX = -10;
    var pyramidPositionY = 1;
    var pyramidPositionZ = -20;

    // NOTE: could pass 'leftOverBoxes' into a separate thread of calculatePyramid and render a mini-pyramid next to the main pyramid etc...

    var determineNforPyramid = function() {
      pyramidSliceStart = numBoxesUsedInPyramid - sliceArr[pyramidIterator];
      if (sliceArr[pyramidIterator+1]) {
        pyramidSliceEnd = numBoxesUsedInPyramid - sliceArr[pyramidIterator+1];
      } else {
        pyramidSliceEnd = numBoxesUsedInPyramid; // so we don't get NaN
      }
      pyramidIterator++;
      pyramidCurrentN = Math.sqrt(pyramidSliceEnd - pyramidSliceStart);
    };

    var changePositionForPyramid = function() {
      pyramidPositionX +=1;
      pyramidPositionY +=1;
      pyramidPositionZ +=1;

      pyramidPosition = `${pyramidPositionX} ${pyramidPositionY} ${pyramidPositionZ}`
    };

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

    // circles and cylinders
    // need to provide an x and z value to position cylinder.
    var circleIterator = datacb;
    var circlePosition;
    var changePosForCylinder = function(z) {   // change Y
      circleIterator--;
      var position = dataRangeToCbrt[circleIterator];
      circlePosition = `0 ${position} ${z}`;
    };
    // rendering for cylinders can be cleaned up.

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

    return (
      <Scene>
        {/* TODO:
         add onEnterVR, noExitVR, onLoaded -- in props :: functions.
         on load show 2D space
         on click of new button - enter VR
         on enterVR start initial 3d render
         on button or keypress Esc exitVR
         on exitVR go back to 2D representation
         >> use D3 for 2D representation ?
        */}
        <Camera><Cursor/></Camera>

        <Sky/>

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>


          {/* cylinder as stacked circles */}
          {/* TODO: dynamic slicing */}
          {dataRangeToCbrt.map(function(i) {
            changePosForCylinder(15);
            return <Entity layout={{type: 'circle', radius: `${datacb}`}} position={circlePosition}>

              {data.slice(0, 15).map(function(person) {
                return <Entity key={person.id} data={person}
                        geometry="primitive: box"
                        material={{src: `url(${person.image})`, color: that.state.color}}
                        onClick={that.changeColor}
                        >
                  </Entity>;
              })}

            </Entity>
          })}

        {/*another one*/}

        {/* container for pyramid of boxes! */}
        {sliceArr.map(function(i) {
          determineNforPyramid();
          changePositionForPyramid();
            return <Entity layout={{type: 'box', margin: '2', columns: `${pyramidCurrentN}`}} position={pyramidPosition} rotation="90 0 0">

            {data.slice(pyramidSliceStart, pyramidSliceEnd).map(function(person) {
              return <Entity key={person.id}
                geometry="primitive: box"
                material={{src: `url(${person.image})`, color: that.state.color}}
                onClick={that.changeColor} >
              </Entity>
            })}
          </Entity>

        })}

        {/* controller entity for layout test container */}
        <Entity onClick={that.changeLayout} geometry="primitive: cylinder" material="color: red" position="1 0 -5"> </Entity>

       {/* Layout tests container entity component */}
        <Entity
          layout={{type: `${that.state.layout}`,
            margin: `${currentLayoutOptions.margin}`,
            radius: `${currentLayoutOptions.radius}`,
            columns: `${currentLayoutOptions.columns}`
          }}
          position="10 1 -10"
        >

        {data.map(function(person) {

          return <Entity key={person.id} data={person}
                  geometry="primitive: box"
                  material={{src: `url(${person.image})`, color: that.state.color}}
                  onClick={that.changeColor} >
            <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
          </Entity>;
        })}
        {/*<Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>*/}
        </Entity>

        {/* Stairs layout container */}
        {/*{ dataRangeToSqrt.map(function(i) {
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
        }*/}

        {/* tunnel as two mirrored stairs */}
          {/*{ dataRangeToSqrt.map(function(i) {
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
          }*/}

          {/* cube as adjacent boxes */}
          {/* TODO: make dynamic slice */}
          {/*{dataRangeToCbrt.map(function(i) {
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
          })}*/}





      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
