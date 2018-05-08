import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Map from 'components/Map/Map';
import TileLayer from 'components/Map/TileLayer';
import TableMarkersLayer from 'components/Map/TableMarkersLayer';
import TableGeoJSONsLayer from 'components/Map/TableGeoJSONsLayer';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import HideLayerAtZoom from 'components/Map/HideLayerAtZoom';
import FeatureGroup from 'components/Map/FeatureGroup';
import DocTemplate from 'panoptes/DocTemplate';

let ResistanceMap = createReactClass({
  displayName: 'ResistanceMap',

  mixins: [
    FluxMixin,
    ConfigMixin,
  ],

  propTypes: {
    initialDrug: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initialDrug: 'sites',
    };
  },

  getInitialState() {
    const {initialDrug} = this.props;
    return {
      drug: (initialDrug !== undefined && initialDrug !== null && this.props.initialDrug !== '') ? this.props.initialDrug : 'sites',
    };
  },

  handleChange(e, drug) {
    this.setState({drug});
  },

  render() {
    let {drug} = this.state;
    let {constants} = this.config;
    return (
      <div className="centering-container">
        <Card>
          <CardContent>
            <CardHeader title={<span>Sites with <em>P. falciparum</em> samples</span>}/>
            <Typography component="p">This map shows the location of sites providing samples in this data set. Clicking
              a site will lead to information about that site. <br/> To view the proportion of resistant samples as a
              pie chart at each site, select a drug below. The number in each pie is the number of samples from that
              site.</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="drug"
                name="drug"
                // className={classes.group}
                value={this.state.drug}
                onChange={this.handleChange}
                style={{flexDirection: 'row'}}
              >
                <FormControlLabel value="sites" control={<Radio/>} label="Sites"/>
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
                    <HideLayerAtZoom above={4}>
                      <TableGeoJSONsLayer
                        onClickBehaviour="tooltip"
                        onClickComponent="DocPage"
                        onClickComponentProps={`{"drug_id":"${drug}","drug_name":"{{name}}","dynamicSize":"true", "path":"templates/regionCloroplethTooltip.html"}`}
                        table="pf_regions"
                        geoJsonProperty="geojson"
                        colourProperty={`${drug}resistance`}
                        max={100}
                        min={0}
                        showLegend={false}
                        numberOfBins={5}
                        geoJsonStrokeOpacity={1}
                        geoJsonFillOpacity={1}
                        colourRange={[constants.mapRangeMin, constants.mapRangeMax]}
                        zeroColour={constants.mapRangeZero}
                        noDataColour={constants.mapNoData}
                      />
                    </HideLayerAtZoom>
                    <HideLayerAtZoom above={4}>
                      <TableMarkersLayer disableOnClickMarker table="sites" clusterMarkers={false}>
                        <svg style={{pointerEvents:"none", width: "6px", height: "6px", position: "absolute", left: "-3px", top: "-3px"}} viewBox="0 0 100 100">
                          <circle cx={50} cy={50} r={50} strokeWidth={0} fill="black" opacity={0.75} />
                        </svg>
                      </TableMarkersLayer>
                    </HideLayerAtZoom>
                    <HideLayerAtZoom below={4}>
                      <TableGeoJSONsLayer
                        onClickBehaviour="tooltip"
                        onClickComponent="DocPage"
                        onClickComponentProps={`{"drug_id":"${drug}","drug_name":"{{name}}","dynamicSize":"true", "path":"templates/regionCloroplethTooltip.html"}`}
                        table="pf_regions"
                        geoJsonProperty="geojson"
                        colourProperty={`${drug}resistance`}
                        max={100}
                        min={0}
                        showLegend={false}
                        numberOfBins={5}
                        geoJsonStrokeOpacity={0.5}
                        geoJsonFillOpacity={0.5}
                        colourRange={[constants.mapRangeMin, constants.mapRangeMax]}
                        zeroColour={constants.mapRangeZero}
                        noDataColour={constants.mapNoData}
                      />
                    </HideLayerAtZoom>
                    <HideLayerAtZoom below={4}>
                      <TableMarkersLayer
                        showLegend={true}
                        clickPrimaryKeyProperty="site_id"
                        table="pf_samples"
                        clusterMarkers={true}
                        markerColourProperty={`${drug}resistant`}
                        knownLegendValues={['yes', 'no', 'maybe']}
                        legendPropertyName="Resistance type"
                        onClickClusterBehaviour="tooltip"
                        onClickClusterComponent="HandlebarsWithComponents"
                        onClickClusterComponentTemplateDocPath="templates/ResistanceMapOnClickClusterTooltip.html"
                      />
                    </HideLayerAtZoom>
                  </FeatureGroup>
                  :
                  <TableMarkersLayer
                    clickPrimaryKeyProperty="site_id"
                    table="sites"
                    clusterMarkers={false}
                    onClickSingleBehaviour="tooltip"
                    onClickSingleComponent="ItemTemplate"
                    onClickSingleComponentTemplateDocPath="templates/ResistanceMapOnClickSingleTooltip.html"
                  />
                }

              </Map>
            </div>
            <DocTemplate path="templates/resistanceMapLegend.html"/>
          </CardContent>
        </Card>
      </div>);
  },
});

export default ResistanceMap;
