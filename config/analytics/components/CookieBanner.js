import createReactClass from 'create-react-class';
import React from 'react';
import ReactCookieBanner from 'react-cookie-banner';

let CookieBanner = createReactClass({
  displayName: 'CookieBanner',

  render() {
    return (
      <div>
        <ReactCookieBanner
          message="This website uses cookies."
          buttonMessage="OK"
          cookie="user-has-accepted-cookies"
          link={<a href="https://www.malariagen.net/cookie-statement" target="_blank" rel="noreferrer noopener">cookie statement</a>}
        />
      </div>
    );
  }
});

export default CookieBanner;
