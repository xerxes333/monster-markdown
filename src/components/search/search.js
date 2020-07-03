import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

function Search(props) {

  const { setQueryResults } = props;
  const [query, setQuery] = useState('');

  const search = (e) => {
    e.preventDefault();

    setQueryResults([]);

    fetch(`https://api.open5e.com/monsters/?search=${query}`)
      .then(res => res.json())
      .then(res => {
        setQueryResults(res.results);
      })
      .catch(() => console.log('error'))
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(3)
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

  return(

    <Paper component="form" className={classes.root} onSubmit={search}>
      <InputBase
        className={classes.input}
        placeholder="Search Creature"
        inputProps={{ 'aria-label': 'search' }}
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon/>
      </IconButton>
    </Paper>
  );
}

export default Search;
