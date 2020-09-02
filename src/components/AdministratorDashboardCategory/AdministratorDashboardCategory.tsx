import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainmenu from '../RoledMainMenu/RoledMainMenu';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';


interface AdministratorDashboardCategoryState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];

}

class AdministratorDashboardCategory extends React.Component {
    state: AdministratorDashboardCategoryState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],
        };
    }

    componentWillMount() {
        this.getCategories();
    }

    componentWillUpdate() {
        this.getCategories();
    }

    private getCategories() {
        api('/api/category', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            const data: ApiCategoryDto[] = res.data;

            const categories: CategoryType[] = data.map(category => ({
                categoryId: category.categoryId,
                name: category.name,
            }));

            this.setStateCategories(categories);
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateCategories(categories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            categories: categories,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RoledMainmenu role="administrator" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Categories
                        </Card.Title>
                        <Table hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.categories.map(category => (
                                    <tr>
                                        <td className="text-right">{ category.categoryId }</td>
                                        <td>{ category.name }</td>                                   
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default AdministratorDashboardCategory;
