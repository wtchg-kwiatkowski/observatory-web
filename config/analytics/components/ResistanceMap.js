import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Card, CardContent, CardHeader} from '@material-ui/core';
import Map from 'components/Map/Map';
import TileLayer from 'components/Map/TileLayer';
import TableMarkersLayer from 'components/Map/TableMarkersLayer';
import TableGeoJSONsLayer from 'components/Map/TableGeoJSONsLayer';
import {FormControl, FormControlLabel} from '@material-ui/core';
import {Radio, RadioGroup} from '@material-ui/core';
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import HideLayerAtZoom from 'components/Map/HideLayerAtZoom';
import FeatureGroup from 'components/Map/FeatureGroup';
import DocTemplate from 'panoptes/DocTemplate';
import {propertyColour}  from 'util/Colours';
import SiteMarker from './SiteMarker';
import Typography from '@material-ui/core/Typography';
import TableData from 'components/Map/TableData';
import AttributeToColour from 'components/AttributeToColour';
import MarkerLayer from 'components/Map/MarkerLayer';
import MarkerLayerMarker from 'components/Map/MarkerLayerMarker';
import MarkerLayerPopup from 'components/Map/MarkerLayerPopup';

let ResistanceMap = createReactClass({
  displayName: 'ResistanceMap',

  mixins: [
    FluxMixin,
    ConfigMixin,
  ],

  propTypes: {
    drug: PropTypes.string,
    setProps: PropTypes.func.isRequired,
  },

  handleChange(e, drug) {
    this.props.setProps({drug});
  },

  render() {
    let {drug} = this.props;

    // getDefaultProps doesn't handle empty string
    drug = drug === undefined || drug === '' ? 'sites' : drug;
    return (
      <div className="obs-page-container centering-container">
        <Card>
          <CardContent>
            <CardHeader title={<span>Global resistance status</span>}/>
            {drug !== 'sites' ?
              <Typography >
                Regions are shaded by resistance status.
                The size of the circle indicates the number of samples collected for that site.
              </Typography>
              :
              <Typography >
                Each marker is a site, with the coloured circles representing the resistance status of 6 key antimalarial drugs. Click a site for more details.
              </Typography>
            }
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="drug"
                name="drug"
                // className={classes.group}
                value={drug}
                onChange={this.handleChange}
                style={{flexDirection: 'row'}}
              >
                <FormControlLabel value="sites" control={<Radio/>} label="All drugs"/>
                <FormControlLabel value="ART" control={<Radio/>} label="Artemisinin"/>
                <FormControlLabel value="CQ" control={<Radio/>} label="Chloroquine"/>
                <FormControlLabel value="MQ" control={<Radio/>} label="Mefloquine"/>
                <FormControlLabel value="PPQ" control={<Radio/>} label="Piperaquine"/>
                <FormControlLabel value="PYR" control={<Radio/>} label="Pyrimethamine"/>
                <FormControlLabel value="SDX" control={<Radio/>} label="Sulfadoxine"/>
              </RadioGroup>
            </FormControl>
            <div style={{width: '80vw', height: '60vh'}}>
              <Map>
                <TileLayer/>
                {drug !== 'sites' ?
                  <FeatureGroup>
                    <HideLayerAtZoom above={2}>
                      <TableGeoJSONsLayer
                        onClickBehaviour="tooltip"
                        onClickComponent="DocTemplate"
                        onClickComponentProps={{drug_id:drug, dynamicSize: true, path: "templates/regionCloroplethTooltip.html"}}
                        table="pf_regions"
                        geoJsonProperty="geojson"
                        max={100}
                        min={0}
                        showLegend={false}
                        geoJsonStrokeOpacity={0.7}
                        geoJsonFillOpacity={0.7}
                        colourProperty={`${drug}resistance`}
                      />
                    </HideLayerAtZoom>
                    <HideLayerAtZoom above={2}>
                      <TableMarkersLayer disableOnClickMarker table="sites" clusterMarkers={false}>
                        <svg style={{pointerEvents:"none", width: "4px", height: "4px", position: "absolute", left: "-2px", top: "-2px"}} viewBox="0 0 100 100">
                          <circle cx={50} cy={50} r={50} strokeWidth={0} fill="black" opacity={0.75} />
                        </svg>
                      </TableMarkersLayer>
                    </HideLayerAtZoom>
                    <HideLayerAtZoom below={2}>
                      <TableGeoJSONsLayer
                        onClickBehaviour="tooltip"
                        onClickComponent="DocTemplate"
                        onClickComponentProps={{drug_id:drug, dynamicSize: true, path: "templates/regionCloroplethTooltip.html"}}
                        table="pf_regions"
                        geoJsonProperty="geojson"
                        colourProperty={`${drug}resistance`}
                        max={100}
                        min={0}
                        showLegend={false}
                        geoJsonStrokeOpacity={0.5}
                        geoJsonFillOpacity={0.5}
                      />
                    </HideLayerAtZoom>
                    <HideLayerAtZoom below={2}>
                      <TableData
                        table="sites"
                        area={["sql_max",[25,["*", [6, "num_samples"]]]]}
                        name="name"
                        lat="lat"
                        lng="lng"
                        colour={`${drug}resistance`}
                        resistance={`${drug}resistance`}
                        primKey="site_id"
                        num_samples="num_samples"
                      >
                        <AttributeToColour table="sites" property={`${drug}resistance`}>
                          <MarkerLayer>
                            <MarkerLayerMarker>
                              <DocTemplate hideEditButton path="templates/circleMapMarker.html"/>
                            </MarkerLayerMarker>
                            <MarkerLayerPopup>
                              <DocTemplate hideEditButton path="templates/drugResistanceInRegionSiteSamplesOnClickClusterTooltip.html"/>
                            </MarkerLayerPopup>
                          </MarkerLayer>
                        </AttributeToColour>
                      </TableData>
                    </HideLayerAtZoom>
                  </FeatureGroup>
                  :
                  <TableMarkersLayer
                    clickPrimaryKeyProperty="site_id"
                    table="sites"
                    clusterMarkers={false}
                    onClickSingleBehaviour="tooltip"
                    onClickSingleComponent="ItemTemplate"
                    onClickSingleComponentTemplateDocPath="templates/siteOnClickTooltip.html"
                    childDataColumns={['ARTresistance', 'CQresistance', 'MQresistance', 'PPQresistance', 'PYRresistance', 'SDXresistance']}
                  >
                    <SiteMarker flux={this.getFlux()}/>
                  </TableMarkersLayer>
                }

              </Map>
            </div>
            <div style={{display: 'flex', flexWrap:' wrap', paddingTop: '7px'}}>
              <div style={{flexBasis: '128px'}}><DocTemplate path="templates/resistanceMapKey.html"/></div>
              <div style={{flexBasis: '310px', flexGrow: '1', minWidth: '310px'}}><DocTemplate path="templates/resistanceMapLegend.html"/></div>
            </div>
          </CardContent>
        </Card>
      </div>);
  },
});

export default ResistanceMap;
