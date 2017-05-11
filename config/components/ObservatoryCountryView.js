import React from 'react';
import PureRenderMixin from 'mixins/PureRenderMixin';

let ObservatoryCountryView = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    msg: React.PropTypes.string.isRequired
  },

  render() {
    let {msg, ...other} = this.props;
    return (
      <div {...other}>
        Hello Obs! {msg}
      </div>
    );
  }

});

export default ObservatoryCountryView;
