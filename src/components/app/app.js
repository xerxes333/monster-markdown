import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import QueryResults from "../queryResults";
import Clipboard from "../clipboard";
import Search from "../search";
import "./app.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

function App() {
  const theme = "dark";
  const darkTheme = createMuiTheme({
    palette: {
      type: theme,
    },
  });
  const [text, setText] = useState("");
  const [queryResults, setQueryResults] = useState([]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm" className="App">
        <Typography variant="h4" gutterBottom color="secondary">
          Monster Markdown
        </Typography>

        <Search setQueryResults={setQueryResults} />

        {queryResults.length > 0 && (
          <QueryResults results={queryResults} setText={setText} />
        )}

        {text && <Clipboard text={text} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
