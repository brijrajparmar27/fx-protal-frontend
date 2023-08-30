import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import Search from "@material-ui/icons/Search";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/Table/Table.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  }
};

class ResearchFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: [],
      columns: [],
      displayData: [],
      searchName: "",
      source: "CNBC",
      startIndex: 0,
      size: 10,
      isMoreFeed: true
    };
  }

  componentDidMount() {
    this.getResearchFeed(0, "CNBC");
  }

  getResearchFeed = async (start, source) => {
    if (source === 'TRADING') {
      const res = await apiHandler({
        url: 'https://api.tradingeconomics.com/news?c=guest:guest&f=json'
      });
      console.log(res);
      const feedList = res.data.map(f => {
        return { ...f, link: 'https://tradingeconomics.com' + f.url, content: f.description }
      });
      this.setState(
        {
          source: source
        },
        () => this.parseResearchFeed(start, {items: feedList})
      );
    } else {
      const query =
        "?type=" + source + "&start=" + start + "&size=" + this.state.size;
      const res = await apiHandler({
        url: endpoint.MARKET_INTELLIGENCE_NEWS + query,
        authToken: sessionStorage.getItem("token")
      });
      this.setState(
        {
          source: source
        },
        () => this.parseResearchFeed(start, res.data)
      );
    }
  };
  parseResearchFeed = (start, feed) => {
    let feedList = start === 0 ? [] : this.state.displayData;
    feed.items.forEach((item, i) => {
      feedList.push([i, item.title, this.getDocumentLink(item.link)]);
    });

    let updatedFeed = [];
    if (start === 0) {
      updatedFeed = feed;
    } else {
      updatedFeed = this.state.feed;
      updatedFeed.items = [...updatedFeed.items, ...feed.items];
      updatedFeed.isMore = feed.isMore;
    }
    let isMore = feed.isMore;
    if ((this.state.source.includes('INVESTING') && this.state.source !== 'INVESTING_5') || (this.state.source.includes('REUTERS') && this.state.source !== 'REUTERS_5')) isMore = true;

    this.setState({
      feed: updatedFeed,
      displayData: feedList,
      startIndex: start,
      isMoreFeed: isMore
    });
  };
  searchResearchFeed = searchName => {
    let feedList = [];
    this.state.feed.items.forEach((item, i) => {
      if (
        searchName === "" ||
        item.content.toLowerCase().includes(searchName.toLowerCase()) ||
        item.title.toLowerCase().includes(searchName.toLowerCase())
      )
        feedList.push([i, item.title, this.getDocumentLink(item.link)]);
    });

    this.setState({
      displayData: feedList
    });
  };
  getDocumentLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    ) : null;
  };
  handleRadioChange = event => {
    this.getResearchFeed(0, event.target.value);
  };
  searchRelevantFeed = (name, event) => {
    const value = event.target.value;
    this.setState(
      {
        searchName: value
      },
      () => {
        this.searchResearchFeed(value);
      }
    );
  };
  showNextNewsFeed = () => {
    let index = this.state.source.lastIndexOf('_');
    if (index === -1) {
      this.getResearchFeed(
        this.state.startIndex + this.state.size,
        this.state.source
      );
    } else {
      let type = this.state.source.substring(0, index);
      let val = this.state.source.substring(index+1, this.state.source.length);
      let newVal = Number(val) + 1;
      this.setState(
        {
          source: type + "_" + newVal
        },
        () => {
          this.getResearchFeed(0, type + "_" + newVal);
        }
      );
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={7} sm={7} md={7} lg={7}>
            <h4 style={{ display: "inline-block" }}>
              <b>Currency Intelligence</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            style={{ textAlign: "right" }}
            className={classes.title}
          >
            <div style={{ display: "inline-block", float: "right" }}>
              <CustomInput
                formControlProps={{
                  className: classes.top + " " + classes.search
                }}
                inputProps={{
                  placeholder: "Search",
                  inputProps: {
                    "aria-label": "Search",
                    className: classes.searchInput,
                    onChange: event => this.searchRelevantFeed("search", event)
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
                  className={classes.headerLinksSvg + " " + classes.searchIcon}
                />
              </Button>
            </div>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">Select Source</FormLabel> */}
              <RadioGroup
                row
                aria-label="research feed"
                name="research"
                defaultValue="CNBC"
                onChange={this.handleRadioChange}
              >
                <FormControlLabel
                  value="CNBC"
                  control={<Radio color="primary" />}
                  label="CNBC"
                />
                <FormControlLabel
                  value="INVESTING_1"
                  control={<Radio color="primary" />}
                  label="Investing UK"
                />
                <FormControlLabel
                  value="FOREXLIVE"
                  control={<Radio color="primary" />}
                  label="Forrex Live"
                />
                <FormControlLabel
                  value="TRADING"
                  control={<Radio color="primary" />}
                  label="Trading Economics"
                />
                <FormControlLabel
                  value="REUTERS_1"
                  control={<Radio color="primary" />}
                  label="Reuters"
                />
              </RadioGroup>
            </FormControl>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4>{this.state.feed && this.state.feed.title}</h4>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.columns}
              tableData={this.state.displayData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[classes.tableHedgeHead]}
              customClassesForCells={[1]}
            />
          </GridItem>
          {this.state.isMoreFeed && (
            <GridItem xs={11} sm={11} md={11} lg={11}>
              <Button
                round={false}
                color="info"
                size="md"
                onClick={() => this.showNextNewsFeed()}
              >
                MORE
              </Button>
            </GridItem>
          )}
        </GridContainer>
      </div>
    );
  }
}
ResearchFeed.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(ResearchFeed);
