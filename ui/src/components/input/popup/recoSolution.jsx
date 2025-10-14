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
import LoadingOverlay from '../../overlay/LoadingOverlay';
// import LoadingButton from "@mui/lab/LoadingButton";
import { CustomDialogTitle } from "../../common/CustomDialogTitle";

const RecoSolution = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [duration, setDuration] = useState(0);
  const [desc, setDesc] = useState("");
  const [initialEffort, setInitialEffort] = useState(0);
  const [targetEfficiency, setTargetEfficiency] = useState(0);
  const [programCategory, setProgramCategory] = useState(0);
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
  const [solDetails, setSolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [externalUser, setExternalUser] = useState("");
  // const [email, setEmail] = useState("");
  const handleSetSid = (event) => {
    setSid(event.target.value);
  };

  const handleSetDesc = (event) => {
    setDesc(event.target.value);
  };


  useEffect(() => {
    setSolDetails(props.solDetails);
    setDuration(props.duration);
    setInitialEffort(props.initialEffort);
    setTargetEfficiency(props.targetEfficiency);
    setProgramCategory(props.programCategory);
    // setSid(props.sid);
    // setStlc(props.stlc);
    // setCatelog(props.catelog);
    // setCategory(props.category);
    // setLicenseType(props.licenseType);
    // setLicsensingCost(props.licsensingCost);
    // setFrequency(props.frequency);
    // setEffort(props.effort);
    // setRecisedEffort(props.recisedEffort);
    props.flag === 0 ? setOpen(false) : setOpen(true);
  }, [props.flag, props.stlc]);

  // Dismiss
  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    setIsLoading(true);
    let body = {
      inputDesc: desc,
      solDetails: solDetails,
      programCategory: 'Greenfield Digital Transformation',
      initialEffort: initialEffort,
      targetEfficiency: targetEfficiency,
      duration: duration,
    };

    if (
      props.sid !== null
    ) {
      var x = apiQuery({
        ...apiRoute.Configuration.recommenSol,
        body: body,
      });

      const promise = new Promise((resolve, reject) => {
        
        setTimeout(() => {
          resolve(x);
        }, 500);
      });

      promise.then((values) => {
        setIsLoading(false);
        if (values.status === 200) {
          swal("Success!", "Successfully Added with Default Adoption %s!", "success").then(
            props.passerRefresh(Math.random())
          );
        } 
        else if (values.status === 201) {
          swal("Success!", "No recommendation found!", "success").then(
            props.passerRefresh(Math.random())
          );
        }
        else {
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
        ENTER PROJECT DESCRIPTION
        </CustomDialogTitle>
        <DialogContent dividers>
          <div sx={{ gap: "10px" }}>            
            <FormControl>
              <InputLabel id="demo-simple-select-label">AI Solution Name</InputLabel>              
            </FormControl>
            <TextField
              id="standard-basic"
              value={desc}
              onChange={handleSetDesc}
              label="Please enter project description along high level QA scope and approach (Max 1000 Characters)"
              style={{ paddingRight: '10px',width:659}}
              multiline
              maxRows={10}
              minRows={5}
              inputProps={{
                maxLength: 1000,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Dismiss
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Get Solutions
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecoSolution;
