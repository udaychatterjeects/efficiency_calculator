import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { apiQuery, apiRoute } from '../../api/apiClient';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import ResponsiveEditDialog from "./popup/addSolution";
import RecoSolution from "./popup/recoSolution";
import SpinnerBackdrop from "../common/SpinnerBackdrop";
import LoadingOverlay from '../overlay/LoadingOverlay';
import { TailSpin } from "react-loader-spinner";

var i = 0;
const AiSolutionSelected = () => {

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [duration, setDuration] = useState("");
  const [initialEffort, setInitialEffort] = useState("");
  const [targetEfficiency, setTargetEfficiency] = useState("");
  const [recisedEffort, setRecisedEffort] = useState("");
  const [responsive, setResponsive] = useState('vertical');
  const [dataRenderHook, setDataRenderHook] = useState([]);
  const [baselineListValues, setBaselineListValues] = useState([]);
  const [tableBodyHeight, setTableBodyHeight] = useState('750px');
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');
  const [squadValues, setSquadValues] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [buttonDisabled, setButtonDisabled] = useState(false);
  const [manualButtonDisable, setManualButtonDisable] = useState(true);
  const [autoButtonDisable, setAutoButtonDisable] = useState(true);
  // const [programCategory, setProgramCategory] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [processDisabled, setProcessDisabled] = useState(true);
  const [initialReadonly, setInitialReadonly] = useState(false);
  const [targetEfficiencyReadonly, setTargetEfficiencyReadonly] = useState(false);
  const [initialDurationDis, setInitialDurationDis] = useState(false);
  const [initialProgramCategory, setInitialProgramCategory] = useState(false);
  const [solDetails, setSolDetails] = useState([]);
  // const [startOverlay, setStartOverlay] = useState('none');
  const [addedBy, setAddedBy] = useState(sessionStorage.getItem("USER_EMAIL"));
  // const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const selectedSquadRef = useRef();

  const [showModal, setShowModal] = useState(0);
  const [showModalhelper, setShowModalhelper] = useState(0);

  const [showModalRec, setShowModalRec] = useState(0);
  const [showModalrechelper, setShowModalrechelper] = useState(0);

  const csvLink = useRef();
  const navigate = useNavigate();

  const handlesetDuration = (event) => {
    if (duration != '' && initialEffort != '') {
      setAutoButtonDisable(false)
      setManualButtonDisable(false)
    }
    else {
      setAutoButtonDisable(true)
      setManualButtonDisable(true)
    }
    setDuration(event);
  };

  const handleSetYearValue = (event) => {
    setYearValue(event);
  };
  
const handleSetInitialEffort = (event) => {
  const value = event;

  // Check if value is a positive integer and not empty
  const isValid = /^\d+$/.test(value) && parseInt(value, 10) > 0;

  if (!isValid) {
    alert("Initial/Day 0 Effort (PH) is a mandatory field and must be a positive integer greater than 0.");
    setInitialEffort(""); // Optionally clear the input
    setAutoButtonDisable(true);
    setManualButtonDisable(true);
    return;
  }

  setInitialEffort(value);

  if (duration !== '' && value !== '') {
    setAutoButtonDisable(false);
    setManualButtonDisable(false);
  } else {
    setAutoButtonDisable(true);
    setManualButtonDisable(true);
  }
};
  const handleSetTargetEfficiency = (event) => {
    // alert(event)
    setTargetEfficiency(event);
    if (duration != '' && event != '') {
      setAutoButtonDisable(false)
      setManualButtonDisable(false)
    }
    else {
      setAutoButtonDisable(true)
      setManualButtonDisable(true)
    }
  };
  // Open A modal window for Edit
  const editor = () => {
    setShowModal(i + 2);
    setShowModalhelper(i++);
  };

  const recommandation = () => {
    setShowModalRec(i + 2);
    setShowModalrechelper(i++);
    // setStartOverlay('block')
  };

  // GIC Things
  const mailer = tableMeta => {
    const clipboardText = tableMeta.rowData[3];
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(clipboardText);
    } else {
      document.execCommand('copy', true, clipboardText);
    }
  };
  // const classes = useStyles();

  const columns = [
    {
      name: 'solId',
      label: 'Token ID',
      options: {
        filter: true,
        sort: true,
        display: false,
        setCellHeaderProps: value => ({ style: { position: 'inherit' } })
      }
    },
    {
      name: 'catelog',
      label: 'User Id',
      options: {
        filter: true,
        sort: true,
        display: true,
        setCellHeaderProps: value => ({ style: { position: 'inherit' } })
      }
    },
    {
      name: 'solutionCategory',
      label: 'User Email',
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: value => ({ style: { position: 'inherit' } })
      }
    },
    {
      name: 'resetToken',
      label: 'Token',
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: value => ({ style: { position: 'inherit' } }),
        responsive: 'simple',
        customBodyRender: val => {
          // return wordWrap(val, 20);
          return val;
        }
      }
    },
    {
      name: 'requestedOn',
      label: 'Requested On',
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: value => ({ style: { position: 'inherit' } })
      }
    },
    {
      name: 'Action',
      options: {
        setCellHeaderProps: value => ({
          style: { textAlign: 'center', position: 'inherit' }
        }),
        filter: true,
        download: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ spacing: 0 }}>
              <Tooltip title="Copy" aria-label="Edit User">
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  onClick={() => mailer(tableMeta)}
                  size="large"
                >
                  <FileCopyIcon style={{ fill: 'ash' }} />
                </IconButton>
              </Tooltip>
            </div>
          );
        }
      }
    }
  ];

  const options = {
    selectableRows: 'none',
    elevation: 0,
    filter: true,
    textAlign: 'center',
    filterType: 'dropdown',
    rowsPerPageOptions: [5, 10, 15],
    rowsPerPage: 5,
    pagination: true,
    responsive: 'standard',
    maxHeight: 'none',
    enableNestedDataAccess: '.',
    tableBodyHeight: 'auto',
    tableBodyMaxHeight: 'auto',
    downloadOptions: { filename: "Reset_Tokens.csv" },
    textLabels: {
      body: {
        noMatch: 'No data found'
      }
    }
  };

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.GetCategory
    }).then((response) => {
      let newSquadValues = response.data.map((usersquad) => {
        return { squadId: usersquad.squadId, catName: usersquad.catName };
      });
      setSquadValues(newSquadValues);
    }).catch(() => {});
  }, []);
  useEffect(() => {

    apiQuery(apiRoute.Configuration.AllCognitiveSolution)
      .then((values) => {
        const data = JSON.parse(
          JSON.stringify(values.data).replace(/:null/gi, ':"_"')
        );
        // console.log("PPP:",data);
        // setStartOverlay('none')
        setDataRenderHook(data);
        setDuration(data[0]['duration']);
        // setProgramCategory(data[0]['program_category']);
        setInitialEffort(data[0]['initial_effort']);
        setTargetEfficiency(data[0]['target_efficiency']);
        if (data[0]['duration'] > 0) {
          setInitialDurationDis(true)
        }
        else {
          setInitialDurationDis(false)
        }
        if (data[0]['initial_effort'] > 0) {
          setInitialReadonly(true)
        }
        else {
          setInitialReadonly(false)
        }
        if (data[0]['target_efficiency'] > 0) {
          setTargetEfficiencyReadonly(true)
        }
        else {
          setTargetEfficiencyReadonly(false)
        }
        if (data[0]['program_category'] != "") {
          setInitialProgramCategory(true)
        }
        else {
          setInitialProgramCategory(false)
        }
        if (data.length <= 0) {
          setProcessDisabled(true)
        }
        else {
          setProcessDisabled(false)
        }
        if(data.length >0)
        {
          if(data[0].source_data=="A")
          {
            setAutoButtonDisable(true)
            setManualButtonDisable(false)
          }
          if(data[0].source_data=="M")
          {
            setAutoButtonDisable(true)
            setManualButtonDisable(false)
          }
        }
        
      })
      .catch((err) => console.log(err));
  }, [showModal, refreshTrigger]);

  function makeCalculation(e) {
    setIsLoading(true)
    const formData = new FormData();

    var yearValue = Array.prototype.slice.call(document.getElementsByName('yearValue[]'));
    var allYearValueData = yearValue.map((o) => o.value);

    var implementation = Array.prototype.slice.call(document.getElementsByName('implementation[]'));
    var allImplementation = implementation.map((p) => p.value);

    var phase_id = Array.prototype.slice.call(document.getElementsByName('phase_id[]'));
    var allPhase_id = phase_id.map((q) => q.value);

    var solu_id = Array.prototype.slice.call(document.getElementsByName('solu_id[]'));
    var allsolu_id = solu_id.map((q) => q.value);
    
    var stlc_name = Array.prototype.slice.call(document.getElementsByName('stlc_name[]'));
    var allstlc_name = stlc_name.map((q) => q.value);
    
    apiQuery({
      ...apiRoute.Configuration.targetAutomation,
      body: {
        targetEfficiency: targetEfficiency,
        allImplementation: allImplementation,
        stlc_name: allstlc_name,
        solu_id: allsolu_id,
      },
    }).then((response) => {
      
      if(targetEfficiency>0 || targetEfficiency!==undefined)
      {
        if(response.data.activitySum >=targetEfficiency)
        {
          // setIsLoading(false)
          make_calculation(allYearValueData, allImplementation, allPhase_id, allsolu_id,allstlc_name)
        }
        else{
          setIsLoading(false);
          if (confirm("The efficiency of the selected AI solutions is currently below the target threshold. Would you like to proceed with generating the dashboard view, or would you prefer to review the AI Solution Catalogue and select additional solutions to meet the desired efficiency target?")) {
            // setIsLoading(true)  
            make_calculation(allYearValueData, allImplementation, allPhase_id, allsolu_id,allstlc_name,)
          } 

          // alert("ask for confimation")
        }
      }
      else
      {
        // setIsLoading(true)
        make_calculation(allYearValueData, allImplementation, allPhase_id, allsolu_id,allstlc_name)
      }
      
      // alert(response.data.message)
      // window.location.reload();
    }).catch((err) => {
      setIsLoading(false);
      console.log(err);
      alert(err.data.message)
    });

    // alert(targetEfficiency)
    // return false
    
  }

  function make_calculation(allYearValueData, allImplementation, allPhase_id, allsolu_id,allstlc_name,)
  {
    setIsLoading(true)
    apiQuery({
      ...apiRoute.Configuration.addCalculations,
      body: {
        // category_name: programCategory,
        duration: duration,
        targetEfficiency: targetEfficiency,
        initialEffort: initialEffort,
        targetEfficiency: targetEfficiency,
        allYearValueData: allYearValueData,
        allImplementation: allImplementation,
        phase_id: allPhase_id,
        solu_id: allsolu_id,
        stlc_name: allstlc_name,
      },
    }).then((response) => {
      setIsLoading(false);
      alert(response.data.message)
      window.location.reload();
    }).catch((err) => {
      setIsLoading(false);
      console.log(err);
      alert(err.data.message)
    });
  }
  function resetAll(e) {
    if (confirm("Are you sure?")) {
      apiQuery({
        ...apiRoute.Configuration.resetSolution,
      }).then((response) => {
        alert(response.data.message)
        setInitialReadonly(false)
        setTargetEfficiencyReadonly(false)
        setInitialDurationDis(false)
        setInitialProgramCategory(false)
        setInitialEffort("")
        setTargetEfficiency("")
        setDuration("")
        // setProgramCategory("")
        setProcessDisabled(true)
        setRefreshTrigger()
        setManualButtonDisable(true)
      });
    }
  }
  function deleteRow(e) {
    if (confirm("Are you sure?")) {
      apiQuery({
        ...apiRoute.Configuration.deleteCogSolution,
        body: {
          id: e.target.id,
        },
      }).then((response) => {
        window.location.reload();
      });
    }
  }

  useEffect(() => {
    apiQuery(apiRoute.Configuration.AllSolutionRec)
      .then((res) => {
        setSolDetails(res.data)
      })
      .catch((err) => console.log(err));
  }, []);

  
  return (
    <>      
      <div className="row">
        <div>
          {isLoading && <LoadingOverlay />}
        </div>
        <div className="col-sm-6 col-md-3">
          {/* <div id="overlayDiv" style={{ display:startOverlay }} className="fadeMe">This might take some time . . .</div> */}
          <div className="card card-stats card-round ">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col col-stats ms-3 ms-sm-0">
                  <span className='card-title margin-right-25 decrease-font'>
                    Duration(Years)</span>
                  <span>
                    <select
                      className='form-select form-control-lg margin-right-25'
                      value={duration}
                      disabled={initialDurationDis}
                      onChange={(e) => {
                        handlesetDuration(e.target.value);
                      }}
                    >
                      <option disabled defaultValue value="">
                        Select
                      </option>
                      <option key="1" value="1">1 </option>
                      <option key="2" value="2">2 </option>
                      <option key="3" value="3">3 </option>
                      <option key="4" value="4">4 </option>
                      <option key="5" value="5">5 </option>
                    </select>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-5">
          <div className="card card-stats card-round ">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col col-stats ms-3 ms-sm-0">                 
                  <span className='card-title margin-right-25 decrease-font'>
                    Target Effort Saving (%)</span>
                  <span>
                    <input
                      placeholder="(%)"
                      onChange={e => handleSetTargetEfficiency(e.target.value)}
                      value={targetEfficiency}
                      className="form-control smallInput"
                      readOnly={targetEfficiencyReadonly}

                    ></input>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="card card-stats card-round  margin-bottom-10" >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col col-stats ms-3 ms-sm-0">
                  <span className='card-title margin-right-25 decrease-font'>
                    Initial/Day 0 Effort (PH)</span>
                  <span>
                    <input
                      placeholder="Effort"
                      onChange={e => handleSetInitialEffort(e.target.value)}
                      value={initialEffort}
                      className="form-control smallInput"
                      readOnly={initialReadonly}

                    ></input>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-12">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className=" col-stats ms-3 ms-sm-0 margin-top-10">
                  <div>
                    <button disabled={manualButtonDisable} className="btn action_button margin-right-5" onClick={editor} >
                      Solution Selection - Manual
                    </button>
                  </div>
                  <div>
                    <button disabled={autoButtonDisable} onClick={recommandation} className="btn action_button margin-right-5" style={{ marginRight: '120px' }}>Solution Selection - AI Assisted</button>
                  </div>
                  <div>
                    <button onClick={makeCalculation} disabled={processDisabled} className="btn action_button margin-right-5 " >
                      Process
                    </button>
                  </div>
                  <div>
                    <button onClick={resetAll} disabled={processDisabled} className="btn action_button margin-right-5">Reset Data</button>
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
                <div className="card-title">AI Solutions Selected</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table" style={{ width: '150%' }}>
                      <thead>
                        <tr >
                          <th colSpan={7} className="dataTableHead border-right-white" style={{ textAlign: 'center' }}>AI Solution Details</th>
                          <th colSpan={duration + 1} className="dataTableHead" style={{ textAlign: 'center' }}>Y-O-Y Adoption(%)</th>
                        </tr>
                        <tr className="sub-header">
                          <th className='sub-header-sty fixed' style={{ textAlign: 'center' }}>STLC Activities</th>
                          <th className='sub-header-sty fixed' style={{ textAlign: 'center' }}>AI Solution Name</th>
                          <th className='sub-header-sty' style={{ textAlign: 'center', width: '15%' }}>Solution Category</th>
                          <th className='sub-header-sty' style={{ textAlign: 'center', width: '80px' }}>License Type</th>
                          <th className='sub-header-sty' style={{ textAlign: 'center', width: '5%' }}>Licensing Cost($)</th>
                          <th className='sub-header-sty' style={{ textAlign: 'center', width: '10%' }}>Potential Efforts Savings (%)</th>
                          <th className="sub-header-sty border-right-white" style={{ textAlign: 'center', width: '8%' }}>Adoption Planned (%)</th>
                          {(() => {
                            const arrh = [];
                            for (let k = 1; k <= duration; k++) {
                              arrh.push(
                                <th key={k} className="sub-header-sty" style={{ textAlign: 'center' }}>Year {k} (%)</th>
                              );
                            }
                            return arrh;
                          })()}
                          <th className="sub-header-sty border-right-white" style={{ textAlign: 'center', width: '5%' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataRenderHook.map((soluData, index) => {
                          return [
                            <tr key={index}>
                              <td style={{ background: soluData.bgColor, width: '220px' }} className='dataTableText table-data fixed' >{soluData.stlcName}</td>
                              <td style={{ background: soluData.bgColor, width: '220px' }} className='dataTableText table-data fixed'>{soluData.catelog}</td>
                              <td style={{ background: soluData.bgColor }} className='dataTableText table-data'>{soluData.solutionCategory}</td>
                              <td style={{ background: soluData.bgColor }} className='dataTableText table-data'>{soluData.licenseType}</td>
                              <td style={{ background: soluData.bgColor, width: '150px' }} className='dataTableText table-data'>${soluData.licsensingCost}</td>
                              <td style={{ background: soluData.bgColor, width: '180px' }} className='dataTableText table-data'>{soluData.effortSavings}%</td>
                              <td style={{ background: soluData.bgColor, width: '150px' }} className="dataTableText table-data border-right">
                                
                                <input type="hidden" name="stlc_name[]" value={soluData.stlcName} />
                                <input type="hidden" name="solu_id[]" value={soluData.solId} />
                                <input type="hidden" name="phase_id[]" value={soluData.phase_id} />
                                <input type='text' style={{ display: 'inline', width: '60px' }} defaultValue={soluData.adoption_per} className="decrease-text-font form-control" name="implementation[]" /> %
                              </td>
                              {(() => {
                                const arr = [];
                                for (let i = 0; i < duration; i++) {
                                  if (i == 0) {
                                    arr.push(
                                      <td key={i} className='dataTableText table-data' style={{ background: soluData.bgColor, width: '130px' }}>
                                        <input type='text' style={{ display: 'inline', width: '50px' }} className="decrease-text-font form-control"  defaultValue={soluData.yeara} name="yearValue[]" onChange={e => handleSetYearValue(e.target.value)} /> %
                                      </td>
                                    );
                                  }
                                  if (i == 1) {
                                    arr.push(
                                      <td key={i} className='dataTableText table-data' style={{ background: soluData.bgColor, width: '130px' }}>
                                        <input type='text' style={{ display: 'inline', width: '50px' }} className="decrease-text-font form-control" name="yearValue[]" onChange={e => handleSetYearValue(e.target.value)} defaultValue={soluData.yearb} /> %
                                      </td>
                                    );
                                  }
                                  if (i == 2) {
                                    arr.push(
                                      <td key={i} className='dataTableText table-data' style={{ background: soluData.bgColor, width: '130px' }}>
                                        <input type='text' style={{ display: 'inline', width: '50px' }} className="decrease-text-font form-control"  defaultValue={soluData.yearc} name="yearValue[]" onChange={e => handleSetYearValue(e.target.value)} /> %
                                      </td>
                                    );
                                  }
                                  if (i == 3) {
                                    arr.push(
                                      <td key={i} className='dataTableText table-data' style={{ background: soluData.bgColor, width: '130px' }}>
                                        <input type='text' style={{ display: 'inline', width: '50px' }} className="decrease-text-font form-control"  defaultValue={soluData.yeard} name="yearValue[]" onChange={e => handleSetYearValue(e.target.value)} /> %
                                      </td>
                                    );
                                  }
                                  if (i == 4) {
                                    arr.push(
                                      <td key={i} className='dataTableText table-data' style={{ background: soluData.bgColor, width: '130px' }}>
                                        <input type='text' style={{ display: 'inline', width: '50px' }} className="decrease-text-font form-control"  defaultValue={soluData.yeare} name="yearValue[]" onChange={e => handleSetYearValue(e.target.value)} /> %
                                      </td>
                                    );
                                  }
                                }
                                return arr;
                              })()}
                              <td style={{ background: soluData.bgColor, width: '220px' }} className='dataTableText table-data fixed' ><button id={soluData.solId} onClick={deleteRow} type="button" className="btn btn-danger btn-sm" style={{ padding: '7px'}}>Delete</button></td>
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
      <React.Fragment>
        <ResponsiveEditDialog
          flag={showModal}
          duration={duration}
          initialEffort={initialEffort}
          targetEfficiency={targetEfficiency}
          recisedEffort={recisedEffort}
          // programCategory={programCategory}
          passerRefresh={(u) => setRefreshTrigger(u)}
        />
      </React.Fragment>

      <React.Fragment>
        <RecoSolution
          flag={showModalRec}
          solDetails={solDetails}
          duration={duration}
          initialEffort={initialEffort}
          targetEfficiency={targetEfficiency}
          // recisedEffort={recisedEffort}
          // programCategory={programCategory}
          passerRefresh={(u) => setRefreshTrigger(u)}
        />
      </React.Fragment>
    </>
  );
};

export default AiSolutionSelected;