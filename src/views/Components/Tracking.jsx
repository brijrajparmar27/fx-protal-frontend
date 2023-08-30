import ReactGA from "react-ga";

export const TrackPage = () => {
  ReactGA.initialize("UA-186725923-1");
  ReactGA.pageview(window.location.pathname + window.location.hash);
};

export const initGA = trackingID => {
  ReactGA.initialize(trackingID);
};

export const PageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.hash);
};
