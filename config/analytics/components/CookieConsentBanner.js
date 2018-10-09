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
        //debug: true, // "Boolean. Optional. If set to true, will output additional feedback to the console."
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

      // Compose the function for logging each virtual pageview.
      // See "Modifying page URLs" https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
      // See "Single Page Application Tracking" https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
      // TODO: Consider implementing https://github.com/googleanalytics/autotrack
      const logPageView = () => {

        // "it's usually best to choose a canonical URL and only ever send that page value to Google Analytics."

        const state = this.getFlux().store('SessionStore').getState();
        const selectedTabComponentKey = state.get('tabs').get('selectedTab');
        const selectedTabComponentType = state.get('components').get(selectedTabComponentKey).get('type');
        const selectedTabComponentProps = state.get('components').get(selectedTabComponentKey).get('props').toObject();

        // NB: If we tried to create a query-string containing all the prop-names and their values, some props would be problematic, such as list-types and children.
        //const selectedTabComponentPropsAsQueryString = Object.entries(selectedTabComponentProps).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        //const pageViewPath = `${selectedTabComponentType}?${selectedTabComponentPropsAsQueryString}`;

        // Default to just logging the selected-tab component-type
        let pageViewPath = selectedTabComponentType;

        // For specific component-types, include key prop-names and values
        // TODO: keep in sync with index.js (abstract and centralize)
        if (selectedTabComponentType === 'ListWithActions') {
          // props: {table, selectedPrimKey}
          const table = selectedTabComponentProps.table;
          pageViewPath += `?table=${encodeURIComponent(table)}`;
        } else if (selectedTabComponentType === 'DataItem') {
          // props: {table, primKey: selectedPrimKey, children}
          const table = selectedTabComponentProps.table;
          const primKey = selectedTabComponentProps.primKey;
          pageViewPath += `?table=${encodeURIComponent(table)}&primKey=${encodeURIComponent(primKey)}`;
        } else if (selectedTabComponentType === 'DataTableWithActions') {
          // props: {table}
          const table = selectedTabComponentProps.table;
          pageViewPath += `?table=${encodeURIComponent(table)}`;
        } else if (selectedTabComponentType === 'FeedItem') {
          // props: {feedId: datasetURLPathParts[1], itemId: datasetURLPathParts[2]}
          const feedId = selectedTabComponentProps.feedId;
          const itemId = selectedTabComponentProps.itemId;
          pageViewPath += `?feedId=${encodeURIComponent(feedId)}&itemId=${encodeURIComponent(itemId)}`;
        } else if (selectedTabComponentType === 'FeedIndex') {
          // props: {id: datasetURLPathParts[1]}
          const id = selectedTabComponentProps.id;
          pageViewPath += `?id=${encodeURIComponent(id)}`;
        } else if (selectedTabComponentType === 'DocPage') {
          // props: {path: remainingPath}
          const path = selectedTabComponentProps.path;
          pageViewPath += `?path=${encodeURIComponent(path)}`;
        }

        // "If the current page is sending other hits (like events), you'll want to make sure every hit gets sent with the correct URL. In such cases, you should update the page field on the tracker instead of passing it in the send command."
        // So, instead of using ReactGA.pageview(pageViewPath);
        // "Sets the page value on the tracker."
        // "After you've set the new page value, all subsequents hits sent will use that new value. To record a pageview, send a pageview hit immediately after updating the tracker."
        ReactGA.ga('set', 'page', pageViewPath);
        // "Sending the pageview no longer requires passing the page value since it's now stored on the tracker object."
        // "While technically the send command for pageview hits accepts an optional page field as the third parameter, passing the page field that way is not recommended when tracking single page applications. This is because fields passed via the send command are not set on the tracker—they apply to the current hit only. Not updating the tracker will cause problems if your application sends any non-pageview hits (e.g. events or social interactions), as those hits will be associated with whatever page value the tracker had when it was created."
        ReactGA.ga('send', 'pageview');
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
