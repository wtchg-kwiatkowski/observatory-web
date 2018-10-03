import createReactClass from 'create-react-class';
import ReactGA from 'react-ga';
import ConfigMixin from 'mixins/ConfigMixin';
import FluxMixin from 'mixins/FluxMixin';

import {Cookies} from 'react-cookie-consent';

// Chrome extension GA debugger https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

let GoogleAnalytics = createReactClass({
  displayName: 'GoogleAnalytics',

  mixins: [
    ConfigMixin,
    FluxMixin,
  ],

  componentWillMount() {
    if (Cookies.get('userGaveCookieConsent')) {

      ReactGA.initialize(this.config.settings.googleAnalyticsId, {
        debug: true,
        // The default titleCase is true, oddly. https://github.com/react-ga/react-ga/issues/231
        titleCase: false, // "Boolean. Optional. Defaults to true. If set to false, strings will not be converted to title case before sending to GA."
      });
      // Improve Google Analytics GDPR compliancy by enabling IP anonymization https://www.cookiebot.com/en/google-analytics-gdpr/
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/ip-anonymization
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#anonymizeIp
      ReactGA.set({anonymizeIp: true});
      // "Set this field to false to disable beacons for the Google Analytics advertising features when these features have been enabled via the displayfeatures plugin or from within Google Analytics (Property Settings > Data Collection)."
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
      ReactGA.set({allowAdFeatures: false});


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

    }

  },

  render() {
    return null;
  }
});

export default GoogleAnalytics;
