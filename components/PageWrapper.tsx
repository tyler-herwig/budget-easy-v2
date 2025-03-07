"use client";

import React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Dashboard from "./Dashboard";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  DashboardRounded,
  Insights,
  Logout,
  Menu,
  MonetizationOn,
  Settings
} from "@mui/icons-material";

const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const PageWrapper: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState<boolean>(true);

  const pages = [
    { name: "Dashboard", link: "/", icon: <DashboardRounded /> },
    { name: "Profile", link: "/account", icon: <AccountCircle /> },
    { name: "Settings", link: "/settings", icon: <Settings /> },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            height: "85px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Insights
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            color="primary"
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BUDGET{" "}
            <span style={{ marginLeft: 8, fontWeight: "bolder" }}>EASY</span>
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Box
          sx={[
            {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "15px",
            },
            !open && { display: "none" },
          ]}
        >
          <Avatar sx={{ width: 80, height: 80 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back,
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            Tyler Herwig
          </Typography>
          <Chip
            icon={<MonetizationOn />}
            label="$1,265.15"
            color="success"
            variant="outlined"
            sx={{ mt: 5 }}
          />
          <Typography variant="body2" color="text.secondary">
            Money remaining
          </Typography>
        </Box>
        <Box
          sx={
            !open
              ? { mt: 3 }
              : {
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  mt: 5,
                }
          }
        >
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.name}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      borderRadius: "15px",
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.name}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={
            !open
              ? {}
              : {
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                }
          }
        >
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    borderRadius: "15px",
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Sign-out"
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          width: open
            ? `calc(100% - ${drawerWidth}px)`
            : `calc(100% - ${theme.spacing(7)} - 1px)`,
          [theme.breakpoints.up("sm")]: {
            width: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${theme.spacing(8)} - 1px)`,
          },
        }}
      >
        <DrawerHeader />
        <Dashboard />
      </Box>
    </Box>
  );
};

export default PageWrapper;
