import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function FirstName(props) {
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
      const result = handleTagsText(text);
      props.setTagsValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [uploadButtonClicked]);

  const handleTagsText = (text) => {
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
          handleTagsText(e.target.value);
        }}
        label="Tags - Must be comma seperated (e.g. 'nature','trees','green')"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
