import React, { useState, useEffect } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

function QueryResults(props) {

  const { results, setText } = props;
  const [slug, setSlug] = useState('');

  const listItems2 = results.map((result, k) => {
    return (
      <MenuItem value={result.slug} key={result.slug}>
        {result.name}
      </MenuItem> 
    )
  });

  /** 
   * TODO: I don't like this implementation
   * 
   * What I want to have happen is when the list of options 
   * is created to automatically pic the first one
   * but not interfere with normal select changes
   */
  useEffect(() => {
    if(listItems2.length === 1) {
      setSlug(results[0].slug);
      setText(results[0]);
    }
  }, [listItems2, results, setText]);

  const handleChange = (event) => {
    setSlug(event.target.value);
    setText(
      _.find(results, ['slug', event.target.value])
    );
  };

  const useStyles = makeStyles((theme) => ({
    select: {
      marginBottom: theme.spacing(3)
    }
  }));

  const classes = useStyles();

  return (
    <>
      <FormControl fullWidth className={classes.select} color="secondary">
        <InputLabel id="simple-select-label">Creature</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={slug}
          onChange={handleChange}
          variant='outlined'
          autoFocus
        >
          {listItems2}
        </Select>
      </FormControl>
    </>
  );

}

export default QueryResults;
