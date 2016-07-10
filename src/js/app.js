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

    // rendering for cylinders can be cleaned up.

    return (
      <Scene physics="debug: true">
        <Camera><Cursor/></Camera>
        <Sky/>

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>
        <Entity geometry="grid" static-body/>

          {/* cylinder as stacked circles */}
          {/*
            TODO: dynamic slicing
            TODO: onMouseEnter: () => {}, // show infobox
                  onMouseLeave: () => {}, // hide infobox
            infobox: curvedsurface? // pane with opacity and text?
          */}

          {dataRangeCircles.map(function(i) {
            changePosForCylinder(10);
            determineSlicingCylinder({all: true}, i);

            return <Entity layout={{type: 'circle', radius: `${datacb}`}} position={circlePosition}>
            <Animation attribute="layout.radius" repeat="indefinite" to={`${datasq}`} direction="alternate" begin="2000"/>

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
