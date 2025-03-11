import { AdditionalIncome } from "@/types/additional_income";
import {
  DataGrid,
  GridRowEditStopReasons,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button, CircularProgress, Stack } from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";

const columns = [
  {
    field: "description",
    headerName: "Description",
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
];

interface AdditionalIncomeTableProps {
  income: AdditionalIncome[];
  refetch: () => Promise<void>;
}

const AdditionalIncomeTable: React.FC<AdditionalIncomeTableProps> = ({
  income,
  refetch,
}) => {
  const [rows, setRows] = useState(
    income.map((item, index) => ({ ...item, id: item.id || index }))
  );
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRows(income.map((item, index) => ({ ...item, id: item.id || index })));
  }, [income]);

  const handleRowEdit = async (newRow: any) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/additional-income/${newRow.id}`,
        newRow
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? newRow : row))
        );
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
        const response = await axios.delete(`/api/additional-income/${rowId}`);
        if (response.status === 200) {
          setRows((prevRows) =>
            prevRows.filter((row) => !selectedRows.includes(row.id))
          );
          await refetch();
        }
      } else if (selectedRows.length > 1) {
        const response = await axios.delete(`/api/additional-income`, {
          data: selectedRows,
        });
        if (response.status === 200) {
          setRows((prevRows) =>
            prevRows.filter((row) => !selectedRows.includes(row.id))
          );
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
    <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
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
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ "& .bold-header": { fontWeight: "bold" }, borderRadius: "15px" }}
        loading={loading}
      />
      <Stack spacing={1} direction="row">
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

export default AdditionalIncomeTable;
