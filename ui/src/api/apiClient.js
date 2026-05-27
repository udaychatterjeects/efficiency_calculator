import axios from "./axios";

export async function apiQuery(config) {
  const requiresAuth = config?.auth;
  const hasParam = config?.params;
  const hasBody = config?.body;
  const hasPathParam = config?.pathParam;
  let authToken = null;
  let resourceId = null;
  if (requiresAuth) {
    try {
      authToken = sessionStorage.getItem("USER_ACCESS_TOKEN");      
    } catch (err) {}
  }

  if (hasPathParam) {
    resourceId = config.pathParam.id;
  }

  try {
    const apiResponse = await axios({
      method: config.method,
      ...(hasPathParam
        ? { url: `${config.endpoint}/${resourceId}` }
        : {
            url: config.endpoint,
          }),
      ...(requiresAuth && {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      ...(hasParam && {
        params: config.params,
      }),
      ...(hasBody && { data: config.body }),
    });
    return apiResponse;
  } catch (err) {
    return Promise.reject(err);
  }
}

export function queryfn(param) {
  return apiQuery(param.queryKey[0]);
}

export const apiRoute = {
  // Dashboard: {
  //   GetPortfolios: {
  //     endpoint: 'DashBoardDropdown/GetPortfolios',
  //     method: 'POST'
  //   },
  //   GetValueStreams: {
  //     endpoint: 'DashBoardDropdown/GetValueStreams',
  //     method: 'POST'
  //   },
  //   GetApplication: {
  //     endpoint: 'DashBoardDropdown/GetApplications',
  //     method: 'POST'
  //   },
  //   GetCIApplications: {
  //     endpoint: 'DashBoardDropdown/GetCIApplications',
  //     method: 'POST'
  //   },
  //   GetEnvironments: {
  //     endpoint: 'DashBoardDropdown/GetEnvironments',
  //     method: 'POST'
  //   },
  //   GetAppMap: {
  //     endpoint: 'DashBoardDropdown/GetAppMap',
  //     method: 'GET'
  //   },
  //   GetAllChartsData: {
  //     endpoint: 'DashBoard/GetAllChartsData',
  //     method: 'POST'
  //   }
  // },
  // BuildHub: {
  //   AllBuild: { endpoint: 'PublicBuilds/GetAllPendingBuilds', method: 'GET' },
  //   ArchivedBuild: {
  //     endpoint: 'ArchiveBuilds/GetAllArchivedBuilds',
  //     method: 'GET',
  //     auth: true
  //   },
  //   RestoreArchivedBuild: {
  //     endpoint: 'ArchiveBuilds/RestoreArchivedBuild',
  //     method: 'POST',
  //     auth: true
  //   }
  // },
  Identity: {
    LogIn: { endpoint: "user/login", method: "POST" },
    Registration: { endpoint: "user/signup", method: "POST" },
    GenerateToken: {
      endpoint: "user/generatetoken",
      method: "POST",
    },
    TokenStatus: {
      endpoint: "user/tokenstatus",
      method: "POST",
    },
    ResetPassword: { endpoint: "user/changepassword", method: "POST" },
    ChangePassword: {
      endpoint: "Identity/ChangePswd",
      method: "POST",
      auth: true,
    },
  },
  Admin: {
    AllUser: { endpoint: "user/list", method: "GET", auth: true },
    LockOrUnlockUser: {
      endpoint: "user/lockunlockuser",
      method: "POST",
      auth: true,
    },
    DeleteUser: { endpoint: "user/delete", method: "DELETE", auth: true },
    EditUser: { endpoint: "user/edit", method: "POST", auth: true },
    TokenBank: {
      endpoint: "Identity/Admin/PasswordReset",
      method: "GET",
      auth: true,
    },
    TokenList: {
      endpoint: "token/list",
      method: "GET",
      auth: true,
    },
    GetUserSquad: {
      endpoint: "usersquad/list",
      method: "GET",
      auth: true,
    },
    DeleteUserSquad: {
      endpoint: "usersquad/delete",
      method: "DELETE",
      auth: true,
    },
    EditUserSquad: {
      endpoint: "usersquad/update",
      method: "PUT",
      auth: true,
    },
    CreateUserSquad: {
      endpoint: "usersquad/add",
      method: "POST",
      auth: true,
    },
    // GetAllocation: {
    //   endpoint: 'Identity/Allocation',
    //   method: 'GET',
    //   auth: true
    // },
    // CreateAllocation: {
    //   endpoint: 'Identity/Allocation',
    //   method: 'POST',
    //   auth: true
    // },
    // DeleteAllAllocation: {
    //   endpoint: 'Identity/Allocation/DeleteAllAllocations',
    //   method: 'DELETE',
    //   auth: true
    // },
    // DeleteSingleAllocation: {
    //   endpoint: 'Identity/Allocation/DeleteSingleAllocations',
    //   method: 'DELETE',
    //   auth: true
    // },
    // GetApplication: {
    //   endpoint: 'Applications',
    //   method: 'GET',
    //   auth: true
    // }, 
    // GetTeams: {
    //   endpoint: 'Teams',
    //   method: 'GET',
    //   auth: true
    // }
  },
  Configuration: {
    AllSolution: { endpoint: "solution/list", method: "GET", auth: true },
    AllSolutionRec: { endpoint: "solution/recommendation", method: "POST", auth: true },
    AllCognitiveSolution: { endpoint: "cognitivesolution/list", method: "GET", auth: true },
    AllCognitiveSolutionCal: { endpoint: "cognitivesolutioncal/list", method: "GET", auth: true },
    GetSumCalculations: { endpoint: "calculate/sum", method: "GET", auth: true },
    cognitiveSolutionGraph: { endpoint: "cognitivesolution/graph", method: "GET", auth: true },
    cognitiveSolutionBarGraph: { endpoint: "stlc/bargraph", method: "GET", auth: true },
    addCategory: { endpoint: "project/add", method: "POST", auth: true },
    GetCategory: { endpoint: "category/list", method: "GET", auth: true },
    GetStlcSolutions: { endpoint: "solution/stlc", method: "GET", auth: true },
    GetStlcData: { endpoint: "solution/stlcdata", method: "POST", auth: true },
    GetStlcPhases: { endpoint: "phase/list", method: "GET", auth: true },
    AddStlcPhase: { endpoint: "phase/add", method: "POST", auth: true },
    AddStlcActivity: { endpoint: "activity/add", method: "POST", auth: true },
    getStlcActivity: { endpoint: "activity/list", method: "GET", auth: true },
    callAI: { endpoint: "automation/senddata", method: "POST", auth: true },
    GetStlcByCategory: {
      endpoint: "stlcbycategory",
      method: "POST",
      auth: true,
    },
    getEfficiencyGain: {
      endpoint: "efficiency-gain",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainNew: {
      endpoint: "efficiency-gain-new",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainIni: {
      endpoint: "efficiency-gain-ini",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainYa: {
      endpoint: "efficiency-gain-ya",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainYb: {
      endpoint: "efficiency-gain-yb",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainYc: {
      endpoint: "efficiency-gain-yc",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainYd: {
      endpoint: "efficiency-gain-yd",
      method: "POST",
      auth: true,
    },
    getEfficiencyGainYe: {
      endpoint: "efficiency-gain-ye",
      method: "POST",
      auth: true,
    },
    addEffortDistribution: {
      endpoint: "effortsdistribution/add",
      method: "POST",
      auth: true,
    },
    updateMasterSolution: {
      endpoint: "mastersolution/update",
      method: "POST",
      auth: true,
    },
    addMasterSolution: {
      endpoint: "mastersolution/add",
      method: "POST",
      auth: true,
    },
    addSolution: {
      endpoint: "solution/add",
      method: "POST",
      auth: true,
    },
    recommenSol: {
      endpoint: "recommendation",
      method: "POST",
      auth: true,
    },
    
    deleteSolution: {
      endpoint: "solution/delete",
      method: "POST",
      auth: true,
    },
    ActiveStlc: { endpoint: "stlc/active", method: "GET", auth: true },
    addCalculations: {
      endpoint: "automation/senddata",
      method: "POST",
      auth: true,
    },
    targetAutomation: {
      endpoint: "automation/target",
      method: "POST",
      auth: true,
    },
    deleteCogSolution: {
      endpoint: "cogsolution/delete",
      method: "POST",
      auth: true,
    },

    resetAll: {
      endpoint: "reset",
      method: "POST",
      auth: true,
    },
    resetSolution: {
      endpoint: "solution/reset",
      method: "POST",
      auth: true,
    },
    resetStlc: {
      endpoint: "reset/stlc",
      method: "POST",
      auth: true,
    },
    resetSolutions: {
      endpoint: "reset/solutions",
      method: "POST",
      auth: true,
    },
    GetCalculations: { endpoint: "stlc/calculation", method: "GET", auth: true },
    GetYearCalculations: { endpoint: "stlc/yearcalculation", method: "GET", auth: true },
    GetCommonVal: { endpoint: "common/list", method: "GET", auth: true },
    CheckCalculation: {
      endpoint: "check/calculation",
      method: "POST",
      auth: true,
    },
    dummyApi: {
      endpoint: "dummy",
      method: "POST",
      auth: true,
    },
  },
  SetUp: {
    // GetPortfolio: { endpoint: 'Portfolios', method: 'GET', auth: true },
    // DeletePortfolio: {
    //   endpoint: 'Portfolios',
    //   method: 'DELETE',
    //   auth: true
    // },
    // EditPortfolio: { endpoint: 'Portfolios', method: 'PUT', auth: true },
    // CreatePortfolio: { endpoint: 'Portfolios', method: 'POST', auth: true },
    // EditValueStream: { endpoint: 'ValueStreams', method: 'PUT', auth: true },
    // GetValueStream: { endpoint: 'ValueStreams', method: 'GET', auth: true },
    // DeleteValueStream: {
    //   endpoint: 'ValueStreams',
    //   method: 'DELETE',
    //   auth: true
    // },
    // EditValueStream: { endpoint: 'ValueStreams', method: 'PUT', auth: true },
    // CreateValueStream: { endpoint: 'ValueStreams', method: 'POST', auth: true },
    GetApplication: { endpoint: "application/list", method: "GET", auth: true },
    DeleteApplication: {
      endpoint: "application/delete",
      method: "DELETE",
      auth: true,
    },
    EditApplication: {
      endpoint: "application/update",
      method: "PUT",
      auth: true,
    },
    CreateApplication: {
      endpoint: "application/add",
      method: "POST",
      auth: true,
    },
    CreateSquad: { endpoint: "squad/add", method: "POST", auth: true },
    GetSquad: { endpoint: "squad/list", method: "GET", auth: true },
    ViewSquad: { endpoint: "squad/view", method: "GET", auth: true },
    // GetAllSquad: { endpoint: 'squad/all', method: 'GET', auth: true },
    EditSquad: { endpoint: "squad/update", method: "PUT", auth: true },
    DeleteSquad: {
      endpoint: "squad/delete",
      method: "DELETE",
      auth: true,
    },
    GetApplicationSquad: {
      endpoint: "appsquad/list",
      method: "GET",
      auth: true,
    },
    GetApplicationBySquad: {
      endpoint: "applicationbysquad",
      method: "GET",
      auth: true,
    },
    GetTrainedApplicationSquad: {
      endpoint: "applicationsquad/process",
      method: "GET",
      auth: true,
    },

    DeleteApplicationSquad: {
      endpoint: "appsquad/delete",
      method: "DELETE",
      auth: true,
    },
    EditApplicationSquad: {
      endpoint: "appsquad/update",
      method: "PUT",
      auth: true,
    },
    CreateApplicationSquad: {
      endpoint: "appsquad/create",
      method: "POST",
      auth: true,
    },
    // GetCIApplication: { endpoint: 'CIApplications', method: 'GET', auth: true },
    // DeleteCIApplication: {
    //   endpoint: 'CIApplications',
    //   method: 'DELETE',
    //   auth: true
    // },
    // EditCIApplication: {
    //   endpoint: 'CIApplications',
    //   method: 'PUT',
    //   auth: true
    // },
    // CreateCIApplication: {
    //   endpoint: 'CIApplications',
    //   method: 'POST',
    //   auth: true
    // },
    // CommonDropdown: {
    //   endpoint: 'Dropdown',
    //   method: 'POST',
    //   auth: true
    // }
  },
  Training: {
    UploadFile: {
      endpoint: "Module",
      method: "POST",
      auth: true,
    },
    GetModules: {
      endpoint: "Module",
      method: "Get",
      auth: true,
    },
    PostUserId: {
      endpoint: "User/PostUserId",
      method: "POST",
    },
    PostSquadId: {
      endpoint: "User/PostSquadId",
      method: "POST",
    },
    GetMapModules: {
      endpoint: "ModuleMapping",
      method: "Get",
      auth: true,
    },
    UploadMapModules: {
      endpoint: "ModuleMapping",
      method: "POST",
      auth: true,
    },
    UploadDefects: {
      endpoint: "Defect",
      method: "POST",
      auth: true,
    },
    GetDefects: {
      endpoint: "Defect",
      method: "Get",
      auth: true,
    },
    UploadProductionIncidents: {
      endpoint: "ProductionIncident",
      method: "POST",
      auth: true,
    },
    GetProductionIncidents: {
      endpoint: "ProductionIncident",
      method: "Get",
      auth: true,
    },
    GetDefects: {
      endpoint: "Defect",
      method: "Get",
      auth: true,
    },
    UploadFunctionalTestCases: {
      endpoint: "FunctionalTestCase",
      method: "POST",
      auth: true,
    },
    GetFunctionalTestCases: {
      endpoint: "FunctionalTestCase",
      method: "Get",
      auth: true,
    },
    UploadRegressionTestCases: {
      endpoint: "RegressionTestCase",
      method: "POST",
      auth: true,
    },
    GetRegressionTestCases: {
      endpoint: "RegressionTestCase",
      method: "Get",
      auth: true,
    },
    UploadUserStories: {
      endpoint: "UserStory",
      method: "POST",
      auth: true,
    },
    GetUserStories: {
      endpoint: "UserStory",
      method: "Get",
      auth: true,
    },
    UploadReleases: {
      endpoint: "Release",
      method: "POST",
      auth: true,
    },
    GetReleases: {
      endpoint: "Release",
      method: "Get",
      auth: true,
    },
  },
  Baseline: {
    SetBaseline: {
      endpoint: "comparison/setbaseline",
      method: "POST",
      auth: true,
    },
    ListBaselineResults: {
      endpoint: "baseline/list",
      method: "POST",
      auth: true,
    },
    OverrideBaseline: {
      endpoint: "baseline/override",
      method: "POST",
      auth: true,
    },
    AddBaseline: {
      endpoint: "baseline/add",
      method: "POST",
      auth: true,
    },
    DeleteBaseline: {
      endpoint: "baseline/delete",
      method: "DELETE",
      auth: true,
    },
  },
  Comparison: {
    TriggerImageComparison: {
      endpoint: "comparison/create",
      method: "POST",
      auth: true,
    },
    ListComparisonResults: {
      endpoint: "comparison/list",
      method: "POST",
      auth: true,
    },
    ViewApplicationBySquad: {
      endpoint: "viewapplicationbysquad",
      method: "GET",
      auth: true,
    },
    DownloadCompairResult: {
      endpoint: "comparison/download",
      method: "POST",
      auth: true,
    },
    ProcessingSquad: {
      endpoint: "squad/functionalTest",
      method: "GET",
      auth: true,
    },
    ProcessingApplicationSquad: {
      endpoint: "ApplicationSquad/functionalTest/process",
      method: "GET",
      auth: true,
    },
    FunctionalPrediction: {
      endpoint: "FunctionalPrediction",
      //endpoint: 'https://dummyjson.com/posts',
      method: "POST",
      auth: true,
    },
    OverrideBaseline: {
      endpoint: "baseline/override",
      method: "POST",
      auth: true,
    },
  },
  Processing: {
    SetReleaseData: {
      endpoint: "Prediction",
      method: "POST",
      auth: true,
    },
    TriggerReleasePrediction: {
      endpoint: "Prediction",
      method: "POST",
      auth: true,
    },
    ProcessingSquad: {
      endpoint: "squad/functionalTest",
      method: "GET",
      auth: true,
    },
    ProcessingApplicationSquad: {
      endpoint: "ApplicationSquad/functionalTest/process",
      method: "GET",
      auth: true,
    },
    FunctionalPrediction: {
      endpoint: "FunctionalPrediction",
      //endpoint: 'https://dummyjson.com/posts',
      method: "POST",
      auth: true,
    },
  },
  // Pipeline: {
  //   TriggerJob: {
  //     endpoint: 'job/StartBackground',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetJobDetails: { endpoint: 'job/history', method: 'GET', auth: true },
  //   GetPendingBuilds: {
  //     endpoint: 'job/pendingbuilds',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetJobStatus: { endpoint: 'job/state', method: 'GET', auth: true }
  // },
  // Ticket: {
  //   RCA: {
  //     endpoint: 'RCA',
  //     method: 'GET'
  //   },
  //   allTickets: {
  //     endpoint: '/api/Ticket/GetAllTicket',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetActiveTicket: {
  //     endpoint: 'Ticket/GetActiveTicketsofUser',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetOtherTeamsTicket: {
  //     endpoint: 'Ticket/GetOtherTeamsQueue',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetClosedTicket: {
  //     endpoint: 'Ticket/GetClosedTicketsofUser',
  //     method: 'GET',
  //     auth: true
  //   },
  //   GetActivityHistory: {
  //     endpoint: 'Ticket/GetTicketHistory',
  //     method: 'GET',
  //     auth: true
  //   },
  //   RelatedBuilds: {
  //     endpoint: 'PublicBuilds/GetBuildDetailsByIds',
  //     method: 'POST',
  //     auth: true
  //   },
  //   UpdateTicket: {
  //     endpoint: 'Ticket/Update',
  //     method: 'POST',
  //     auth: true
  //   },
  //   ArchiveBuild: {
  //     endpoint: 'ArchiveBuilds/MoveToArchive',
  //     method: 'POST',
  //     auth: true
  //   },
  //   inactiveTickets: '/api/Ticket/GetInActiveTicketsofUser',
  //   closedTickets: '/api/Ticket/GetClosedTicketsofUser',
  //   cancledTickets: '/api/Ticket/GetCanceledTicketsofUser',
  //   ticketHistory: '/api/Ticket/GetTicketHistory',
  //   updateTicket: '/api/Ticket/UpdateTicket'
  // },
  // Profile: {
  //   UserAllocation: {
  //     endpoint: 'profile/allocation',
  //     method: 'GET',
  //     auth: true
  //   }
  // },
  SuperAdmin: {
    Seed:             { endpoint: 'superadmin/seed',             method: 'POST', auth: false },
    ListUsers:        { endpoint: 'superadmin/users',            method: 'GET',  auth: true },
    AddUser:          { endpoint: 'superadmin/user/add',         method: 'POST', auth: true },
    UpdateUser:       { endpoint: 'superadmin/user/update',      method: 'POST', auth: true },
    DeleteUser:       { endpoint: 'superadmin/user/delete',      method: 'POST', auth: true },
    ActivateUser:     { endpoint: 'superadmin/user/activate',    method: 'POST', auth: true },
    ListActivities:   { endpoint: 'superadmin/activities',       method: 'GET',  auth: true },
    AddActivity:      { endpoint: 'superadmin/activity/add',     method: 'POST', auth: true },
    UpdateActivity:   { endpoint: 'superadmin/activity/update',  method: 'POST', auth: true },
    DeleteActivity:   { endpoint: 'superadmin/activity/delete',  method: 'POST', auth: true },
    ListSolutions:    { endpoint: 'superadmin/solutions',        method: 'GET',  auth: true },
    AddSolution:      { endpoint: 'superadmin/solution/add',     method: 'POST', auth: true },
    UpdateSolution:   { endpoint: 'superadmin/solution/update',  method: 'POST', auth: true },
    DeleteSolution:   { endpoint: 'superadmin/solution/delete',  method: 'POST', auth: true },
    ListCategories:   { endpoint: 'superadmin/categories',       method: 'GET',  auth: true },
    AddCategory:      { endpoint: 'superadmin/category/add',     method: 'POST', auth: true },
    UpdateCategory:   { endpoint: 'superadmin/category/update',  method: 'POST', auth: true },
    DeleteCategory:   { endpoint: 'superadmin/category/delete',  method: 'POST', auth: true },
  },
};
