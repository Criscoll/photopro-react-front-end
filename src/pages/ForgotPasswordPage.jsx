import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, set_email] = useState('');

  const history = useHistory();

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  async function attempt_password_change(event) {
    event.preventDefault();

    var response = await axios.get(
      'http://localhost:5000/forgot_password_get_change_password_link',
      {
        params: { email: email },
      }
    );
    console.log(response);
  }

  return (
    <div>
      <form onSubmit={attempt_password_change}>
        <h1>Forgot your password? Get link to change it.</h1>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
          />
        </FormGroup>

        <Button block bsSize="large" disabled={!validate_email()} type="submit">
          Send Email
        </Button>
      </form>
      <Button
        block
        bsSize="large"
        onClick={() => {
          history.goBack();
        }}
      >
        Cancel
      </Button>
    </div>
  );
}
