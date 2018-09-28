import createReactClass from 'create-react-class';
import ReactGA from 'react-ga';
import FluxMixin from 'mixins/FluxMixin';

// FIXME: Use the appropriate Tracking ID for each environment.
// Development: UA-126631386-2
// Staging: UA-126631386-3
// Production: UA-126631386-1

ReactGA.initialize('UA-126631386-2', {
  debug: true,
  // Why is the default titleCase true? https://github.com/react-ga/react-ga/issues/231
  titleCase: false, //Boolean. Optional. Defaults to true. If set to false, strings will not be converted to title case before sending to GA.
});
// Improve Google Analytics GDPR compliancy https://www.cookiebot.com/en/google-analytics-gdpr/
ReactGA.set({anonymizeIp: true}); // https://developers.google.com/analytics/devguides/collection/analyticsjs/ip-anonymization

// Chrome extension GA debugger https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

let GoogleAnalytics = createReactClass({
  displayName: 'GoogleAnalytics',

  mixins: [
    FluxMixin,
  ],

  componentDidMount() {
    let store = this.getFlux().store('SessionStore');
    store.on('change', () => {
      const state = store.getState();
      const selectedTabComponentKey = state.get('tabs').get('selectedTab');
      const selectedTabComponentType = state.get('components').get(selectedTabComponentKey).get('type');
      const selectedTabComponentProps = state.get('components').get(selectedTabComponentKey).get('props').toObject();
      const selectedTabComponentPropsAsQueryString = Object.entries(selectedTabComponentProps).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
      const pageViewPath = `${selectedTabComponentType}?${selectedTabComponentPropsAsQueryString}`;
      ReactGA.pageview(pageViewPath);
    });
  },

  render() {
    return null;
  }
});

export default GoogleAnalytics;
