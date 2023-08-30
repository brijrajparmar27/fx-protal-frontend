import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from 'components/CustomButtons/Button.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

// core components

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';

import CurrencyRiskDocument from 'views/Components/HedgeAccounting/CurrencyRiskDocument';
import HedgeAccountingDocument from 'views/Components/HedgeAccounting/HedgeAccountingDocument';

const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: '#ffffff',
    padding: '50px 30px 60px 50px',
    // , textAlign: "center"
  },
  question: {
    marginTop: '35px',
    fontSize: '20px',
  },
  options: {
    marginTop: '25px',
  },
  footer: {
    padding: '20px 15px 0px 15px',
  },

  center: {
    textAlign: 'center ',
  },
  groupHeader: {
    textAlign: 'left',
    fontSize: 30,
    marginTop: 0,
  },
  featureTitleHeader: {
    //height: 35,
    color: '#3c4858',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
    // textAlign: "center"
    //marginTop: 0
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
};

const documents = [
  {
    name: 'Hedge Accounting Documentation Template under IFRS9',
    value: 1,
  },
];

class SampleDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: '',
    };
  }

  confirmButtonClick = () => {};

  handleSimple = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>Sample Documentation</h2>
        <GridContainer justify='center'>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <InputLabel htmlFor='type' className={classes.selectLabel}>
                Document
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                classes={{
                  select: classes.select,
                }}
                value={this.state.countryCode}
                onChange={this.handleSimple}
                inputProps={{
                  name: 'document',
                  id: 'document',
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                  }}
                >
                  Choose Document
                </MenuItem>
                {documents.map((item) => (
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value={item.value}
                    key={item.value}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        </GridContainer>
        {this.state.document === 1 && <HedgeAccountingDocument ref={(el) => (this.componentRef = el)} />}

        {/* <div className={classes.footer}>
          <div className={classes.center}>
            {this.state.document !== '' && (
              <ReactToPrint
                trigger={() => (
                  <Button color='rose' className={this.props.nextButtonClasses}>
                    Generate
                  </Button>
                )}
                content={() => this.componentRef}
              />
            )}
          </div>
          <div className={classes.clearfix} />
        </div> */}
      </div>
    );
  }
}
SampleDocument.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(SampleDocument);
