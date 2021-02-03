import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function CaptionField(props) {
  const [text, setText] = useState(props.oldCaption);
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
    props.setCaptionValidated([false, text]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleCaptionInput(text);
      props.setCaptionValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [saveButtonClicked]);

  const handleCaptionInput = (text) => {
    if (text.length < 50) {
      setErrorValue(false);
      return true;
    } else {
      setErrorValue(true);
      setErrorText('Caption too long');
      return false;
    }
  };

  return (
    <React.Fragment>
      <h3>Caption</h3>
      <div>
        <TextField
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleCaptionInput(e.target.value);
          }}
          id="outlined-required"
          defaultValue={props.oldCaption}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
