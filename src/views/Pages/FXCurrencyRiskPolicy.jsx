import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';

// core components
import CurrencyRiskDocument from 'views/Components/HedgeAccounting/CurrencyRiskDocument';

const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: '#ffffff',
    padding: '50px 30px 60px 50px',
    // , textAlign: "center"
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
};

class FXCurrencyRiskPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify='center'>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridItem xs={11} sm={11} md={11} lg={11} className={classes.center}>
              <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>Currency Risk Management Policy ("FX Policy")</h2>
            </GridItem>
            <CurrencyRiskDocument  />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
FXCurrencyRiskPolicy.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(FXCurrencyRiskPolicy);
