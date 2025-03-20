import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AuthInitializer from "./routes/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";
import SocketInitializer from "./routes/SocketInitializer";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SocketInitializer>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </SocketInitializer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
