import {Entity} from 'aframe-react';
import React from 'react';
import 'aframe-extras';
var extras = require('aframe-extras');
extras.registerAll();


export default props => (
  <Entity geometry={{primitive: 'sphere', radius: 100}}
          material={{color: "#73CFF0", shader: 'flat'}}
          scale="1 1 -1"
          static-body
          />
);
