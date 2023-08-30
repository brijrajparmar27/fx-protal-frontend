import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import cx from "classnames";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import hedgeAccountingPrintStyle from "assets/jss/material-dashboard-pro-react/views/hedgeAccountingPrintStyle.jsx";

class CurrencyRiskDocumentPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { classes, documentContent } = this.props;
    let seq = 0;
    return (
      <div className={cx(classes.container)}>
        <GridContainer justify="center" className={classes.groupContainer}>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h2 className={cx(classes.groupHeader, classes.featureTitleHeader)}>
              {this.props.documentName}
            </h2>
            {this.props.documentContent && this.props.documentContent.fields && this.props.documentContent.fields.map((content, index) => {
              // customisedBlank=customisedBlank?customisedBlank:(content.heading=='Customised' && (!content.value || content.value != ''))
              seq = content.isVisible && !(content.heading == "Customised" && content.value == "") ? seq + 1 : seq;
              index =
                index > 9 && documentContent.fields[9].value == ""
                  ? index
                  : index + 1;
              
              return content.isVisible && (
                <>{content.heading == "Customised" && content.value == "" ? (
                <></>
              ) : (
                <>
                  <h4>
                    <b>{seq + ". " + content.heading}</b>
                  </h4>
                  <p className={cx(classes.grouptext)}>
                    {content.value && content.value !== ""
                      ? content.value
                      : "none"}
                  </p>
                </>
                )}
                </>
              );
              
            })}
            <p className={cx(classes.grouptext)}>
              <span>Date:</span>
              <span style={{ paddingLeft: "2%" }}>
                {this.props.documentContent.approvalDate}
              </span>
            </p>

            {this.props.documentContent && this.props.documentContent.approvedByInfo && this.props.documentContent.approvedByInfo.map((content, i) => {
              return (
                <GridContainer className={classes.groupContainer} key={i}>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <p>Signed By</p>
                    <p>{content.signedBy}</p>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <p>Approved By</p>
                    <p>{content.aprrovedBy}</p>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <p>Designation</p>
                    <p>{content.designation}</p>
                  </GridItem>
                </GridContainer>
              );
            })}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
CurrencyRiskDocumentPrint.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(hedgeAccountingPrintStyle)(CurrencyRiskDocumentPrint);
