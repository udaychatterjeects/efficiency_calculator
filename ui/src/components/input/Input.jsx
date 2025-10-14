import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material';
// import { Tab, Tabs, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AiSolutionSelected from './AiSolutionSelected';
import EfficiencyDashboard from './EfficiencyDashboard';
import { apiQuery, apiRoute } from '../../api/apiClient';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TabPanel } from '../common/TabPanel';

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}

const Input = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [value, setValue] = React.useState(0);
  // const [calExists, setCalExists] = useState(0);
  const [disFir, setDisFir] = useState(false);
  const [disSec, setDisSec] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    apiQuery({
      ...apiRoute.Configuration.CheckCalculation,
    }).then((response) => {
      // console.log("CAL::", response.data.data)
      if (response.data.data > 0) {
        setDisFir(true)
        setValue(1)
      }
      else{
        setDisSec(true)
        setValue(0)
      }
      // else{
      //   setDisFir("false")
      //   setValue(0)
      // }
      // setRefreshTrigger()
      // setCalExists(response.data.data)
      // console.log("disTab:",disTab)
    });
  }, []);
  return (
    <div className="page-inner">
      <React.Fragment>
        <Box
          sx={{
            backgroundColor: '#f5f5f557',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            scrollButtons
            indicatorColor="primary"
            textColor="primary"
            allowScrollButtonsMobile

          >

            <Tab label="AI Solution Selection" {...a11yProps(0)}  />
            <Tab label="Efficiency Dashboard" {...a11yProps(1)} disabled={disSec} />

          </Tabs>
        </Box>

        <TabPanel value={value} index={0}  >
          <AiSolutionSelected />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EfficiencyDashboard />
        </TabPanel>
      </React.Fragment>
    </div>
  );
};

export default Input;