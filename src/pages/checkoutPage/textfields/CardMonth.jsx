import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function CardMonth(props) {
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
      const result = handleMonthInput(text);
      props.setCardMonthValidated(result);
    }
    // eslint-disable-next-line
  }, [placeOrderClicked]);

  const handleMonthInput = (text) => {
    if (parseInt(text) > 0 && parseInt(text) <= 12) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Input the correct month [1-12]');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <h3>EXPIRY DATE</h3>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleMonthInput(e.target.value);
          }}
          id="outlined-number"
          label="Month"
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
