import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function TitleField(props) {
  const [text, setText] = useState(props.oldTitle);
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
    props.setTitleValidated([false, text]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleTitleInput(text);
      props.setTitleValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [saveButtonClicked]);

  const handleTitleInput = (text) => {
    if (text.length > 0 && text.length < 50) {
      setErrorValue(false);
      return true;
    } else {
      setErrorValue(true);
      setErrorText('A title must be included');
      return false;
    }
  };

  return (
    <React.Fragment>
      <h3>Title</h3>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleTitleInput(e.target.value);
          }}
          id="outlined-required"
          label="Required"
          defaultValue={props.oldTitle}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
