import createReactClass from 'create-react-class';
import React from 'react';
import Cookies from 'js-cookie';
import FluxMixin from 'mixins/FluxMixin';
import ReactGA from 'react-ga';
import ConfigMixin from 'mixins/ConfigMixin';

// Credit https://github.com/Mastermindzh/react-cookie-consent

export const COOKIE_CONSENT_NAME = 'userGaveCookieConsent';

let CookieConsentBanner = createReactClass({
  displayName: 'CookieConsentBanner',

  mixins: [
    FluxMixin,
    ConfigMixin,
  ],

  getInitialState() {
    return {
      consented: false,
      refused: false,
      doNotTrack: null,
    };
  },

  componentDidMount() {
    // Credit https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
    if (window.doNotTrack == '1' || navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1') {
      console.info('Do Not Track');
      this.setState({doNotTrack: true});
    } else {
      this.setState({doNotTrack: false});
    }

    // Determine whether the user has already consented.
    if (Cookies.get(COOKIE_CONSENT_NAME) === undefined || !Cookies.get(COOKIE_CONSENT_NAME)) {
      this.setState({consented: false});
    } else {
      this.setState({consented: true});
    }

    console.info('Cookies:', Object.keys(Cookies.get()));
  },

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.doNotTrack !== prevState.doNotTrack) {
      Cookies.remove(COOKIE_CONSENT_NAME);
    }
    if (this.state.consented !== prevState.consented && this.state.consented && !this.state.doNotTrack) {
      // If the state has changed to consented, and DNT is false

      // Set the cookie-consent cookie.
      Cookies.set(COOKIE_CONSENT_NAME, true, {expires: 365});

      // Initialize Google Analytics.
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

      // Compose the function for logging each PageView.
      const logPageView = () => {
        const state = this.getFlux().store('SessionStore').getState();
        const selectedTabComponentKey = state.get('tabs').get('selectedTab');
        const selectedTabComponentType = state.get('components').get(selectedTabComponentKey).get('type');
        const selectedTabComponentProps = state.get('components').get(selectedTabComponentKey).get('props').toObject();
        const selectedTabComponentPropsAsQueryString = Object.entries(selectedTabComponentProps).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        const pageViewPath = `${selectedTabComponentType}?${selectedTabComponentPropsAsQueryString}`;
        ReactGA.pageview(pageViewPath);
      };

      // Log this PageView.
      logPageView();

      // Log a PageView every time there is a SessionStore change.
      this.getFlux().store('SessionStore').on('change', logPageView);
    }
  },

  handleConsent() {
    this.setState({consented: true});
  },

  handleRefuse() {
    this.setState({refused: true});
  },

  render() {
    if (this.state.consented || this.state.refused || this.state.doNotTrack) {
      return null;
    } else {
      const bannerStyle = {
        alignItems: 'baseline',
        background: '#3f51b5',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        left: '0',
        position: 'fixed',
        width: '100%',
        zIndex: '999',
        bottom: '0',
      };

      const contentStyle = {
        flex: '1 0 300px',
        margin: '10px',
        textAlign: 'center',
        alignSelf: 'flex-start',
      };

      const buttonStyle = {
        background: '#69b3e4',
        border: '0',
        borderRadius: '3px',
        boxShadow: 'none',
        color: '#ffffff',
        flex: '0 0 auto',
        padding: '5px 10px',
        margin: '10px',
      };

      const linkStyle = {
        color: '#ffffff',
      };

      return (
        <div style={bannerStyle}>
          <button
            style={buttonStyle}
            onClick={() => { this.handleRefuse(); }}
          >
            Refuse
          </button>
          <div style={contentStyle}>
            We would like to use cookies to help improve this website&#8217;s performance and your experience. See our <a href="https://www.malariagen.net/cookie-statement" target="_blank" rel="noreferrer noopener" style={linkStyle}>cookie statement</a> for details.
          </div>
          <button
            style={buttonStyle}
            onClick={() => {   this.handleConsent(); }}
          >
            Consent
          </button>
        </div>
      );
    }
  }

});

export default CookieConsentBanner;
