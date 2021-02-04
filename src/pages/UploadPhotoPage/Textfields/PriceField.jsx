import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function LastName(props) {
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
      const result = handlePriceInput(text);
      props.setPriceValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [uploadButtonClicked]);

  const handlePriceInput = (text) => {
    if (parseFloat(text) > 0) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Price must be included');
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
            handlePriceInput(e.target.value);
          }}
          label="Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </React.Fragment>
  );
}
