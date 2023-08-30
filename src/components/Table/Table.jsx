import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import tableStyle from "assets/jss/material-dashboard-pro-react/components/tableStyle";

function CustomTable({ ...props }) {
  const {
    classes,
    tableHead,
    tableData,
    tableHeaderColor,
    tableSubHead,
    tableSubHeadCols,
    tableSubHeadClasses,
    hover,
    colorsColls,
    coloredColls,
    customCellClasses,
    customClassesForCells,
    striped,
    tableShopping,
    customHeadCellClasses,
    customHeadClassesForCells,
    isMarketData
  } = props;
  return (
    <div
      className={classes.tableResponsive}
      // style={{ overflow: "hidden" }}
    >
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor]}>
            {tableSubHead !== undefined && (
              <TableRow className={classes.tableRow}>
                {tableSubHead.map((prop, key) => {
                  return (
                    <TableCell
                      key={key}
                      align="center"
                      colSpan={tableSubHeadCols[key]}
                      className={cx(
                        classes.tableHeadCell,
                        classes.tableCell,
                        // customHeadCellClasses[0],
                        classes.tableHeadFontSize,
                        tableSubHeadClasses[key]
                      )}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
            <TableRow className={classes.tableRow}>
              {tableHead.map((prop, key) => {
                const sort =
                  props.onClickColumnHeader &&
                  props.columnsDetails &&
                  props.columnsDetails[key].sort
                    ? true
                    : false;

                const tableCellClasses =
                  classes.tableHeadCell + " " + classes.tableCell + " " + sort
                    ? classes.tableHeadClick + " "
                    : "" +
                      cx({
                        [customHeadCellClasses[
                          customHeadClassesForCells.indexOf(key)
                        ]]: customHeadClassesForCells.indexOf(key) !== -1,
                        [classes.tableShoppingHead]: tableShopping,
                        [classes.tableHeadFontSize]: !tableShopping
                      });
                return (
                  <TableCell
                    className={tableCellClasses}
                    key={key}
                    onClick={() => {
                      if (sort) {
                        props.onClickColumnHeader(
                          props.columnsDetails[key],
                          key
                        );
                      }
                    }}
                  >
                    {prop}
                    {props.columnSortKey === prop && (
                      <IconButton
                        aria-label="close"
                        // className={classes.closeButton}
                      >
                        {props.sortByAscending ? (
                          <ArrowDropDownIcon />
                        ) : (
                          <ArrowDropUpIcon />
                        )}
                      </IconButton>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData &&
            tableData.map((prop, key) => {
              var rowColor = "";
              var rowColored = false;
              if (prop && prop.color !== undefined) {
                rowColor = prop.color;
                rowColored = true;
                prop = prop.data;
              }
              const tableRowClasses = cx({
                [classes.tableRowHover]: hover,
                [classes[rowColor + "Row"]]: rowColored,
                [classes.tableStripedRow]: striped && key % 2 === 0
              });
              if (prop.total) {
                return (
                  <TableRow key={key} hover={hover} className={tableRowClasses}>
                    <TableCell
                      className={classes.tableCell}
                      colSpan={prop.colspan}
                    />
                    <TableCell
                      className={
                        classes.tableCell + " " + classes.tableCellTotal
                      }
                    >
                      Total
                    </TableCell>
                    <TableCell
                      className={
                        classes.tableCell + " " + classes.tableCellAmount
                      }
                    >
                      {prop.amount}
                    </TableCell>
                    {tableHead.length - (prop.colspan - 0 + 2) > 0 ? (
                      <TableCell
                        className={classes.tableCell}
                        colSpan={tableHead.length - (prop.colspan - 0 + 2)}
                      />
                    ) : null}
                  </TableRow>
                );
              }
              if (prop.purchase) {
                return (
                  <TableRow key={key} hover={hover} className={tableRowClasses}>
                    <TableCell
                      className={classes.tableCell}
                      colSpan={prop.colspan}
                    />
                    <TableCell
                      className={classes.tableCell + " " + classes.right}
                      colSpan={prop.col.colspan}
                    >
                      {prop.col.text}
                    </TableCell>
                  </TableRow>
                );
              }
              if (isMarketData) {
                return (
                  <TableRow
                    key={key}
                    hover={hover}
                    className={classes.tableRow + " " + tableRowClasses}
                    onClick={() => {
                      if (props.onClick) props.onClick(prop[0]);
                    }}
                  >
                    {prop &&
                      prop.map((prop, key) => {
                        if (key > 0) {
                          const tableCellClasses =
                            classes.tableCell + " " + prop.style;
                          return (
                            <TableCell className={tableCellClasses} key={key}>
                              {prop.data}
                            </TableCell>
                          );
                        } else return null;
                      })}
                  </TableRow>
                );
              }
              return (
                <TableRow
                  key={key}
                  hover={hover}
                  className={classes.tableRow + " " + tableRowClasses}
                  onClick={() => {
                    if (props.onClick) props.onClick(prop[0]);
                  }}
                >
                  {prop &&
                    prop.map((prop, key) => {
                      if (key > 0) {
                        const tableCellClasses =
                          classes.tableCell +
                          " " +
                          cx({
                            [classes[colorsColls[coloredColls.indexOf(key)]]]:
                              coloredColls.indexOf(key) !== -1,
                            [customCellClasses[
                              customClassesForCells.indexOf(key)
                            ]]: customClassesForCells.indexOf(key) !== -1
                          });
                        return (
                          <TableCell className={tableCellClasses} key={key}>
                            {prop}
                          </TableCell>
                        );
                      } else return null;
                    })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  hover: false,
  colorsColls: [],
  coloredColls: [],
  striped: false,
  customCellClasses: [],
  customClassesForCells: [],
  customHeadCellClasses: [],
  customHeadClassesForCells: []
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  // Of(PropTypes.arrayOf(PropTypes.node)) || Of(PropTypes.object),
  tableSubHead: PropTypes.arrayOf(PropTypes.object),
  tableSubHeadCols: PropTypes.arrayOf(PropTypes.object),
  tableSubHeadClasses: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.array,
  hover: PropTypes.bool,
  coloredColls: PropTypes.arrayOf(PropTypes.number),
  // Of(["warning","primary","danger","success","info","rose","gray"]) - colorsColls
  colorsColls: PropTypes.array,
  customCellClasses: PropTypes.arrayOf(PropTypes.object),
  customClassesForCells: PropTypes.arrayOf(PropTypes.number),
  customHeadCellClasses: PropTypes.arrayOf(PropTypes.object),
  customHeadClassesForCells: PropTypes.arrayOf(PropTypes.number),
  striped: PropTypes.bool,
  // this will cause some changes in font
  tableShopping: PropTypes.bool,
  onClick: PropTypes.func,
  isMarketData: PropTypes.bool,
  columnsDetails: PropTypes.object,
  onClickColumnHeader: PropTypes.func
};

export default withStyles(tableStyle)(CustomTable);
