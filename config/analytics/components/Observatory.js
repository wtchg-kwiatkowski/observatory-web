import PropTypes from 'prop-types';
import React from  'react';
import createReactClass from 'create-react-class';
import NotificationSystem from 'react-notification-system';
import deserialiseComponent from 'util/deserialiseComponent'; // NB: deserialiseComponent is actually used.
import _assign from 'lodash.assign';
import Modal from 'ui/Modal';
import SessionComponent from 'panoptes/SessionComponent';
import DetectResize from 'utils/DetectResize';

// Custom components
import StateBreadCrumb from './StateBreadCrumb';
import ObservatoryHeader from './ObservatoryHeader';
import CookieConsentBanner from './CookieConsentBanner';

// Mixins
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import PureRenderMixin from 'mixins/PureRenderMixin';
import StoreWatchMixin from 'mixins/StoreWatchMixin';

// Material UI
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {withTheme} from '@material-ui/core/styles';
import {blueGrey} from '@material-ui/core/colors';

import 'font-awesome.css';
import 'ui-components.scss';
import 'main.scss';

const palette = createPalette({
  // primary: deepOrange,
  secondary: blueGrey,
  genotypeRefColor: 'rgb(0, 128, 192)',
  genotypeAltColor: 'rgb(255, 50, 50)',
  genotypeHetColor: 'rgb(0, 192, 120)',
  genotypeNoCallColor: 'rgb(230, 230, 230)'
});

const fontStyle = {
  fontFamily: 'Roboto, sans-serif',
};

const muiTheme = createMuiTheme({
  palette,
  typography: createTypography(palette, fontStyle),
  tableHeaderColumn: {
    height: 56,
    spacing: 12,
    textColor: 'black'
  },
  tableRowColumn: {
    height: 48,
    spacing: 12,
  },
  overrides: {
    MuiListSubheader: {
      sticky: {
        backgroundColor: 'white'
      }
    }
  },
});

let Observatory = createReactClass({
  displayName: 'Observatory',

  mixins: [
    FluxMixin,
    ConfigMixin,
    PureRenderMixin,
    StoreWatchMixin('SessionStore', 'PanoptesStore')],

  propTypes: {
    theme: PropTypes.object
  },

  componentDidMount() {
    let store = this.getFlux().store('SessionStore');
    store.on('notify',
      () => this.notificationSystem.addNotification(
        _assign(store.getLastNotification(), {position: 'tc'})));
    //We don't need this as it will come to us in page load json
    //this.getFlux().actions.api.fetchUser(this.state.panoptes.get('dataset'));
    console.info('Theme:', this.props.theme);
  },

  getStateFromFlux() {
    let {tabs, popups, components} = this.getFlux().store('SessionStore').getState().toObject();
    return {
      tabs,
      popups,
      components,
      modal: this.getFlux().store('SessionStore').getModal(),
      panoptes: this.getFlux().store('PanoptesStore').getState()
    };
  },

  handleResize() {
    this.getFlux().actions.session.appResize();
  },

  isDocPage(component) {
    return component.type === 'DocPage' ||  component.type ===  'DataItem';
  },

  isViewerDocPage(component) {
    return (this.isDocPage(component) && component.props !== undefined && component.props.path !== undefined && component.props.path.startsWith('viewers/'));
  },

  isNonViewerDocPage(component) {
    return (this.isDocPage(component) && !this.isViewerDocPage(component));
  },

  resetScroll() {
    if (this.scrollContainer) this.scrollContainer.scrollTop = 0;
  },

  render() {
    let actions = this.getFlux().actions.session;
    let {tabs, modal, components} = this.state;
    let config = this.config;
    tabs = tabs.toJS();
    components = components.toJS();
    // NB: initialConfig is actually defined (in index.html)
    return (
      <DetectResize onResize={this.handleResize}>
        <MuiThemeProvider theme={muiTheme}>
          <div>
            <div className="loading-container">
              <div className="spinner" />
            </div>
            <CookieConsentBanner/>
            <div className="page">
              <ObservatoryHeader
                dataset={config.dataset}
                name={config.settings.nameBanner}
                version={config.settings.version}
                logo={initialConfig.logo}
                selectedTab={tabs.selectedTab}
                components={components}
                onTabChange={this.handleChangeTab}
              />
              <div ref={(node) => { this.scrollContainer = node; }} className="body scroll-within grey-background">
                <div style={{position: 'relative', height: '100%'}}>
                  <div className="vertical stack">
                    <StateBreadCrumb compId={tabs.selectedTab}/>
                    <div className="grow"><SessionComponent resetScroll={this.resetScroll} compId={tabs.selectedTab} /></div>
                  </div>
                </div>
              </div>
            </div>
            <Modal visible={!!modal}
              onClose={actions.modalClose}>
              {modal ?
                React.cloneElement(modal, {setProps: actions.modalSetProps})
                : null}
            </Modal>
            <NotificationSystem ref={(ref) => this.notificationSystem = ref}/>
          </div>
        </MuiThemeProvider>
      </DetectResize>
    );
  },
});

Observatory = withTheme()(Observatory);
Observatory.displayName = 'Observatory';

export default Observatory;
