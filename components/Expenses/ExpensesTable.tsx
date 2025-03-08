import { DataGrid, GridRowEditStopReasons, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button, Stack, Chip, TextField, MenuItem, Select } from "@mui/material";
import { Delete, Check, Error } from "@mui/icons-material";
import moment from "moment";
import { Expense } from "@/types/expense";
import { DatePicker } from "@mui/x-date-pickers";

const columns = [
  {
    field: "expense_name",
    headerName: "Expense",
    flex: 1,
    headerClassName: "bold-header",
    editable: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    headerClassName: "bold-header",
    editable: true,
    renderCell: (params: any) => (
      <NumericFormat
        value={params.value || 0}
        displayType="text"
        thousandSeparator={true}
        prefix="$"
        decimalScale={2}
        fixedDecimalScale={true}
      />
    ),
  },
  {
    field: "date_due",
    headerName: "Date Due",
    flex: 1,
    headerClassName: "bold-header",
    editable: true,
    renderEditCell: (params: any) => (
      <DatePicker
        value={moment(params.value)}
        onChange={(newValue) => params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })}
      />
    ),
    renderCell: (params: any) => (
      moment(params.value).format("MMMM Do, YYYY")
    )
  },
  {
    field: "date_paid",
    headerName: "Date Paid",
    flex: 1,
    headerClassName: "bold-header",
    editable: true,
    renderEditCell: (params: any) => (
      <DatePicker
        value={moment(params.value)}
        onChange={(newValue) => params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })}
      />
    ),
    renderCell: (params: any) =>
      params.value ? (
        moment(params.value).format("MMMM Do, YYYY")
      ) : params.row.date_due && moment(params.row.date_due).isBefore(moment(), "day") ? (
        <Chip icon={<Error />} label="Past due" color="error" variant="outlined" size="small" />
      ) : (
        <Chip icon={<Error />} label="Not paid" color="warning" variant="outlined" size="small" />
      ),
  },
  {
    field: "autopay",
    headerName: "Autopay",
    flex: 0.5,
    headerClassName: "bold-header",
    editable: true,
    renderEditCell: (params: any) => (
      <Select
        value={params.value || "No"}
        onChange={(event) => params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value })}
      >
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    ),
    renderCell: (params: any) => (params.value ? <Check color="success" /> : ""),
  },
];

interface ExpensesTableProps {
    expenses: Expense[];
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses }) => {
  const [rows, setRows] = useState(expenses.map((item, index) => ({ ...item, id: item.id || index })));
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowEdit = (newRow: any) => {
    setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? newRow : row)));
    console.log("Updated row:", newRow);
    return newRow;
  };

  const handleDeleteSelected = () => {
    setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row.id)));
    console.log("Deleted rows:", selectedRows);
  };

  return (
    <Stack spacing={2} direction="column" mt={1}>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={handleRowEdit}
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
          }
        }}
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ "& .bold-header": { fontWeight: "bold" }, borderRadius: "15px" }}
      />
      <Stack spacing={1} direction="row">
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
          sx={{ minWidth: "120px", borderRadius: '15px' }}
          startIcon={<Delete />}
        >
          Delete Selected
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExpensesTable;
