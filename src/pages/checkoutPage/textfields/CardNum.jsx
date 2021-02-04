import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function CardNum(props) {
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
      const result = handleCardNumberInput(text);
      props.setCardNumValidated(result);
    }
    // eslint-disable-next-line
  }, [placeOrderClicked]);

  const handleCardNumberInput = (text) => {
    let patt = /\d+/;
    if (text.length === 16 && patt.test(text)) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Bank Account should be 16 digits only');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <h3>CARD NUMBER</h3>
      <TextField
        required
        error={errorValue}
        id="outlined-required"
        label="Required"
        variant="outlined"
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handleCardNumberInput(e.target.value);
        }}
      />
    </React.Fragment>
  );
}
