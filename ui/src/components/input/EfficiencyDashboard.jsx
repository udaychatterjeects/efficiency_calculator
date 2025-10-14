import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { apiQuery, apiRoute } from '../../api/apiClient';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ResponsiveEditDialog from "./popup/addSolution";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { utils, writeFileXLSX } from "xlsx";
// import { useDownloadExcel } from 'react-export-table-to-excel';
// import { ThemeProvider } from "@mui/material/styles";
// import MUIDataTable from "mui-datatables";
// import { getSolutionTablesTheme } from "../common/DataTableStyles";


// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';

// import React from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
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
const EfficiencyDashboard = () => {
  const [dataRenderHook, setDataRenderHook] = useState([]);
  const [barGraphLabel, setBarGraphLabel] = useState("");
  const [cognitiveSolutionList, setCognitiveSolutionList] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [tracker, setTracker] = useState();
  const [showModal, setShowModal] = useState(0);
  const [showDelModal, setShowDelModal] = useState(0);
  const [showModalhelper, setShowModalhelper] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [catelog, setCatelog] = useState("");
  const [category, setCategory] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [effort, setEffort] = useState("");

  const [sumCalculation, setSumCalculation] = useState([]);

  const [podSum, setPodSum] = useState(0);
  const [poaSum, setPoaSum] = useState(0);
  const [orrSum, setOrrSum] = useState(0);
  const [podphSum, setPodphSum] = useState(0);
  const [poaphSum, setPoaphSum] = useState(0);
  const [oesSum, setOesSum] = useState(0);
  const [yearaSum, setYearaSum] = useState(0);
  const [yearbSum, setYearbSum] = useState(0);
  const [yearcSum, setYearcSum] = useState(0);
  const [yeardSum, setYeardSum] = useState(0);
  const [yeareSum, setYeareSum] = useState(0);
  const [graphSum, setGraphSum] = useState(0);
  const [hoursEffSaving, setHoursEffSaving] = useState(0);
  const [podList, setPodList] = useState([]);
  const [poaList, setPoaList] = useState([]);
  const [stlcList, setStlcList] = useState([]);
  // const [podSum, setPodSum] = useState([]);


  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [edit, setEdit] = useState("");

  // const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [programCategory, setProgramCategory] = useState("");
  const [squadValues, setSquadValues] = useState([]);
  const [duration, setDuration] = useState("");
  const [initialEffort, setInitialEffort] = useState("");
  const [iniPhaseList, setIniPhaseList] = useState([]);
  const [yearaPhaseList, setYearaPhaseList] = useState([]);
  const [yearbPhaseList, setYearbPhaseList] = useState([]);
  const [yearcPhaseList, setYearcPhaseList] = useState([]);
  const [yeardPhaseList, setYeardPhaseList] = useState([]);
  const [yearePhaseList, setYearePhaseList] = useState([]);
  const [yearNewPhaseList, setYearNewPhaseList] = useState([]);
  const [comittedGaina, setComittedGaina] = useState(0);
  const [comittedGainb, setComittedGainb] = useState(0);
  const [comittedGainc, setComittedGainc] = useState(0);
  const [comittedGaind, setComittedGaind] = useState(0);
  const [comittedGaine, setComittedGaine] = useState(0);
  const [finalVal, setFinalVal] = useState(0);
  const [efficiencyGainCalc, setEfficiencyGainCalc] = useState(0);
  const [totalSelectSolution, setTotalSelectSolution] = useState(0);
  const [aYearSum, setaYearSum] = useState(0);
  const [bYearSum, setbYearSum] = useState(0);
  const [cYearSum, setcYearSum] = useState(0);
  const [dYearSum, setdYearSum] = useState(0);
  const [eYearSum, seteYearSum] = useState(0);
  const [hidec, setHidec] = useState("none");

  const tbl1 = useRef(null);
  const tbl2 = useRef(null);
  const tbl3 = useRef(null);
  // const tableRef = useRef(null);
  // // const tableRefStlc = useRef(null);

  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: tableRef.current,
  //   filename: 'Users',
  //   sheet: 'Users'
  // })

  // const { onDownloadStlcPhase } = useDownloadExcel({
  //   currentTableRef: tableRefStlc.current,
  //   filename: 'Stlc',
  //   sheet: 'Stlc'
  // })

  const handleClick = (event, tableMeta) => {
    //
    setEdit(tableMeta);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetInitialEffort = (event) => {

    // if (event < 0 || event > 100) {
    //   this.classList.add("input-field-error");
    //   //   this.setCustomValidity(errMsg);
    // }
    setInitialEffort(event);
    // sessionStorage.setItem("duration", event);
  };

  const handlesetDuration = (event) => {
    setDuration(event);
    // sessionStorage.setItem("duration", event);
  };
  const handleProgramCategory = (event) => {
    // alert(event)
    setProgramCategory(event);
    // sessionStorage.setItem("duration", event);
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
    setLicenseType(edit.rowData[4]); licenseType
    setLicsensingCost(edit.rowData[5]);
    setFrequency(edit.rowData[6]);
    setEffort(edit.rowData[7]);
    // Turn the POPUP off
    setAnchorEl(null);
  };

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.GetCalculations,
    }).then((response) => {
      setDataRenderHook(response.data.data);

      // var arr = [{x:1}, {x:2}, {x:4}];
      var fullArr = response.data.data;
      var podSum = fullArr.reduce(function (acc, obj) { return acc + obj.pod; }, 0);
      var poaSum = fullArr.reduce(function (acc, obj) { return acc + obj.poa; }, 0);
      var orrSum = fullArr.reduce(function (acc, obj) { return acc + obj.overr; }, 0);
      var podphSum = fullArr.reduce(function (acc, obj) { return acc + obj.podph; }, 0);
      var poaphSum = fullArr.reduce(function (acc, obj) { return acc + obj.poaph; }, 0);
      var oesSum = fullArr.reduce(function (acc, obj) { return acc + obj.oes; }, 0);
      var yearaSum = fullArr.reduce(function (acc, obj) { return acc + obj.yeara; }, 0);
      var yearbSum = fullArr.reduce(function (acc, obj) { return acc + obj.yearb; }, 0);
      var yearcSum = fullArr.reduce(function (acc, obj) { return acc + obj.yearc; }, 0);
      var yeardSum = fullArr.reduce(function (acc, obj) { return acc + obj.yeard; }, 0);
      var yeareSum = fullArr.reduce(function (acc, obj) { return acc + obj.yeare; }, 0);

      // console.log(result);  // 7
      // alert(orrSum)
      var hoursSaving = podphSum - poaphSum

      setPodSum(podSum)
      setPoaSum(poaSum)
      setOrrSum(orrSum)
      setPodphSum(podphSum)
      setPoaphSum(poaphSum)
      setOesSum(oesSum)
      setYearaSum(yearaSum)
      setYearbSum(yearbSum)
      setYearcSum(yearcSum)
      setYeardSum(yeardSum)
      setYeareSum(yeareSum)
      setHoursEffSaving(hoursSaving)

      console.log("hoursEffSaving->", hoursEffSaving)
      // console.log("poaphSum->",poaphSum) 
    });
  }, [showModal, refreshTrigger]);

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.AllCognitiveSolutionCal,
    }).then((response) => {
      // alert(obj.yeara)
      var fullArrs = response.data;
      var aYearSum = fullArrs.reduce(function (acc, obj) { return acc + obj.yeara; }, 0);
      var bYearSum = fullArrs.reduce(function (acc, obj) { return acc + obj.yearb; }, 0);
      var cYearSum = fullArrs.reduce(function (acc, obj) { return acc + obj.yearc; }, 0);
      var dYearSum = fullArrs.reduce(function (acc, obj) { return acc + obj.yeard; }, 0);
      var eYearSum = fullArrs.reduce(function (acc, obj) { return acc + obj.yeare; }, 0);

      setaYearSum(aYearSum)
      setbYearSum(bYearSum)
      setcYearSum(cYearSum)
      setdYearSum(dYearSum)
      seteYearSum(eYearSum)
      // console.log("VVV::",aYearSum)
      setCognitiveSolutionList(response.data);
      setTotalSelectSolution(response.data.length)
    });
  }, [showModal, refreshTrigger]);


  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.cognitiveSolutionGraph,
    }).then((response) => {
      console.log("Graphresponse:", response.data)
      var totalArr = response.data;
      var graphSum = totalArr.reduce(function (acc, obj) { return acc + obj.value; }, 0);
      setGraphSum(graphSum)
      console.log("graphSum:", graphSum)
      setGraphData(response.data)
      // setGraphData(newArr)
    });
  }, [showModal, refreshTrigger]);

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.GetCategory
    }).then((response) => {
      let newSquadValues = response.data.map((usersquad) => {
        return { squadId: usersquad.squadId, catName: usersquad.catName };
      });
      setSquadValues(newSquadValues);
    });

    apiQuery({
      ...apiRoute.Configuration.GetCommonVal
    }).then((response) => {
      setProgramCategory(response.data.topPC)
      setInitialEffort(response.data.topEffort)
      setDuration(response.data.topDuration)
    });

  }, []);

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.cognitiveSolutionBarGraph,
    }).then((response) => {
      setPodList(response.data.pod)
      setPoaList(response.data.poa)
      setStlcList(response.data.stlc)
    });
  }, [showModal, refreshTrigger]);


  function resetAll(e) {
    if (confirm("Are you sure?")) {
      apiQuery({
        ...apiRoute.Configuration.resetAll,
      }).then((response) => {
        alert(response.data.message)
        window.location.reload();
      });
    }
  }

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainNew,
    }).then((response) => {
      // setHidec('block') 
      // console.log("PPP->", response.data.data)
      // yearNewPhaseList(response.data.data)
      setYearNewPhaseList(response.data.data)

    });
  }, []);

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainIni,
    }).then((response) => {
      // setHidec('block')
      setIniPhaseList(response.data.data)

    });
  }, []);

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainYa,
    }).then((response) => {
      setYearaPhaseList(response.data.data)

    });
  }, []);
  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainYb,
    }).then((response) => {
      setYearbPhaseList(response.data.data)

    });
  }, []);

  useEffect(() => {
    // if(duration>2){
    //   alert("p")
    //   // setHidec('block')
    // }

    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainYc,
    }).then((response) => {
      setYearcPhaseList(response.data.data)

    });
  }, []);
  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainYd,
    }).then((response) => {
      setYeardPhaseList(response.data.data)

    });
  }, []);
  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.getEfficiencyGainYe,
    }).then((response) => {
      setYearePhaseList(response.data.data)

    });
  }, []);

  const columns = [
    {
      name: "col_name",
      label: "Initial QA Effort " + initialEffort + " PH",
      options: {
        filter: true,
        sort: false,
        display: true,
      },
    },
    {
      name: "sp_ini0",
      label: "Sprint Planning",
      options: {
        filter: true,
        sort: false,
        display: true,
      },
    },
    {
      name: "sp_ini1",
      label: "In-Sprint Design",
      options: {
        filter: true,
        sort: false,
        display: true,
      },
    },
    {
      name: "sp_ini2",
      label: "In-Sprint Execution",
      options: {
        display: true,
        filter: true,
        sort: false,
      },
    },
    {
      name: "sp_ini3",
      label: "Sprint Review & Retrospection",
      options: {
        display: true,
        filter: true,
        sort: false,
      },
    },
    {
      name: "sp_ini4",
      label: "QA Efforts Savings %",
      options: {
        filter: true,
        display: true,
        sort: false,
      },
    },
    {
      name: "sp_ini5",
      label: "QA Efforts Savings (PH)",
      options: {
        filter: true,
        sort: false,
      },
    }
  ];
  const options = {
    rowHover: true,
    elevation: 0,
    selectableRows: "none",
    filter: false,
    print: false,
    download: true,
    viewColumns: false,
    searchable: false,
    textAlign: "center",
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
    // tableBodyHeight: "30em",
  };

  return (
    <>
      <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 ">
        <div style={{ paddingLeft: '18px' }}>
          <h3 className="fw-bold mb-3">Savings Summary</h3>

        </div>

      </div>
      <div className="row">
        <Box sx={{ flexGrow: 1 }} >
          <Grid container spacing={3} padding={2}>
            <Grid item xs={5}>
              <div className="card card-stats card-round" style={{ marginBottom: '5px' }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-icon">
                      <div className="icon-big text-center icon-success bubble-shadow-small">
                        <i className="fa fa-suitcase" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col col-stats ms-3 ms-sm-0">
                      <div className="numbers">
                        <p className="card-category">Program Category</p>
                        <h4 className="card-title" style={{ fontSize: '16px' }}>{programCategory}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="card card-stats card-round" style={{ marginBottom: '5px' }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-icon">
                      <div className="icon-big text-center icon-info bubble-shadow-small">
                        <i className="fa fa-clock" aria-hidden="true"></i>

                      </div>
                    </div>
                    <div className="col col-stats ms-3 ms-sm-0">
                      <div className="numbers">
                        <p className="card-category">Duration(Years)</p>
                        <h4 className="card-title">{duration}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={4}>
              <div className="card card-stats card-round" style={{ marginBottom: '5px' }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-icon">
                      <div className="icon-big text-center icon-secondary bubble-shadow-small">
                        <i className="far fa-check-circle" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col col-stats ms-3 ms-sm-0">
                      <div className="numbers">
                        <p className="card-category">No. of AI Solutions Deployed </p>
                        <h4 className="card-title">{totalSelectSolution}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="card card-stats card-round" style={{ marginBottom: '5px' }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-icon">
                      <div className="icon-big text-center icon-warning bubble-shadow-small">
                        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col col-stats ms-3 ms-sm-0" >
                      <div className="numbers">
                        <p className="card-category" style={{ marginRight: '75px' }}>Initial Effort (PH) </p>
                        <h4 className="card-title">{initialEffort}</h4>
                      </div>
                      <div className="numbers">
                        <p className="card-category">Final Effort (PH) </p>
                        <h4 className="card-title">{poaphSum.toFixed(1)}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="card card-stats card-round" style={{ marginBottom: '5px' }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-icon">
                      <div className="icon-big text-center icon-warning bubble-shadow-small">
                        <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col col-stats ms-3 ms-sm-0" >
                      <div className="numbers">
                        <p className="card-category" style={{ marginRight: '75px' }}>Projected  Savings (PH) </p>
                        <h4 className="card-title">{(parseFloat(podphSum) - parseFloat(poaphSum)).toFixed(1)}</h4>
                      </div>
                      <div className="numbers">
                        <p className="card-category">Projected Efficiency </p>
                        <h4 className="card-title">{orrSum.toFixed(2)}%</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '5px' }}>
              <div className="card card-stats card-round">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className=" col-stats ms-3 ms-sm-0">
                      <button onClick={resetAll} className="btn action_button">Reset Data</button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>

        </Box>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">Potential Savings from AI Driven Solutions</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive table-hover table-sales">
                    <button className="btn action_button margin-bottom-5" onClick={() => {
                      const wb = utils.table_to_book(tbl1.current);
                      writeFileXLSX(wb, "Potential_Savings_AI_Driven_Solutions.xlsx");
                    }}>Export XLSX</button>
                    <table ref={tbl1} className="table" style={{ marginBottom:'0'}}>
                      <thead>
                        <tr className="table-header">
                          <th rowSpan={2} width="40%" style={{ textAlign: 'center' }} className='dataTableHead border-right-white'>Selected AI Solutions</th>
                          <th colSpan={duration} style={{ textAlign: 'center' }} className='dataTableHead'>Y-O-Y Cumulative Savings (%)</th>

                        </tr>
                        <tr className="table-header">
                          {(() => {
                            const arrh = [];
                            for (let k = 1; k <= duration; k++) {
                              arrh.push(
                                <th style={{ textAlign: 'center' }} className='dataTableHead' key={k}>Year {k}</th>
                              );
                            }
                            return arrh;
                          })()}
                        </tr>
                      </thead>
                      <tbody>
                        {cognitiveSolutionList.map((cognitive, sl) => {
                          return [
                            <tr key={sl}>
                              <td className='dataTableText border-right'>{cognitive.catelog}</td>
                              {(() => {
                                const arr = [];
                                for (let i = 0; i < duration; i++) {
                                  if (i == 0) {
                                    arr.push(
                                      <td className='dataTableText' key={i}>
                                        {(cognitive.yeara).toFixed(1)}{'\u00A0'}{'\u00A0'}
                                      </td>
                                    );
                                  }
                                  if (i == 1) {
                                    arr.push(
                                      <td className='dataTableText' key={i}>
                                        {(cognitive.yearb).toFixed(1)}
                                      </td>
                                    );
                                  }
                                  if (i == 2) {
                                    arr.push(
                                      <td className='dataTableText' key={i}>
                                        {(cognitive.yearc).toFixed(1)}
                                      </td>
                                    );
                                  }
                                  if (i == 3) {
                                    arr.push(
                                      <td key={i} className='dataTableText'>
                                        {(cognitive.yeard).toFixed(1)}
                                      </td>
                                    );
                                  }
                                  if (i == 4) {
                                    arr.push(
                                      <td className='dataTableText' key={i}>
                                        {(cognitive.yeare).toFixed(1)}
                                      </td>
                                    );
                                  }
                                }
                                return arr;
                              })()}

                            </tr>
                          ];
                        })}
                      </tbody>
                      <tfoot style={{ display:'none'}}>
                        <tr className="total-column" >
                          <td className='border-right center-align'>OVERALL(%): </td>
                          {(() => {
                            const arr = [];
                            for (let i = 0; i < duration; i++) {
                              if (i == 0) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {aYearSum.toFixed(1)}
                                  </td>
                                );
                              }
                              if (i == 1) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {bYearSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 2) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {cYearSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 3) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {dYearSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 4) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {eYearSum.toFixed(1)}
                                  </td>
                                );
                              }
                            }
                            return arr;
                          })()}
                        </tr>
                      </tfoot>
                    </table>
                    <table className="table" cellPadding={0} cellSpacing={0}>
                    <thead>
                        <tr className="total-column" >
                          <td width="40%" className='border-right center-align'>OVERALL: </td>
                          {(() => {
                            const arr = [];
                            for (let i = 0; i < duration; i++) {
                              if (i == 0) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {aYearSum.toFixed(1)}%
                                  </td>
                                );
                              }
                              if (i == 1) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {bYearSum.toFixed(1)}%

                                  </td>
                                );
                              }
                              if (i == 2) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {cYearSum.toFixed(1)}%

                                  </td>
                                );
                              }
                              if (i == 3) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {dYearSum.toFixed(1)}%

                                  </td>
                                );
                              }
                              if (i == 4) {
                                arr.push(
                                  <td className='center-align' key={i}>
                                    {eYearSum.toFixed(1)}%
                                  </td>
                                );
                              }
                            }
                            return arr;
                          })()}
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div style={{ height: '30px' }}></div>
                  <div style={{ height: '30px' }}>
                    <div className="card-title">Savings Contribution by AI Solutions</div>
                  </div>
                  <div className="table-responsive table-hover table-sales" style={{ paddingLeft: '25em' }}>
                    <PieChart
                      margin={{
                        left: -250,
                      }}
                      series={[
                        {
                          arcLabel: (item) => `(${((item.value * 100) / graphSum).toFixed(1)}%)`,
                          data: graphData,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                      ]}

                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: { vertical: 'middle', horizontal: 'right' },
                          padding: 0,
                        },
                      }}
                      width={600}
                      height={200}
                    />

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">Potential Savings by STLC Phases</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive table-hover table-sales">
                    <button className="btn action_button margin-bottom-5" onClick={() => {
                      const wb = utils.table_to_book(tbl2.current);
                      writeFileXLSX(wb, "Potential_Savings_STLC_Phases.xlsx");
                    }}>Export XLSX</button>
                    <table ref={tbl2} className="table">
                      <thead>
                        <tr className="table-header">
                          <th width="16%" style={{ textAlign: 'center' }} className="border-right-white dataTableHead">
                            Initial QA Effort {initialEffort} PH
                          </th>
                          <th width="16%" style={{ textAlign: 'center' }} className="dataTableHead">Sprint Planning
                          </th>
                          <th className='dataTableHead' style={{ textAlign: 'center' }}>In-Sprint Design
                          </th>
                          <th className='dataTableHead' style={{ textAlign: 'center' }}>In-Sprint Execution
                          </th>
                          <th className='dataTableHead' style={{ textAlign: 'center' }}>Sprint Review & Retrospection
                          </th>
                          <th className='dataTableHead border-left-white' style={{ textAlign: 'center' }}>QA Efforts Savings (%)
                          </th>
                          <th width="15%" style={{ textAlign: 'center' }} className=' dataTableHead'>QA Efforts Savings (PH)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearNewPhaseList.map((allPhase, index) => {
                          return [
                            <tr key={index}>
                              <td className='dataTableText border-right'>{(allPhase.col_name)}</td>
                              <td className='dataTableText'>{(allPhase.sp_ini0).toFixed(1)}</td>
                              <td className='dataTableText'>{(allPhase.sp_ini1).toFixed(1)}</td>
                              <td className='dataTableText'>{(allPhase.sp_ini2).toFixed(1)}</td>
                              <td className='dataTableText border-right'>{(allPhase.sp_ini3).toFixed(1)}</td>
                              <td className='dataTableText'><strong>{(allPhase.sp_ini4 == "-") ? '-' : (allPhase.sp_ini4).toFixed(1)}</strong></td>
                              <td className='dataTableText'><strong>{(allPhase.sp_ini4 == "-") ? '-' : ((initialEffort * allPhase.sp_ini4) / 100).toFixed(1)}</strong></td>
                            </tr>
                          ];
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-round">
            <div className="card-header">
              <div className="card-head-row">
                <div className="card-title">Potential Savings Across STLC Activities</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  {/* <button onClick={onDownload}> Export excel </button> */}
                  <button className="btn action_button margin-bottom-5" onClick={() => {
                      const wb = utils.table_to_book(tbl3.current);
                      writeFileXLSX(wb, "Potential_Savings_Across_STLC_Activities.xlsx");
                    }}>Export XLSX</button>
                  <div className="table-responsive table-hover table-sales" style={{ width: '150%', height: '30em' }}>
                    
                    <table ref={tbl3} className="table" style={{ textAlign: 'center', width: '130%' }}>
                      <thead>
                        <tr className="table-header">
                          <th rowSpan={2} style={{ textAlign: 'center', width: '80px' }} className='dataTableHead border-right-white'>Phase</th>
                          <th rowSpan={2} style={{ textAlign: 'center' }} className=' dataTableHead border-right-white'>Activities</th>
                          <th colSpan={3} style={{ textAlign: 'center' }} className='dataTableHead border-right-white'>QA Effort Savings (%)</th>
                          <th colSpan={3} style={{ textAlign: 'center' }} className='dataTableHead border-right-white'>QA Effort Savings (PH)</th>
                          <th width="30%" rowSpan={2} style={{ textAlign: 'center' }} className='dataTableHead border-right-white'>Selected AI Solutions</th>
                          <th colSpan={duration} style={{ textAlign: 'center' }} className='dataTableHead'>Y-O-Y Cumulative Savings (%)</th>
                        </tr>
                        <tr className="table-header ">
                          <th >Point Of Departure</th>
                          <th >Point of Arrival</th>
                          <th className='border-right-white'>Overall Reduction </th>
                          <th>Point of Departure</th>
                          <th >Point of Arrival</th>
                          <th className='border-right-white'>Overall Reduction</th>
                          {(() => {
                            const arrh = [];
                            for (let k = 1; k <= duration; k++) {
                              arrh.push(
                                <th style={{ width: '5%' }} key={k} >Year {k}</th>
                              );
                            }
                            return arrh;
                          })()}
                        </tr>
                      </thead>
                      <tbody>
                        {dataRenderHook.map((baselineResult, index) => {
                          return [
                            <tr key={index} >
                              <td className="dataTableText border-right " style={{ width: '10%', background: baselineResult.bgColor }}>{baselineResult.phase_id}</td>
                              <td className="dataTableText border-right " style={{ width: '15%', background: baselineResult.bgColor }}>{baselineResult.stlc_name}</td>
                              <td className='dataTableText' style={{ background: baselineResult.bgColor }}>{(baselineResult.pod).toFixed(1)}%</td>
                              <td className='dataTableText' style={{ background: baselineResult.bgColor }}>{(baselineResult.poa).toFixed(1)}%</td>
                              <td className='dataTableText border-right' style={{ background: baselineResult.bgColor }}>{(baselineResult.overr).toFixed(1)}%</td>
                              <td className='dataTableText' style={{ background: baselineResult.bgColor }}>{(baselineResult.podph).toFixed(1)}</td>
                              <td className='dataTableText' style={{ background: baselineResult.bgColor }}>{(baselineResult.poaph).toFixed(1)}</td>
                              <td className='dataTableText border-right' style={{ background: baselineResult.bgColor }}>{(baselineResult.podph - baselineResult.poaph).toFixed(1)}</td>
                              <td className='dataTableText border-right' style={{ background: baselineResult.bgColor }}>{baselineResult.sais}</td>
                              {(() => {
                                const arr = [];
                                for (let i = 0; i < duration; i++) {
                                  if (i == 0) {
                                    arr.push(
                                      <td className='dataTableText' style={{ background: baselineResult.bgColor }} key={i}>
                                        {(baselineResult.yeara).toFixed(1)}
                                      </td>
                                    );
                                  }
                                  if (i == 1) {
                                    arr.push(
                                      <td className='dataTableText' style={{ background: baselineResult.bgColor }} key={i}>
                                        {(baselineResult.yearb).toFixed(1)}

                                      </td>
                                    );
                                  }
                                  if (i == 2) {
                                    arr.push(
                                      <td className='dataTableText' style={{ background: baselineResult.bgColor }} key={i}>
                                        {(baselineResult.yearc).toFixed(1)}

                                      </td>
                                    );
                                  }
                                  if (i == 3) {
                                    arr.push(
                                      <td className='dataTableText' style={{ background: baselineResult.bgColor }} key={i}>
                                        {(baselineResult.yeard).toFixed(1)}

                                      </td>
                                    );
                                  }
                                  if (i == 4) {
                                    arr.push(
                                      <td className='dataTableText' style={{ background: baselineResult.bgColor }} key={i}>
                                        {(baselineResult.yeare).toFixed(1)}
                                      </td>
                                    );
                                  }
                                }
                                return arr;
                              })()}

                            </tr>
                          ];
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="total-column">
                          <td colSpan={2} className='border-right'>OVERALL: </td>
                          <td>{podSum.toFixed(1)}</td>
                          <td>{poaSum.toFixed(1)}</td>
                          <td className="border-right">{orrSum.toFixed(1)}</td>
                          <td >{podphSum.toFixed(1)}</td>
                          <td>{poaphSum.toFixed(1)}</td>

                          <td className="border-right">{(podphSum - poaphSum).toFixed(1)}</td>
                          <td className="border-right"></td>
                          {(() => {
                            const arr = [];
                            for (let i = 0; i < duration; i++) {
                              if (i == 0) {
                                arr.push(
                                  <td key={i}>
                                    {yearaSum.toFixed(1)}
                                  </td>
                                );
                              }
                              if (i == 1) {
                                arr.push(
                                  <td key={i}>
                                    {yearbSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 2) {
                                arr.push(
                                  <td key={i}>
                                    {yearcSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 3) {
                                arr.push(
                                  <td key={i}>
                                    {yeardSum.toFixed(1)}

                                  </td>
                                );
                              }
                              if (i == 4) {
                                arr.push(
                                  <td key={i}>
                                    {yeareSum.toFixed(1)}
                                  </td>
                                );
                              }
                            }
                            return arr;
                          })()}
                        </tr>
                      </tfoot>

                    </table>
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

export default EfficiencyDashboard;