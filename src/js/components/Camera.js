import {Entity} from 'aframe-react';
import React from 'react';
import 'aframe-extras';
var extras = require('aframe-extras');
extras.registerAll();

export default props => (
  <Entity>
    <Entity camera="active:true"
      // universal-controls="movementEnabled: true"
      look-controls
      wasd-controls
      //kinematic-body
      dynamic-body
      keyboard-controls
      //touch-controls=""
      //hmd-controls=""
      //mouse-controls=""
      // jump-ability="enableDoubleJump: true; distance: 2;"
       {...props}/>
  </Entity>
);

{/*<a-entity camera="active:true" universal-controls="movementEnabled: true" kinematic-body=""jump-ability="enableDoubleJump: true; distance: 2.5;" velocity="0 0 0" gamepad-controls="" keyboard-controls="" touch-controls="" hmd-controls="" mouse-controls="" rotation="0 0 0"></a-entity>*/}
