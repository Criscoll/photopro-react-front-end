import React, { useState, useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';

export default function TagsField(props) {
  const [text, setText] = useState(props.oldTags);
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const textFieldRef = useRef();
  const { saveButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
    props.setTagsValidated([false, text]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setText(props.oldTags);
    props.setTagsValidated([false, props.oldTags]);
    // eslint-disable-next-line
  }, [props.oldTags]);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleTagsInput(text);
      props.setTagsValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [saveButtonClicked]);

  const handleTagsInput = (text) => {
    if (text.length < 100) {
      setErrorValue(false);
      return true;
    } else {
      setErrorValue(true);
      setErrorText('Too many tags');
      return false;
    }
  };

  return (
    <React.Fragment>
      <h3>Tags</h3>
      <div>
        <TextField
          ref={textFieldRef}
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleTagsInput(e.target.value);
          }}
          value={text}
          id="outlined-required"
          label="Tags must be comma seperated"
          defaultValue={props.oldTags.toString()}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </React.Fragment>
  );
}
