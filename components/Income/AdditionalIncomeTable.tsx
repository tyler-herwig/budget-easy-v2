import { AdditionalIncome } from "@/types/additional_income";
import { DataGrid, GridRowEditStopReasons, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button, Stack } from "@mui/material";
import { Delete } from "@mui/icons-material";

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
}

const AdditionalIncomeTable: React.FC<AdditionalIncomeTableProps> = ({
  income,
}) => {
  const [rows, setRows] = useState(
    income.map((item, index) => ({ ...item, id: item.id || index }))
  );
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowEdit = (newRow: any) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    console.log("Updated row:", newRow);
    return newRow;
  };

  const handleDeleteSelected = () => {
    setRows((prevRows) => prevRows.filter((row) => !selectedRows.includes(row.id)));
    console.log("Deleted rows:", selectedRows);
  };

  return (
    <Stack spacing={2} direction="column">
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

export default AdditionalIncomeTable;
