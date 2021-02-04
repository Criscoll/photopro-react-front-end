import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function Password(props) {
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
      const result = handlePasswordInput(text);
      props.setPasswordValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [submitFormClicked]);

  const handlePasswordInput = (text) => {
    if (text.length >= 8 && text.length < 16) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Password must be between 8 and 16 characters long');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <TextField
        type="password"
        required
        error={errorValue}
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handlePasswordInput(e.target.value);
        }}
        label="Password"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
