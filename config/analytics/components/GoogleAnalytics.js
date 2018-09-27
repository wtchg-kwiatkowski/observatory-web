import createReactClass from 'create-react-class';
import ReactGA from 'react-ga';
import FluxMixin from 'mixins/FluxMixin';

ReactGA.initialize('UA-foobar219381209381', {
  debug: true,
  titleCase: false, //Boolean. Optional. Defaults to true. If set to false, strings will not be converted to title case before sending to GA.
});
ReactGA.pageview('/about/contact-us');

// Chrome extension GA debugger https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

let GoogleAnalytics = createReactClass({
  displayName: 'GoogleAnalytics',

  mixins: [
    FluxMixin,
  ],

  componentDidMount() {
    let store = this.getFlux().store('SessionStore');
    store.on('change', () => console.log('change store', store));
  },

  render() {
console.log('GA render')
    return null;
  }
});

export default GoogleAnalytics;
