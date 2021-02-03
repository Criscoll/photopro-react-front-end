import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function (props) {
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { placeOrderClicked } = props;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleYearInput(text);
      props.setCardYearValidated(result);
    }
    // eslint-disable-next-line
  }, [placeOrderClicked]);

  const handleYearInput = (text) => {
    if (parseInt(text) >= 2020) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Input the correct year [2020+]');
      setErrorValue(true);
      return false;
    }
  };

  console.log(errorText);
  return (
    <React.Fragment>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleYearInput(e.target.value);
          }}
          id="outlined-number"
          label="Year"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
