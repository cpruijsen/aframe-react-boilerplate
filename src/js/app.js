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
    var currentLayoutOptions = that.getLayoutOptions();
    var len = data.length;
    var datasq = Math.floor(Math.sqrt(len)); // 43 => 6
    var arr = _.range(0, datasq+1); // [1, 2, 3, 4, 5]
    var generateArrY = function(number, array) {
      var arr = [];
      for (var i = 0; i < number; i++) {
        arr = arr.concat(array);
      }
      return arr;
    };
    var generateArrZ = function(number, array) {
      var arr = [];
      var len = array.length;

      for (var i = 0; i < number; i++) {
          for(var j = 0; j < len; j++) {
            arr.push(array[j]);
          }
      }
      return arr;
    };
    var arrY = generateArrY(datasq, arr); // [1, 2, 3, 1, 2, 3, ...]
    var arrZ = generateArrZ(datasq, arr); // [1, 1, 1, 2, 2, 2, 3, 3, 3]
    var posY = arrY[len - 1]; // arr.length-1 => 4
    var posZ = arrZ[len - 1];
    var iterator = len - 1;
    var pos = '';

    var changePos = function() {
      iterator--;
      posY = arrY[iterator];
      posZ = arrZ[iterator];
      pos = '0 ' + posY + ' ' + posZ;
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

        <Entity onClick={that.changeLayout} geometry="primitive: cylinder" material="color: red" position="1 0 -5"> </Entity>

       {/* our container entity component */}
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

        {/*<Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/> {/* somehow animate the entire circle of ( animated...) boxes */}*/}
        </Entity>

        {/* another entity layout container */}
        {/*
          the way to make a cube of n * n is to change:
          - the slice of the dataset
            for an n*n cube - slice n
              so while x < n, x = 0, y = x + n || undefined
              TODO: one floor, one round to account for all boxes.

              1 2 3 1 2 3 1 2 3 Y
              1 1 1 2 2 2 3 3 3 Z

          - the positioning of the entities (along Y and Z axes)
          -- no need to change the X axis as the layout module maps against X

          // TODO: slice dynamic
        */}

        { arr.map(function(i) {
          changePos();

           return <Entity key={i} layout="type: line, margin: 1.5"
                  position={pos}>

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

      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
