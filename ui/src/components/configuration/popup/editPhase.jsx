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
// import { CustomDialogTitle } from "../../../../components/CustomDialogTitle";
import { CustomDialogTitle } from "../../common/CustomDialogTitle";

const editPhase = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [phase_id, setPid] = useState("");
  // const [stlc, setStlc] = useState("");
  // const [catelog, setCatelog] = useState("");
  // const [category, setCategory] = useState("");
  // const [solutionType, setSolutionType] = useState("");
  // const [licenseType, setLicenseType] = useState("");
  // // const [solutionType, setSolutionType] = useState("");
  // const [licsensingCost, setLicsensingCost] = useState("");
  // const [frequency, setFrequency] = useState("");
  // const [effort, setEffort] = useState("");
  // const [yeara, setYeara] = useState(0);
  // const [yearb, setYearb] = useState(0);
  // const [yearc, setYearc] = useState(0);
  // const [yeard, setYeard] = useState(0);
  // const [yeare, setYeare] = useState(0);
  // const [adoption, setAdoption] = useState(0);
  const [stlcName, setStlcName] = useState("");
  // const [externalUser, setExternalUser] = useState("");
  // const [email, setEmail] = useState("");
  const handleSetPid = (event) => {
    setPid(event.target.value);
  };
  const handleSetStlc = (event) => {
    // alert(event)
    setStlc(event.target.value);
  };
  // const handleSetCatelog = (event) => {
  //   setCatelog(event.target.value);
  // };
  // const handleSetCategory = (event) => {
  //   setCategory(event.target.value);
  // };
  // const handleSetLicenseType = (event) => {
  //   setLicenseType(event.target.value);
  // };

  // const handleSetSolutionType = (event) => {
  //   setSolutionType(event.target.value);
  // };
  // const handleLicsensingCost = (event) => {
  //   setLicsensingCost(event.target.value);
  // };
  // const handleSetFrequency = (event) => {
  //   setFrequency(event.target.value);
  // };
  // const handleSetEffort = (event) => {
  //   setEffort(event.target.value);
  // };

  // const handleSetYeara = (event) => {
  //   setYeara(event.target.value);
  // };
  // const handleSetYearb = (event) => {
  //   setYearb(event.target.value);
  // };
  // const handleSetYearc = (event) => {
  //   setYearc(event.target.value);
  // };
  // const handleSetYeard = (event) => {
  //   setYeard(event.target.value);
  // };
  // const handleSetYeare = (event) => {
  //   setYeare(event.target.value);
  // };
  // const handleSetAdoption = (event) => {
  //   setAdoption(event.target.value);
  // };
  const handleSetStlcName = (event) => {
    setStlcName(event.target.value);
  };


  useEffect(() => {
    // console.log("UDAY:->",props.stlcName)
    // setId(props.id);
    // setYeara(props.yeara)
    // setYearb(props.yearb)
    // setYearc(props.yearc)
    // setYeard(props.yeard)
    // setYeare(props.yeare)
    // setAdoption(props.adoption)
    setStlcName(props.stlcName)
    setPid(props.phase_id);
    // setStlc(props.stlc);
    // setCatelog(props.catelog);
    // setCategory(props.category);
    // setSolutionType(props.solutionType);
    // setLicenseType(props.licenseType);
    // setLicsensingCost(props.licsensingCost);
    // setFrequency(props.frequency);
    // setEffort(props.effort);
    // console.log("PPP",props)
    props.flag === 0 ? setOpen(false) : setOpen(true);
  }, [props.flag, props.stlc]);

  // Dismiss
  function handleClose() {
    setOpen(false);
  }
  //  update
  function handleSubmit() {
    // firstName={firstName} lastName={lastName} externalUser={externalUser} email={email} role={role}
    // console.log("phase_id",phase_id)
    // console.log("stlc",stlc)
    // console.log("catelog",catelog)
    // console.log("licenseType",licenseType)
    // console.log("licsensingCost",licsensingCost)
    // console.log("frequency",frequency)
    // console.log("descv",stlcName)
    // console.log("yeara",yeara)
    // console.log("yearb",yearb)
    // console.log("yearc",yearc)
    // console.log("yeard",yeard)
    // console.log("yeare",yeare)
    // return false
    // let effortV=effort
    // if (effortV[effortV.length - 1] === "%") {
    //   effortV = effortV.substring(0, effortV.length - 1);
    // }
    // console.log("effort", effortV)
    // return false
    let body = {
      // firstName: firstName,
      // lastName: lastName,
      // externalUser: externalUser === "true" ? true : false,
      // phase_id: phase_id,
      // stlc: stlc,
      // catelog: catelog,
      // category: category,
      // licenseType: licenseType,
      // licsensingCost: licsensingCost,
      // frequency: frequency,
      // effort: effortV,
      // solutionType: solutionType,
      stlcName: stlcName,
      // yeara: yeara,
      // yearb: yearb,
      // yearc: yearc,
      // yeard: yeard,
      // yeare: yeare,
      // adoption: adoption,
    };

    if (
      licsensingCost != '' &&
      effort !== ''
    ) {
      // var x = editDataReturner(props.uid, body);
      var x = apiQuery({
        ...apiRoute.Configuration.updateMasterSolution,
        body: body,
        // params: { id: props.uid }
      });

      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(x);
        }, 500);
      });

      promise.then((values) => {
        if (values.status === 200) {
          swal("Success!", "Edit Successful!", "success").then(
            props.passerRefresh(Math.random())
          );
        } else {
          let x = values.data[0].description;
          swal("Error!", x.toString(), "error");
        }
      });
      setOpen(false);
    }
    else {
      alert("Provide all values before update.")
    }
    // Close the modal

  }

  return (
    <div>
      <Dialog
        fullScreen={false}
        open={open}
        maxWidth="lg"
        scroll={"body"}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <CustomDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Update STLC Phase
        </CustomDialogTitle>
        <DialogContent dividers>
          <div sx={{ gap: "10px" }}>
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={phase_id}
              onChange={handleSetPid}
              label="id"
            />
            
            
            <TextField
              style={{ width: 400 }}
              id="standard-basic"
              value={stlcName}
              onChange={handleSetStlcName}
              label="STLC Name"
            />
            <br /><br />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Dismiss
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Update Details
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default editPhase;
