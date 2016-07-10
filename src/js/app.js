import 'aframe';
import 'aframe-layout-component';
import 'babel-polyfill';
import 'aframe-text-component';
import 'aframe-extras';
var extras = require('aframe-extras');
extras.registerAll();
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
    const colors = ['orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
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
        radius: 20, // renders 4 entity boxes into a pyramid
        columns: 0 // leaving the rest in the previous configuration.
      };
    } else if (this.state.layout === 'cube') {
      return {
        margin: 0, // as pyramid, using 6 boxes
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
    var numCircles = Math.floor(len / 10); // arbitrary... for now.
    var dataRangeToSqrt = _.range(0, datasq + 1); // [0, 1, 2, 3, 4, 5, 6]
    var dataRangeToCbrt = _.range(0, datacb ); // 43 => [0, 1, 2, 3]
    var dataRangeCircles = _.range(0, numCircles); // 42 => [0, 1, 2, 3]

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
        pyramidMirroredPosition,
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
    var pyramidMirroredPositionX = -10;
    var pyramidMirroredPositionY = 0; // or 0 for overlap
    var pyramidMirroredPositionZ = -20;

    // NOTE: could pass 'leftOverBoxes' into a separate thread of calculatePyramid and render a mini-pyramid next to the main pyramid etc...

    var determineNforPyramid = function() {
      if (!sliceArr[pyramidIterator]) {
        pyramidIterator = 0; // reset on mirrored pyramid creation.
      }

      pyramidSliceStart = numBoxesUsedInPyramid - sliceArr[pyramidIterator];
      if (sliceArr[pyramidIterator+1]) {
        pyramidSliceEnd = numBoxesUsedInPyramid - sliceArr[pyramidIterator+1];
      } else {
        pyramidSliceEnd = numBoxesUsedInPyramid; // so we don't get NaN
      }
      pyramidIterator++;
      pyramidCurrentN = Math.sqrt(pyramidSliceEnd - pyramidSliceStart);
    };

    var changePositionForPyramid = function(options) {
      options = options || {};
      if (options.mirrored) { // X and Z could go +1 instead ?
        pyramidMirroredPositionX +=1;
        pyramidMirroredPositionY -=1;
        pyramidMirroredPositionZ +=1;
        pyramidMirroredPosition = `${pyramidMirroredPositionX} ${pyramidMirroredPositionY} ${pyramidMirroredPositionZ}`
      }
      pyramidPositionX +=1; // on second iteration (mirrored) this shouldn't affect
      pyramidPositionY +=1; // rendering of the first pyramid.
      pyramidPositionZ +=1;
      pyramidPosition = `${pyramidPositionX} ${pyramidPositionY} ${pyramidPositionZ}`
    };

    return (
      // TODO: make physics work so jumping is enabled and falling etc doesn't
      <Scene physics="debug: true">
        <Camera><Cursor/></Camera>
        <Sky/>

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>
        <Entity geometry="grid" static-body/>

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

          {/*// === MIRRORED PYRAMID === //*/}
          {sliceArr.map(function(i) {
            determineNforPyramid();
            changePositionForPyramid({mirrored: true});
              return <Entity layout={{type: 'box', margin: '2', columns: `${pyramidCurrentN}`}} position={pyramidMirroredPosition} rotation="90 0 0">

              {data.slice(pyramidSliceStart, pyramidSliceEnd).map(function(person) {
                return <Entity key={person.id}
                  geometry="primitive: box"
                  material={{src: `url(${person.image})`, color: that.state.color}}
                  onClick={that.changeColor} >
                </Entity>
              })}
            </Entity>
          })}



        {/*another one*/}
        {/*curved surface scatterplot*/}

        {/*another one*/}
        {/*inverted mirrored pyramids (one 0 -> Y++ and another 0 -> Y--)*/}

        {/* controller entity for layout test container */}
        <Entity onClick={that.changeLayout} geometry="primitive: cylinder" material="color: red" position="1 0 -5"> </Entity>

       {/* Layout tests container entity component */}
        <Entity
            layout={{type: `${that.state.layout}`,
            margin: `${currentLayoutOptions.margin}`,
            radius: `${currentLayoutOptions.radius}`,
            columns: `${currentLayoutOptions.columns}` }}
            position="10 1 -10" >

        {data.map(function(person) {
          return <Entity key={person.id} data={person}
                  geometry="primitive: box"
                  material={{src: `url(${person.image})`, color: that.state.color}}
                  onClick={that.changeColor} >
            <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
          </Entity>; })}
        </Entity>

      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
