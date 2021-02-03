import React, { useState } from "react";
import "./searchbar.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: "100ch",
    backgroundColor: "white",
  },
}));

function SearchBarInput(props) {
  const [searchVal, setSearchVal] = useState("");
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      if ((searchVal.match(/[/[\s]/g) || []).length === searchVal.length) {
        props.setQuery(null);
      } else {
        props.setQuery(searchVal);
      }
    }, 100);
  };

  return (
    <React.Fragment>
      <div className="searchBar">
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={classes.text}
            id="outlined-basic"
            label="Search for stock photos"
            variant="outlined"
            size="small"
            fullWidth
            value={searchVal}
            onChange={(event) => setSearchVal(event.target.value)}
          />
        </form>
      </div>
    </React.Fragment>
  );
}

export default SearchBarInput;
