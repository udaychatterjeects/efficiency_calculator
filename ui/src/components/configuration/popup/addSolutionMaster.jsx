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

const ResponsiveAddSolutionMaster = (props) => {
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState("md");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [sid, setSid] = useState("");
  const [stlc, setStlc] = useState("");
  const [selStlc, setSelStlc] = useState("");
  const [catelog, setCatelog] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [category, setCategory] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licsensingCost, setLicsensingCost] = useState("");
  const [frequency, setFrequency] = useState("");
  const [vector, setVector] = useState("");
  const [effort, setEffort] = useState("");
  const [error, setError] = useState("");
  // const [yeara, setYeara] = useState(0);
  // const [yearb, setYearb] = useState(0);
  // const [yearc, setYearc] = useState(0);
  // const [yeard, setYeard] = useState(0);
  // const [yeare, setYeare] = useState(0);
  const [adoption, setAdoption] = useState(0);
  const [desc, setDesc] = useState("");

  
const [stlcList, setStlcList] = useState([]);
const [selectedStlc, setSelectedStlc] = useState("");


  // const [externalUser, setExternalUser] = useState("");
  // const [email, setEmail] = useState("");
  const handleSetSid = (event) => {
    setSid(event.target.value);
  };
  const handleSetStlc = (event) => {
    setStlc(event.target.value);
  };
  const handleSetSelectedStlc = (event) => {
    // alert(event.target.value)
    // setStlc(event.target.value);
    setSelStlc(event.target.value);
  };
  const handleSetCatelog = (event) => {
    setCatelog(event.target.value);
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
  const handleSetVector = (event) => {
    setVector(event.target.value);
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
    // alert(vector)
    // console.log("stlc",selStlc)
    // console.log("catelog",catelog)
    // console.log("licsensingCost",licsensingCost)
    // console.log("effort",effort)
    // console.log("category",category)
    // console.log("licenseType",licenseType)
    // console.log("frequency",frequency)
    // console.log("vector",vector)
    // return false
    // return false

    let body = {
      stlc: selStlc,
      catelog: catelog,
      licsensingCost: licsensingCost,
      effort: effort,
      category: category,
      licenseType: licenseType,
      frequency: frequency,
      vector: vector,
      solutionType: solutionType,
      desc: desc,
      // yeara: yeara,
      // yearb: yearb,
      // yearc: yearc,
      // yeard: yeard,
      // yeare: yeare,
      adoption: adoption,
    };

    if (
      selStlc != undefined &&
      selStlc != "" &&
      catelog != undefined &&
      catelog != "" &&
      licsensingCost != undefined &&
      licsensingCost != "" &&
      effort != undefined &&
      effort != "" &&
      category != undefined &&
      category != "" &&
      solutionType != undefined &&
      solutionType != "" &&
      licenseType != undefined &&
      licenseType != "" &&
      frequency != undefined &&
      frequency != "" &&
      vector != undefined &&
      vector != ""
    ) {
      // var x = editDataReturner(props.uid, body);
      var x = apiQuery({
        ...apiRoute.Configuration.addMasterSolution,
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
    } else {
      alert("Provide all values before update.");
    }
  }
  // Fetch the list of categories on component mount
  useEffect(() => {
    fetchCategories();
    // console.log("HPL:", stlc);
    // fetchPhases();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiQuery(apiRoute.Configuration.getStlcActivity);
      if (response.status === 200) {
        // console.log("HPL:", response.data[0].stlc_name);
        // setStlc(response.data);
        setStlcList(response.data); 
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("cAn error occurred while fetching categories.");
    }
  };
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
        <CustomDialogTitle
          id="customized-dialog-title-add"
          onClose={handleClose}
        >
          ADD AI SOLUTION DETAILS 
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
            <FormControl style={{ width: 400 }}>
              
<InputLabel id="stlc-select-label">STLC Activities</InputLabel>
  <Select
    labelId="stlc-select-label"
    value={selStlc}
    // onChange={(e) => setSelectedStlc(e.target.value)}
    onChange={handleSetSelectedStlc}
    required
  >
    <MenuItem value="">Select STLC Activity</MenuItem>
    {stlcList.map((activity, index) => (
      <MenuItem key={index} value={activity.stlc_name}>
        {activity.stlc_name}
      </MenuItem>
    ))}
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
            />
            <FormControl style={{ paddingLeft: "10px" }}>
              <InputLabel id="demo-simple-select-label">
                License Type
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={licenseType}
                onChange={handleSetLicenseType}
                label="License Type"
              >
                <MenuItem value={"Free"}>Free</MenuItem>
                <MenuItem value={"Licensed"}>Licensed</MenuItem>
                {/* <MenuItem value={"TBD"}>TBD</MenuItem> */}
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
                label="Solution Category"
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
                {/* <MenuItem value={"Cognizant In-House"}>Cognizant In-House</MenuItem> */}
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
            Add Solution
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResponsiveAddSolutionMaster;
