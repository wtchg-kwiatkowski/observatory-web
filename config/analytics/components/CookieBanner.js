import createReactClass from 'create-react-class';
import React from 'react';
import CookieConsent, {Cookies} from 'react-cookie-consent';
import FluxMixin from 'mixins/FluxMixin';

let CookieBanner = createReactClass({
  displayName: 'CookieBanner',

  mixins: [
    FluxMixin,
  ],

  componentWillMount() {
    this.consentCookieName = 'userGaveCookieConsent';

    // Credit https://dev.to/corbindavenport/how-to-correctly-check-for-do-not-track-with-javascript-135d
    this.doNotTrack = (window.doNotTrack == '1' || navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1') ? true : false;
    if (this.doNotTrack) {
      // If doNotTrack then remove the consent-cookie and do not track.
      Cookies.remove(this.consentCookieName);
      console.info('Do not track.');
    }
    console.info('Cookies:', Object.keys(Cookies.get()));
  },

  handleAccept() {
    console.log('TODO: trigger GoogleAnalytics');
  },

  render() {
    if (this.doNotTrack) {
      return null;
    } else {
      // CookieConsent settings
      // `expires` should be a number, i.e. "Number of days before the cookie expires.", not a string. The default is 365.
      // `debug` set to true prevents the banner from disappearing
      return (
        <CookieConsent
          cookieName={this.consentCookieName}
          expires={365}
          buttonText="Consent"
          buttonStyle={{backgroundColor: '#F7F7F7', borderRadius: '3px'}}
          style={{textAlign: 'center'}}
          onAccept={this.handleAccept}
        >
          We would like to use cookies to help improve this website&#8217;s performance and your experience. See our <a href="https://www.malariagen.net/cookie-statement" target="_blank" rel="noreferrer noopener">cookie statement</a> for details.
        </CookieConsent>
      );
    }
  }

});

export default CookieBanner;
