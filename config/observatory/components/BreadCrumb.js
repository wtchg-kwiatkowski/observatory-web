import React from 'react';
import './page-template.scss'
import filterChildren from 'util/filterChildren';
import DocLink from 'panoptes/DocLink';

class BreadCrumb extends React.Component {
  static displayName = 'BreadCrumb';

  render() {
    let {children, a, b} = this.props;
    children = filterChildren(this, children);
    children = children || [];
    if (children.length === undefined) children = [children];

    b === 'regions' ? children.unshift(<DocLink href="regions.html">Regions</DocLink>) :  null;
    b === 'drugs' ? children.unshift(<DocLink href="drugs.html">Drugs</DocLink>) :  null;
    b === 'genes' ? children.unshift(<DocLink href="genes.html">Genes</DocLink>) :  null;
    b === 'about' ? children.unshift(<DocLink href="about.html">About</DocLink>) :  null;
    b === 'technical' ? children.unshift(<DocLink href="technical.html">Publications and Reports</DocLink>) :  null;

    a === 'pf' ? children.unshift(<DocLink href="pf.html">P. falciparum</DocLink>) :  null;
    a === 'pv' ? children.unshift(<DocLink href="pv.html">P. vivax</DocLink>) :  null;
    a === 'ag' ? children.unshift(<DocLink href="ag.html">A. gambiae</DocLink>) :  null;

    // children.unshift(<span>Guidebook</span>);

    return (
      <div className="obs-breadcrumb">
        <div className="obs-breadcrumb-inner">
          {React.Children.map(children, (child, i) =>
            [<div className="obs-breadcrumb-component">{child}</div>, i < children.length - 1 ? <span style={{color: '#FF5722'}}>&#160;&#160;&#62;&#160;&#160;</span> : null]
          )}
        </div>
      </div>
    );
  }
}

export default BreadCrumb;
