import {
  DataGrid,
  GridRowEditStopReasons,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import {
  Button,
  Stack,
  Chip,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { Delete, Check, Error, Add } from "@mui/icons-material";
import moment from "moment";
import { Expense } from "@/types/expense";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import ExpenseForm from "./ExpenseForm";

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
        onChange={(newValue) =>
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue,
          })
        }
      />
    ),
    renderCell: (params: any) => moment(params.value).format("MMMM Do, YYYY"),
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
        onChange={(newValue) =>
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: newValue,
          })
        }
      />
    ),
    renderCell: (params: any) =>
      params.value ? (
        moment(params.value).format("MMMM Do, YYYY")
      ) : params.row.date_due &&
        moment(params.row.date_due).isBefore(moment(), "day") ? (
        <Chip
          icon={<Error />}
          label="Past due"
          color="error"
          variant="outlined"
          size="small"
        />
      ) : (
        <Chip
          icon={<Error />}
          label="Not paid"
          color="warning"
          variant="outlined"
          size="small"
        />
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
        value={params.value ? "Yes" : "No"}
        onChange={(event) =>
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: event.target.value === "Yes",
          })
        }
      >
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    ),
    renderCell: (params: any) =>
      params.value ? <Check color="success" /> : "",
  },
];

interface ExpensesTableProps {
  expenses: Expense[];
  refetch: () => Promise<void>;
  monthYear: string;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses, refetch, monthYear }) => {
  const [rows, setRows] = useState(
    expenses.map((item, index) => ({ ...item, id: item.id || index }))
  );

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRows(expenses.map((item, index) => ({ ...item, id: item.id || index })));
  }, [expenses]);

  const handleRowEdit = async (newRow: any) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/expenses/${newRow.id}`, newRow);

      if (response.status === 200) {
        setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? newRow : row)));
        await refetch();
      } else {
        console.error("Failed to update row:", newRow);
      }

      return newRow;
    } catch (error) {
      console.error("Error updating row:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      if (selectedRows.length === 1) {
        const rowId = selectedRows[0];
        const response = await axios.delete(`/api/expenses/${rowId}`);
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row.id)));
          await refetch();
        }
      } else if (selectedRows.length > 1) {
        const response = await axios.delete(`/api/expenses`, {
          data: selectedRows,
        });
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row.id)));
          await refetch();
        }
      } else {
        console.log("No rows selected");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    } finally {
      setIsDeleting(false);
    }
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
        loading={loading}
      />
      <Stack spacing={1} direction="row">
        <ExpenseForm
          monthYear={monthYear}
          refetch={refetch}
        />
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0 || isDeleting}
          sx={{ minWidth: "120px", borderRadius: "15px" }}
          startIcon={
            isDeleting ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : (
              <Delete />
            )
          }
        >
          {isDeleting ? "Deleting" : "Delete Selected"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExpensesTable;
