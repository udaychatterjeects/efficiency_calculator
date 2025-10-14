import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { apiQuery, apiRoute } from '../../api/apiClient';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ResponsiveEditDialog from "./popup/editSolution";
import ResponsiveAddSolutionMaster from "./popup/addSolutionMaster";
import { ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { getSolutionTablesTheme } from "../common/DataTableStyles";
import {
  // Divider,
  Button,
  IconButton,
  // ListItemIcon,
  // ListItemText,
  // MenuItem,
  // MenuList,
  // Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   input: {
//     display: "none",
//   },
//   typography: {
//     padding: theme.spacing(1),
//     paddingLeft: 10,
//     fontSize: 15,
//   },
// }));

var i = 0;

const AiSolutions = () => {

  const [dataRenderHook, setDataRenderHook] = useState([]);
  // const [tableBodyHeight, setTableBodyHeight] = useState("750px");
  // const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [tracker, setTracker] = useState();

  const [showModal, setShowModal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(0);
  const [showDelModal, setShowDelModal] = useState(0);
  const [showModalhelper, setShowModalhelper] = useState(0);

  const [loadingState, setLoadingState] = useState("Loading...");


  // GIC Things
  // const [displayName, setDisplayName] = useState("");
  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [catelog, setCatelog] = useState("");
  const [solutionCategory, setCategory] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [vector, setVector] = useState("");
  const [effort, setEffort] = useState("");
  // const [firstname, setFirstName] = useState("");

  // const [externalUser, setExternalUser] = useState('');
  // const [email, setEmail] = useState("");
  // const [role, setRole] = useState("");
  // const [id, setId] = useState("");
  // GIC- Trigger rerender table
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [edit, setEdit] = useState("");
  const [yeara, setYeara] = useState(0);
  const [yearb, setYearb] = useState(0);
  const [yearc, setYearc] = useState(0);
  const [yeard, setYeard] = useState(0);
  const [yeare, setYeare] = useState(0);
  const [adoption, setAdoption] = useState(0);
  const [desc, setDesc] = useState("");

  // const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, tableMeta) => {
    //
    setEdit(tableMeta);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const ids = open ? "simple-popover" : undefined;


  // Open A modal window for Edit
  const editor = () => {
    setShowModal(i + 2);
    setShowModalhelper(i++);

    setSid(edit.rowData[0]);
    setCatelog(edit.rowData[1]);
    setStlc(edit.rowData[2]);
    setCategory(edit.rowData[3]);
    setSolutionType(edit.rowData[4]);
    // setSolutionType(edit.rowData[4]);
    // setSolutionType("Generative AI");
    setLicenseType(edit.rowData[5]); licenseType
    setLicsensingCost(edit.rowData[6]);
    setFrequency(edit.rowData[7]);
    setVector(edit.rowData[9]);
    setEffort(edit.rowData[8]);
    setYeara(edit.rowData[10]);
    setYearb(edit.rowData[11]);
    setYearc(edit.rowData[12]);
    setYeard(edit.rowData[13]);
    setYeare(edit.rowData[14]);
    setDesc(edit.rowData[15]);
    setAdoption(edit.rowData[16]);

    // console.log("setSolutionType::",solutionType)
    // Turn the POPUP off
    setAnchorEl(null);
  };

  // Open A modal window for Add
  const addSolution = () => {
    setShowAddModal(i + 2);
    setShowModalhelper(i++);
    // Turn the POPUP off
    setAnchorEl(null);
  };

  /* Deletion */
  const deleter = (tableMeta) => {
    // alert(edit.rowData[0])
    // return false
    let body = {
      id: edit.rowData[0]
    };
    swal({
      title: "Are you sure?",
      text: "You are about to remove a Solution, can't be undone",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willArchive) => {

      if (willArchive) {
        // console.log("PPPPP",edit.rowData[0])
        // swal(edit.rowData[0]);
        apiQuery({
          ...apiRoute.Configuration.deleteSolution,
          // pathParam: { id: edit.rowData[0] },
          body: body,
          // params: { id: edit.rowData[0] },
        })
          .then((values) => {
            // swal("xxxxxx")
            // If removal is successful renderTable
            if (values !== undefined && values.status !== 404) {
              setRefreshTrigger(Math.random());
            } else {
            }
          })
          .then(
            swal("Solution has been deleted successfully", {
              icon: "success",
            })
          );
      } else {
        swal("You did not make any change!");
      }
    });
  };

  const columns = [
    {
      name: "solId",
      label: "Solution ID",
      options: {
        filter: true,
        sort: false,
        display: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "catelog",
      label: "AI Solutions Name",
      options: {
        filter: true,
        sort: false,
        display: true,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit", alignItems:"center" } }),
      },
    },
    {
      name: "stlcName",
      label: "STLC Activities",
      options: {
        filter: true,
        sort: false,
        display: true,
        // setCellHeaderProps: (value) => ({ style: { textAlign:"center !important", color:"#ff0000", position: "inherit" } }),
      },
    },
    {
      name: "solutionCategory",
      label: "Solution Category",
      options: {
        display: true,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "solutionType",
      label: "Solution Type",
      options: {
        display: true,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "licenseType",
      label: "License Type",
      options: {
        filter: true,
        display: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "licsensingCost",
      label: "License Cost ($)",
      options: {
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "frequency",
      label: "Per Month/Year?",
      options: {
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "effortSavings",
      label: "Effort Savings (%)",
      options: {
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "vector",
      label: "Vector ",
      options: {
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption_yeara",
      label: "adoption_yeara",
      options: {
        display: false,
        filter: false,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption_yearb",
      label: "adoption_yearb",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption_yearc",
      label: "adoption_yearc",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption_yeard",
      label: "adoption_yeard",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption_yeare",
      label: "adoption_yeare",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "short_desc",
      label: "desc",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "adoption",
      label: "adoption",
      options: {
        display: false,
        filter: true,
        sort: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "Action",
      options: {
        // setCellHeaderProps: (value) => ({
        //   style: { textAlign: "center", position: "inherit" },
        // }),
        download: false,
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            //---------------------
            <div style={{ spacing: 0, textAlign: "center" }}>
              <IconButton
                aria-label="delete"
                aria-describedby={ids}
                // className={classes.margin}
                onClick={(event) => handleClick(event, tableMeta)}
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                id={ids}
                open={open}
                elevation={1}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div>
                  <div>
                    <Button
                      fullWidth
                      aria-label="delete"
                      disableFocusRipple
                      // className={classes.margin}
                      onClick={editor}
                    // startIcon={<EditIcon/>}
                    >
                      <EditIcon style={{ fill: "ash" }} />{" "}
                      <Typography>
                        Edit
                      </Typography>
                    </Button>
                  </div>
                  <div>
                    <Button
                      fullWidth
                      aria-label="delete"
                      disableFocusRipple
                      // className={classes.margin}
                      onClick={() => deleter(tableMeta)}
                    // startIcon={<DeleteIcon/>}
                    >
                      <DeleteIcon style={{ fill: "red" }} />{" "}
                      <Typography>
                        Delete
                      </Typography>
                    </Button>
                  </div>
                </div>
              </Popover>
            </div>
          );
        },
      },
    },
    {
      name: "firstName",
      label: "firstName",
      options: {
        filter: true,
        display: false,
        sort: true,
        setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "stlc",
      label: "stlc",
      options: {
        filter: true,
        display: false,
        sort: true,
        setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
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
    // filterType: "dropdown",
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
  };

  var res = [];
  useEffect(() => {
    apiQuery(apiRoute.Configuration.AllSolution)
      .then((values) => {
        if (values !== undefined && values.status !== 404) {
          const data = JSON.parse(
            JSON.stringify(values.data).replace(/:null/gi, ':"_"')
          );
          setDataRenderHook(data);
          // console.log(data);
        } else {
          setLoadingState("Unfortunately No Data Found");
        }
      })
      .catch((err) => console.log(err));
  }, [tracker, showModal, showDelModal, refreshTrigger]);

  function resetAll(e) {
    if (confirm("This action will reset all Solutions along with Calculation. Are you sure?")) {
      apiQuery({
        ...apiRoute.Configuration.resetSolutions,
      }).then((response) => {
        alert(response.data.message)
        // setRefreshTrigger()
      });
    }
  }
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">AI Solutions Catalogue</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <React.Fragment>
                      <ThemeProvider theme={getSolutionTablesTheme()}>
                        <MUIDataTable
                          title={<div className="button-header"> 
                          <button className="btn action_button margin-right-5" onClick={addSolution}>Add Solution</button>
                          <button className="btn action_button margin-right-5" onClick={resetAll}>Reset Data</button>
                          </div>}
                          data={dataRenderHook}
                          columns={columns}
                          options={options}
                        />
                      </ThemeProvider>
                    </React.Fragment>

                    <ResponsiveEditDialog
                      flag={showModal}
                      sid={sid}
                      stlc={stlc}
                      catelog={catelog}
                      category={solutionCategory}
                      solutionType={solutionType}
                      licenseType={licenseType}
                      licsensingCost={licsensingCost}
                      yeara={yeara}
                      yearb={yearb}
                      yearc={yearc}
                      yeard={yeard}
                      yeare={yeare}
                      adoption={adoption}
                      desc={desc}
                      frequency={frequency}
                      vector={vector}
                      effort={effort}
                      passerRefresh={(u) => setRefreshTrigger(u)}
                    />

                    <ResponsiveAddSolutionMaster
                      flag={showAddModal}
                      passerRefresh={(u) => setRefreshTrigger(u)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiSolutions;