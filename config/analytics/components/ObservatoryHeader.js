import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {withStyles} from '@material-ui/core/styles';
import _flattenDeep from 'lodash.flattendeep';

// Mixins
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import PureRenderMixin from 'mixins/PureRenderMixin';

// Panoptes
import EmptyTab from 'containers/EmptyTab';
import DatasetManagerActions from 'components/DatasetManagerActions';
import Icon from 'ui/Icon';
import DocPage from 'panoptes/DocPage';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {ListItemIcon, ListItemText} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import {List, ListItem} from '@material-ui/core';
import {Tabs, Tab} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import 'font-awesome.css';
import 'ui-components.scss';
import 'main.scss';

const drawerWidth = 280;
const iconColour = '#69B3E4';

const styles = (theme) => ({
  list: {
    width: drawerWidth,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nested2: {
    paddingLeft: theme.spacing(6),
  },
});

let ObservatoryHeader = createReactClass({
  displayName: 'ObservatoryHeader',

  mixins: [
    ConfigMixin,
    FluxMixin,
  ],

  propTypes: {
    name: PropTypes.string,
    logo: PropTypes.string,
    classes: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired,
    components: PropTypes.object.isRequired,
    version: PropTypes.string,
    tabIndex: PropTypes.number,
    onTabChange: PropTypes.func,
  },

  getInitialState() {
    return {
      drawerIsOpen: false,
      guidebooksIsExpanded: true,
      pfIsExpanded: true,
    };
  },

  handleClickHamburger(event) {
    this.setState({drawerIsOpen: true});
  },

  handleCloseDrawer() {
    this.setState({drawerIsOpen: false});
  },

  handleToggleExpand(stateToToggle) {
    this.setState({[stateToToggle]: !this.state[stateToToggle]});
  },

  render() {
    let {logo, classes, version, selectedTab} = this.props;
    let actions = this.getFlux().actions;
    const {drawerIsOpen, guidebooksIsExpanded, pfIsExpanded} = this.state;
    return (
      <AppBar position="static" style={{backgroundColor: this.config.constants.appBar}}>
        <Toolbar disableGutters={true} style={{marginLeft: '12px', marginRight: '12px'}}>
          <IconButton
            className="header-hamburger"
            aria-label="open drawer"
            onClick={this.handleClickHamburger}
          >
            <MenuIcon/>
          </IconButton>
          <Drawer
            variant="temporary"
            classes={{
              paper: classes.drawerPaper,
            }}
            open={drawerIsOpen}
            onBackdropClick={this.handleCloseDrawer}
          >
            <div className={classes.list}>
              <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '10px', cursor: 'pointer'}}>
                <img src={logo} onClick={this.handleCloseDrawer}/>
              </div>
              <List component="nav">
                <HamburgerContents onClose={this.handleCloseDrawer}/>
                {this.config.user.isManager ?
                  [
                    <Divider key="Divider1"/>,
                    <ListItem button key="ListItem1" onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(
                      <DatasetManagerActions/>))}>
                      <ListItemIcon>
                        <SettingsIcon style={{color: iconColour}}/>
                      </ListItemIcon>
                      <ListItemText primary="Admin"/>
                    </ListItem>,
                    <ListItem button key="ListItem2"
                              onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<EmptyTab/>))}>
                      <ListItemIcon>
                        <ListIcon style={{color: iconColour}}/>
                      </ListItemIcon>
                      <ListItemText primary="Table/View list"/>
                    </ListItem>,
                  ]
                  : null}
                {(
                  this.config.cas.service ?
                    (this.config.user.id === "anonymous" ?
                      [
                        <Divider key="Divider2"/>,
                        <ListItem button key="ListItemLogin"
                                  onClick={() => (this.handleCloseDrawer(), window.location.href = `${this.config.cas.service}?service=${window.location.href}`)}>
                          <ListItemIcon>
                            <AccountCircle style={{color: iconColour, transform: 'scaleX(-1)'}}/>
                          </ListItemIcon>
                          <ListItemText primary="Login"/>
                        </ListItem>]
                      : [
                        <Divider key="Divider2"/>,
                        <ListItem button key="ListItem3"
                                  onClick={() => (this.handleCloseDrawer(), window.location.href = this.config.cas.logout)}>
                          <ListItemIcon>
                            <ExitToAppIcon style={{color: iconColour, transform: 'scaleX(-1)'}}/>
                          </ListItemIcon>
                          <ListItemText primary="Sign out" secondary={this.config.user.id}/>
                        </ListItem>])
                    : null
                )
                }
              </List>
            </div>
          </Drawer>
          <div className="header-top-nav">
            <HorizontalSiteNav />
          </div>
          <div className="header-filler" />
          <div
            className="header-logo"
          >
            <div className="header-logo-container">
              <img onClick={() => actions.session.tabOpen(<DocPage path="index.html" />)} src={logo} className="header-logo-mg"/>
              <div onClick={() => actions.session.tabOpen(<DocPage path="index.html" />)} className="header-logo-beta">
                beta
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  },
});



