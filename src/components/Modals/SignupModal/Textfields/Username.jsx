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
      const result = handleUsernameInput(text);
      props.setUsernameValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [submitFormClicked]);

  const handleUsernameInput = (text) => {
    if (text.length > 0 && text.length < 32) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Username must be between 0 and 32 characters long ');
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
          handleUsernameInput(e.target.value);
        }}
        label="Username"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
