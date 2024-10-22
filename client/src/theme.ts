import { createTheme } from '@mui/material/styles';
import { indigo, deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: indigo[500],
    },
    background: {
      default: '#031033', // Dark background for the entire application
      paper: '#041a4d', // Dark background for components such as cards, sheets
    },
    text: {
      primary: '#ffffff', // Light color text for better readability on dark backgrounds
      secondary: '#f5edf7', // Slightly muted text color for secondary text
    },
  },
});

export default theme;
