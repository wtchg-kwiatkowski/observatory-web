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
    resetScroll: PropTypes.func
  },

  handleChange(e, drug) {
    this.props.setProps({drug});
  },

  componentWillMount() {
    if (this.props.resetScroll) this.props.resetScroll();
  },

  render() {
    let {drug} = this.props;

    // getDefaultProps doesn't handle empty string
    drug = drug === undefined || drug === '' ? 'sites' : drug;
    return (
      <div className="obs-page-container">
        <div className="centering-container">
          <Card>
            <CardContent>
              <Typography variant="headline">
                  Global resistance status
              </Typography>
              {drug !== 'sites' ?
                <Typography variant="subheading" color="textSecondary">
                  Each marker represents a site with parasite genome data. The area of the circle is proportional to the total number of samples collected at that site. Click on a different drug or site for further details.
                </Typography>
                :
                <Typography variant="subheading" color="textSecondary">
                  Each marker represents a site with parasite genome data. This summary shows the proportion of resistant parasites at six  antimalarial drugs. Click a drug or site for further details.
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
                <RadioGroup
                  aria-label="drug"
                  name="drug"
                  // className={classes.group}
                  value={drug}
                  onChange={this.handleChange}
                  style={{flexDirection: 'row'}}
                >
                  <FormControlLabel value="SP" control={<Radio/>} label="Sulfadoxine-pyrimethamine"/>
                  <FormControlLabel value="SPIPTp" control={<Radio/>} label="Sulfadoxine-pyrimethamine for IPTp"/>
                  <FormControlLabel value="ASMQ" control={<Radio/>} label="Artesunate-mefloquine"/>
                  <FormControlLabel value="DHAPPQ" control={<Radio/>} label="Dihydro-artemisinin-piperaquine"/>
                </RadioGroup>
              </FormControl>

              <div style={{width: '80vw', height: '60vh'}}>
                <Map>
                  <TileLayer/>
                  {drug !== 'sites' ?
                    <FeatureGroup>
                        <TableGeoJSONsLayer
                          disableClick
                          table="pf_regions"
                          geoJsonProperty="geojson"
                          max={100}
                          min={0}
                          showLegend={false}
                          geoJsonStrokeOpacity={0.5}
                          geoJsonFillOpacity={0}
                        />
                        <TableData
                          table="pf_sites"
                          area={["sql_max",[25,["*", [6, "num_samples"]]]]}
                          name="name"
                          lat="lat"
                          lng="lng"
                          colour={`${drug}resistance`}
                          resistance={`${drug}resistance`}
                          primKey="site_id"
                          num_samples="num_samples"
                        >
                          <AttributeToColour table="pf_sites" property={`${drug}resistance`}>
                            <MarkerLayer>
                              <MarkerLayerMarker>
                                <DocTemplate hideEditButton drug={drug} path="templates/circleMapMarker.html"/>
                              </MarkerLayerMarker>
                              <MarkerLayerPopup>
                                <DocTemplate hideEditButton drug={drug} path="templates/drugResistanceInRegionSiteSamplesOnClickClusterTooltip.html"/>
                              </MarkerLayerPopup>
                            </MarkerLayer>
                          </AttributeToColour>
                        </TableData>
                    </FeatureGroup>
                    :
                    <TableMarkersLayer
                      clickPrimaryKeyProperty="site_id"
                      table="pf_sites"
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
        </div>
        <div className="horiz-centering-container vertical stack obs-page-content">
          <DocTemplate path="templates/footer.html"/>
        </div>
      </div>
    );
  },
});

export default ResistanceMap;
