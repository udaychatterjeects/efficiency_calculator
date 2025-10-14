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

const addPhaseMaster = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [stlcPhase, setStlcPhase] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [category, setCategory] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [effort, setEffort] = useState("");
  // const [yeara, setYeara] = useState(0);
  // const [yearb, setYearb] = useState(0);
  // const [yearc, setYearc] = useState(0);
  // const [yeard, setYeard] = useState(0);
  // const [yeare, setYeare] = useState(0);
  const [adoption, setAdoption] = useState(0);
  const [desc, setDesc] = useState("");
  // const [externalUser, setExternalUser] = useState("");
  // const [email, setEmail] = useState("");
  const handleSetSid = (event) => {
    setSid(event.target.value);
  };
  const handleSetStlc = (event) => {
    setStlc(event.target.value);
  };
  const handleSetStlcPhase = (event) => {
    setStlcPhase(event.target.value);
  };
  const handleSetSolutionType = (event) => {
    setSolutionType(event.target.value);
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
  const handleSetAdoption = (event) => {
    setAdoption(event.target.value);
  };
  const handleSetDesc = (event) => {
    setDesc(event.target.value);
  };


  useEffect(() => {
    // console.log("UDAY:->",props.category)
    // setId(props.id);
    setSid(props.sid);
    setStlc(props.stlc);
    setStlcPhase(props.stlcPhase);
    setCategory(props.category);
    setSolutionType(props.solutionType);
    setLicenseType(props.licenseType);
    setLicsensingCost(props.licsensingCost);
    setFrequency(props.frequency);
    setEffort(props.effort);
    // console.log("PPP",props)
    props.flag === 0 ? setOpen(false) : setOpen(true);
  }, [props.flag, props.stlc]);

  // Dismiss
  function handleClose() {
    setOpen(false);
  }
  //  update
  function handleSubmit() {
    // console.log("stlc",stlc)
    // console.log("stlcPhase",stlcPhase)
    // console.log("licsensingCost",licsensingCost)
    // console.log("effort",effort)
    // console.log("category",category)
    // console.log("licenseType",licenseType)
    // console.log("frequency",frequency)
    // return false
    // return false

    let body = {
      // stlc: stlc,
      stlcPhase: stlcPhase,
      // licsensingCost: licsensingCost,
      // effort: effort,
      // category: category,
      // licenseType: licenseType,
      // frequency: frequency,
      // solutionType: solutionType,
      // desc: desc,
      // // yeara: yeara,
      // // yearb: yearb,
      // // yearc: yearc,
      // // yeard: yeard,
      // // yeare: yeare,
      // adoption: adoption,
    };

    if (
      stlcPhase != undefined &&
      stlcPhase != '' 
    ) {
      // var x = editDataReturner(props.uid, body);
      var x = apiQuery({
        ...apiRoute.Configuration.AddStlcPhase,
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
          swal("Success!", "Solution Added Successfully!", "success").then(
            props.passerRefresh(Math.random())
          );
        } else {
          let x = values.data[0].description;
          swal("Error!", x.toString(), "error");
        }
      });
      // Close the modal
      setOpen(false);
    }
    else {
      alert("Provide all values before update.")
    }


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
        <CustomDialogTitle id="customized-dialog-title-add" onClose={handleClose}>
          ADD STLC PHASE
        </CustomDialogTitle>
        <DialogContent dividers>
          <div sx={{ gap: "10px" }}>
            
           
           <TextField
                         style={{ width: 400 }}
                         id="standard-basic"
                         value={stlcPhase}
                         onChange={handleSetStlcPhase}
                         label="STLC Phase Name"
                       />
                       <br /> <br />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Dismiss
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Add Phase
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default addPhaseMaster;
