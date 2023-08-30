import React from "react";

const OTPTime = "01:00";

class TimeoutTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: OTPTime //'01:00'
    };
    this.interval = null;
  }
  componentDidMount() {
    this.startTimer();
  }
  startTimer = () => {
    var presentTime = this.state.timeLeft;
    console.log("startTimer - ", presentTime);
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = this.checkSecond(timeArray[1] - 1);
    if (s == 59) {
      m = m - 1;
    }
    this.setState(
      {
        timeLeft: m + ":" + s
      },
      () => {
        setTimeout(this.startTimer, 1000);
      }
    );
  };

  checkSecond = sec => {
    if (sec < 10 && sec >= 0) {
      sec = "00" + sec;
    } // add zero in front of numbers < 10
    if (sec < 0) {
      sec = "59";
    }
    return sec;
  };
  render() {
    return <h4>In case of no action, You will be logout in {this.state.timeLeft} seconds</h4>;
  }
}
export default TimeoutTimer;
