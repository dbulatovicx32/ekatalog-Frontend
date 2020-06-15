import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';

export class MainMenuItem {
    link: string = '/';
    text: string = '';

    constructor(text: string, link: string) {
        this.link = link;
        this.text = text;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[],
}

interface MainMenuState {
    items: MainMenuItem[],
}

export class MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>) {
        super(props);

        this.state = {
            items: this.props.items,
        };
    }

    render() {
        return (
            <Container>
                <Nav variant="tabs">
                    <HashRouter>
                        {this.state.items.map(this.makeMenuItem)}
                    </HashRouter>
                </Nav>
            </Container>
        );
    }

    private makeMenuItem(item: MainMenuItem) {
        return <Link to={item.link} className="nav-link">
            {item.text}
        </Link>;
    }
}
