import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function RegistrationPage() {
  const history = useHistory();

  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [username, set_username] = useState("");

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  function validate_password() {
    return password.length >= 8 && password.length < 16;
  }

  function validate_first_name() {
    return email.length > 0 && email.length < 50;
  }

  function validate_last_name() {
    return password.length > 0 && password.length < 50;
  }

  function validate_username() {
    return password.length > 0 && password.length < 32;
  }

  async function attempt_registration(event) {
    event.preventDefault();

    const response = await axios.get("https://photo-pro.herokuapp.com//create_user", {
      params: {
        email: email,
        password: password,
        first: first_name,
        last: last_name,
        username: username,
      },
    });
    console.log(response);
    // const verify_response = await axios.get('https://photo-pro.herokuapp.com//verify_email', {
    //   params: { email: email },
    // });

    if (response.data.result !== false) {
      history.push("/");
    }
  }

  return (
    <div>
      <form onSubmit={attempt_registration}>
        <FormGroup controlId="first_name" bsSize="large">
          <FormLabel>First Name</FormLabel>
          <FormControl
            autoFocus
            value={first_name}
            onChange={(e) => set_first_name(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="last_name" bsSize="large">
          <FormLabel>Last Name</FormLabel>
          <FormControl
            value={last_name}
            onChange={(e) => set_last_name(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="username" bsSize="large">
          <FormLabel>Username</FormLabel>
          <FormControl
            value={username}
            onChange={(e) => set_username(e.target.value)}
          />
        </FormGroup>

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

        <Button
          block
          bsSize="large"
          disabled={
            !validate_first_name() ||
            !validate_last_name() ||
            !validate_email() ||
            !validate_password() ||
            !validate_username()
          }
          type="submit"
        >
          Register
        </Button>
      </form>
    </div>
  );
}
