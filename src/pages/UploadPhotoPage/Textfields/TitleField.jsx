import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function Title(props) {
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { uploadButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleTitleInput(text);
      props.setTitleValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [uploadButtonClicked]);

  const handleTitleInput = (text) => {
    if (text.length > 0) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Title must be included');
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
          handleTitleInput(e.target.value);
        }}
        label="Title"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
