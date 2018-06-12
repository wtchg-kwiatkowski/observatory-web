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
      <svg className="site-marker">
        <g>
          <rect x="0" y="0" width="34" height="24" rx="5" ry="5" style={{fill: 'black'}}/>
          <rect x="1" y="1" width="32" height="22" rx="4" ry="4" style={{fill: 'white'}}/>
          <circle
            style={{fill:colourFunc(ARTresistance)}}
            cx="7"
            cy="7"
            r="4"
          />
          <circle
            style={{fill:colourFunc(CQresistance)}}
            cx="17"
            cy="7"
            r="4"
          />
          <circle
            style={{fill:colourFunc(MQresistance)}}
            cx="27"
            cy="7"
            r="4"
          />
          <circle
            style={{fill:colourFunc(PPQresistance)}}
            cx="7"
            cy="17"
            r="4"
          />
          <circle
            style={{fill:colourFunc(PYRresistance)}}
            cx="17"
            cy="17"
            r="4"
          />
          <circle
            style={{fill:colourFunc(SDXresistance)}}
            cx="27"
            cy="17"
            r="4"
          />
          <polygon points="14,24 17,27 20,24" style={{fill: 'black'}}/>
          <polygon points="14,23 17,26 20,23" style={{fill: 'white'}}/>
        </g>
      </svg>
    );
  }
});

export default SiteMarker;
