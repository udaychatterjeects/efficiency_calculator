import { Hidden, IconButton, InputLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { apiQuery, apiRoute } from "../../../api/apiClient";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
// import LoadingButton from "@mui/lab/LoadingButton";
import { CustomDialogTitle } from "../../common/CustomDialogTitle";
import LoadingOverlay from '../../overlay/LoadingOverlay';

const ResponsiveEditDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [duration, setDuration] = useState(0);
  const [initialEffort, setInitialEffort] = useState(0);
  const [targetEfficiency, setTargetEfficiency] = useState(0);
  // const [programCategory, setProgramCategory] = useState(0);
  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [catelog, setCatelog] = useState("");
  const [category, setCategory] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [effort, setEffort] = useState("");
  const [recisedEffort, setRecisedEffort] = useState("");
  const [optionValues, setOptionValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [externalUser, setExternalUser] = useState("");
  // const [email, setEmail] = useState("");
  const handleSetSid = (event) => {
    setSid(event.target.value);
  };

  const handleSetDuration = (event) => {
    setDuration(event.target.value);
  };
  const handleSetInitialEffort = (event) => {
    setInitialEffort(event.target.value);
  };
  const handleSetTargetEfficiency = (event) => {
    setTargetEfficiency(event.target.value);
  };
  // const handleSetProgramCategory = (event) => {
  //   setProgramCategory(event.target.value);
  // };
  const handleSetStlc = (event) => {
    setStlc(event.target.value);
  };
  const handleSetCatelog = (event) => {
    setCatelog(event.target.value);
  };
  const handleSetCategory = (event) => {
    setCategory(event.target.value);
  };
  const handleSetLicenseType = (event) => {
    setLicenseType(event.target.value);
  };
  const handleLicsensingCost = (event) => {
    setLicsensingCost(event.target.value);
  };
  const handleSetFrequency = (event) => {
    setFrequency(event.target.value);
  };
  const handleSetEffort = (event) => {
    setEffort(event.target.value);
  };
  const handleSetRecisedEffort = (event) => {
    setRecisedEffort(event.target.value);
  };

  function getStlcSolution() {
    // setSelectedCategory(value);
    // setSelectedApplication("");
    // // console.log("selectedCategory:", value)
    apiQuery({
      ...apiRoute.Configuration.GetStlcSolutions,
      // body: {
      //   catname: value,
      // },
    }).then((response) => {
      let newSolValues = response.data.map((appsquad) => {
        return {
          solId: appsquad.solId,
          solName: appsquad.catelog,
          stlcName: appsquad.stlc_name,
        };
      });
      setOptionValues(newSolValues);
    });
  }


  useEffect(() => {
    //  alert(props.duration)
    // setId(props.id);
    // console.log("UDAY",props.duration)
    setSid(props.sid);
    setStlc(props.stlc);
    setCatelog(props.catelog);
    setCategory(props.category);
    setLicenseType(props.licenseType);
    setLicsensingCost(props.licsensingCost);
    setFrequency(props.frequency);
    setEffort(props.effort);
    setRecisedEffort(props.recisedEffort);
    setDuration(props.duration);
    setInitialEffort(props.initialEffort);
    setTargetEfficiency(props.targetEfficiency);
    // setProgramCategory(props.programCategory);
    getStlcSolution()
    props.flag === 0 ? setOpen(false) : setOpen(true);
  }, [props.flag, props.stlc]);

  // Dismiss
  function handleClose() {
    setOpen(false);
  }

  function updateData(val) {
    // alert("P");
    // return false;
    let body = {
      id: val
    };
    apiQuery({
      ...apiRoute.Configuration.GetStlcData,
      body: body,
    }).then((response) => {
      // console.log("ZZZZ:", duration)
      setSid(response.data[0]['sol_id']);
      setStlc(response.data[0]['stlc_name']);
      setCatelog(response.data[0]['catelog']);
      setCategory(response.data[0]['solution_category']);
      setLicenseType(response.data[0]['license_type']);
      setLicsensingCost(response.data[0]['licsensing_cost']);
      setFrequency(response.data[0]['frequency']);
      setEffort(response.data[0]['effort_savings']);
                // let newAppValues = response.data.data.map((appsquad) => {
                //   return {
                //     applicationId: appsquad.applicationId,
                //     applicationName: appsquad.applicationName,
                //   };
                // });
                // setApplicationValues(newAppValues);
                // setAppSquadValues(response.data.data);
    });
  }
  //  update
  function handleSubmit() {
    setIsLoading(true);
    let body = {
      sid: sid,
      stlc: stlc,
      catelog: catelog,
      category: category,
      licenseType: licenseType,
      licsensingCost: licsensingCost,
      frequency: frequency,
      effort: effort,
      // programCategory: programCategory,
      initialEffort: initialEffort,
      targetEfficiency: targetEfficiency,
      duration: duration,
      recisedEffort: recisedEffort,
    };

    if (
      props.sid !== null
    ) {
      var x = apiQuery({
        ...apiRoute.Configuration.addSolution,
        body: body,
        // params: { id: props.uid }
      });

      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(x);
          setIsLoading(false);
        }, 500);
      });

      promise.then((values) => {
        if (values.status === 200) {
          swal("Success!", "Successfully Added with Default Adoption %s!", "success").then(
            props.passerRefresh(Math.random())
          );
        } else {
          let x = values.data[0].description;
          swal("Error!", x.toString(), "error");
        }
      });
    }

    // Close the modal
    setOpen(false);
  }

  return (
    <div>
      <div>
                {isLoading && <LoadingOverlay />}
              </div>
      <Dialog
        // style={{ width: 400 }}
        fullScreen={false}
        open={open}
        maxWidth="lg"
        scroll={"body"}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <CustomDialogTitle id="customized-dialog-title" onClose={handleClose} style={{ width: 600 }}>
          ADD SOLUTION
        </CustomDialogTitle>
        <DialogContent dividers>
          <div sx={{ gap: "10px" }}>
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={duration}
              onChange={handleSetDuration}
              label="duration"
            />
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={initialEffort}
              onChange={handleSetInitialEffort}
              label="initialEffort"
            />
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={targetEfficiency}
              onChange={handleSetTargetEfficiency}
              label="targetEfficiency"
            />
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={sid}
              // onChange={handleCatelog}
              label="id"
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">AI Solution Name</InputLabel>
              <Select
                style={{ width: 400 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={stlc}
                // onChange={updateData(this.value)}
                label="STLC Activities"
                onChange={(e) => {
                  updateData(e.target.value);
                  // selectedSquadRef.current =
                  //   e.target.selectedOptions[0].label;
                }}
              >

                {optionValues.map(val => {
                  return (
                    <MenuItem value={val.solId}>{val.stlcName} - {val.solName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <br /> <br />

            <TextField
              id="standard-basic"
              value={category}
              onChange={handleSetCategory}
              label="Solution Category"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              id="standard-basic"
              value={licenseType}
              // onChange={handleSetCategory}
              label="License Type"
              style={{ paddingLeft: '10px' }}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              id="standard-basic"
              value={licsensingCost}
              onChange={handleLicsensingCost}
              label="Licsensing Cost"
              style={{ paddingLeft: '10px' }}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <br /> <br />
            <TextField
              id="standard-basic"
              value={effort}
              onChange={handleSetEffort}
              label="Potential Efforts Savings(%)"
              // style={{ paddingLeft: '10px' }}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              style={{ paddingLeft: '10px' }}
              id="standard-basic"
              value={recisedEffort}
              onChange={handleSetRecisedEffort}
              label="Revised Efforts Savings(%)"
            />
            <br /><br />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Dismiss
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Add Solutions
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResponsiveEditDialog;
