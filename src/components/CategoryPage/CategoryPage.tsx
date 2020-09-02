import React from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faSearch } from '@fortawesome/free-solid-svg-icons';
import PhoneType from '../../types/PhoneType';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import { Redirect, Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';
import RoledMainmenu from '../RoledMainMenu/RoledMainMenu';

interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    phones?: PhoneType[];
    message: string;
    filters: {
        keywords: string;
        os: "iOS" | "Windows" | "Android" | "Blackberry";
        ramSize: number;
        storageSize: number;
        screenSize: number;
        order: "name asc" | "name desc";
    };
}

interface PhoneDto {
    phoneId?: number;
    name?: string;
    os?: "Android" | "iOS" | "Windows" | "Blackberry";
    ramSize?: number;
    storageSize?: number;
    screenSize?: number;
    description?: string;
    phonePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;
    }[],
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            filters: {
                keywords: '',
                os: "Windows",
                ramSize: 4,
                storageSize: 32,
                screenSize: 1,
                order: "name asc"
            }
        };
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login/" />
            );
        }

        return (
            <Container>
                <RoledMainmenu role="user"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faBoxOpen} /> {this.state.category?.name}
                        </Card.Title>
                        {this.printOptionalMessage()}

                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>

                            <Col xs="12" md="8" lg="9">
                                {this.showPhones()}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private filterRamChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            ramSize: Number(event.target.value),
        }));
    }

    private filterStorageChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            storageSize: Number(event.target.value),
        }));
    }

    private filterScreenChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            screenSize: Number(event.target.value),
        }));
    }

    private filterOsChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            os: event.target.value,
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private applyFilters() {
        this.getCategoryData();
    }

    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Search keywords:</Form.Label>
                    <Form.Control type="text" id="keywords"
                        value={this.state.filters.keywords}
                        onChange={(e) => this.filterKeywordsChanged(e as any)} />
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="ramSize">Ram Size:</Form.Label>
                            <Form.Control type="number" id="ramSize"
                                value={this.state.filters.ramSize}
                                onChange={(e) => this.filterRamChanged(e as any)} />
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="storageSize">Storage Size:</Form.Label>
                            <Form.Control type="number" id="storageSize"
                                value={this.state.filters.storageSize}
                                onChange={(e) => this.filterStorageChanged(e as any)} />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="screenSize">Screen Size:</Form.Label>
                    <Form.Control type="number" id="screenSize"
                        value={this.state.filters.screenSize}
                        onChange={(e) => this.filterScreenChanged(e as any)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="os">Operating System:</Form.Label>
                    <Form.Control as="select" id="os"
                        value={this.state.filters.os}
                        onChange={(e) => this.filterOsChanged(e as any)}>
                        <option value="iOS">iOS</option>
                        <option value="Windows">Windows</option>
                        <option value="Android">Android</option>
                        <option value="Blackberry">Blackberry</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="os">Sort Order:</Form.Label>
                    <Form.Control as="select" id="sortOrder"
                        value={this.state.filters.order}
                        onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" block onClick={() => this.applyFilters()}>
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    private showPhones() {
        if (this.state.phones?.length === 0) {
            return (
                <div>There are no phones in this category.</div>
            );
        }

        return (
            <Row>
                {this.state.phones?.map(this.singlePhone)}
            </Row>
        );
    }

    private singlePhone(phone: PhoneType) {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Header>
                            <img alt={phone.name}
                                src={ApiConfig.PHOTO_PATH + 'small/' + phone.imageUrl}
                                className="w-100"
                            />
                        </Card.Header>
                        <Card.Title as="p">
                            <strong>{phone.name}</strong>
                        </Card.Title>
                        <Card.Text>
                            Cena: {phone.price}
                        </Card.Text>
                        <Card.Text>
                            Operativni Sistem:
                            {phone.os}
                        </Card.Text>
                        <Link to={`/phone/${phone.phoneId}`}
                            className="btn btn-primary btn-block btn-sm">
                            Open phone page
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }
        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        );
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setPhones(phones: PhoneType[]) {
        this.setState(Object.assign(this.state, {
            phones: phones,
        }));
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }

        this.getCategoryData();
    }


    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLogginState(false);
                }

                if (res.status === 'error') {
                    return this.setMessage('Request error, refresh the page.')
                }

                const categoryData: CategoryType = {
                    categoryId: res.data.categoryId,
                    name: res.data.name,
                };
                this.setCategoryData(categoryData);
            });

        api('api/phone/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            os: this.state.filters.os,
            storageSize: this.state.filters.storageSize,
            ramSize: this.state.filters.ramSize,
            screenSize: this.state.filters.screenSize,
            priceMin: 1,
            priceMax: Number.MAX_SAFE_INTEGER,
            orderBy: "name",
            orderDirection: "ASC",
        })
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLogginState(false);
                }

                if (res.status === 'error') {
                    return this.setMessage('Request error. Please try to refresh the page.');
                }

                if (res.data.statusCode === 0) {
                    this.setMessage('');
                    this.setPhones([]);
                    return;
                }

                const phones: PhoneType[] =
                    res.data.map((phone: PhoneDto) => {
                        const object: PhoneType = {
                            phoneId: phone.phoneId,
                            name: phone.name,
                            os: phone.os,
                            ramSize: phone.ramSize,
                            storageSize: phone.storageSize,
                            screenSize: phone.screenSize,
                            description: phone.description,
                            imageUrl: '',
                            price: 0,
                        };

                        if (phone.photos !== undefined && phone.photos?.length > 0) {
                            object.imageUrl = phone.photos[phone.photos?.length - 1].imagePath;
                        }

                        if (phone.phonePrices !== undefined && phone.phonePrices?.length > 0) {
                            object.price = phone.phonePrices[phone.phonePrices?.length - 1].price;
                        }

                        return object;
                    });
                this.setPhones(phones);
            });
    }
}
