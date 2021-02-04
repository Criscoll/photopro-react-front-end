import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function PriceField(props) {
  const [text, setText] = useState(props.oldPrice);
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
    props.setPriceValidated([false, text]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handlePriceInput(text);
      console.log(text);
      props.setPriceValidated([result, text]);
    }
    // eslint-disable-next-line
  }, [saveButtonClicked]);

  const handlePriceInput = (text) => {
    if (parseFloat(text) > 0) {
      setErrorValue(false);
      return true;
    } else {
      setErrorValue(true);
      setErrorText('A price must be included');
      return false;
    }
  };

  return (
    <React.Fragment>
      <h3>Price</h3>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handlePriceInput(e.target.value);
          }}
          id="outlined-required"
          label="Required"
          type="number"
          defaultValue={parseInt(props.oldPrice)}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
