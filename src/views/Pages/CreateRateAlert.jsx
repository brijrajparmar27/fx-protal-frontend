import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import RateAlertPage from 'views/Components/MarketRates/RateAlertPage.jsx';
import PortalDashboardGraph from 'views/Components/MarketRates/PortalDashboardGraph';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

import regularFormsStyle from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

const CreateRateAlert = ({ classes }) => {
  const [baseCurrencycode, setBseCurrencycode] = useState('');
  const [mappedCurrencies, setMappedCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [quoteCurrency, setQuoteCurrency] = useState('');
  const [showCurrencyPairAlertModal, setShowCurrencyPairAlertModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');

  useEffect(() => {
    getCurrencies();
    getBaseCurrency();
  }, []);
  useEffect(() => {
    getCurrencyPair();
  }, [baseCurrencycode]);
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
  };
  const getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem('token'),
    });
    let currencies = res.data.currrencies.map((curr) => curr.currencyCode);
    setMappedCurrencies(currencies);
  };
  const getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      // console.log(res.data.userDesc);
      setBseCurrencycode('GBP');
      return;
    } else {
      setBseCurrencycode(res.data.baseCurrency);
    }
  };
  const getCurrencyPair = async () => {
    const res = await apiHandler({
      url: endpoint.MARKET_INTELLIGENCE,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      let quoteCurrency = 'GBP';
      let baseCurrency = 'EUR';
      if (baseCurrencycode === 'EUR') {
        baseCurrency = 'EUR';
        quoteCurrency = 'USD';
      } else if (baseCurrencycode === 'GBP') {
        baseCurrency = 'EUR';
        quoteCurrency = 'GBP';
      } else {
        baseCurrency = 'USD';
        quoteCurrency = baseCurrencycode;
      }
      setBaseCurrency(baseCurrency);
      setQuoteCurrency(quoteCurrency);
      return;
    } else {
      console.log('getcurrencypair', res.data);
      if (res.data.fromCurrencyCode && res.data.toCurrencyCode) {
        setBaseCurrency(res.data.fromCurrencyCode);
        setQuoteCurrency(res.data.toCurrencyCode);
      } else {
        setBaseCurrency('EUR');
        setQuoteCurrency('GBP');
      }
    }
  };
  const handleBuyCurrency = (event) => {
    let wrongData = false;
    if (event.target.name === 'baseCurrency') {
      if (quoteCurrency === event.target.value) wrongData = true;
    } else if (event.target.name === 'quoteCurrency') {
      if (baseCurrency === event.target.value) wrongData = true;
    }
    if (wrongData) {
      setNoticeModalHeader('Currency');
      setNoticeModalErrMsg('Please select different Currency.');
      setNoticeModal(true);
    } else {
      if (event.target.name === 'baseCurrency') {
        setBaseCurrency(event.target.value);
        saveCurrencyPair(event.target.value, quoteCurrency);
      } else if (event.target.name === 'quoteCurrency') {
        setQuoteCurrency(event.target.value);
        saveCurrencyPair(baseCurrency, event.target.value);
      }
    }
  };
  const swapCurrencies = () => {
    saveCurrencyPair(quoteCurrency, baseCurrency);
    let oldBaseCurrency = baseCurrency;
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(oldBaseCurrency);
  };
  const saveCurrencyPair = async (baseCurrency, quoteCurrency) => {
    let currencyPairParam = {
      fromCurrencyCode: baseCurrency,
      toCurrencyCode: quoteCurrency,
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.MARKET_INTELLIGENCE,
      data: currencyPairParam,
      authToken: sessionStorage.getItem('token'),
    });
  };
  const onClickCreateRateAlert = () => {
    setShowCurrencyPairAlertModal(true);
  };

  return (
    <>
      <GridContainer justify="center">
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <div style={{ float: 'left' }}>
            <h4>
              <b>Create Rate Alert & Live FX Rates</b>
            </h4>
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={10} lg={10}>
          <Card>
            <CardBody style={{ paddingLeft: 0, paddingRight: 10, display: "flex" }}>
              <GridItem xs={11} sm={11} md={6} lg={6}>
                {baseCurrency !== "" && quoteCurrency !== "" && <RateAlertPage currencyPair={baseCurrency + quoteCurrency} />}
              </GridItem>
              <GridItem xs={11} sm={11} md={6} lg={6} style={{ marginLeft: 25, borderLeft: "1px solid" }}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={7} lg={7}>
                        <FormControl className={classes.filledSelect}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                            }}
                            value={baseCurrency}
                            onChange={handleBuyCurrency}
                            inputProps={{
                              name: 'baseCurrency',
                              id: 'baseCurrency',
                              classes: {
                                icon: classes.white,
                                root: classes.selectDropDown,
                              },
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Currency
                            </MenuItem>
                            {mappedCurrencies.map((item) => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={item}
                                key={item}
                              >
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <SwapHoriz
                          onClick={() => swapCurrencies()}
                          style={{
                            fontSize: 38,
                            backgroundColor: '#40A8BD',
                            color: 'white',
                            padding: 3,
                            width: 55,
                            height: 25,
                            marginLeft: 5,
                            marginRight: 5,
                          }}
                        />
                        <FormControl className={classes.filledSelect}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                            }}
                            value={quoteCurrency}
                            onChange={handleBuyCurrency}
                            inputProps={{
                              name: 'quoteCurrency',
                              id: 'quoteCurrency',
                              classes: {
                                icon: classes.white,
                                root: classes.selectDropDown,
                              },
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Currency
                            </MenuItem>
                            {mappedCurrencies.map((item) => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={item}
                                key={item}
                              >
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      {/* <GridItem xs={12} sm={12} md={5} lg={5}>
                        <Button color="success" size="sm" round style={{ marginRight: 7, marginTop: 0 }} onClick={() => onClickCreateRateAlert()}>
                          CREATE RATE ALERT
                        </Button>
                      </GridItem> */}
                    </GridContainer>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      textAlign: 'center',
                      // backgroundColor: "#1D64B0"
                    }}
                  >
                    <PortalDashboardGraph quoteCurrency={quoteCurrency} baseCurrency={baseCurrency} />
                  </GridItem>
                </GridContainer>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
        {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
      </GridContainer>
    </>
  );
};

CreateRateAlert.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(regularFormsStyle)(CreateRateAlert));
