import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {withStyles} from '@material-ui/core/styles';

// Mixins
import FluxMixin from 'mixins/FluxMixin';
import ConfigMixin from 'mixins/ConfigMixin';
import PureRenderMixin from 'mixins/PureRenderMixin';

// Panoptes
import EmptyTab from 'containers/EmptyTab';
import DatasetManagerActions from 'components/DatasetManagerActions';
import Icon from 'ui/Icon';
import DocPage from 'panoptes/DocPage';
import PopupButton from 'panoptes/PopupButton';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {ListItemIcon, ListItemText} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import {List, ListItem} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
    paddingLeft: theme.spacing.unit * 4,
  },
  nested2: {
    paddingLeft: theme.spacing.unit * 6,
  },
});

let ObservatoryHeader = createReactClass({
  displayName: 'ObservatoryHeader',

  mixins: [
    PureRenderMixin,
    ConfigMixin,
    FluxMixin,
  ],

  propTypes: {
    name: PropTypes.string,
    logo: PropTypes.string,
    classes: PropTypes.object.isRequired,
    tabs: PropTypes.object.isRequired,
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
    let {logo, classes, version, tabIndex, onTabChange} = this.props;
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
                <ListItem button onClick={() => (this.handleCloseDrawer(), actions.session.tabSwitch('FirstTab'))}>
                  <ListItemIcon>
                    <HomeIcon style={{color: iconColour}}/>
                  </ListItemIcon>
                  <ListItemText primary="Home"/>
                </ListItem>
                <ListItem button onClick={() => (this.handleCloseDrawer(), onTabChange(1))}>
                  <ListItemIcon>
                    <Icon className="icon" name="docimage:icons/guidebook.svg"/>
                  </ListItemIcon>
                  <ListItemText primary="Guidebooks"/>
                  {guidebooksIsExpanded ? <ExpandLess
                      onClick={(event) => (event.stopPropagation(), this.handleToggleExpand('guidebooksIsExpanded'))}/> :
                    <ExpandMore
                      onClick={(event) => (event.stopPropagation(), this.handleToggleExpand('guidebooksIsExpanded'))}/>}
                </ListItem>
                <Collapse in={guidebooksIsExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}
                              onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                                path="news.html"/>))}>
                      <ListItemIcon>
                        <Icon className="icon" name="docimage:icons/stories-news.svg"/>
                      </ListItemIcon>
                      <ListItemText primary="Articles"/>
                    </ListItem>
                  </List>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}
                              onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                                path="pf.html"/>))}>
                      <ListItemIcon>
                        <Icon className="icon" name="docimage:icons/plasmodium-falciparum.svg"/>
                      </ListItemIcon>
                      <ListItemText primary="P. falciparum"/>
                      {pfIsExpanded ? <ExpandLess
                          onClick={(event) => (event.stopPropagation(), this.handleToggleExpand('pfIsExpanded'))}/> :
                        <ExpandMore
                          onClick={(event) => (event.stopPropagation(), this.handleToggleExpand('pfIsExpanded'))}/>}
                    </ListItem>
                  </List>
                  <Collapse in={pfIsExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem button className={classes.nested2}
                                onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                                  path="regions.html"/>))}>
                        <ListItemIcon>
                          <Icon className="icon" name="docimage:icons/map.svg"/>
                        </ListItemIcon>
                        <ListItemText inset primary="Regions"/>
                      </ListItem>
                      <ListItem button className={classes.nested2}
                                onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                                  path="drugs.html"/>))}>
                        <ListItemIcon>
                          <Icon className="icon" name="docimage:icons/drug01.svg"/>
                        </ListItemIcon>
                        <ListItemText inset primary="Drugs"/>
                      </ListItem>
                      <ListItem button className={classes.nested2}
                                onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                                  path="genes.html"/>))}>
                        <ListItemIcon>
                          <Icon className="icon" name="docimage:icons/gene01.svg"/>
                        </ListItemIcon>
                        <ListItemText inset primary="Genes"/>
                      </ListItem>
                    </List>
                  </Collapse>
                </Collapse>
                <ListItem button onClick={() => (this.handleCloseDrawer(), actions.session.tabOpen(<DocPage
                  path="about.html"/>))}>
                  <ListItemIcon>
                    <Icon className="icon" name="docimage:icons/table01.svg"/>
                  </ListItemIcon>
                  <ListItemText inset primary="Data"/>
                </ListItem>
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
                        <Divider key="Divider1"/>,
                        <ListItem button key="ListItemLogin"
                                  onClick={() => (this.handleCloseDrawer(), window.location.href = `${this.config.cas.service}?service=${window.location.href}`)}>
                          <ListItemIcon>
                            <AccountCircle style={{color: iconColour, transform: 'scaleX(-1)'}}/>
                          </ListItemIcon>
                          <ListItemText primary="Login"/>
                        </ListItem>]
                      : [
                        <Divider key="Divider1"/>,
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
              <img onClick={() => actions.session.tabSwitch('FirstTab')} src={logo} className="header-logo-mg"/>
              <div onClick={() => actions.session.tabSwitch('FirstTab')} className="header-logo-beta">
                beta
              </div>
            </div>
          </div>
          <div className="data-version">
            data&#160;version<br/>{version}&#160;beta
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

    let recurse = (tree, type) => {
      return tree.map((branch, i) => {
      if (branch.children) {
        return <MenuListComposition key={i} type={type} label={branch.label}>
          {recurse(branch.children, 'menuitem')}
        </MenuListComposition>
      } else {
        return (type !== 'button' ? <MenuItem key={i} onClick={() => this.getFlux().actions.session.tabOpen(React.createElement(branch.component.type, branch.component.props))}>{branch.label}</MenuItem> :
          <Button key={i} onClick={() => this.getFlux().actions.session.tabOpen(React.createElement(branch.component.type, branch.component.props))}>{branch.label}</Button>)
      }
      })
    };

    return recurse(sitemap, 'button');
  }
});

ObservatoryHeader = withStyles(styles)(ObservatoryHeader);
ObservatoryHeader.displayName = "ObservatoryHeader";



export default ObservatoryHeader;
