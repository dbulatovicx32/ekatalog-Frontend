import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainmenu from '../RoledMainMenu/RoledMainMenu';

interface UserLoginPageState {
    isLoggedIn: boolean;
    message: string;
    email: string;
    password: string;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isLoggedIn: false,
            message: '',
            email: '',
            password: '',
        };
    }

    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let stateFieldName = '';

        if (event.target.id === 'email') {
            stateFieldName = 'email';
        } else if (event.target.id === 'password') {
            stateFieldName = 'password';
        }

        if (stateFieldName === '') {
            return;
        }

        const newState = Object.assign(this.state, {
            [stateFieldName]: event.target.value,
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setLoggedInState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isLoggedIn: state,
        }));
    }

    private doLogin() {
        const data = {
            email: this.state.email,
            password: this.state.password,
        };

        api('/auth/user/login', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessage('There was an error. Please try again!');
                    return;
                }

                if (res.data.statusCode !== undefined) {
                    switch (res.data.statusCode) {
                        case -3001: this.setMessage('This user does not exist!'); break;
                        case -3002: this.setMessage('Bad password!'); break;
                    }
                    return;
                }

                saveToken('user', res.data.token);
                saveRefreshToken('user', res.data.refreshToken);

                this.setLoggedInState(true);
            });
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <Container>
                <RoledMainmenu role="visitor"/>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt} /> User Login
                            </Card.Title>

                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail:</Form.Label>
                                    <Form.Control type="email" id="email"
                                        value={this.state.email}
                                        onChange={(event) => this.handleFormInputChange(event as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password"
                                        value={this.state.password}
                                        onChange={(event) => this.handleFormInputChange(event as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" block
                                        onClick={() => this.doLogin()}>
                                        <FontAwesomeIcon icon={faSignInAlt} /> Log in
                                    </Button>
                                </Form.Group>
                            </Form>

                            <Alert variant="danger"
                                className={this.state.message ? '' : 'd-none'}>
                                {this.state.message}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }
}
