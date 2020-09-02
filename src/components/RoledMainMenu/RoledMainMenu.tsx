import React from 'react';
import { MainMenuItem, MainMenu } from '../MainMenu/MainMenu';

interface RoledMainmenuProperties {
    role: 'user' | 'administrator' | 'visitor';
}

export default class RoledMainmenu extends React.Component<RoledMainmenuProperties> {

    render() {
        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visitor': items = this.getVisitorMenuItems(); break;
            case 'user': items = this.getUserMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
        }
        return <MainMenu items={items} />
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("Log out", "/user/logout/"),
        ];
    }

    getAdministratorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Dashboard", "/administrator/dashboard"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }

    getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("User log in", "/user/login/"),
            new MainMenuItem("Admin log in", "/administrator/login/"),
            new MainMenuItem("Register", "/user/register/"),
        ];
    }
}
