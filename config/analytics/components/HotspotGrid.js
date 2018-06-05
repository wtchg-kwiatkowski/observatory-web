import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'mixins/PureRenderMixin';
import DocTemplate from 'panoptes/DocTemplate';

import {propertyColour}  from 'util/Colours.js';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import ConfigMixin from "../../../mixins/ConfigMixin";
import FluxMixin from "../../../mixins/FluxMixin";


let HotspotGrid = createReactClass({
  displayName: 'HotspotGrid',

  mixins: [
    PureRenderMixin,
    ConfigMixin,
    FluxMixin
  ],

  propTypes: {
    transpose: PropTypes.bool,
    regionsOrder: PropTypes.array, // Array of string
  },

  getDefaultProps() {
    return {
    };
  },

  handleClick(e, table, primKey) {
    const middleClick =  e.button == 1 || e.metaKey || e.ctrlKey;
    if (!middleClick) {
      e.stopPropagation();
    }
    this.getFlux().actions.panoptes.dataItemPopup({table, primKey, switchTo: !middleClick});
  },

  render() {
    const {transpose, regionsOrder} = this.props;
    const drugs = this.config.cachedTables['pf_drugs'];
    const regions = this.config.cachedTables['pf_regions'];
    const regionsInOrder = regionsOrder !== undefined ? regionsOrder.map((region_id) => regions.filter((region) => region.region_id === region_id)[0]) : regions.sort(({region_id}, b) => region_id > b.region_id);
    let colourFunc = propertyColour(this.config.tablesById['sites'].propertiesById['ARTresistance']);
    if (transpose) {
      return <div style={{overflowX: "auto", overflowY: "hidden",  position: 'relative'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                padding="dense"
              />
              {
                regionsInOrder.map(({region_id, name}) =>
                  <TableCell
                    className="hover"
                    onClick={(e) => this.handleClick(e, 'pf_regions', `${region_id}`)}
                    style={{
                      cursor: 'pointer',
                      width: '5px',height:'130px',
                      paddingRight: '11px',
                    }} padding="dense" key={region_id}>
                    <div style={{width:"5px", transform: "rotate(-90deg) translate(-47px, 10px)"}}>{name}</div>
                  </TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              drugs.sort(({drug_id}, b) => drug_id > b.drug_id).map(({drug_id, name}) => {
                let drug_name = name;
                return <TableRow key={drug_id}>
                  <TableCell
                    padding="dense"
                    className="hover"
                    style={{
                      width: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => this.handleClick(e, 'pf_drugs', `${drug_id}`)}
                  >
                    {name}
                  </TableCell>
                  {regionsInOrder.map(({region_id, name, ...data}) =>
                    <TableCell
                      title={`${Math.round(data[drug_id + 'resistance'])}% ${drug_name} resistance in ${name}`}
                      className="hover"
                      style={{
                        cursor: 'pointer',
                        paddingRight: '11px'
                      }}
                      onClick={(e) => this.handleClick(e, 'pf_drug_regions', `${drug_id}_${region_id}`)}
                      padding="dense" key={region_id}>
                      <div style={{
                          width: "25px",
                          height: "25px",
                          borderRadius: "50%",
                          background: colourFunc(data[drug_id+'resistance'])
                      }}/>
                    </TableCell>
                  )
                  }
                </TableRow>;})
            }
          </TableBody>
        </Table>
        <DocTemplate path="templates/resistanceMapLegend.html" />
      </div>;
    } else {
      return <div style={{overflowX: "auto", overflowY: "hidden", position: 'relative'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                padding="dense"
              />
              {
                drugs.map(({drug_id, name}) =>
                  <TableCell
                    className="hover"
                    onClick={(e) => this.handleClick(e, 'pf_drugs', `${drug_id}`)}
                    style={{cursor: 'pointer', width: '5px', height: '100px'}} padding="dense" key={drug_id}>
                    <div style={{width: "5px", transform: "rotate(-90deg) translate(-30px, 10px)"}}>{name}</div>
                  </TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              regionsInOrder.map(({region_id, name, ...data}) => {
                let region_name = name;
                return <TableRow key={region_id}>
                  <TableCell
                    padding="dense"
                    className="hover"
                    style={{
                      width: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => this.handleClick(e, 'pf_regions', `${region_id}`)}
                  >
                    {name}
                  </TableCell>
                  {drugs.map(({drug_id, name}) =>
                    <TableCell
                      title={`${Math.round(data[drug_id + 'resistance'])}% ${name} resistance in ${region_name}`}
                      className="hover"
                      style={{
                        cursor: 'pointer'
                      }}
                      onClick={(e) => this.handleClick(e, 'pf_drug_regions', `${drug_id}_${region_id}`)}
                      padding="dense" key={drug_id}>
                      <div style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        background: colourFunc(data[drug_id + 'resistance'])
                      }}/>
                    </TableCell>
                  )
                  }
                </TableRow>;})
            }


          </TableBody>
        </Table>
        <DocTemplate path="templates/resistanceMapLegend.html"/>
      </div>;
    }
  },
});


export default HotspotGrid;
