import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { apiQuery, apiRoute } from '../../api/apiClient';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ResponsiveEditDialog from "./popup/editPhase";
import ResponsiveAddSolutionMaster from "./popup/addPhaseMaster";
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


var i = 0;

const AddStlcPhase = () => {

  const [dataRenderHook, setDataRenderHook] = useState([]);
  const [tracker, setTracker] = useState();

  const [showModal, setShowModal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(0);
  const [showDelModal, setShowDelModal] = useState(0);
  const [showModalhelper, setShowModalhelper] = useState(0);

  const [loadingState, setLoadingState] = useState("Loading...");


  // GIC Things
  // const [displayName, setDisplayName] = useState("");
  const [phase_id, setPid] = useState("");
//   const [stlc, setStlc] = useState("");
//   const [catelog, setCatelog] = useState("");
//   const [solutionCategory, setCategory] = useState("");
//   const [solutionType, setSolutionType] = useState("");
//   const [licenseType, setLicenseType] = useState("");
//   const [licsensingCost, setLicsensingCost] = useState("");
//   const [frequency, setFrequency] = useState("");
//   const [effort, setEffort] = useState("");
  // const [firstname, setFirstName] = useState("");

  // const [externalUser, setExternalUser] = useState('');
  // const [email, setEmail] = useState("");
  // const [role, setRole] = useState("");
  // const [id, setId] = useState("");
  // GIC- Trigger rerender table
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [edit, setEdit] = useState("");
//   const [yeara, setYeara] = useState(0);
//   const [yearb, setYearb] = useState(0);
//   const [yearc, setYearc] = useState(0);
//   const [yeard, setYeard] = useState(0);
//   const [yeare, setYeare] = useState(0);
//   const [adoption, setAdoption] = useState(0);
  const [stlcName, setStlcName] = useState("Uppp");

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

    setPid(edit.rowData[0]);
    // setCatelog(edit.rowData[1]);
    // setStlc(edit.rowData[2]);
    // setCategory(edit.rowData[3]);
    // setSolutionType(edit.rowData[4]);
    // // setSolutionType(edit.rowData[4]);
    // // setSolutionType("Generative AI");
    // setLicenseType(edit.rowData[5]); licenseType
    // setLicsensingCost(edit.rowData[6]);
    // setFrequency(edit.rowData[7]);
    // setEffort(edit.rowData[8]);
    // setYeara(edit.rowData[9]);
    // setYearb(edit.rowData[10]);
    // setYearc(edit.rowData[11]);
    // setYeard(edit.rowData[12]);
    // setYeare(edit.rowData[13]);
    // setDesc(edit.rowData[14]);
    // setAdoption(edit.rowData[15]);

    // console.log("setSolutionType::",solutionType)
    // Turn the POPUP off
    setAnchorEl(null);
  };

  // Open A modal window for Add
  const addPhase = () => {
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
      name: "phase_id",
      label: "Phase ID",
      options: {
        filter: true,
        sort: false,
        display: false,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit" } }),
      },
    },
    {
      name: "phase_name",
      label: "Phase Name",
      options: {
        filter: true,
        sort: false,
        display: true,
        // setCellHeaderProps: (value) => ({ style: { position: "inherit", alignItems:"center" } }),
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
    pagination: false,
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
    apiQuery(apiRoute.Configuration.GetStlcPhases)
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


  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">STLC Phases</div>
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
                          <button className="btn action_button margin-right-5" onClick={addPhase}>Add Phase</button>
                          </div>}
                          data={dataRenderHook}
                          columns={columns}
                          options={options}
                        />
                      </ThemeProvider>
                    </React.Fragment>

                    <ResponsiveEditDialog
                      flag={showModal}
                      phase_id={phase_id}
                    //   stlc={stlc}
                    //   catelog={catelog}
                    //   category={solutionCategory}
                    //   solutionType={solutionType}
                    //   licenseType={licenseType}
                    //   licsensingCost={licsensingCost}
                    //   yeara={yeara}
                    //   yearb={yearb}
                    //   yearc={yearc}
                    //   yeard={yeard}
                    //   yeare={yeare}
                    //   adoption={adoption}
                      stlcName={stlcName}
                    //   frequency={frequency}
                    //   effort={effort}
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

export default AddStlcPhase;