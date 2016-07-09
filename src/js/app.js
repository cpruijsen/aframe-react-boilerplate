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
    var dataRangeToSqrt = _.range(0, datasq+1); // [1, 2, 3, 4, 5]

    // circles and cylinders
    // need to provide an x and z value to position cylinder.
    var circleIterator = datasq+1;
    var circlePosition;
    var changePosForCylinder = function(z) {   // change Y
      circleIterator--;
      var position = dataRangeToSqrt[circleIterator];
      circlePosition = '0 ' + position + ' ' + z;
    };

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

        {dataRangeToSqrt.map(function(i) {
          changePosForCylinder(15);
          return <Entity layout={{type: 'circle', radius: `${datasq}`}} position={circlePosition}>

            {data.slice(0, 5).map(function(person) {
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
                  onClick={that.changeColor}
                  >
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

      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
