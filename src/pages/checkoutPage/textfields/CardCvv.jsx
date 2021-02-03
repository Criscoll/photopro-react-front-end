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
      const result = handleCvvInput(text);
      props.setCardCvvValidated(result);
    }
    // eslint-disable-next-line
  }, [placeOrderClicked]);

  const handleCvvInput = (text) => {
    let patt = /\d+/;
    if ((parseInt(text.length) === 3) & patt.test(text)) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Input the correct CVV [3 digits]');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <h3>CVC</h3>
      <div style={{ marginBottom: '10%' }}>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleCvvInput(e.target.value);
          }}
          id="outlined-required"
          label="Required"
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
