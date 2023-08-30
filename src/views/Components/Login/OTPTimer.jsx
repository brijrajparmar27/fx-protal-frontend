import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

const OTPTime = "05:00";

class OTPTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: OTPTime //'05:00'
    };
    this.interval = null;
  }
  // componentDidMount(){
  //     alert()
  //     this.setState({

  //     },()=>{
  //         this.setTimer()
  //     })
  // }
  componentWillReceiveProps(newProps) {
    if (this.props.resetTimer !== newProps.resetTimer) {
      this.setState({}, () => {
        this.setState(
          {
            timeLeft: OTPTime //'05:00'
          },
          () => {
            if (this.interval) {
              clearTimeout(this.interval);
              this.interval = null;
            }
            this.startTimer();
          }
        );
      });
    }
  }
  //   setTimer = () => {
  //     //var d = new Date();
  //     if (this.interval != null) {
  //       clearInterval(this.interval);
  //     }
  //     this.interval = setInterval(() => {
  //       var d = new Date(); //get current time
  //       var seconds = d.getMinutes() * 60 + d.getSeconds(); //convet current mm:ss to seconds for easier caculation, we don't care hours.
  //       var fiveMin = 60 * 5; //five minutes is 300 seconds!
  //       var timeleft = fiveMin - (seconds % fiveMin); // let's say now is 01:30, then current seconds is 60+30 = 90. And 90%300 = 90, finally 300-90 = 210. That's the time left!
  //       var result = parseInt(timeleft / 60) + ":" + (timeleft % 60); //formart seconds back into mm:ss
  //       // document.getElementById('test').innerHTML = result;
  //       this.setState({
  //         timeLeft: result
  //       });
  //     }, 1000);
  //   };

  startTimer = () => {
    var presentTime = this.state.timeLeft;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = this.checkSecond(timeArray[1] - 1);
    if (s == 59) {
      m = m - 1;
    }
    if (m < 0) {
      this.props.setLoginButtonDisabled(true);
      return;
    }
    this.setState(
      {
        timeLeft: m + ":" + s
      },
      () => {
        this.interval = setTimeout(this.startTimer, 1000);
      }
    );
    //console.log(m)
  };

  checkSecond = sec => {
    if (sec < 10 && sec >= 0) {
      sec = "0" + sec;
    } // add zero in front of numbers < 10
    if (sec < 0) {
      sec = "59";
    }
    return sec;
  };
  //className={classes.subTitle}
  render() {
    return (
      <div>
        <h6>{"OTP is valid for " + this.state.timeLeft + " min"}</h6>
      </div>
    );
  }
}
export default OTPTimer;