class MenuListComposition extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    let { type, label, children, onClick} = this.props;
    return (
      <div>
        <div>
          {type === 'button' ? <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            {label}
          </Button> : <MenuItem
            ref={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            {label}
          </MenuItem>}
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {children.map((child) => React.cloneElement(child, {onClick: (e) => {
                        onClick ? onClick(e) : null;
                        this.handleClose(e);
                        child.props.onClick ? child.props.onClick(e) : null;
                        }}))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

MenuListComposition.propTypes = {
  label: PropTypes.string,
};

let HorizontalSiteNav = createReactClass({
  displayName: 'HorizontalSiteNav',

  mixins: [
    PureRenderMixin,
    FluxMixin,
    ConfigMixin,
  ],

  render() {
    const {sitemap} = this.config.constants;

    return sitemap.map((branch, i) => {
        if (branch.children) {
          return <MenuListComposition key={i}
                                      type={'button'}
                                      label={branch.label}>
            {_flattenDeep(branch.children.map((option, j) => {
                return  [<MenuItem key={j}
                                 onClick={() => this.getFlux().actions.session.tabOpen(React.createElement(option.component.type, option.component.props))}>
                  {option.icon ? <ListItemIcon>
                    <Icon className="icon" name={option.icon}/>
                  </ListItemIcon> : null}
                  <ListItemText primary={option.label} />
                </MenuItem>,
                option.children.map((subOption, k) => <MenuItem key={j+k}
                                                                style={{paddingLeft: '40px'}}
                                                                onClick={() => this.getFlux().actions.session.tabOpen(React.createElement(subOption.component.type, subOption.component.props))}>
                  {subOption.icon ? <ListItemIcon>
                    <Icon className="icon" name={subOption.icon}/>
                  </ListItemIcon> : null}
                  <ListItemText primary={subOption.label} />
                </MenuItem>)
                ];
              }))}
          </MenuListComposition>;
        } else {
          return <Button key={i} onClick={() => this.getFlux().actions.session.tabOpen(React.createElement(branch.component.type, branch.component.props))}>{branch.label}</Button>;
        }
    })
  }
});

let HamburgerContents = createReactClass({
  displayName: 'HamburgerContents',

  mixins: [
    PureRenderMixin,
    FluxMixin,
    ConfigMixin,
  ],

  render() {
    const {sitemap} = this.config.constants;
    const {onClose} = this.props;
    const iconStyle = {marginRight: '0', color: '#69B1E3'};

    return _flattenDeep(sitemap.map((branch, i) => {
        return [<MenuItem key={'branch_' + i}
                         onClick={() => (onClose(), this.getFlux().actions.session.tabOpen(React.createElement(branch.component.type, branch.component.props)))}>
          {branch.icon ? <ListItemIcon>
            <Icon className="icon" name={branch.icon} style={iconStyle}/>
          </ListItemIcon> : null}
          <ListItemText primary={branch.label} />
        </MenuItem>,
          (branch.children || []).map((option, j) => {
            return  [<MenuItem key={'branch_' + i + '_option_' + j}
                               style={{paddingLeft: '40px'}}
                               onClick={() => (onClose(),this.getFlux().actions.session.tabOpen(React.createElement(option.component.type, option.component.props)))}>
              {option.icon ? <ListItemIcon>
                <Icon className="icon" name={option.icon} style={iconStyle}/>
              </ListItemIcon> : null}
              <ListItemText primary={option.label} />
            </MenuItem>,
              option.children.map((subOption, k) => <MenuItem key={'branch_' + i + '_option_' + j + '_subOption_' + k}
                                                              style={{paddingLeft: '60px'}}
                                                              onClick={() => (onClose(),this.getFlux().actions.session.tabOpen(React.createElement(subOption.component.type, subOption.component.props)))}>
                {subOption.icon ? <ListItemIcon>
                  <Icon className="icon" name={subOption.icon} style={iconStyle}/>
                </ListItemIcon> : null}
                <ListItemText primary={subOption.label} />
              </MenuItem>)
            ];
          })];
    }))
  }
});

ObservatoryHeader = withStyles(styles)(ObservatoryHeader);
ObservatoryHeader.displayName = "ObservatoryHeader";



export default ObservatoryHeader;
