import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function FirstName(props) {
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { submitFormClicked } = props;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleFirstNameInput(text);
      props.setFirstNameValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [submitFormClicked]);

  const handleFirstNameInput = (text) => {
    if (text.length > 0) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('First name must be included');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handleFirstNameInput(e.target.value);
        }}
        label="First name"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
