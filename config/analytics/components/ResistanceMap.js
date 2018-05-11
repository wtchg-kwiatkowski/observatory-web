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
    return <svg style={{width: "34px", height:"49px", transform: "translate(-17px,-50px"}}>
      <g transform="translate(-8,0)">
        <g transform="scale(0.05,0.05)">
        <path
          d="m 500,42.7 c 162.1,0 294,131.9 294,294 0,51.6 -13.7,102.4 -39.5,147 L 500,924.7 245.5,483.7 C 219.7,439.1 206,388.3 206,336.7 206,174.5 337.9,42.7 500,42.7 Z M 500,10 c -180.4,0 -326.7,146.3 -326.7,326.7 0,59.6 16,115.3 43.9,163.3 L 500,990 782.8,500 C 810.6,451.9 826.7,396.2 826.7,336.7 826.6,156.3 680.4,10 500,10 Z"
        />
        <path
          style={{fill:'#ffffff'}}
          d="M 462.10733,858.3137 C 293.48638,566.33602 244.48742,481.15409 238.80362,470.11275 222.52114,438.48243 213.48523,408.87911 208.05206,369.36502 c -1.3402,-9.74697 -1.34571,-54.52657 -0.008,-65.16768 6.87387,-54.68035 25.42165,-101.19811 57.34391,-143.81833 43.56397,-58.16335 108.53447,-98.63126 180.241,-112.265964 53.70499,-10.211784 110.85259,-4.773139 161.79562,15.397827 72.30305,28.628495 130.36837,84.627237 161.79089,156.032627 26.78373,60.8641 31.65587,131.8852 13.46348,196.25669 -5.34942,18.92825 -13.70136,40.09117 -22.10803,56.01945 -2.23497,4.23462 -40.86279,71.48093 -85.83961,149.43623 -44.97681,77.9553 -102.48801,177.63532 -127.80265,221.51115 -25.31463,43.87582 -46.26268,80.02875 -46.55121,80.33984 -0.28852,0.31108 -17.51007,-28.84584 -38.27012,-64.79316 z M 700.68178,509.0694 c 13.06457,-3.75574 22.93285,-9.47367 32.75962,-18.98175 24.55335,-23.75706 30.7096,-59.83415 15.41592,-90.34093 -4.04824,-8.07519 -6.65725,-11.71332 -13.54842,-18.89265 -26.0817,-27.17233 -67.62741,-31.67601 -98.76023,-10.70593 -11.61183,7.82136 -22.84087,21.34003 -28.12681,33.86192 -4.67532,11.07539 -5.84227,17.32346 -5.77068,30.89717 0.068,12.89314 0.97482,17.88024 5.20108,28.60392 6.84678,17.37295 22.38082,33.65832 39.51694,41.4282 16.25808,7.37177 36.56401,8.94484 53.31258,4.13005 z m -180.52196,-2.1653 c 29.61184,-6.41912 51.47908,-27.63479 59.67001,-57.89206 1.30629,-4.82546 1.58826,-7.98985 1.59058,-17.85008 0.002,-10.56571 -0.23061,-12.8655 -1.96838,-19.42193 -6.89821,-26.02616 -26.39558,-46.56226 -51.8194,-54.58009 -20.45709,-6.45148 -44.36658,-3.83732 -62.15374,6.79562 -24.39549,14.58331 -38.57627,39.28864 -38.57627,67.2064 0,38.00599 27.641,70.28628 65.49883,76.49222 7.27816,1.1931 20.43432,0.83759 27.75837,-0.75008 z m -182.37496,-0.4892 c 18.34673,-2.24307 34.26777,-10.19436 46.94838,-23.44695 9.76231,-10.20264 15.89408,-21.1719 19.45199,-34.79812 1.56764,-6.00382 1.91028,-9.0968 1.96704,-17.75693 0.0754,-11.50365 -0.72118,-16.79267 -3.96602,-26.33278 -8.20952,-24.13669 -28.94258,-43.25888 -53.93428,-49.7438 -14.07622,-3.65252 -32.66801,-2.62305 -46.50743,2.57524 -18.93436,7.11204 -35.80656,23.09455 -43.73408,41.42795 -7.35249,17.00356 -8.40038,36.89692 -2.87225,54.52728 11.01415,35.12638 46.30414,57.99134 82.64665,53.54811 z M 695.94434,340.271 c 27.63168,-7.34048 48.93652,-28.65321 56.14587,-56.16671 1.9646,-7.49761 2.64952,-21.85611 1.43787,-30.14269 -1.89521,-12.96142 -7.0808,-25.2397 -15.2303,-36.06184 -21.44119,-28.47285 -61.44178,-38.30079 -93.93849,-23.08019 -8.26798,3.87251 -13.75852,7.61098 -20.37527,13.87341 -7.47144,7.07135 -12.23078,13.50812 -16.62847,22.4892 -22.41892,45.78451 4.92674,100.43231 55.12449,110.16126 7.71028,1.49435 26.00971,0.90791 33.4643,-1.07244 z m -175.85053,-3.45429 c 34.90406,-8.85415 58.86673,-39.36007 58.86673,-74.94091 0,-22.08676 -8.52544,-41.53908 -25.01097,-57.06699 -22.85261,-21.52516 -57.49079,-26.72242 -86.22352,-12.93734 -34.05641,16.33922 -51.49567,56.37269 -40.28409,92.47594 4.01531,12.93001 10.54788,23.41922 20.52911,32.96316 9.92342,9.48866 20.70188,15.70459 33.15698,19.12159 12.32765,3.38204 26.59424,3.52283 38.96576,0.38455 z m -185.69934,0.31123 c 9.36272,-1.0618 16.70872,-3.20977 25.46783,-7.4468 39.07573,-18.90202 54.89703,-65.57537 35.42639,-104.50898 -8.42726,-16.8512 -24.03073,-30.91143 -41.61212,-37.49654 -9.50855,-3.56142 -16.68183,-4.82651 -27.30284,-4.81515 -20.57915,0.022 -38.15232,6.81779 -52.65637,20.36297 -7.26022,6.78024 -12.02532,13.02747 -16.34067,21.42323 -15.40359,29.96853 -9.76218,66.56498 13.84785,89.83267 7.52796,7.41881 12.44022,10.93552 21.22292,15.19359 14.05591,6.81464 27.12013,9.13648 41.94701,7.45501 z"
          />
        <circle
                style={{fill:colourFunc(ARTresistance)}}
                cx="326.17596"
                cy="260.07071"
                r="76.589714"/>
        <circle
          style={{fill:colourFunc(CQresistance)}}
                cx="501.53024"
                cy="261.6445"
                r="76.589714"/>
        <circle
          style={{fill:colourFunc(MQresistance)}}
                cx="676.88452"
                cy="265.12747"
                r="76.589714"/>
        <circle
          style={{fill:colourFunc(PPQresistance)}}
                cx="328.98294"
                cy="429.44769"
                r="76.589714"/>
        <circle
          style={{fill:colourFunc(PYRresistance)}}
                cx="504.33722"
                cy="431.02148"
                r="76.589714"/>
        <circle
          style={{fill:colourFunc(SDXresistance)}}
                cx="679.69147"
                cy="434.50446"
                r="76.589714"/>
        </g></g></svg>;
  }
});

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
                    <HideLayerAtZoom above={4}>
                      <TableMarkersLayer disableOnClickMarker table="sites" clusterMarkers={false}>
                        <svg style={{pointerEvents:"none", width: "4px", height: "4px", position: "absolute", left: "-2px", top: "-2px"}} viewBox="0 0 100 100">
                          <circle cx={50} cy={50} r={50} strokeWidth={0} fill="black" opacity={0.75} />
                        </svg>
                      </TableMarkersLayer>
                    </HideLayerAtZoom>
                    <HideLayerAtZoom below={4}>
                      <TableGeoJSONsLayer
                        onClickBehaviour="tooltip"
                        onClickComponent="DocPage"
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
                    childDataColumns={['ARTresistance', 'CQresistance', 'MQresistance', 'PPQresistance', 'PYRresistance', 'SDXresistance']}
                  >
                    <SiteMarker flux={this.getFlux()}/>
                  </TableMarkersLayer>
                }

              </Map>
            </div>
            <div style={{maxWidth: "500px"}}><DocTemplate path="templates/resistanceMapLegend.html"/></div>
          </CardContent>
        </Card>
      </div>);
  },
});

export default ResistanceMap;
