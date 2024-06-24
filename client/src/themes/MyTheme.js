// https://mui.com/material-ui/customization/color/

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            light: '#ff6659',
            main: '#D60000',
            dark: '#950000',
        },
        secondary: {
            light: 'D9D9D9',
            main: '#464646',
            dark: '#313131',
        },
    }
});

export default theme;
