import React, { useEffect, useState, useContext, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { apiQuery, apiRoute } from "../../api/apiClient";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import AddStlcActivities from "./popup/AddStlcActivities";
import { ThemeProvider } from "@mui/material/styles";
import { getSolutionTablesTheme } from "../common/DataTableStyles";
import MUIDataTable from "mui-datatables";
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

var i = 0;
const StlcEfforts = () => {
  const [responsive, setResponsive] = useState("vertical");
  const [dataRenderHook, setDataRenderHook] = useState([]);
  const [baselineListValues, setBaselineListValues] = useState([]);
  const [tableBodyHeight, setTableBodyHeight] = useState("750px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [squadValues, setSquadValues] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showAddModal, setShowAddModal] = useState(0);
  const [showModalhelper, setShowModalhelper] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const selectedSquadRef = useRef();
  const csvLink = useRef();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const ids = open ? "simple-popover" : undefined;

  useEffect(() => {
    handleProjectCategory("Greenfield Digital Transformation");
  }, [refreshTrigger]);

  function handleProjectCategory(value) {
    setSelectedCategory(value);
    setSelectedApplication("");
    apiQuery({
      ...apiRoute.Configuration.GetStlcByCategory,
      body: {
        catname: value,
      },
    }).then((response) => {
      setBaselineListValues(response.data.data);
    });
  }

  function updateValue() {
    const eDisIdValue = baselineListValues.map((row) => row.eDisId);
    const getOverrideValue = baselineListValues.map(
      (row) => row.overrideBreakup
    );

    const formData = new FormData();
    formData.append("eDisId", eDisIdValue);
    formData.append("overrideValue", getOverrideValue);
    // formData.append("standardValue", getStandardValue);
    formData.append("selectedCategory", selectedCategory);

    apiQuery({
      ...apiRoute.Configuration.addEffortDistribution,
      body: {
        eDisId: eDisIdValue,
        overrideValue: getOverrideValue,
        selectedCategory: selectedCategory,
        // standardValue: getStandardValue,
      },
    })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((err) => {
        alert(err.data.message);
      });
  }

  // Open A modal window for Add
  const addActivities = () => {
    setShowAddModal(i + 2);
    setShowModalhelper(i++);
    // Turn the POPUP off
    setAnchorEl(null);
  };

  const columns = [
    {
      name: "eDisId",
      label: "Solution ID",
      options: {
        filter: true,
        sort: false,
        display: false,
      },
    },
    {
      name: "phase",
      label: "Phase",
      options: {
        filter: true,
        sort: false,
        display: true,
      },
    },
    {
      name: "stlcName",
      label: "STLC Activities",
      options: {
        filter: true,
        sort: false,
        display: true,
      },
    },

    {
      name: "overrideBreakup",
      label: "Program Specific Effort Breakup (%)",
      options: {
        display: true,
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <OutlinedInput
              value={value || ""}
              onChange={(e) => {
                const updatedData = [...baselineListValues];
                updatedData[tableMeta.rowIndex].overrideBreakup =
                  e.target.value;
                setBaselineListValues(updatedData);
              }}
              fullWidth
              size="small"
              style={{ width: "140px" }}
              type="number"
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          );
        },
      },
    },
  ];

  const options = {
    rowHover: true,
    elevation: 0,
    selectableRows: "none",
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    searchable: false,
    textAlign: "center",
    rowsPerPageOptions: [5, 10, 15, 20, 25],
    rowsPerPage: 10,
    pagination: true,
    responsive: "simple",
    maxHeight: "none",
    enableNestedDataAccess: ".",
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "auto",
    icon: false,
    rowHover: false,
    searchOpen: false,
    fixedHeader: true,
    tableBodyHeight: "30em",
    search: false,
  };

  const totalOverrideEffort = baselineListValues.reduce((sum, row) => {
    const value = parseFloat(row.overrideBreakup);
    return !isNaN(value) ? sum + value : sum;
  }, 0);

  const isEffortValid = () => {
    return totalOverrideEffort === 100;
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">
                  QA Effort Breakup Across STLC Activities
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive ">
                    <React.Fragment>
                      <ThemeProvider theme={getSolutionTablesTheme()}>
                        <MUIDataTable
                          title={
                            <div className="button-header">
                              <div className="left-align-text">
                                <button
                                  className="btn action_button margin-right-5"
                                  onClick={addActivities}
                                >
                                  Add Activities
                                </button>

                                <button
                                  className="btn action_button margin-right-5"
                                  disabled={!buttonDisabled || !isEffortValid()}
                                  onClick={() => {
                                    if (!isEffortValid()) {
                                      alert(
                                        "Total Effort Breakup must be exactly 100% before updating."
                                      );
                                      return;
                                    }
                                    updateValue();
                                  }}
                                >
                                  Update
                                </button>
                              </div>

                              <div className="right-align-text">
                                Total Effort Breakup: {totalOverrideEffort}%
                                {!isEffortValid() && (
                                  <span
                                    style={{ color: "red", marginLeft: "10px" }}
                                  >
                                    (Must be exactly 100%)
                                  </span>
                                )}
                              </div>
                            </div>
                          }
                          data={baselineListValues}
                          columns={columns}
                          options={options}
                        />
                      </ThemeProvider>
                    </React.Fragment>
                  </div>
                  <AddStlcActivities
                    flag={showAddModal}
                    passerRefresh={(u) => setRefreshTrigger(u)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StlcEfforts;
