import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Edit from '@material-ui/icons/Edit';

// core components

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import Table from "components/Table/Table.jsx";

import response from 'views/Pages/json/marketrates.json';

import cx from 'classnames';


const COLUMNS=['Currency Pair', 'Bid', 'Ask', 'Net Change', '% Change', 'Open', 'High', 'Low','']

const style = {
  container: {
    backgroundColor: '#ffffff',
    padding: '50px 30px 60px 50px'
  },
  tableHeadBold: {
    fontWeight: "bold"
  },
  tableHedgeHead: {
    //backgroundColor: "#5882c780",
    fontWeight: "bold"
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
  icon: {
    //marginTop: "-3px",
    cursor: 'pointer',
    top: '0px',
    position: 'relative',
    marginRight: '3px',
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
    display: 'inline-block',
    color: 'black',
  },
  editIcon: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 3,
  },
  currencyPairTag:{
    cursor: 'pointer'
  }, 
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
};


class MarketRatesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: '',
    };
  }

  componentDidMount(){
    let data=[]
    response.forEach((obj, index)=>{
        data=[...data,
        [
            index,
            this.getCurrencyPairButton(obj),
            obj.bid,
            obj.ask,
            obj.netChange,
            obj.percentageChange,
            obj.open,
            obj.high,
            obj.low,
            this.getEditButton(obj)
        ]]
    })
    this.setState({
        data
    })
}
getCurrencyPairButton = (obj) => {
    return (
      <a onClick={()=>this.showCurrencyPairModal(obj)} target='_blank' rel='noopener noreferrer' className={cx(this.props.classes.currencyPairTag)}>
        {obj.currencyPair}
      </a>
    );
  };

  getEditButton = (obj) => {
    return (
        <Edit onClick={()=>this.editCurrencyPair(obj)} 
        className={cx(this.props.classes.editIcon, this.props.classes.icon)} />

    );
  };
  editCurrencyPair=(obj)=>{
      alert('edit')
  }
  showCurrencyPairModal=(obj)=>{
    alert('showCurrencyPairModal')
}
  render() {
    const { classes, type } = this.props;
    return (
      <div className={classes.container}>
        <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>{type==='forward'?'Forward Deals Currency Pair':'Spot Deals Currency Pair'}</h2>
        <GridContainer justify='center'>
          <GridItem xs={11} sm={11} md={11} lg={11}>
          <Table
                        striped
                        tableHeaderColor="info"
                        tableHead={COLUMNS}
                        tableData={this.state.data}
                        customHeadCellClasses={[]}
                          customHeadClassesForCells={[]}
                          customCellClasses={[classes.tableHedgeHead]}
                          customClassesForCells={[1]}
                      />
          </GridItem>
        </GridContainer>

      </div>
    );
  }
}
MarketRatesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(MarketRatesTable);
