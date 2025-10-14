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

const ResponsiveEditDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [catelog, setCatelog] = useState("");
  const [category, setCategory] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [licenseType, setLicenseType] = useState("");
  // const [solutionType, setSolutionType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [vector, setVector] = useState("");
  const [effort, setEffort] = useState("");
  const [adoption, setAdoption] = useState(0);
  const [desc, setDesc] = useState("");
  const handleSetSid = (event) => {
    setSid(event.target.value);
  };
  const handleSetStlc = (event) => {
    // alert(event)
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

  const handleSetSolutionType = (event) => {
    setSolutionType(event.target.value);
  };
  const handleLicsensingCost = (event) => {
    setLicsensingCost(event.target.value);
  };
  const handleSetFrequency = (event) => {
    setFrequency(event.target.value);
  };
  const handleSetVector = (event) => {
    setVector(event.target.value);
  };
  const handleSetEffort = (event) => {
    setEffort(event.target.value);
  };
  
  const handleSetAdoption = (event) => {
    setAdoption(event.target.value);
  };
  const handleSetDesc = (event) => {
    setDesc(event.target.value);
  };

  useEffect(() => {
    setAdoption(props.adoption);
    setDesc(props.desc);
    setSid(props.sid);
    setStlc(props.stlc);
    setCatelog(props.catelog);
    setCategory(props.category);
    setSolutionType(props.solutionType);
    setLicenseType(props.licenseType);
    setLicsensingCost(props.licsensingCost);
    setFrequency(props.frequency);
    setVector(props.vector);
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
    let effortV = effort;
    if (effortV[effortV.length - 1] === "%") {
      effortV = effortV.substring(0, effortV.length - 1);
    }
    let body = {
      sid: sid,
      stlc: stlc,
      catelog: catelog,
      category: category,
      licenseType: licenseType,
      licsensingCost: licsensingCost,
      frequency: frequency,
      vector: vector,
      effort: effortV,
      solutionType: solutionType,
      desc: desc,
      adoption: adoption,
    };

    if (licsensingCost != "" && effort !== "") {
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
    } else {
      alert("Provide all values before update.");
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
          CHANGE AI SOLUTION DETAILS
        </CustomDialogTitle>
        <DialogContent dividers>
          <div sx={{ gap: "10px" }}>
            <Hidden
              style={{ width: 400 }}
              id="standard-basic"
              value={sid}
              // onChange={handleCatelog}
              label="id"
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                STLC Activities
              </InputLabel>
              <Select
                style={{ width: 400 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={stlc}
                // onChange={setStlc}
                value={stlc}
                onChange={handleSetStlc}
                label="STLC Activities"
              >
                <MenuItem value={"Sprint Planning & Strategizing"}>
                  Sprint Planning & Strategizing
                </MenuItem>
                <MenuItem value={"In Sprint Test Design (Manual)"}>
                  In Sprint Test Design (Manual)
                </MenuItem>
                <MenuItem value={"In Sprint Test Design (Automation)"}>
                  In Sprint Test Design (Automation)
                </MenuItem>
                <MenuItem
                  value={"In-Sprint Test Execution (Environment Management)"}
                >
                  In-Sprint Test Execution (Environment Management)
                </MenuItem>
                <MenuItem value={"In Sprint Test Execution (Test Data)"}>
                  In Sprint Test Execution (Test Data)
                </MenuItem>
                <MenuItem
                  value={"In-Sprint Test Design (Regression Maintenance)"}
                >
                  In-Sprint Test Design (Regression Maintenance)
                </MenuItem>
                <MenuItem value={"In-Sprint Test Execution (Functional)"}>
                  In-Sprint Test Execution (Functional)
                </MenuItem>
                <MenuItem value={"In-Sprint Test Execution (Regression)"}>
                  In-Sprint Test Execution (Regression)
                </MenuItem>
                <MenuItem value={"In-Sprint Test Execution (NFT)"}>
                  In-Sprint Test Execution (NFT)
                </MenuItem>
                <MenuItem value={"In-Sprint Test Execution (Others)"}>
                  In-Sprint Test Execution (Others)
                </MenuItem>
                <MenuItem
                  value={"In-Sprint Test Execution (Defect Management)"}
                >
                  In-Sprint Test Execution (Defect Management)
                </MenuItem>
                <MenuItem value={"Sprint Review & Retrospection"}>
                  Sprint Review & Retrospection
                </MenuItem>
              </Select>
            </FormControl>
            <br /> <br />
            <TextField
              style={{ width: 400 }}
              id="standard-basic"
              value={catelog}
              onChange={handleSetCatelog}
              label="Solution Name"
            />
            <br /> <br />
            <TextField
              id="standard-basic"
              value={desc}
              onChange={handleSetDesc}
              label="Description(Max 500 Characters)"
              style={{ paddingRight: "10px", width: 559 }}
              multiline
              // maxRows={4}
              // inputProps={{
              //   maxLength: 300,
              // }}
              maxRows={10}
              minRows={5}
              inputProps={{
                maxLength: 500,
              }}
            />
            <br /> <br />
            <TextField
              id="standard-basic"
              value={licsensingCost}
              onChange={handleLicsensingCost}
              label="License Cost ($)"
              style={{ paddingRight: "10px" }}
            />
            <TextField
              id="standard-basic"
              value={effort}
              onChange={handleSetEffort}
              label="Effort Savings (%)"
              style={{ paddingRight: "10px" }}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                License Type
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={licenseType}
                label="License Type"
              >
                <MenuItem value={"Free"}>Free</MenuItem>
                <MenuItem value={"Licensed"}>Licensed</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <FormControl style={{ paddingRight: "10px" }}>
              <InputLabel id="demo-simple-select-label">
                Solution Type
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={solutionType}
                onChange={handleSetSolutionType}
                label="Solution Type"
              >
                <MenuItem value={"Predictive AI"}>Predictive AI</MenuItem>
                <MenuItem value={"Generative AI"}>Generative AI</MenuItem>
              </Select>
            </FormControl>
            <FormControl style={{ paddingRight: "10px" }}>
              <InputLabel id="demo-simple-select-label">
                Solution Category
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={handleSetCategory}
                label="Solution Category"
              >
                <MenuItem value={"Cognizant: Prototype"}>
                  Cognizant: Prototype
                </MenuItem>
                <MenuItem value={"Cognizant: Industrialized"}>
                  Cognizant: Industrialized
                </MenuItem>
                <MenuItem value={"External"}>External</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                License Term
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={frequency}
                onChange={handleSetFrequency}
                label="Frequency"
              >
                <MenuItem value={"Month"}>Month</MenuItem>
                <MenuItem value={"Year"}>Year</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <FormControl>
              <TextField
                id="standard-basic"
                value={adoption}
                onChange={handleSetAdoption}
                label="Adoption Planned (%)"
                style={{ paddingRight: "10px" }}
              />
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Vector</InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={vector}
                onChange={handleSetVector}
                label="vector"
              >
                <MenuItem value={"Vector 1"}>Vector 1</MenuItem>
                <MenuItem value={"Vector 2"}>Vector 2</MenuItem>
                <MenuItem value={"Vector 3"}>Vector 3</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
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

export default ResponsiveEditDialog;
