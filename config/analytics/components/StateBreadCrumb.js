import React from 'react';
import './page-template.scss'
import createReactClass from 'create-react-class';
import FluxMixin from 'mixins/FluxMixin';
import DocLink from 'panoptes/DocLink';
import Home from '@material-ui/icons/Home';
import ConfigMixin from 'mixins/ConfigMixin';

import FeedIndex from 'panoptes/FeedIndex';
import TextButton from 'panoptes/TextButton';
import DocPage from 'panoptes/DocPage';

import DataTableWithActions from 'containers/DataTableWithActions';

let StateBreadCrumb = createReactClass({
  displayName: 'StateBreadCrumb',

  mixins: [
    FluxMixin,
    ConfigMixin
  ],

  shouldComponentUpdate(nextProps) {
    let component = this.getFlux().store('SessionStore').getState().getIn(['components', nextProps.compId]);
    return component !== this.lastRendered;
  },

  componentWillMount() {
    //Store this so that we can access changes without render.
    this.lastRendered = null;
  },

  render() {
    let {compId} = this.props;
    let component = this.getFlux().store('SessionStore').getState().getIn(['components', compId]);
    this.lastRendered = component;
    let {type, props} = component.toJS();

    const analysis = ['Analysis', <DocPage path="analysis.html"/>];
    const pf60Resistance = ['Resistance in P.f', <DocPage path="analysis.html"/>];
    const genes = ['Genes', <DocPage path="pf60/genes.html"/>];
    const regions = ['Geographic Regions', <DocPage path="pf60/regions.html"/>];
    const drugs = ['Drugs', <DocPage path="pf60/drugs.html"/>];

    const data = ['Data', <DocPage path="data.html"/>];
    const about = ['About', <DocPage path="about.html"/>];
    const pf60DataRelease = ['P.f 6.0 Release', <DocPage path="pf60/data.html"/>];

    const convertersByType = {
        DocPage: ({path, name}) => ({
          'index.html': null,
          'about.html': [
            [about[0], null]
          ],
          'technical.html': [
            about, ['Technical', null]
          ],
          'analysis.html': [
            [analysis[0], null],
          ],
          'pf60/analysis.html': [
            analysis,
            [pf60Resistance[0], null],

          ],
          'pf60/data.html': [
            data,
            [pf60DataRelease[0], null],
          ],
          'pf60/regions.html': [
            analysis,
            pf60Resistance,
            [regions[0], null]

          ],
          'pf60/drugs.html': [
            analysis,
            pf60Resistance,
            [drugs[0], null]
          ],
          'pf60/genes.html': [
            analysis,
            pf60Resistance,
            [genes[0], null]
          ],
          'pf60/GeneticDifferentiation.html': [
            analysis,
            pf60Resistance,
            genes,
            ['By Differentiation', null]
          ],
          'pf60/GeneticVariants.html': [
            analysis,
            pf60Resistance,
            genes,
            [`Variants in ${name}`, null]
          ],
        }[path]),
        DataItem: ({table, primKey}) => (
          ({
            pf_resgenes: () => [
              analysis,
              pf60Resistance,
              genes,
              [this.config.cachedTablesByPrimKey[table][primKey].name, null]
            ],
            pf_regions: () => [
              analysis,
              pf60Resistance,
              regions,
              [this.config.cachedTablesByPrimKey[table][primKey].name, null]
            ],
            pf_drugs: () => [
              analysis,
              pf60Resistance,
              drugs,
              [this.config.cachedTablesByPrimKey[table][primKey].name, null]
            ],
            pf_drug_regions: () => [
              analysis,
              pf60Resistance,
              regions,
              [`${this.config.cachedTablesByPrimKey['pf_drugs'][primKey.split('_')[0]].name} in ${this.config.cachedTablesByPrimKey['pf_regions'][primKey.split('_')[1]].name}`, null]
            ],
            pf_sites: () => [
              analysis,
              pf60Resistance,
              regions,
              [this.config.cachedTablesByPrimKey[table][primKey].name, null]
            ],
          }[table] || (() => null))()),
        ItemTemplate: ({table, primKey}) => ({
          pf_genes: [
            analysis,
            pf60Resistance,
            genes,
            [`Variants in ${primKey}`, null]
          ],
        }[table]),
        FeedItem: ({feedId, itemId}) => [
          ['Articles', <FeedIndex id={feedId}/>],
          [this.config.feeds[feedId].itemsById[itemId].title, null]
        ],
        FeedIndex: ({feedId, itemId}) => [
          ['Articles', null]
        ],
        DataTableWithActions: ({table}) => ({
          pf_samples: [
            data,
            pf60DataRelease,
            ['Samples Table', null],
          ],
          pf_variants: [
            data,
            pf60DataRelease,
            ['Variants Table', null],
          ],
        }[table]),
        PivotTableWithActions: ({table}) => ({
          pf_samples: [
            data,
            pf60DataRelease,
            ['Samples Table', <DataTableWithActions table={table} />],
            ['Pivot', null],
          ],
          pf_variants: [
            data,
            pf60DataRelease,
            ['Variants Table', <DataTableWithActions table={table} />],
            ['Pivot', null],
          ],
        }[table]),
        TablePlotActions: ({table}) => ({
          pf_samples: [
            data,
            pf60DataRelease,
            ['Samples Table', <DataTableWithActions table={table} />],
            ['Plot', null],
          ],
          pf_variants: [
            data,
            pf60DataRelease,
            ['Variants Table', <DataTableWithActions table={table} />],
            ['Plot', null],
          ],
        }[table]),
        GenomeBrowserWithActions: () => [
          data,
          pf60DataRelease,
          ['Genome Browser', null]
        ],
        ResistanceMap: ({feedId, itemId}) => [
          analysis,
          pf60Resistance,
          regions,
          ['Map of sites', null]
        ]

      }
    ;
    let path = (convertersByType[type] || (() => null))(props);
    return path ? <div className="obs-breadcrumb">
      <div className="obs-breadcrumb-inner">
        <div className="obs-breadcrumb-component"><DocLink href="index.html"><Home/></DocLink></div>
        {path.map(([title, target]) => {
          return [<span key={title + 'arrow'}>&#160;&#160;&#62;&#160;&#160;</span>,
            <div key={title + 'text'} className="obs-breadcrumb-component">
              {target ? <TextButton label={title}> {target} </TextButton> : title}
            </div>
          ];
        })
        }
      </div>
    </div> : null;
    // return (
    //   <div className="obs-breadcrumb">
    //     <div className="obs-breadcrumb-inner">
    //       {React.Children.map(children, (child, i) =>
    //         [<div className="obs-breadcrumb-component">{child}</div>, i < children.length - 1 ? <span style={{color: '#FF5722'}}>&#160;&#160;&#62;&#160;&#160;</span> : null]
    //       )}
    //     </div>
    //   </div>
    // );
  }
});

export default StateBreadCrumb;
