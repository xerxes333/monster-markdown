import React, { useState } from "react";
import { IconButton, InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

function Search(props) {
  const { setQueryResults } = props;
  const [query, setQuery] = useState("");

  const search = (e) => {
    e.preventDefault();

    setQueryResults([]);

    fetch(`https://api.open5e.com/monsters/?search=${query}`)
      .then((res) => res.json())
      .then((res) => {
        setQueryResults(res.results);
      })
      .catch((error) => console.log(error));
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(3),
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  }));

  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root} onSubmit={search}>
      <InputBase
        className={classes.input}
        placeholder="Search Creature"
        inputProps={{ "aria-label": "search" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default Search;
