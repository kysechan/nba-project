import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";

const Theme = createMuiTheme({
  palette: {
    text: {
      primary: "#456268",
      secondary: "#FFFFFF",
    },
  },
  props: {
    // MuiAutocomplete: {
    //   text: {
    //     color: "red",
    //   },
    // },
  },
});

export default Theme;