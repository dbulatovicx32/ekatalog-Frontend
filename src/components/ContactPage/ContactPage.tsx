import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import RoledMainmenu from '../RoledMainMenu/RoledMainMenu';

export default class ContactPage extends React.Component {
    render() {
        return (
            <Container>
                <RoledMainmenu role="user"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faPhone} /> Contact page
                        </Card.Title>
                        <Card.Text>Contact details will be show here.</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
