import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function CardName(props) {
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
      const result = handleNameCardInput(text);
      props.setCardNameValidated(result);
    }
    // eslint-disable-next-line
  }, [placeOrderClicked]);

  const handleNameCardInput = (text) => {
    let patt = /\w+\s\w+/;
    if (text.length > 0 && patt.test(text)) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Enter your card name [first name + last name]');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <h3>NAME ON CARD</h3>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handleNameCardInput(e.target.value);
        }}
        id="outlined-required"
        label="Required"
        variant="outlined"
      />
    </React.Fragment>
  );
}
