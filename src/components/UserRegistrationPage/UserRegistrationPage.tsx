import React from 'react';
import { Container, Card, Form, Col, Alert, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse } from '../../api/api';
import { Link } from 'react-router-dom';

interface UserRegistrationPageState {
    isRegistrationComplete: boolean;
    message: string;
    formData: {
        email: string;
        password: string;
        name: string;
        surname: string;
    };
}

export default class UserRegistrationPage extends React.Component {
    state: UserRegistrationPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            message: '',
            formData: {
                email: '',
                password: '',
                name: '',
                surname: ''
            },
        };
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setRegistrationCompleteState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isRegistrationComplete: state,
        }));
    }

    private setFormDataField(fieldName: string, value: any) {
        const newFormData = Object.assign(this.state.formData, {
            [fieldName]: value,
        });

        this.setState(Object.assign(this.state, {
            formData: newFormData,
        }));
    }

    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let fieldName = '';

        switch (event.target.id) {
            case 'email': fieldName = 'email'; break;
            case 'password': fieldName = 'password'; break;
            case 'name': fieldName = 'name'; break;
            case 'surname': fieldName = 'surname'; break;
        }

        if (fieldName === '') {
            return;
        }

        this.setFormDataField(fieldName, event.target.value);
    }

    render() {
        return (
            <Container>
                <Col md={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUserPlus} /> User Registration
                            </Card.Title>

                            {
                                this.state.isRegistrationComplete ?
                                    this.renderRegistrationComplete() :
                                    this.renderRegistrationForm()
                            }

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

    private renderRegistrationComplete() {
        return (
            <>
                <p>The registration has been completed succesfully.</p>
                <p>
                    <Link to="/user/login/">Click here</Link> to go to the log in page.
                </p>
            </>
        );
    }

    private renderRegistrationForm() {
        return (
            <Form>
                <Row>
                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="email">E-mail:</Form.Label>
                            <Form.Control type="email" id="email"
                                value={this.state.formData.email}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>

                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="password">Password:</Form.Label>
                            <Form.Control type="password" id="password"
                                value={this.state.formData.password}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="name">Name:</Form.Label>
                            <Form.Control type="text" id="name"
                                value={this.state.formData.name}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>

                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="surname">Surname:</Form.Label>
                            <Form.Control type="text" id="surname"
                                value={this.state.formData.surname}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group>
                    <Button variant="primary" block
                        onClick={() => this.doRegister()}>
                        <FontAwesomeIcon icon={faUserPlus} /> Register
                    </Button>
                </Form.Group>
            </Form>
        );
    }

    private doRegister() {
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            name: this.state.formData.name,
            surname: this.state.formData.surname,
        };

        api('/auth/user/register', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessage('There was an error. Please try again.');
                    return;
                }

                if (res.data.statusCode !== undefined) {
                    switch (res.data.statusCode) {
                        case -6001: this.setMessage(res.data.message); break;
                    }
                    return;
                }

                this.setMessage('');
                this.setRegistrationCompleteState(true);
            });
    }
}
