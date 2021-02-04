import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function ChangePasswordPage() {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [new_password, set_new_password] = useState('');
  const [new_confirmed_password, set_new_confirmed_password] = useState('');

  const history = useHistory();

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  function validate_password() {
    return password.length >= 8 && password.length < 16;
  }

  function validate_new_password() {
    return new_password.length >= 8 && new_password.length < 16;
  }

  function validate_new_confirmed_password() {
    return (
      new_confirmed_password.length >= 8 &&
      new_confirmed_password.length < 16 &&
      new_confirmed_password === new_password
    );
  }

  async function attempt_password_change(event) {
    event.preventDefault();

    var response = await axios.get('https://photo-pro.herokuapp.com//login', {
      params: { email: email, password: password },
    });
    console.log(response);
    if (response.data.result) {
      response = await axios.get('https://photo-pro.herokuapp.com//change_password', {
        params: {
          email: email,
          password: password,
          new_password: new_password,
        },
      });
      console.log(response);

      if (response.data.result) {
        history.push('/');
      }
    }
  }

  return (
    <div>
      <form onSubmit={attempt_password_change}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>

          <FormControl
            value={password}
            onChange={(e) => set_password(e.target.value)}
            type="password"
          />
        </FormGroup>

        <FormGroup controlId="new_password" bsSize="large">
          <FormLabel>New Password</FormLabel>

          <FormControl
            value={new_password}
            onChange={(e) => set_new_password(e.target.value)}
            type="password"
          />
        </FormGroup>

        <FormGroup controlId="new_confirmed_password" bsSize="large">
          <FormLabel>Confirm New Password</FormLabel>

          <FormControl
            value={new_confirmed_password}
            onChange={(e) => set_new_confirmed_password(e.target.value)}
            type="password"
          />
        </FormGroup>

        <Button
          block
          bsSize="large"
          disabled={
            !validate_new_password() ||
            !validate_new_confirmed_password() ||
            !validate_email() ||
            !validate_password()
          }
          type="submit"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
