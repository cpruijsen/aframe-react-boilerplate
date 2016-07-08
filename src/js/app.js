import 'aframe';
import 'aframe-layout-component';
import 'babel-polyfill';
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
      color: 'red'
    }
  }

  changeColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  };

  render () {
    var that = this;
    return (
      <Scene>
        {/*
         add onEnterVR, noExitVR, onLoaded -- in props -- functions.
      -- on load show 2D space
         on click of new button - enter VR
         on enterVR start initial 3d render
         on button or keypress Esc exitVR
         on exitVR go back to 2D representation
         >> use D3 for 2D representation ?
        */}
        <Camera><Cursor/></Camera>

        <Sky/>

        {/*
          try out: 'box', 'circle', 'cube', 'dodecahedron', 'line', 'pyramid'
          github.com/ngokevin/aframe-layout-component/blob/master/index.js
          <Entity layout='type: ***; margin: '></Entity>
          // columns, margin, radius ( > 0 )

          * taken from box:
          var x = person.id - 230;
          var y = Math.random();
          var z = -5;
          position={`${x} ${y} ${z}`}
        */}

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>
        <Entity layout="type: circle; margin: 10; radius: 7">

        {data.map(function(person) {

          return <Entity key={person.id} data={person}
                  geometry="primitive: box"
                  material={{src: `url(${person.image})`, color: that.state.color}}
                  onClick={that.changeColor}
                  >
            <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
          </Entity>;
        })}

        <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/> {/* somehow animate the entire circle of ( animated...) boxes */}

        </Entity>
      </Scene>
    ); // render ()
  } // render {}
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
