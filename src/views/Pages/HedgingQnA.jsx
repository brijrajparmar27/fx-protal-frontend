import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
//import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Search from "@material-ui/icons/Search";
import cx from "classnames";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import contentPageStyle from "assets/jss/material-dashboard-pro-react/views/contentPageStyle.jsx";

import questions from "./json/hedgingQnA.json";
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const AccordionDetails = withStyles((theme) => ({
    root: {
        display:'flow-root',
        padding:'8px 16px 16px',

    },
  }))(MuiAccordionDetails);
  
const style = theme => ({
    container: {
        // paddingTop: '50px',
        // paddingBottom: '60px',
        backgroundColor: "#ffffff",
        padding: "50px 30px 60px 50px"
        // , textAlign: "center"
      },
    answertext: {
        fontSize: 16,
        fontWeight: 400,
        textAlign: "justify",
        width:'100%'
      },
      questionsContainer: {
        marginTop: "20px"
      },
      questionsText:{
        
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: "justify",
            width:'100%'
        
      }
});

class HedgingQnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredQuestions: [...questions],
      searchedText: "",
      expandedAccordianId:-1
    };
  }
  componentWillMount() {}

  handleChange = event => {
    const filteredQuestions = questions.filter(x =>
      x.question.toLowerCase().includes(event.target.value.toLowerCase().trim())
    );
    this.setState({ searchedText: event.target.value, filteredQuestions });
  };

  toggleAccordian=(id)=>{
    
    this.setState({
        expandedAccordianId:this.state.expandedAccordianId==id?-1:id
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h4 style={{ display: "inline-block" }}>
            <b>{"Hedging Guidance Q&A"}</b>
          </h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <div className={classes.container}>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
<p className={classes.answertext}><b>Disclaimer:</b> FXGuard limited provides the platform, tools and execution services; however, it does not provide advice on suitability, requirement, proportion or decision by a firm to hedge its business. Hedging may or may not be appropriate for your firm and you should rely on your own decision-making in this regard, or seek professional advice, if necessary.</p>

</GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <div style={{ display: "inline-block", float: "right" }}>
                  <CustomInput
                    formControlProps={{
                      className: classes.top + " " + classes.search
                        }}
                    inputProps={{
                      placeholder: "Search Question",
                      value: this.state.searchedText,
                      inputProps: {
                        "aria-label": "Search",
                        className: classes.searchInput,
                        onChange: this.handleChange
                      }
                    }}
                  />
                  <Button
                    color="white"
                    aria-label="edit"
                    justIcon
                    round
                    className={classes.searchButton}
                  >
                    <Search
                      className={
                        classes.headerLinksSvg + " " + classes.searchIcon
                      }
                    />
                  </Button>
                </div>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.questionsContainer}
              >
                {this.state.filteredQuestions.map((question, index) => {
                  return (
                    <Accordion key={index} expanded={this.state.expandedAccordianId==question.id} onChange={()=>this.toggleAccordian(question.id)}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                <p
                className={cx(classes.questionsText)}
                
              >
                        {question.question}
                  
              </p>
                      </AccordionSummary>
                      <AccordionDetails>
                      {question.answer.content.map((answer, index)=>{
                          return(
                <p
                className={cx(classes.answertext)}
                key={index}
              >
                {answer}
              </p>
                          )
                      })}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
HedgingQnA.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(HedgingQnA);
