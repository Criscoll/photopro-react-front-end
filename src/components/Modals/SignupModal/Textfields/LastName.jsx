import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function LastName(props) {
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
      const result = handleLastNameInput(text);
      props.setLastNameValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [submitFormClicked]);

  const handleLastNameInput = (text) => {
    if (text.length > 0) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Last name must be included');
      setErrorValue(true);
      return false;
    }
  };
  return (
    <React.Fragment>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleLastNameInput(e.target.value);
          }}
          label="Last name"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </React.Fragment>
  );
}
