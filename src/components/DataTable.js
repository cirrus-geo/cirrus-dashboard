import React from 'react'
import PropTypes from 'prop-types'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core'

// Table being made based off of https://material-ui.com/components/tables/

const DataTable = ({ rows = [], columns = [] }) => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" className="data-table">
          <TableHead className="data-table-name">
            <TableRow className="data-table-row-headers">
              { columns.map(column => {
                const { key, Header } = column;
                return (
                  <TableCell key={key} className="data-table-row-header">{ Header }</TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => {
              return (
                <TableRow key={`Row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
                    return (
                      <TableCell key={`Cell-${cellIndex}`}>{ cell }</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array
}

export default DataTable
