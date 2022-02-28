import React from 'react'
import PropTypes from 'prop-types'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'

// Table being made based off of https://material-ui.com/components/tables/

const DataTable = ({ rows = [], columns = [] }) => {
  return (
    <TableContainer>
      <Table className="data-table">
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
          {rows.map((row, rowIndex) => {
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
  );
}

DataTable.propTypes = {
  rows: PropTypes.array
}

export default DataTable
