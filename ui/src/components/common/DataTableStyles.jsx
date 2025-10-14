import { createTheme, adaptV4Theme } from '@mui/material/styles';

export const viewOnlytableOptions = {
  selectableRows: 'none',
  selectToolbarPlacement: 'none',
  elevation: 0,
  textLabels: {
    body: {
      noMatch: 'No matching records found'
    }
  }
};
export const selectableTableOptions = {
  ...viewOnlytableOptions
};

export const getTrainingTablesTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            paddingTop: '6px',
            paddingBottom: '6px'
          }
        }
      },
      MUIDataTable: {
        styleOverrides: {
          root: {
            //  backgroundColor: '#red'
          },
          paper: {
            boxShadow: 'none',
            border: 'solid 1px lightgrey'
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            borderBottom: 'solid 1px lightgrey'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '8px'
          },
          head: {
            //  backgroundColor: 'purple'
          }
        }
      },
      MUIDataTableSelectCell: {
        styleOverrides: {
          headerCell: {}
        }
      },
      MuiTableFooter: {
        styleOverrides: {
          root: {
            //  '& .MuiToolbar-root': {
            //    backgroundColor: 'white'
            //  }
          }
        }
      }
    }
  });

export const getDataTableTheme = () =>
  createTheme(
    adaptV4Theme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            // backgroundColor: '#FFFFFE',
            // border: '0',
            // fontSize: '11pt',
            // fontWeight: '400',
            // fontFamily: 'Franklin Gothic Book',
            paddingBottom: '0.2rem',
            paddingTop: '0.2rem'
          }
        }
      }
    })
  );

export const getSetUpDataTableTheme = () =>
  createTheme(
    adaptV4Theme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            paddingBottom: '0.2rem',
            paddingTop: '0.2rem',
            backgroundColor: '#FFFFFE',
            fontSize: '11pt',
            fontWeight: '500',
            textAlign: 'center',
            fontFamily: 'Franklin Gothic Book'
          }
        },
        MUIDataTableHeadCell: {
          root: {
            textAlign: 'center'
          }
        }
      }
    })
  );

// export const getPendingBuildDataTableTheme = () =>
// createMuiTheme({
//   overrides: {
//     MUIDataTableBodyCell: {
//       root: {
//         paddingBottom: '0.2rem',
//         paddingTop: '0.2rem',
//         backgroundColor: '#FFFFFE',
//         fontSize: '11pt',
//         fontWeight: '500',
//         textAlign: 'center',
//         fontFamily: 'Franklin Gothic Book'
//       }
//     },
//     MUIDataTableHeadCell: {
//       root: {
//         textAlign: 'center'
//       }
//     }
//   }
// });

export const getTriggerDataTableTheme = () =>
  createTheme(
    adaptV4Theme({
      overrides: {
        MUIDataTable: {
          root: {
            backgroundColor: 'red'
          },
          paper: {
            // boxShadow: "none",
            borderRadius: 0,
            padding: 0
          }
        },
        // MUIDataTableBodyCell: {
        //   root: {
        //     backgroundColor: "#FFF"
        //   }
        // },
        MuiToolbar: {
          regular: {
            // backgroundColor: "#ffff00",
            // color: "#3f51b5",
            // height: "32px",
            // minHeight: "32px",
            '@media (min-width: 600px)': {
              paddingLeft: 13,
              paddingRight: 10
            }
          },
          root: {
            backgroundColor: 'rgba(0, 0, 0, 0.00)',
            // backgroundColor:'#e8eaf6',
            // borderLeft:'4px solid rgb(63, 81, 181)',
            borderBottom: '1px solid #d4d2d2'
          },
          gutters: {
            '@media (min-width: 600px)': {
              paddingLeft: 0,
              paddingRight: 0
            }
          }
        },
        MuiTableCell: {
          root: {
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 15,
            paddingRight: 0
          }
        },
        // MUIDataTableSelectCell: {
        //   headerCell: {
        //     backgroundColor: 'blue',
        //   }
        // },
        MUIDataTableHeadCell: {
          fixedHeader: {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            // backgroundColor: "#e8eaf6",
            // backgroundColor:'rgb(63, 81, 181)',
            // color:'#fff',
            paddingTop: 3,
            paddingBottom: 3
          }
          // MuiTableFooter: {
          //   MuiToolbar: {
          //     regular: {
          //       // backgroundColor: "#ffff00",
          //       color: 'red'
          //     }
          //   }
          // }
        }
      }
    })
  );

export const getPendingBuildDataTableTheme = () =>
  createTheme({
    overrides: {
      MUIDataTable: {
        paper: {
          borderRadius: 0,
          padding: 0,
          elevation: 0,
          border: '1px solid lightgrey'
        }
      },
      MuiToolbar: {
        regular: {
          '@media (min-width: 600px)': {
            paddingLeft: 13,
            paddingRight: 10
          }
        },
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.00)',
          border: '1px solid lightgrey'
          //  borderBottom: '1px solid #d4d2d2'
        },
        gutters: {
          '@media (min-width: 600px)': {
            paddingLeft: 0,
            paddingRight: 0
          }
        }
      },
      MuiTableCell: {
        root: {
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 15,
          paddingRight: 0
        }
      },
      MUIDataTableHeadCell: {
        fixedHeader: {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          paddingTop: 12,
          paddingBottom: 12
        }
        // MuiTableFooter:
        // {
        //   MuiToolbar: {
        //     regular: {
        //       color: "red",
        //       }
        //     },
        // }
      }
    }
  });

  export const getSolutionTablesTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            // padding: '6px',
            // margin:'6px',
            backgroundColor:'#002060',
            // textTransform: 'uppercase',
            height: '50px !important',
            color: '#FFF !important',
            fontFamily: 'Roboto !important',
            fontWeight: '50 !important',
            fontSize: '1rem !important',
            // textAlign:'right !important',
            // border: 'solid 2px #fff'
          }
        }
      },
      // MUIDataTable: {
      //   styleOverrides: {
      //     root: {
      //       //  backgroundColor: '#red'
      //     },
      //     paper: {
      //       boxShadow: 'none',
      //       border: 'solid 1px #ff0000'
      //     }
      //   }
      // },
      // MUIDataTable: {
      //   styleOverrides: {
      //     root: {
      //       //  backgroundColor: '#red'
      //     },
      //     paper: {
      //       boxShadow: 'none',
      //       border: 'solid 1px #ff0000'
      //     }
      //   }
      // },
      // MuiToolbar: {
      //   styleOverrides: {
      //     root: {
      //       borderBottom: 'solid 1px lightgrey'
      //     }
      //   }
      // },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '0px',
            textAlign:'center !important',
            border: 'solid 1px #fff',
            // margin:'5px',
            padding:'5px',

            // '&:nth-child(odd)': { 
            //   backgroundColor: '#FF0000'
            // }
            // backgroundColor:'#ff0000'
          },
          head: {
            //  backgroundColor: 'purple'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            padding: '0px',
            
            textAlign:'center !important',
            '&:nth-of-type(odd)': { 
              backgroundColor: '#f1f1f1'
            },
            '&:nth-of-type(even)': { 
              backgroundColor: '#ffffff'
            }
            // backgroundColor:'#ff0000'
          },
          head: {
            //  backgroundColor: 'purple'
          }
        }
      },
      MUIDataTableSelectCell: {
        styleOverrides: {
          headerCell: {}
        }
      },
      MuiTableFooter: {
        styleOverrides: {
          root: {
            //  '& .MuiToolbar-root': {
            //    backgroundColor: 'white'
            //  }
          }
        }
      }
    }
  });
