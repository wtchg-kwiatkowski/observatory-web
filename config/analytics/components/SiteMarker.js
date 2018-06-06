import React from 'react';
import createReactClass from 'create-react-class';
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import {propertyColour}  from 'util/Colours.js';


let SiteMarker = createReactClass({
  mixins: [
    FluxMixin,
    ConfigMixin,
  ],

  render() {
    const {
      ARTresistance,
      CQresistance,
      MQresistance,
      PPQresistance,
      PYRresistance,
      SDXresistance
    } = this.props;
    const colourFunc = propertyColour(this.config.tablesById['sites'].propertiesById['ARTresistance']);
    return (
      <svg style={{width: "30px", height:"24px", transform: "translate(-15px,-24px)"}}>
        <g>
          <rect x="0" y="0" width="30" height="21" rx="5" ry="5" style={{fill: 'black'}}/>
          <rect x="1" y="1" width="28" height="19" rx="3" ry="3" style={{fill: 'white'}}/>
          <circle
            style={{fill:colourFunc(ARTresistance)}}
            cx="6"
            cy="6"
            r="4"
          />
          <circle
            style={{fill:colourFunc(CQresistance)}}
            cx="15"
            cy="6"
            r="4"
          />
          <circle
            style={{fill:colourFunc(MQresistance)}}
            cx="24"
            cy="6"
            r="4"
          />
          <circle
            style={{fill:colourFunc(PPQresistance)}}
            cx="6"
            cy="15"
            r="4"
          />
          <circle
            style={{fill:colourFunc(PYRresistance)}}
            cx="15"
            cy="15"
            r="4"
          />
          <circle
            style={{fill:colourFunc(SDXresistance)}}
            cx="24"
            cy="15"
            r="4"
          />
          <polygon points="12,21 15,24 18,21" style={{fill: 'black'}}/>
          <polygon points="12,20 15,23 18,20" style={{fill: 'white'}}/>
        </g>
      </svg>
    );
  }
});

export default SiteMarker;
