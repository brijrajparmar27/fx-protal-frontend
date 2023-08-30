import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

import paginationStyle from "assets/jss/material-dashboard-pro-react/components/paginationStyle.jsx";

function Pagination({ ...props }) {
  const { classes, pages, color, currentPage } = props;
  const pageNeighbours = 2;

  if (pages.length === 0) return null;

  let displayPages = [];
  if (currentPage === 1) {
    displayPages.push({ text: `FIRST`, disabled: true });
    displayPages.push({ text: `PREVIOUS`, disabled: true });
  } else {
    displayPages.push({ text: `FIRST` });
    displayPages.push({ text: `PREVIOUS` });
  }
  const totalPages = pages.length;

  const totalBlocks = 5; //totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const leftBound = currentPage - pageNeighbours;
    const rightBound = currentPage + pageNeighbours;

    let startPage = leftBound > 1 ? leftBound : 1;
    let endPage = rightBound < totalPages ? rightBound : totalPages;

    const count = endPage - startPage + 1;
    if (count < totalBlocks) {
      if (endPage + count > totalPages) {
        endPage = totalPages;
        startPage = endPage - totalBlocks + 1;
      }
      endPage =
        endPage + count > totalPages
          ? totalPages
          : endPage + (totalBlocks - count);
    }

    // pages = range(startPage, endPage);
    let i = startPage;
    while (i <= endPage) {
      displayPages.push(pages[i - 1]);
      i += 1;
    }
    if (currentPage === totalPages) {
      displayPages.push({ text: `NEXT`, disabled: true });
      displayPages.push({ text: `LAST`, disabled: true });
    } else {
      displayPages.push({ text: `NEXT` });
      displayPages.push({ text: `LAST` });
    }
  } else {
    displayPages = displayPages.concat(pages);
    if (currentPage === totalPages) {
      displayPages.push({ text: `NEXT`, disabled: true });
      displayPages.push({ text: `LAST`, disabled: true });
    } else {
      displayPages.push({ text: `NEXT` });
      displayPages.push({ text: `LAST` });
    }
  }
  return (
    <ul className={classes.pagination}>
      {displayPages.map((prop, key) => {
        const paginationLink = cx({
          [classes.paginationLink]: true,
          [classes[color]]: prop.active,
          [classes.disabled]: prop.disabled
        });
        return (
          <li className={classes.paginationItem} key={key}>
            {props.onClick !== undefined ? (
              <Button onClick={props.onClick} className={paginationLink}>
                {prop.text}
              </Button>
            ) : (
              <Button
                onClick={() => console.log("you've clicked " + prop.text)}
                className={paginationLink}
              >
                {prop.text}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

Pagination.defaultProps = {
  color: "primary"
};

Pagination.propTypes = {
  classes: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      text: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(["PREV", "NEXT", "..."])
      ]).isRequired
    })
  ).isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  onClick: PropTypes.func,
  currentPage: PropTypes.any
};

export default withStyles(paginationStyle)(Pagination);
