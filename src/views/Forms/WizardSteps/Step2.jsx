import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Edit from '@material-ui/icons/Edit';
import MailOutline from '@material-ui/icons/MailOutline';
import Close from '@material-ui/icons/Close';
import Event from '@material-ui/icons/Event';
import Fingerprint from '@material-ui/icons/Fingerprint';
import ContactMail from '@material-ui/icons/ContactMail';
import LocationOn from '@material-ui/icons/LocationOn';
import Add from '@material-ui/icons/Add';
import cx from 'classnames';
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import { formatDate } from '../../../utils/Utils';

import AddDirectors from '../../Pages/AddDirectors';
import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';

const style = {
  ellipses: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: 195,
    verticalAlign: 'middle',
  },
  directors: {
    backgroundColor: 'rgba(64,168,189,0.15)',
  },
  cardTitleWhite: {
    fontSize: 14,
  },
  infoText: {
    fontWeight: '300',
    margin: '10px 0 30px',
    textAlign: 'center',
  },
  inputAdornmentIcon: {
    color: '#555',
  },
  choiche: {
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
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
  closeIcon: {
    backgroundColor: '#F44336',
    color: 'white',
    padding: 3,
  },
  addIcon: {
    marginTop: 40,
    height: 45,
    width: 45,
    borderRadius: 6,
    backgroundColor: 'grey',
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
};

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddon: false,
      simpleSelect: '',
      desgin: false,
      code: false,
      develop: false,
      showAddDirector: false,
      directors: [],
      director: null,
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    };
  }
  sendState() {
    return this.state;
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    });
  };
  // componentDidMount = () => {
  //   alert()
  //   console.log('componentDidMount',this.props.allStates)
  //   if(this.props.apiDataFetched){
  //     this.setState(
  //       {...this.props.allStates},()=>{
  //         console.log('componentDidMount stat',this.props.allStates)

  //       }
  //     )

  //   }
  
  // };
  componentWillReceiveProps(newProps){
    console.log('componentWillReceiveProps',newProps)
    console.log('componentWillReceiveProps props',this.props)

    console.log('componentWillReceiveProps',newProps.apiDataFetched)

    if(this.props.apiDataFetched!=newProps.apiDataFetched && newProps.apiDataFetched){
      console.log('componentWillReceiveProps inside',newProps)
      this.setState(this.setState(
        {...newProps.allStates}
      ),()=>{
        console.log('componentWillReceiveProps after',{...newProps.allStates})
        console.log('componentWillReceiveProps after',this.state)

      })
    }

  }
  handleSimple = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleClose = () => {
    this.setState({ showAddDirector: false });
  };

  showAddDirectorHandler = () => {
    this.setState({ showAddDirector: true, editDirector: null });
  };

  handleDeleteDirector = (id) => {
    this.setState((state) => {
      return {
        directors: state.directors.filter((director) => director.id !== id),
      };
    });
  };

  handleEditDirector = (id) => {
    this.setState((state) => {
      return {
        showAddDirector: true,
        editDirector: state.directors.filter((director) => director.id === id)[0],
      };
    });
  };

  addDirector = (director) => {
    this.setState((state) => {
      state.directors.push({
        ...director,
        id: Math.floor(Math.random() * 1000000),
      });
      return { directors: state.directors };
    });
  };

  updateDirector = (director) => {
    this.setState((state) => {
      let index = state.directors.findIndex((di) => {
        return di.id === director.id;
      });
      state.directors.splice(index, 1, director);
      return { directors: state.directors };
    });
  };

  isValidated() {
    if (this.state.directors.length === 0) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: 'Please add Director first',
      });
      return false;
    }
    return true;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <span>Details of All Directors and Beneficial owners holding more than 10% of the shareholding.</span>
        <GridContainer>
          {this.state.directors.map((director, index) => (
            <GridItem xs={12} sm={12} md={4} lg={4} key={index}>
              <Card pricing classNames={classes.directors} style={{ backgroundColor: 'rgba(64,168,189,0.15)' }}>
                <GridContainer direction='row' style={{ height: 55 }}>
                  <GridItem xs={6} sm={6} md={8} lg={8}>
                    <h4 className={classes.cardTitleWhite} style={{ textAlign: 'left', marginLeft: 15 }}>
                      <b>{director.firstName + ' ' + director.lastName}</b>
                    </h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={4} lg={4} style={{ marginTop: 10, textAlign: 'center' }}>
                    <Edit onClick={this.handleEditDirector.bind(this, director.id)} className={cx(classes.editIcon, classes.icon)} />
                    <Close onClick={this.handleDeleteDirector.bind(this, director.id)} className={cx(classes.closeIcon, classes.icon)} />
                  </GridItem>
                </GridContainer>
                <CardBody style={{ paddingTop: 0 }}>
                  <GridContainer direction='row'>
                    <GridItem xs={6} sm={6} md={12} lg={12} style={{ textAlign: 'left', marginTop: 10 }}>
                      <MailOutline className={classes.icon} />
                      <span className={classes.ellipses}>{director.address}</span>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={12} lg={12} style={{ textAlign: 'left', marginTop: 10 }}>
                      <LocationOn className={classes.icon} />
                      <span>{director.postalCode}</span>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={12} lg={12} style={{ textAlign: 'left', marginTop: 10 }}>
                      <GridContainer direction='row'>
                        <GridItem xs={6} sm={6} md={8} lg={8}>
                          <Event className={classes.icon} />
                          <span>{formatDate(director.dob)}</span>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={4} lg={4} style={{ textAlign: 'end' }}>
                          <Fingerprint className={classes.icon} />
                          <ContactMail className={classes.icon} />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          ))}
          <GridItem xs={12} sm={12} md={4} lg={4}>
            <Card
              pricing
              classNames={classes.directors}
              style={{
                backgroundColor: 'rgba(64,168,189,0.15)',
                minHeight: 165,
              }}
            >
              <CardBody>
                <Add className={cx(classes.editIcon, classes.icon, classes.addIcon)} onClick={this.showAddDirectorHandler} />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <AddDirectors
          handleClose={this.handleClose}
          showModal={this.state.showAddDirector}
          addDirector={this.addDirector}
          directors={this.state.directors}
          editDirector={this.state.editDirector}
          updateDirector={this.updateDirector}
          isAddon={this.state.isAddon}
        />
        <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        />
      </div>
    );
  }
}
Step2.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(Step2);
