import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: '#ffffff',
    padding: '50px 30px 60px 50px',
    // , textAlign: "center"
  }
};


class AccountingEntries extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <p style={{color:'red'}}>Coming Soon...</p>
   
      
      </div>
    );
  }
}
AccountingEntries.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(AccountingEntries);
