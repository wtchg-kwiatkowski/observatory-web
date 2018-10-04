import createReactClass from 'create-react-class';
import React from 'react';
import Cookies from 'js-cookie';
import FluxMixin from 'mixins/FluxMixin';

// Credit https://github.com/Mastermindzh/react-cookie-consent

let CookieBanner = createReactClass({
  displayName: 'CookieBanner',

  mixins: [
    FluxMixin,
  ],

  getInitialState() {
    return {
      visible: false,
    };
  },

  componentWillMount() {
    this.consentCookieName = 'userGaveCookieConsent';

    // Credit https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
    this.doNotTrack = (window.doNotTrack == '1' || navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1') ? true : false;
    if (this.doNotTrack) {
      // If doNotTrack then remove the consent-cookie and do not track.
      Cookies.remove(this.consentCookieName);
      console.info('Do Not Track');
    }
    console.info('Cookies:', Object.keys(Cookies.get()));
  },

  componentDidMount() {
    if (Cookies.get(this.consentCookieName) === undefined) {
      this.setState({visible: true});
    }
  },

  handleConsent() {
    console.log('TODO: handleConsent, trigger GoogleAnalytics');
    Cookies.set(this.consentCookieName, true, {expires: 365});
    this.setState({visible: false});
  },

  handleRefuse() {
    this.setState({visible: false});
  },

  render() {
    if (!this.state.visible || this.doNotTrack) {
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

export default CookieBanner;
