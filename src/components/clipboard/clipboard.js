import React, { useRef } from "react";
import { Button, TextField } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { mash } from "../app/utils";

function Clipboard(props) {
  const { text } = props;
  const mdText = useRef(null);

  const clip = (e) => {
    mdText.current.select();
    document.execCommand("copy");
    mdText.current.blur();
  };

  const useStyles = makeStyles((theme) => ({
    button: {
      marginBottom: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={clip}
        fullWidth="true"
        className={classes.button}
      >
        Copy to Clipboard
      </Button>
      <Typography variant="body1" gutterBottom>
        Then paste here:
        <Link
          href="https://homebrewery.naturalcrit.com/new"
          color="secondary"
          target="_blank"
          rel="noreferrer"
        >
          https://homebrewery.naturalcrit.com/new
        </Link>
      </Typography>
      <TextField
        multiline={true}
        variant="outlined"
        fullWidth={true}
        inputRef={mdText}
        value={mash(text)}
        color="secondary"
      />
    </>
  );
}

export default Clipboard;
