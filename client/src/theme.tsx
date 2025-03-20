import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF6B01",
      light: "#FF8C3A",
      dark: "#E05A00",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#303030",
      light: "#424242",
      dark: "#1E1E1E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212",
      paper: "rgba(35, 35, 35, 0.95)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.3px",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.2px",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.1px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.2px",
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(145deg, #121212 0%, #1A1A1A 100%)",
          backgroundAttachment: "fixed",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255, 107, 1, 0.6) rgba(30, 30, 30, 0.5)",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 107, 1, 0.6)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(30, 30, 30, 0.5)",
          },
        },
        "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active":
          {
            "-webkit-box-shadow": "0 0 0 30px #1E1E1E inset !important",
            "-webkit-text-fill-color": "#FFFFFF !important",
            "border-color": "#FF6B01 !important",
            "caret-color": "#FF6B01 !important",
            "background-color": "#1E1E1E !important",
            transition: "background-color 5000s ease-in-out 0s",
            "background-image": "none !important",
            "animation-name": "none !important",
          },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          padding: "10px 24px",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "0.9rem",
          transition: "all 0.2s ease-in-out",
          textTransform: "none",
        },
        contained: {
          backgroundColor: "#FF6B01",
          color: "#FFFFFF",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#FF8C3A",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            backgroundColor: "#E05A00",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderColor: "#FF6B01",
          color: "#FF6B01",
          borderWidth: "1.5px",
          "&:hover": {
            borderColor: "#FF8C3A",
            color: "#FF8C3A",
            backgroundColor: "rgba(255, 107, 1, 0.08)",
            borderWidth: "1.5px",
          },
          "&:active": {
            borderColor: "#E05A00",
            color: "#E05A00",
            backgroundColor: "rgba(255, 107, 1, 0.12)",
          },
        },
        text: {
          color: "#FF6B01",
          padding: "8px 16px",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 1, 0.08)",
            color: "#FF8C3A",
          },
          "&:active": {
            backgroundColor: "rgba(255, 107, 1, 0.12)",
            color: "#E05A00",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
              borderWidth: "1px",
              transition: "all 0.2s ease-in-out",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 107, 1, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF6B01",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input": {
            padding: "14px 16px",
          },
          "& label.Mui-focused": {
            color: "#FF6B01",
          },
          "& .Mui-error": {
            color: "#FF4B4B",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF4B4B",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.95rem",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(25, 25, 25, 0.9)",
          backdropFilter: "blur(15px)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          transition: "all 0.25s ease",
          width: "calc(100% - 32px) !important",
          maxWidth: "95% !important",
          marginLeft: "70px !important",
          marginRight: "16px !important",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(28, 28, 28, 0.9)",
            borderColor: "rgba(255, 255, 255, 0.09)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(35, 35, 35, 0.95)",
          backdropFilter: "blur(15px)",
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          transition: "all 0.25s ease",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
            backgroundColor: "rgba(38, 38, 38, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.09)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(15px)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(33, 33, 33, 0.95)",
            borderColor: "rgba(255, 107, 1, 0.2)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px",
          "&:last-child": {
            paddingBottom: "20px",
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "12px 20px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid rgba(255, 107, 1, 0.7)",
          boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          margin: "12px 0",
          "&::before, &::after": {
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: "#FF6B01",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid",
        },
        standardInfo: {
          backgroundColor: "rgba(33, 150, 243, 0.15)",
          color: "#64B5F6",
          borderColor: "rgba(33, 150, 243, 0.3)",
        },
        standardError: {
          backgroundColor: "rgba(244, 67, 54, 0.15)",
          color: "#EF5350",
          borderColor: "rgba(244, 67, 54, 0.3)",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 152, 0, 0.15)",
          color: "#FFA726",
          borderColor: "rgba(255, 152, 0, 0.3)",
        },
        standardSuccess: {
          backgroundColor: "rgba(76, 175, 80, 0.15)",
          color: "#81C784",
          borderColor: "rgba(76, 175, 80, 0.3)",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#FF6B01",
          textDecoration: "none",
          fontWeight: 500,
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            color: "#FF8C3A",
            textDecoration: "none",
            "&::after": {
              width: "100%",
            },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: 0,
            height: "2px",
            backgroundColor: "#FF6B01",
            transition: "width 0.3s ease",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          transition: "all 0.2s ease",
          fontWeight: 500,
          "&:hover": {
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          },
        },
        colorPrimary: {
          backgroundColor: "rgba(255, 107, 1, 0.15)",
          color: "#FF8C3A",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 1, 0.25)",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            margin: "0 3px",
            borderRadius: "8px",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              backgroundColor: "#FF6B01",
              color: "#FFFFFF",
              fontWeight: 600,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#FF8C3A",
                transform: "translateY(-1px)",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 107, 1, 0.12)",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(20, 20, 20, 0.9)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: "#FF6B01",
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
        },
        flexContainer: {
          gap: "8px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          minHeight: "48px",
          padding: "12px 16px",
          transition: "all 0.2s ease",
          borderRadius: "8px 8px 0 0",
          "&.Mui-selected": {
            color: "#FF6B01",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 107, 1, 0.08)",
            color: "#FF8C3A",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(25, 25, 25, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 0",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 1, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 107, 1, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 1, 0.2)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: "25%",
              height: "50%",
              width: "3px",
              backgroundColor: "#FF6B01",
              borderRadius: "0 3px 3px 0",
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          minWidth: "40px",
          ".Mui-selected &": {
            color: "#FF6B01",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 1, 0.12)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(35, 35, 35, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          padding: "8px 12px",
          fontSize: "0.8rem",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 1,
          "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: "#FF6B01",
              opacity: 1,
              border: "none",
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          opacity: 1,
        },
      },
    },
    MuiBox: {
      variants: [
        {
          props: { className: "glassmorphism" },
          style: {
            backgroundColor: "rgba(25, 25, 25, 0.85)",
            backdropFilter: "blur(15px)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
              borderColor: "rgba(255, 107, 1, 0.2)",
            },
          },
        },
        {
          props: { className: "instagramPost" },
          style: {
            backgroundColor: "rgba(30, 30, 30, 0.95)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
            },
          },
        },
        {
          props: { className: "storyCard" },
          style: {
            padding: "3px",
            borderRadius: "16px",
            background: "linear-gradient(45deg, #FF6B01, #FF8C3A, #E05A00)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          },
        },
      ],
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: "0.7rem",
          fontWeight: 600,
          borderRadius: "6px",
          padding: "2px 6px",
          minWidth: "auto",
          height: "auto",
        },
      },
    },
  },
});

export default theme;
