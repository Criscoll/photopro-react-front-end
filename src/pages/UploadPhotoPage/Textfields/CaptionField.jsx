import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function Password(props) {
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
      const result = handleCaptionText(text);
      props.setCaptionValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [uploadButtonClicked]);

  const handleCaptionText = (text) => {
    setErrorValue(false);
    setErrorText('');
    return true;
  };
  return (
    <React.Fragment>
      <TextField
        error={errorValue}
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handleCaptionText(e.target.value);
        }}
        label="Caption"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
