import React, { useState } from 'react';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '24%',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };
  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { classes, rowHeight, onRowClick } = this.props;
    let clr = "";
    if (columnIndex === 1) clr = "green";
    if (columnIndex === 2) clr = "red";
    let txtAlign = "left";
    if (columnIndex === 1 || columnIndex === 3) txtAlign = "right";
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick === null,
        })}
        variant="body"
        style={{ height: rowHeight, color: clr }}
        align={txtAlign}
      >
        {this.props.decimalFormat(cellData, columnIndex)}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, classes } = this.props;
    let txtAlign = "left";
    if (columnIndex === 1 || columnIndex === 3) txtAlign = "right";

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight, width: "100%", fontWeight: "bold", color: "gray" }}
        align={txtAlign}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}


const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);


export default function ReactVirtualizedTable(props) {

  const { list, columns } = props;
  const [asksFormatIndex, setAsksFormatIndex] = useState(8);
  const [bidsFormatIndex, setBidsFormatIndex] = useState(8);

  const decimalFormat = (value, index) => {
    if (parseFloat(value)) {
      let decimalParam = asksFormatIndex;;
      if (index < 2)
        decimalParam = bidsFormatIndex;

      return parseFloat(value).toFixed(decimalParam);
    }
    return value;
  }

  const changeAllDecimalFormat = (value) => {
    let allDecimalValue = value + (asksFormatIndex + bidsFormatIndex) / 2;
    setAsksFormatIndex(allDecimalValue);
    setBidsFormatIndex(allDecimalValue);
  }
  return (
    <>

      {list === null ? <div className='loader'><CircularProgress /> <p>{"Loaading order book..."}</p></div> : null}
      {list?.length > 0 ?
        <>
          <h6 className='table-title'>Order book</h6>
          <Grid container spacing={1} className='btn-container'>
            <Grid item xs={4}>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button disabled={bidsFormatIndex <= 0} onClick={() => setBidsFormatIndex(bidsFormatIndex - 1)}>-</Button>
                <Button disabled={bidsFormatIndex >= 8} onClick={() => setBidsFormatIndex(bidsFormatIndex + 1)}>+</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "center" }}>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button disabled={(bidsFormatIndex + asksFormatIndex) <= 0} onClick={() => changeAllDecimalFormat(-1)}>-</Button>
                <Button disabled={(bidsFormatIndex + asksFormatIndex) >= 16} onClick={() => changeAllDecimalFormat(1)}>+</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }} >
              <ButtonGroup variant="text" aria-label="text button group">
                <Button disabled={asksFormatIndex <= 0} onClick={() => setAsksFormatIndex(asksFormatIndex - 1)}>-</Button>
                <Button disabled={asksFormatIndex >= 8} onClick={() => setAsksFormatIndex(asksFormatIndex + 1)}>+</Button>
              </ButtonGroup>
            </Grid>
          </Grid>


          <Paper style={{ height: 500, width: '100%' }}>
            <VirtualizedTable
              rowCount={list.length}
              rowGetter={({ index }) => list[index]}
              columns={columns}
              decimalFormat={decimalFormat}
            />
          </Paper>
        </>
        :
        null
      }

    </>
  );
}
