import React from 'react';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import Slide from '@material-ui/core/Slide';
import GridItem from 'components/Grid/GridItem.jsx';
import Table from 'components/Table/Table.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';

// core components
import modalStyle from 'assets/jss/material-dashboard-pro-react/modalStyle.jsx';

import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import { formatMoney } from '../../../utils/Utils';

import addCustomersStyle from 'assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx';

const style = (theme) => ({
  container: {
    // paddingTop: "50px",
    paddingBottom: '60px',
    backgroundColor: '#ffffff',
    //  textAlign: "center"
  },
  iconButton: {
    //right: theme.spacing(1),
    //top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: '#53ac57',
    float: 'right',
  },
  newSection: {
    marginTop: '20px',
  },
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch,
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class RiskInsightDataReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportObj: {},
    };
  }
  componentDidMount() {}
  checkForAnyRisk = () => {
    let question2C = this.props.questionsObj.filter((x) => x.questionId === '2.3'); //2.3
    let question23 = this.props.questionsObj.filter((x) => x.questionId === '9'); //9
    let displayA =
      (question2C.length > 0 && question2C[0].answer && question2C[0].answer.name === 'Yes') ||
      (question23.length > 0 && question23[0].answer && question23[0].answer.name === 'Yes');

    // questionId 2 , 3, 4,5, 7, 8
    let question2 = this.props.questionsObj.filter((x) => x.questionId === '2'); //2
    let question3 = this.props.questionsObj.filter((x) => x.questionId === '2.2'); //2.2
    let question7 = this.props.questionsObj.filter((x) => x.questionId === '3'); //3
    let question8 = this.props.questionsObj.filter((x) => x.questionId === '3.2'); //3.2
    let question10 = this.props.questionsObj.filter((x) => x.questionId === '4'); //4
    let question11 = this.props.questionsObj.filter((x) => x.questionId === '4.2'); //4.1
    let question13 = this.props.questionsObj.filter((x) => x.questionId === '5'); //5
    let question17 = this.props.questionsObj.filter((x) => x.questionId === '7'); //7
    let question19 = this.props.questionsObj.filter((x) => x.questionId === '8'); //8
    let question22 = this.props.questionsObj.filter((x) => x.questionId === '9.2'); //9.2

    let displayB =
      (question2.length > 0 && question2[0].answer && question2[0].answer.name === 'Yes') ||
      (question7.length > 0 && question7[0].answer && question7[0].answer.name === 'Yes') ||
      (question10.length > 0 && question10[0].answer && question10[0].answer.name === 'Yes') ||
      (question13.length > 0 && question13[0].answer && question13[0].answer.name === 'Yes') ||
      (question17.length > 0 && question17[0].answer && question17[0].answer.name === 'Yes') ||
      (question19.length > 0 && question19[0].answer && question19[0].answer.name === 'Yes');

    let question16 = this.props.questionsObj.filter((x) => x.questionId === '6'); //6
    let displayC = question16.length > 0 && question16[0].answer && question16[0].answer.name === 'Yes';

    let question25 = this.props.questionsObj.filter((x) => x.questionId === '11'); //11
    let displayD = question25.length > 0 && question25[0].answer && question25[0].answer.name === 'Yes';

    let question26 = this.props.questionsObj.filter((x) => x.questionId === '12'); // 12
    let displayE = question26.length > 0 && question26[0].answer && question26[0].answer.name === 'Yes';

    return displayA || displayB || displayC || displayD || displayE;
  };
  renderNoRisk = () => {
    let question2C = this.props.questionsObj.filter((x) => x.questionId === '2.3'); //2.3
    let question23 = this.props.questionsObj.filter((x) => x.questionId === '9'); //9
    let displayA =
      (question2C.length > 0 && question2C[0].answer && question2C[0].answer.name === 'Yes') ||
      (question23.length > 0 && question23[0].answer && question23[0].answer.name === 'Yes');

    // questionId 2 , 3, 4,5, 7, 8
    let question2 = this.props.questionsObj.filter((x) => x.questionId === '2'); //2
    let question3 = this.props.questionsObj.filter((x) => x.questionId === '2.2'); //2.2
    let question7 = this.props.questionsObj.filter((x) => x.questionId === '3'); //3
    let question8 = this.props.questionsObj.filter((x) => x.questionId === '3.2'); //3.2
    let question10 = this.props.questionsObj.filter((x) => x.questionId === '4'); //4
    let question11 = this.props.questionsObj.filter((x) => x.questionId === '4.2'); //4.1
    let question13 = this.props.questionsObj.filter((x) => x.questionId === '5'); //5
    let question17 = this.props.questionsObj.filter((x) => x.questionId === '7'); //7
    let question19 = this.props.questionsObj.filter((x) => x.questionId === '8'); //8
    let question22 = this.props.questionsObj.filter((x) => x.questionId === '9.2'); //9.2

    let displayB =
      (question2.length > 0 && question2[0].answer && question2[0].answer.name === 'Yes') ||
      (question7.length > 0 && question7[0].answer && question7[0].answer.name === 'Yes') ||
      (question10.length > 0 && question10[0].answer && question10[0].answer.name === 'Yes') ||
      (question13.length > 0 && question13[0].answer && question13[0].answer.name === 'Yes') ||
      (question17.length > 0 && question17[0].answer && question17[0].answer.name === 'Yes') ||
      (question19.length > 0 && question19[0].answer && question19[0].answer.name === 'Yes');

    let question16 = this.props.questionsObj.filter((x) => x.questionId === '6'); //6
    let displayC = question16.length > 0 && question16[0].answer && question16[0].answer.name === 'Yes';

    let question25 = this.props.questionsObj.filter((x) => x.questionId === '11'); //11
    let displayD = question25.length > 0 && question25[0].answer && question25[0].answer.name === 'Yes';

    let question26 = this.props.questionsObj.filter((x) => x.questionId === '12'); // 12
    let displayE = question26.length > 0 && question26[0].answer && question26[0].answer.name === 'Yes';

    const { classes } = this.props;
    return (
      <>
        {this.displayTable(
          ['Summary of FX Risks:', 'Risk Present'],
          [
            [0, 'Pre- Transaction FX Risk', displayA ? 'Yes' : 'No'],
            [1, 'Transaction FX Risk', displayB ? 'Yes' : 'No'],
            [2, 'Translation FX Risk', displayC ? 'Yes' : 'No'],
            [3, 'Economic FX Risk', displayD ? 'Yes' : 'No'],
            [4, 'Embedded FX Risk', displayE ? 'Yes' : 'No'],
          ]
        )}
        <p style={{ color: '#5383ec', fontWeight: 'bold' }}>
          You seem to have no FX risks. Please revisit the questionnaire and check your answers.
        </p>
      </>
    )
  };
  renderPreTransactionRisk = () => {
    console.log('renderPreTransactionRisk', this.props.questionsObj);
    // questionId 2.3 and 9
    let question2C = this.props.questionsObj.filter((x) => x.questionId === '2.3'); //2.3
    let question9 = this.props.questionsObj.filter((x) => x.questionId === '9'); //9
    console.log('renderPreTransactionRisk', question2C);
    console.log('renderPreTransactionRisk', question9);

    if (
      (question2C.length > 0 && question2C[0].answer && question2C[0].answer.name === 'Yes') ||
      (question9.length > 0 && question9[0].answer && question9[0].answer.name === 'Yes')
    ) {
      return (
        <>
          <p>
            <b>1. Identification of FX risks</b>
          </p>
          <p>
            <b>Pre-Transaction FX Risks</b>
          </p>
          <p>
            Pre-transaction risk is the foreign exchange risk which a company is exposed from the moment they submit a bid for a business contract in a foreign currency until the
            moment that contract is signed and confirmed.
          </p>
          <p>You have Pre-Transaction risks because:</p>
          <li
            style={{
              display: question2C.length > 0 && question2C[0].answer && question2C[0].answer.name === 'Yes' ? '' : 'none',
            }}
          >
            {'You sell your product in foreign currency with a product price list which is valid for a certain duration.'}
          </li>
          <li
            style={{
              display: question9.length > 0 && question9[0].answer && question9[0].answer.name === 'Yes' ? '' : 'none',
            }}
          >
            {'You are planning to do an M&A deal and would pay in foreign currency to make an acquisition.'}
          </li>
        </>
      );
    } else {
      return (
        <p>
          <b>1. Identification of FX risks</b>
        </p>
      );
    }
  };
  renderTransactionRisk = () => {
    // questionId 2 , 3, 4,5, 7, 8
    let question2 = this.props.questionsObj.filter((x) => x.questionId === '2'); //2
    let question7 = this.props.questionsObj.filter((x) => x.questionId === '3'); //3
    let question10 = this.props.questionsObj.filter((x) => x.questionId === '4'); //4
    let question13 = this.props.questionsObj.filter((x) => x.questionId === '5'); //5
    let question17 = this.props.questionsObj.filter((x) => x.questionId === '7'); //7
    let question19 = this.props.questionsObj.filter((x) => x.questionId === '8'); //8

    if (
      (question2.length > 0 && question2[0].answer && question2[0].answer.name === 'Yes') ||
      (question7.length > 0 && question7[0].answer && question7[0].answer.name === 'Yes') ||
      (question10.length > 0 && question10[0].answer && question10[0].answer.name === 'Yes') ||
      (question13.length > 0 && question13[0].answer && question13[0].answer.name === 'Yes') ||
      (question17.length > 0 && question17[0].answer && question17[0].answer.name === 'Yes') ||
      (question19.length > 0 && question19[0].answer && question19[0].answer.name === 'Yes')
    ) {
      return (
        <>
          <p>
            <b>Transaction FX Risks</b>
          </p>
          <p>
            Transaction risk is the risk of an exchange rate changing between the transaction date (for example, from the sale date or the cost agreement date) and the subsequent
            settlement when the sale amount is paid, or costs are realised.
          </p>

          <p>You have Transaction risks because of:</p>
          <p>
            <ul>
              <li
                style={{
                  display: question2.length > 0 && question2[0].answer && question2[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your foreign currency sales income'}
              </li>
              <li
                style={{
                  display: question7.length > 0 && question7[0].answer && question7[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your foreign currency costs'}
              </li>
              <li
                style={{
                  display: question10.length > 0 && question10[0].answer && question10[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your foreign currency dividend income'}
              </li>
              <li
                style={{
                  display: question13.length > 0 && question13[0].answer && question13[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your foreign currency loans'}
              </li>

              <li
                style={{
                  display: question17.length > 0 && question17[0].answer && question17[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your foreign currency investments (other than in your subsidiaries, affiliates, etc.)'}
              </li>

              <li
                style={{
                  display: question19.length > 0 && question19[0].answer && question19[0].answer.name === 'Yes' ? '' : 'none',
                }}
              >
                {'Your planned investment sale'}
              </li>
            </ul>
          </p>
        </>
      );
    } else {
      return null;
    }
  };
  renderTranslationRisk = () => {
    // questionId 6
    let question16 = this.props.questionsObj.filter((x) => x.questionId === '6'); //6

    if (question16.length > 0 && question16[0].answer && question16[0].answer.name === 'Yes') {
      return (
        <>
          <p>
            <b>Translation FX Risk</b>
          </p>
          <p>
            You have mentioned that you have overseas subsidiaries or affiliates. The financial statements of overseas subsidiaries or affiliates are translated into the home
            currency in the group's financial statements. This is purely a paper-based exercise as it is the translation, not converting real money from one currency to another.
          </p>
          {/* <p>
            group's financial statements. This is purely a paper-based exercise
            as it is the translation not the conversion of real money from one
            currency to another.
          </p> */}
          <p>
            However, the reported performance of an overseas subsidiary in home-based currency terms can be distorted if there has been a significant foreign exchange movement.
            This risk is called Translation risk.
          </p>
          {/* <p>This risk is called Translation risk.</p> */}
        </>
      );
    } else {
      return null;
    }
  };
  renderEconomicRisk = () => {
    // questionId 11
    let question25 = this.props.questionsObj.filter((x) => x.questionId === '11'); //11

    if (question25.length > 0 && question25[0].answer && question25[0].answer.name === 'Yes') {
      return (
        <>
          <p>
            <b>Economic FX Risk</b>
          </p>
          <p>
            You have mentioned that you have competitors of your products and services in foreign countries. This exposes you to economic FX risk as your
            competitors’ cost base, supply chain structure, financing etc., in that country can make your products and services less competitive and reduce the value of your
            company.
          </p>
          <p>
            Economic FX exposure is different from Transaction FX exposure. The latter focuses on relatively short-term cash flows, whereas the former focuses on the longer-term
            effects of changes in exchange rates on the market value of a company.
          </p>
          <p>
            Economic driven FX risk is difficult to quantify and hedge. However, it can be mitigated by diversifying internationally in sales, location of production facilities,
            raw materials, and financing. Such diversification is likely to significantly reduce the impact of economic exposure relative to a purely domestic company and provide
            much greater flexibility to react to fundamental exchange rate changes.
          </p>
        </>
      );
    } else {
      return null;
    }
  };
  renderEmbededRisk = () => {
    // questionId 26
    let question26 = this.props.questionsObj.filter((x) => x.questionId === 26);

    if (question26.length > 0 && question26[0].answer && question26[0].answer.name === 'Yes') {
      return (
        <>
          <p>
            <b>Embedded FX Risk</b>
          </p>
          <p>
            You have mentioned that over and above risks, you have embedded, or hidden risks in some of your contracts. These risks can sometimes be committed transaction FX risks
            (such as foreign currency pay roll to employees). However, in some cases they can be contingent FX risks (such as the ability of foreign customer to buy your goods or
            services in their own currency instead of in your own reporting currency).
          </p>
          <p>
            If these risks are transactions risks, they can be hedged by using FX Forward contracts. However, contingent risks, until realised, could be hedged with FX Option
            contracts which can be expensive.
          </p>
        </>
      );
    } else {
      return null;
    }
  };
  renderSecondSection = () => {
    // check for any Receipt / Payment / Investment
    let questionID2_1 = this.props.questionsObj.filter((x) => x.questionId === '2.1'); //1z
    let questionID8_1 = this.props.questionsObj.filter((x) => x.questionId === '8.1'); //7z
    let questionID4_1 = this.props.questionsObj.filter((x) => x.questionId === '4.1'); //3z

    let questionID3_1 = this.props.questionsObj.filter((x) => x.questionId === '3.1'); //2z
    let questionID5_2 = this.props.questionsObj.filter((x) => x.questionId === '5.2'); //4z
    let questionID9_1 = this.props.questionsObj.filter((x) => x.questionId === '9.1'); //8z

    let questionID7_1 = this.props.questionsObj.filter((x) => x.questionId === '7.1'); //6z

    let displayRecord = false;
    questionID2_1.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });
    questionID8_1.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });
    questionID4_1.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });
    questionID3_1.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });
    questionID5_2.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });
    questionID7_1.forEach((x) => {
      if (x.currencyPerformance.length > 0) displayRecord = displayRecord || true;
    });

    return (
      <div style={{ marginTop: '20px' }}>
        <p>
          <b>2. Quantification of FX risks</b>
        </p>
        <p>
          <b>i) Volatilities in the currency that matter in your business</b>
        </p>
        {displayRecord ? (
          <>
            <p>
              <b>Given below is the historical currency variations in your business:</b>
            </p>

            {this.renderReceiptCurrencyTable()}
          </>
        ) : (
          <>
            <p style={{ color: '#5383ec' }}>
              <b>No currency exposure information was provided. Please provide this information to obtain this analysis.</b>
            </p>
            {this.displaySensitivityPercentTable()}
          </>
        )}
      </div>
    );
  };
  renderReceiptHedgingTable = () => {
    let questionID2_1 = this.props.questionsObj.filter((x) => x.questionId === '2.1'); //1z
    let questionID8_1 = this.props.questionsObj.filter((x) => x.questionId === '8.1'); //7z

    let questionID4_1 = this.props.questionsObj.filter((x) => x.questionId === '4.1'); //3z

    let data = [];
    let currenyValuation = {};
    let columns = ['Receipt Currency', 'Currency Pair', 'Indicative mid hedging cost/benefit for 12-month hedge*'];
    //let arr=[...questionID2_1,...questionID4_1, ...questionID8_1];
    let index = 0;
    let displayTable = false;
    questionID2_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID4_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID8_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });

    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {displayTable && <p>* The negative percentage is cost, and positive percentage is benefit</p>}
        {this.renderPaymentHedgingTable()}
      </>
    );
  };
  renderPaymentHedgingTable = () => {
    let questionID3_1 = this.props.questionsObj.filter((x) => x.questionId === '3.1'); //2z
    let questionID5_2 = this.props.questionsObj.filter((x) => x.questionId === '5.2'); //4z
    let questionID9_1 = this.props.questionsObj.filter((x) => x.questionId === '9.1'); //8z

    let data = [];
    let currenyValuation = {};
    let columns = ['Payment Currency', 'Currency Pair', 'Indicative mid hedging cost/benefit for 12-month hedge*'];
    // let arr=[...questionID3_1,...questionID5_2, ...questionID9_1];
    let index = 0;
    let displayTable = false;
    questionID3_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID5_2.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID9_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });

    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {displayTable && <p>* The negative percentage is cost, and positive percentage is benefit</p>}
        {this.renderInvestmentHedgingTable()}
      </>
    );
  };
  renderInvestmentHedgingTable = () => {
    let questionID7_1 = this.props.questionsObj.filter((x) => x.questionId === '7.1'); //2z

    let data = [];
    let currenyValuation = {};
    let columns = ['Investment Currency', 'Currency Pair', 'Indicative mid hedging cost/benefit for 12-month hedge*'];
    // let arr=[...questionID3_1,...questionID5_2, ...questionID9_1];
    let index = 0;
    let displayTable = false;
    questionID7_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.hedgingCostPercentage ? answer.hedgingCostPercentage + '%' : 'N/A']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {displayTable && <p>* The negative percentage is cost, and positive percentage is benefit</p>}
      </>
    );
  };
  renderThirdSection = (totalIncrementAmount, overallGrossMargin, overallGrossMarginPercent, senstivityPercentage, grossMargin) => {
    const { classes } = this.props;
    let question2C = this.props.questionsObj.filter((x) => x.questionId === '2.3'); //2.3
    let question23 = this.props.questionsObj.filter((x) => x.questionId === '9'); //10
    let displayA =
      (question2C.length > 0 && question2C[0].answer && question2C[0].answer.name === 'Yes') ||
      (question23.length > 0 && question23[0].answer && question23[0].answer.name === 'Yes');

    // questionId 2 , 3, 4,5, 7, 8
    let question2 = this.props.questionsObj.filter((x) => x.questionId === '2'); //2
    let question3 = this.props.questionsObj.filter((x) => x.questionId === '2.2'); //2.2
    let question7 = this.props.questionsObj.filter((x) => x.questionId === '3'); //3
    let question8 = this.props.questionsObj.filter((x) => x.questionId === '3.2'); //3.2
    let question10 = this.props.questionsObj.filter((x) => x.questionId === '4'); //4
    let question11 = this.props.questionsObj.filter((x) => x.questionId === '4.2'); //4.1
    let question13 = this.props.questionsObj.filter((x) => x.questionId === '5'); //5
    let question17 = this.props.questionsObj.filter((x) => x.questionId === '7'); //7
    let question19 = this.props.questionsObj.filter((x) => x.questionId === '8'); //8
    let question22 = this.props.questionsObj.filter((x) => x.questionId === '9.2'); //9.2

    let displayB =
      (question2.length > 0 && question2[0].answer && question2[0].answer.name === 'Yes') ||
      (question7.length > 0 && question7[0].answer && question7[0].answer.name === 'Yes') ||
      (question10.length > 0 && question10[0].answer && question10[0].answer.name === 'Yes') ||
      (question13.length > 0 && question13[0].answer && question13[0].answer.name === 'Yes') ||
      (question17.length > 0 && question17[0].answer && question17[0].answer.name === 'Yes') ||
      (question19.length > 0 && question19[0].answer && question19[0].answer.name === 'Yes');

    let question16 = this.props.questionsObj.filter((x) => x.questionId === '6'); //6
    let displayC = question16.length > 0 && question16[0].answer && question16[0].answer.name === 'Yes';

    let question25 = this.props.questionsObj.filter((x) => x.questionId === '11'); //11
    let displayD = question25.length > 0 && question25[0].answer && question25[0].answer.name === 'Yes';

    let question26 = this.props.questionsObj.filter((x) => x.questionId === '12'); // 12
    let displayE = question26.length > 0 && question26[0].answer && question26[0].answer.name === 'Yes';

    let displayZ = totalIncrementAmount !== 0 && overallGrossMargin !== 0; //need to check condition later
    let questionID12 = this.props.questionsObj.filter((x) => x.questionId === '12'); // 12

    let answeredQuestion12 =
      questionID12.length > 0 &&
      questionID12[0].answer &&
      questionID12[0].answer.currencyAmounts &&
      questionID12[0].answer.currencyAmounts.length > 0 &&
      questionID12[0].answer.currencyAmounts[0].amount != null &&
      questionID12[0].answer.currencyAmounts[0].amount !== '';

    let questionID13 = this.props.questionsObj.filter((x) => x.questionId === '13');
    let answeredQuestion13 =
      questionID13.length > 0 &&
      questionID13[0].answer &&
      questionID13[0].answer.currencyAmounts &&
      questionID13[0].answer.currencyAmounts.length > 0 &&
      questionID13[0].answer.currencyAmounts[0].amount != null &&
      questionID13[0].answer.currencyAmounts[0].amount !== '';
    let questionID15 = this.props.questionsObj.filter((x) => x.questionId === '15');
    let answeredQuestion15Response = questionID15.length > 0 && questionID15[0].answer ? questionID15[0].answer : '';
    let answeredQuestion23Response = question23.length > 0 && question23[0].answer && question23[0].answer.name ? question23[0].answer.name : '';

    let questionID2_1 = this.props.questionsObj.filter((x) => x.questionId === '2.1'); //1z
    let answeredQuestion2_1 = questionID2_1.length > 0 && questionID2_1[0].answer && questionID2_1[0].answer.currencyAmounts && questionID2_1[0].answer.currencyAmounts.length > 0;

    let questionID3_1 = this.props.questionsObj.filter((x) => x.questionId === '3.1'); //2z
    let answeredQuestion3_1 = questionID3_1.length > 0 && questionID3_1[0].answer && questionID3_1[0].answer.currencyAmounts && questionID3_1[0].answer.currencyAmounts.length > 0;

    let questionID4_1 = this.props.questionsObj.filter((x) => x.questionId === '4.1'); //3z
    let answeredQuestion4_1 = questionID4_1.length > 0 && questionID4_1[0].answer && questionID4_1[0].answer.currencyAmounts && questionID4_1[0].answer.currencyAmounts.length > 0;

    let questionID5_2 = this.props.questionsObj.filter((x) => x.questionId === '5.2'); //4z
    let answeredQuestion5_2 = questionID5_2.length > 0 && questionID5_2[0].answer && questionID5_2[0].answer.currencyAmounts && questionID5_2[0].answer.currencyAmounts.length > 0;

    let questionID7_1 = this.props.questionsObj.filter((x) => x.questionId === '7.1'); //6z
    let answeredQuestion7_1 = questionID7_1.length > 0 && questionID7_1[0].answer && questionID7_1[0].answer.currencyAmounts && questionID7_1[0].answer.currencyAmounts.length > 0;

    let questionID8_1 = this.props.questionsObj.filter((x) => x.questionId === '8.1'); //7z
    let answeredQuestion8_1 = questionID8_1.length > 0 && questionID8_1[0].answer && questionID8_1[0].answer.currencyAmounts && questionID8_1[0].answer.currencyAmounts.length > 0;

    let questionID9_1 = this.props.questionsObj.filter((x) => x.questionId === '9.1'); //8z
    let answeredQuestion9_1 = questionID9_1.length > 0 && questionID9_1[0].answer && questionID9_1[0].answer.currencyAmounts && questionID9_1[0].answer.currencyAmounts.length > 0;

    let questionID12_1 = this.props.questionsObj.filter((x) => x.questionId === '12.1'); //11z
    let answeredQuestion12_1 =
      questionID12_1.length > 0 && questionID12_1[0].answer && questionID12_1[0].answer.currencyAmounts && questionID12_1[0].answer.currencyAmounts.length > 0;

    let answeredQuestion3 = question3.length > 0 && question3[0].answer ? question3[0].answer : 0;
    let answeredQuestion8 = question8.length > 0 && question8[0].answer ? question8[0].answer : 0;
    let answeredQuestion11 = question11.length > 0 && question11[0].answer ? question11[0].answer : 0;
    let answeredQuestion22 = question22.length > 0 && question22[0].answer ? question22[0].answer : 0;

    let depreciatedGrossMargin = grossMargin * (1 - overallGrossMarginPercent / 100);
    return (
      <div className={classes.newSection}>
        <p>
          <b>3. Designing Hedging Framework or Policy</b>
        </p>
        {displayA || displayB || displayC || displayD || displayE ? (
          <>
            <p className={classes.newSection}>
              <b>What to hedge</b>
            </p>
            <p style={{ display: displayA ? '' : 'none' }}>
              {'Pre-transaction risk can be hedged, however, in general using FX options can be expensive as it involves payment of up-front premium.'}
            </p>
            <p style={{ display: displayB ? '' : 'none' }}>{'Transaction risks are the most commonly hedged FX risks.'}</p>
            <p style={{ display: displayC ? '' : 'none' }}>{"Translation risks are not usually hedged as they do not impact the company's cash flow."}</p>
            <p style={{ display: displayD ? '' : 'none' }}>{'FX deals cannot effectively hedge economic FX risks.'}</p>
            <p style={{ display: displayE ? '' : 'none' }}>
              {'Embedded FX needs to be analysed and split into Pre-Transaction risk (if any), or Transaction risk, and treated accordingly.'}
            </p>
          </>
        ) : null}
        {displayA || displayB || displayE ? (
          <div className={classes.newSection}>
            <p>
              We will focus our attention on Transaction risk hedging (which includes Pre-Transaction risk; when the risk of uncertainty from the underlying transaction is removed,
              the Pre-transaction risk becomes the Transaction risk).
            </p>
            <p>To know how to make a hedging framework or policy, you would also need to consider the following:</p>
            <p>
              i) Is your profit margin from the business is very susceptible to changes in FX rates. Or is the impact of exchange rate changes in your business is significant
              enough for you to be concerned?
            </p>
            <p>ii) What is your risk appetite or risk tolerance</p>
            <p>iii) Are your competitors hedging and whether this may have an impact on your ability to compete with them on products and services you compete with them</p>
          </div>
        ) : null}

        <p className={classes.newSection}>
          <b>Impact on Profits, or Profit margins</b>
        </p>

        {displayZ && (
          <p>
            {'Based on the information you have provided, a ' +
              senstivityPercentage +
              '% appreciation in ' +
              this.props.functionalCurrency +
              ' could change your Gross Margin to ' +
              formatMoney(overallGrossMargin) +
              ' ' +
              this.props.functionalCurrency +
              ' from the previous level.'}
          </p>
        )}
        <p style={{ display: answeredQuestion13 ? '' : 'none' }}>{'This is  ' + Math.abs(overallGrossMarginPercent) + '% of your gross margin.'}</p>
        <p>{'The higher the possible impact of FX changes in Profits or profit margins, the greater the need to hedge FX risks.'}</p>
        <p className={classes.newSection}>
          <b>Your risk appetite or tolerance</b>
        </p>

        {answeredQuestion15Response.name !== '' ? (
          <>
          {answeredQuestion15Response.name !== 'Do not know' ? (
            <>
            <p>{'You have indicated that you have ' + answeredQuestion15Response.name + ' to FX risks.'}</p>
            <p>
              The greater the FX risk tolerance you have, the lesser you could hedge as you accept more significant variations to your profits and/or financial statements and are
              happy with this.
            </p>
            </>
          ) : (
            <>
            <p>{'You have indicated that you do not know your risk appetite or tolerance.'}</p>
            <p>
            {'The greater the FX risk tolerance you have, the lesser you could hedge as you accept more significant variations to your profits and/or financial statements and are happy with this.'}
            </p>
            </>
          )}
          </>
        ) : (
          <>
          <p>
            {'You have not indicated your appetite or tolerance to FX risks.'}
          </p>
          <p>{'The greater the FX risk tolerance you have, the lesser you could hedge as you accept more significant variations to your profits and/or financial statements and are happy with this.'} 
          </p>
          </>
        )}
        <p className={classes.newSection}>
          <b>Hedging by your competitors</b>
        </p>

        {answeredQuestion23Response !== '' ? (
          <>
            {answeredQuestion23Response === 'Yes' ? (
              <>
                <p>You have indicated that you have competitors who sell their products and services in your home market.</p>
                <p>
                  As your competitors in your market may be exposed to similar FX risks as to yours, whether they hedge can impact their ability to offer products and services more
                  competitively than you.
                </p>
                <p>
                  For example, if you import raw material from abroad from the same place where your competitors import from, and they have hedged the cost of the raw material
                  against the appreciation of the foreign currency, and you have not, they may be able to sell their final products cheaper than you.
                </p>
                <p>
                  Thus, hedging practises adopted by your competitors also can influence your decision to hedge your FX risks. This would depend on your further analysis of
                  competitor dynamics in relation to FX prices movements.
                </p>
              </>
            ) : (
              <>
                <p>You have indicated that you do not have competitors who sell their products and services in your home market.</p>
                <p>
                  If you had such competitors, they may be exposed to similar FX risks as to yours, and their FX hedging behaviour could also be a criteria for your own hedging
                  decision.
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <p>
              As your competitors in your market may be exposed to similar FX risks as to yours, whether they hedge can impact their ability to offer products and services more
              competitively than you.
            </p>
            <p>
              For example, if you import raw material from abroad from the same place where your customers import from, and they have hedged the cost of the raw material against
              the appreciation of the foreign currency, and you have not, they may be able to sell their final products cheaper than you.
            </p>
            <p>
              Thus, hedging practises adopted by your competitors also can influence your decision to hedge your FX risks. This would depend on your further analysis of competitor
              dynamics in relation to FX prices movements.
            </p>
          </>
        )}
        {/* <p
          style={{
            display: displayC && !displayD ? "" : "none",
            marginTop: "20px"
          }}
        >
          Thanks for filling the FX risk insight questionnaire. You may need to
          analyse your Translation FX exposure in more detail and seek
          specialist assistance if needed.
        </p>
        <p
          style={{
            display: !displayC && displayD ? "" : "none",
            marginTop: "20px"
          }}
        >
          Thanks for filling the FX risk insight questionnaire. You may need to
          analyse your Economic FX exposure in more detail and seek specialist
          assistance if needed.
        </p>
        <p
          style={{
            display: displayC && displayD ? "" : "none",
            marginTop: "20px"
          }}
        >
          Thanks for filling the FX risk insight questionnaire. You may need to
          analyse your Translation and Economic FX exposure in more detail and
          seek specialist assistance if needed.
        </p> */}

        <p className={classes.newSection}>
          <b>4. How to get started: what to hedge, how much to hedge?</b>
        </p>
        {this.displayTable(
          ['Summary of FX Risks:', 'Risk Present'],
          [
            [0, 'Pre- Transaction FX Risk', displayA ? 'Yes' : 'No'],
            [1, 'Transaction FX Risk', displayB ? 'Yes' : 'No'],
            [2, 'Translation FX Risk', displayC ? 'Yes' : 'No'],
            [3, 'Economic FX Risk', displayD ? 'Yes' : 'No'],
            [4, 'Embedded FX Risk', displayE ? 'Yes' : 'No'],
          ]
        )}

        <p className={classes.newSection}>
          <b>How much to hedge</b>
        </p>
        <p>Within a given FX risk management policy framework, how much to hedge is further influenced by the following factors:</p>
        <p>i) With what certainty you can forecast a certain receipt or payment of funds in foreign currency</p>

        <p style={{ display: answeredQuestion3 ? '' : 'none' }}>
          {'You have mentioned that you can predict your foreign currency sales with ' +
            answeredQuestion3.name +
            '% certainty. The higher the predictability, the higher the percentage of hedge you can do without having the risk of over hedging.'}
        </p>
        <p style={{ display: answeredQuestion8 ? '' : 'none' }}>
          {'You have mentioned that you can predict your foreign currency costs with ' +
            answeredQuestion8.name +
            '% certainty. The higher the predictability, the higher the percentage of hedge you can do without having the risk of over hedging.'}
        </p>
        <p style={{ display: answeredQuestion11 ? '' : 'none' }}>
          {'You have mentioned that you can predict your foreign currency dividend income with ' +
            answeredQuestion11.name +
            '% certainty. The higher the predictability, the higher the percentage of hedge you can do without having the risk of over hedging'}
        </p>
        <p style={{ display: answeredQuestion22 ? '' : 'none' }}>
          {'You have mentioned that you can predict your M&A deals happening within 12 months with a ' +
            answeredQuestion22.name +
            '% likelihood. The higher the predictability, the higher the percentage of hedge you can do without having the risk of over hedging.'}
        </p>

        <p className={classes.newSection}>ii) What is the cost of hedging</p>
        <p>
          The cost of hedging has to be seen in the context of how much the exchange rate movement can happen if you do not hedge and what the cost of hedging that potential
          adverse movement in the currency is if you do hedge.
        </p>
        <p>For the same cost of hedging, in volatile times, you may consider hedging more to avoid having potentially higher risks.</p>
        <p>
          The cost of hedging includes the bid-offer spread and the forward price differential from the spot price due to interest rate differential (which can be positive if you
          are selling the low-interest rate currency and negative if buying the higher interest rate currency). Add in any margins charges by the supplier of the forwards, which
          may include a credit spread for counterparty risks.
        </p>

        <p
          style={{
            display:
              answeredQuestion2_1 ||
              answeredQuestion3_1 ||
              answeredQuestion4_1 ||
              answeredQuestion5_2 ||
              answeredQuestion7_1 ||
              answeredQuestion8_1 ||
              answeredQuestion9_1 ||
              answeredQuestion12_1
                ? ''
                : 'none',
            marginTop: '20px',
          }}
          className={classes.newSection}
        >
          Your indicative cost of hedging - mid-cost based only on interest rate differential is as below.
        </p>
        <p
          style={{
            display:
              answeredQuestion2_1 ||
              answeredQuestion3_1 ||
              answeredQuestion4_1 ||
              answeredQuestion5_2 ||
              answeredQuestion7_1 ||
              answeredQuestion8_1 ||
              answeredQuestion9_1 ||
              answeredQuestion12_1
                ? ''
                : 'none',
            marginTop: '20px',
          }}
          className={classes.newSection}
        >
          These are percentage costs for one year of hedging.
        </p>
        {this.renderReceiptHedgingTable()}
        <p className={classes.newSection}>iii) Currency correlations</p>
        <p>
          If you have income or costs in more than one foreign currency, there may be some correlation between different currency pairs. In simple language, it may mean that when a
          particular currency pair moves in one direction, the other currency pair may always move in the same direction or the opposite direction.
        </p>
        <p>
          If the correlation between the currency pair was stable, there is a case of not hedging all the exposures separately on a gross basis. However, generally speaking, the
          currency correlations keep changing with time and may not be relied on for the total elimination of FX risks. The analysis of currency correlations is not currently
          covered in this report.
        </p>

        <p className={classes.newSection}>iv) Market Forecast of currencies</p>
        <p>It is hard to forecast currency movements consistently over any period.</p>
        <p>In times of higher volatility and heightened risks, it is pretty common to consider FX risk hedging more than when the FX volatility is lower.</p>
        <p>
          However, the best time to hedge a currency risk may be when the currency volatility is not high. It can protect you against the unexpected movements of the currency,
          posing risks for your business.
        </p>
        <p>
          In FXGuard's view, the currency hedging program should consider market factors, and currency volatility. However, you should not overly rely on any currency forecasts or
          predictions or any technical analysis to know the future exchange rates.
        </p>
        <p>FXGuard does not provide any currency forecasts of its own.</p>
      </div>
    );
  };
  displayTable = (columns, data) => {
    return (
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Table
          striped
          tableHeaderColor="info"
          tableHead={columns}
          tableData={data}
          customHeadCellClasses={[]}
          customHeadClassesForCells={[]}
          customCellClasses={[]}
          customClassesForCells={[]}
        />
      </div>
    );
  };
  calculatePercentage = (low, high) => {
    let x = (high - low) / low;
    return x.toFixed(2);
  };
  renderReceiptCurrencyTable = () => {
    let questionID2_1 = this.props.questionsObj.filter((x) => x.questionId === '2.1'); //1z
    let questionID8_1 = this.props.questionsObj.filter((x) => x.questionId === '8.1'); //7z
    let questionID4_1 = this.props.questionsObj.filter((x) => x.questionId === '4.1'); //3z

    let data = [];
    let currenyValuation = {};
    let columns = ['Receipt Currency', 'Currency Pair', 'Last 12-month Performance', 'Max variation in 12 months'];
    //let arr=[...questionID2_1,...questionID4_1, ...questionID8_1];
    let index = 0,
      preTransactionAmount = 0,
      transactionAmount = 0;
    let displayTable = false;
    questionID2_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;

          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ),
            // this.calculatePercentage(answer.closeRateLow, answer.closeRateHigh)
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID4_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;

          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ) + "%",
            // this.calculatePercentage(
            //   answer.closeRateLow,
            //   answer.closeRateHigh
            // ) + "%"
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID8_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;

          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ) + "%",
            // this.calculatePercentage(
            //   answer.closeRateLow,
            //   answer.closeRateHigh
            // ) + "%"
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });

    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {this.renderPaymentCurrencyTable(preTransactionAmount, transactionAmount, currenyValuation)}
      </>
    );
  };
  renderPaymentCurrencyTable = (preTransactionAmount, transactionAmount, currenyValuation) => {
    let questionID3_1 = this.props.questionsObj.filter((x) => x.questionId === '3.1'); //2z
    let questionID5_2 = this.props.questionsObj.filter((x) => x.questionId === '5.2'); //4z
    let questionID9_1 = this.props.questionsObj.filter((x) => x.questionId === '9.1'); //8z

    let data = [];
    let columns = ['Payment Currency', 'Currency Pair', 'Last 12-month Performance', 'Max variation in 12 months'];
    // let arr=[...questionID3_1,...questionID5_2, ...questionID9_1];
    let index = 0;
    let displayTable = false;
    questionID3_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;
          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            //answer.closePriceNow-answer.closePriceBefore,
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ),

            // this.calculatePercentage(answer.closeRateLow, answer.closeRateHigh)
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID5_2.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;
          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            //answer.closePriceNow-answer.closePriceBefore,
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ),

            // this.calculatePercentage(answer.closeRateLow, answer.closeRateHigh)
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });
    questionID9_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;
          data.push([
            index,
            answer.currencyCode,
            answer.currencyPair,
            //answer.closePriceNow-answer.closePriceBefore,
            // this.calculatePercentage(
            //   answer.closePriceBefore,
            //   answer.closePriceNow
            // ),

            // this.calculatePercentage(answer.closeRateLow, answer.closeRateHigh)
            answer.appreciatePerformancePercentage + '%',
            answer.appreciatePerformancePercentageWithHighLow + '%',
          ]);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });

    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {this.renderInvestmentCurrencyTable(preTransactionAmount, transactionAmount, currenyValuation)}
      </>
    );
  };
  renderInvestmentCurrencyTable = (preTransactionAmount, transactionAmount, currenyValuation) => {
    let questionID7_1 = this.props.questionsObj.filter((x) => x.questionId === '7.1'); //6z
    let data = [];
    let columns = ['Investment Currency', 'Currency Pair', 'Last 12-month Performance', 'Max variation in 12 months'];
    // let arr=[...questionID7_1];
    let index = 0;
    let displayTable = false;
    questionID7_1.forEach((x) => {
      x.currencyPerformance.forEach((answer, idx) => {
        if (!currenyValuation[answer.currencyCode]) {
          displayTable = true;
          preTransactionAmount = preTransactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceBefore;
          transactionAmount = transactionAmount + x.answer.currencyAmounts[idx].amount * answer.closePriceNow;
          data.push([index, answer.currencyCode, answer.currencyPair, answer.appreciatePerformancePercentage + '%', answer.appreciatePerformancePercentageWithHighLow + '%']);
          index++;
          currenyValuation = { ...currenyValuation, [answer.currencyCode]: 1 };
        }
      });
    });

    return (
      <>
        {displayTable && this.displayTable(columns, data)}
        {this.displaySensitivityPercentTable(preTransactionAmount, transactionAmount)}
      </>
    );
  };
  displaySensitivityPercentTable = () => {
    const { classes } = this.props;
    const reportData = this.props.reportData && this.props.reportData.riskInsightImpact ? this.props.reportData.riskInsightImpact : {};
    let totalSalesInFunCurrency = reportData && reportData.totalSalesInFunCurrency ? reportData.totalSalesInFunCurrency : 0;
    let totalCostsInFunCurrency = reportData && reportData.totalCostsInFunCurrency ? reportData.totalCostsInFunCurrency : 0;
    let overallGrossMargin = reportData && reportData.overallGrossMargin ? reportData.overallGrossMargin : 0;
    let grossMargin = reportData && reportData.grossMargin ? reportData.grossMargin : 0;
    let overallImpactPercentage = reportData && reportData.overallImpactPercentage ? reportData.overallImpactPercentage : 0;
    const costs = reportData.costs ? reportData.costs : [];
    const sales = reportData.sales ? reportData.sales : [];
    const investments = reportData.investments ? reportData.investments : [];
    const investmentsSales = reportData.investmentsSales ? reportData.investmentsSales : [];
    const mandACosts = reportData.mandACosts ? reportData.mandACosts : [];

    let question16 = this.props.questionsObj.filter((x) => x.questionId === '6'); //6
    let displayC = question16.length > 0 && question16[0].answer && question16[0].answer.name === 'Yes';

    let question24 = this.props.questionsObj.filter((x) => x.questionId === '11'); //11
    let displayD = question24.length > 0 && question24[0].answer && question24[0].answer.name === 'Yes';

    let question25 = this.props.questionsObj.filter((x) => x.questionId === '12');
    let displayE = question25.length > 0 && question25[0].answer && question25[0].answer.name === 'Yes';

    let question26 = this.props.questionsObj.filter((x) => x.questionId === '13');
    let question27 = this.props.questionsObj.filter((x) => x.questionId === '14');

    let displayTable = false;
    if (
      question26.length > 0 &&
      question26[0].answer &&
      question26[0].answer.currencyAmounts &&
      question26[0].answer.currencyAmounts[0] &&
      question26[0].answer.currencyAmounts[0].amount &&
      question27.length > 0 &&
      question27[0].answer &&
      question27[0].answer.currencyAmounts &&
      question27[0].answer.currencyAmounts[0] &&
      question27[0].answer.currencyAmounts[0].amount
    )
      displayTable = true;
    // let incrementPreTransactionAmount =
    //   (preTransactionAmount * senstivityPercentage) / 100 + preTransactionAmount;
    // let decrementPreTransactionAmount =
    //   preTransactionAmount - (preTransactionAmount * senstivityPercentage) / 100;
    // let incrementTransactionAmount =
    //   (transactionAmount * senstivityPercentage) / 100 + transactionAmount;
    // let decrementTransactionAmount =
    //   transactionAmount - (transactionAmount * senstivityPercentage) / 100;
    let senstivityPercentage = reportData && reportData.senstivityPercentage ? reportData.senstivityPercentage : 0;

    let totalIncrementAmount = totalSalesInFunCurrency - totalCostsInFunCurrency;

    // incrementPreTransactionAmount + incrementTransactionAmount;
    // let totalDecrementAmount =
    //   decrementPreTransactionAmount + decrementTransactionAmount;

    // let data1 = [
    //   [
    //     0,
    //     "Pre-Transaction Risks",
    //     formatMoney(incrementPreTransactionAmount) +
    //       " " +
    //       this.props.functionalCurrency,
    //     formatMoney(decrementPreTransactionAmount) +
    //       " " +
    //       this.props.functionalCurrency
    //   ],
    //   [
    //     1,
    //     "Transaction Risks",
    //     formatMoney(incrementTransactionAmount) +
    //       " " +
    //       this.props.functionalCurrency,
    //     formatMoney(decrementTransactionAmount) +
    //       " " +
    //       this.props.functionalCurrency
    //   ],
    //   [
    //     2,
    //     "Total for Pre-Transaction & Transaction FX",
    //     formatMoney(totalIncrementAmount) + " " + this.props.functionalCurrency,
    //     formatMoney(totalDecrementAmount) + " " + this.props.functionalCurrency
    //   ]
    // ];
    const dataHeader = [
      'Impact of ' + this.props.functionalCurrency + ' Appreciation of ' + senstivityPercentage + '% on Gross Margins',
      'Impact %',
      'Gross margin after the FX Impact',
    ];
    let data = [
      [
        1,
        <b>{'Impact on Gross Margin if ' + this.props.functionalCurrency + ' Appreciates against all currencies by ' + senstivityPercentage + '%'}</b>,
        <b>{overallImpactPercentage + '%'}</b>,
        <b>{formatMoney(overallGrossMargin) + ' ' + this.props.functionalCurrency}</b>,
      ],
    ];

    costs.forEach((x, index) => {
      data.push([
        data.length,
        'Impact on Gross Margin if ' + this.props.functionalCurrency + ' Appreciates against ' + x.currencyCode + ' by ' + senstivityPercentage + '%',
        x.percentage + '%',
        formatMoney(x.grossMargin) + ' ' + this.props.functionalCurrency,
      ]);
    });
    sales.forEach((x, index) => {
      data.push([
        data.length,
        'Impact on Gross Margin if ' + this.props.functionalCurrency + ' Appreciates against ' + x.currencyCode + ' by ' + senstivityPercentage + '%',
        x.percentage + '%',
        formatMoney(x.grossMargin) + ' ' + this.props.functionalCurrency,
      ]);
    });
    const dataInvestmentsHeader = [
      'Impact of ' + this.props.functionalCurrency + ' Appreciation of ' + senstivityPercentage + '% on Investments',
      ' Valuation of Investments',
      'Valuation after the FX Impact',
    ];
    let dataInvestments = [];
    investments.forEach((x, index) => {
      dataInvestments.push([
        dataInvestments.length,
        'Impact on Investments if ' + this.props.functionalCurrency + ' Appreciates against ' + x.currencyCode + ' by ' + senstivityPercentage + '%',
        formatMoney(x.valuation) + ' ' + this.props.functionalCurrency,
        formatMoney(x.valudationAfterAppreciation) + ' ' + this.props.functionalCurrency,
      ]);
    });

    const dataInvestmentsSalesHeader = [
      'Impact of ' + this.props.functionalCurrency + ' Appreciation of ' + senstivityPercentage + '% on Investments Sales',
      'Valuation of Investments Sales',
      'Valuation after the FX Impact',
    ];
    let dataInvestmentsSales = [];
    investmentsSales.forEach((x, index) => {
      dataInvestmentsSales.push([
        dataInvestmentsSales.length,
        'Impact on Investments Sales if ' + this.props.functionalCurrency + ' Appreciates against ' + x.currencyCode + ' by ' + senstivityPercentage + '%',
        formatMoney(x.valuation) + ' ' + this.props.functionalCurrency,
        formatMoney(x.valudationAfterAppreciation) + ' ' + this.props.functionalCurrency,
      ]);
    });

    const dataMACostsHeader = [
      'Impact of ' + this.props.functionalCurrency + ' Appreciation of ' + senstivityPercentage + '% on M & A Costs',
      'M & A Costs',
      'M&A Costs after FX Impact',
    ];
    let dataMACosts = [];
    mandACosts.forEach((x, index) => {
      dataMACosts.push([
        dataMACosts.length,
        'Impact on M & A Costs if ' + this.props.functionalCurrency + ' Appreciates against ' + x.currencyCode + ' by ' + senstivityPercentage + '%',
        formatMoney(x.valuation) + ' ' + this.props.functionalCurrency,
        formatMoney(x.valudationAfterAppreciation) + ' ' + this.props.functionalCurrency,
      ]);
    });
    let data2 = [];
    let index = 0;
    if (displayC) {
      data2.push([index++, 'Translation Risks', 'Not quantified as these impact your financial statements and not the cashflows', '']);
    }
    if (displayD) {
      data2.push([index++, 'Economic FX risks', 'Company specific and difficult to quantify and hedge', '']);
    }
    if (displayE) {
      data2.push([
        index++,
        'Embedded risks',
        'Not quantified separately. You can include them either on Pre-Transaction or Transaction FX risk volumes, depending on their characteristic.',
        '',
      ]);
    }
    return (
      <>
        <p className={classes.newSection}>
          <b>ii) Sensitivity of currency movement to your business</b>
        </p>
        <p>
          {'Based on the information you have provided, here is the summary of what the impact could be of a ' +
            senstivityPercentage +
            '% depreciation or appreciation of your home currency on your bottom-line.'}
        </p>
        {/* {this.displayTable([], data1)} */}
        {displayTable ? (
          this.displayTable(dataHeader, data)
        ) : (
          <p style={{ color: '#5383ec' }}>
            This has not been possible to calculate based on the information you have provided. Please revisit the questionnaire and provide answers to relevant questions to get
            further information on this section.
          </p>
        )}
        {dataInvestments.length > 0 && this.displayTable(dataInvestmentsHeader, dataInvestments)}
        {dataInvestmentsSales.length > 0 && this.displayTable(dataInvestmentsSalesHeader, dataInvestmentsSales)}
        {dataMACosts.length > 0 && this.displayTable(dataMACostsHeader, dataMACosts)}
        <div style={{ marginBottom: 30, borderTop: '1px solid #DDD' }} />
        {this.displayTable([], data2)}
        <div className={classes.newSection}>{this.renderThirdSection(totalIncrementAmount, overallGrossMargin, overallImpactPercentage, senstivityPercentage, grossMargin)}</div>
      </>
    );
  };
  renderAdditionalResourcesView = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <p>
          <b>5. Additional Resources</b>
        </p>
        <p>
          You can check out our FX Exposure Calculator to give you further insight into your transaction FX risks affecting your bottom-line and how hedging can mitigate this risk.
        </p>
        <p>You can check out our Sample FX Risk Policy document and customise your requirements to guide the FX Risk management of your business.</p>
        <p>
          Thanks for filling the FX Risk Insight Questionnaire. The report provides a framework for you to recognise and analyse your FX risks. However, the risk analysis provided
          in this report may not be complete and comprehensive. Please seek specialist assistance, or additional resources to complement this analysis if needed.
        </p>
      </div>
    );
  };
  renderAppendixView = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <p>
          <b>Appendix:</b>
        </p>
        <p>i) FX Options cost indication</p>
      </div>
    );
  };
  render() {
    const { classes } = this.props;
    return (
      //       <div className={classes.container}>
      //       <GridContainer justify='center' className={classes.groupContainer}>
      //               <GridItem xs={2} sm={2} md={2} lg={2}>
      // </GridItem>
      <GridItem xs={11} sm={11} md={11} lg={11}>
        <div>
          <span>
            <IconButton aria-label="close" className={classes.iconButton} onClick={() => this.props.toggleView('home')}>
              <HomeRoundedIcon />
            </IconButton>
            <ReactToPrint
              trigger={() => (
                <IconButton aria-label="close" className={classes.iconButton}>
                  <PrintIcon />
                </IconButton>
              )}
              pageStyle="@page { size: auto; margin-top: 10mm; margin-bottom: 20mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 20px !important; } }"
              content={() => this.componentRef}
            />
          </span>
          <span>
            <h5 style={{ fontWeight: 500, textAlign: 'center' }}>FX Risk Summary in your Business</h5>
          </span>
        </div>
        <div ref={(el) => (this.componentRef = el)}>
          {this.checkForAnyRisk() ? (
            <>
              <div style={{ marginTop: '20px' }}>{this.renderPreTransactionRisk()}</div>
              <div style={{ marginTop: '20px' }}>{this.renderTransactionRisk()}</div>
              <div style={{ marginTop: '20px' }}>{this.renderTranslationRisk()}</div>
              <div style={{ marginTop: '20px' }}>{this.renderEconomicRisk()}</div>
              <div style={{ marginTop: '20px' }}>{this.renderEmbededRisk()}</div>
              {this.renderSecondSection()}
              {/* {this.renderThirdSection()} */}
              {this.renderAdditionalResourcesView()}
              {/* {this.renderAppendixView()} */}
            </>
          ) : (
            <div style={{ marginTop: '20px' }}>{this.renderNoRisk()}</div>
          )}
        </div>
      </GridItem>
      // </GridContainer>
      // </div>
    );
  }
}
RiskInsightDataReport.propTypes = {
  classes: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object,
  questionsObj: PropTypes.object,
  reportData: PropTypes.object,
  toggleView: PropTypes.func,
};
export default withStyles(style)(RiskInsightDataReport);
