import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import PhoneType from '../../types/PhoneType';
import ApiPhoneDto from '../../dtos/ApiPhoneDto';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import CategoryType from '../../types/CategoryType';

interface AdministratorDashboardPhoneState {
    isAdministratorLoggedIn: boolean;
    phones: PhoneType[];
    categories: CategoryType[];


    addModal: {
        visible: boolean;
        message: string;

        name: string;
        category_id: number;
        description: string;
        os: "Android" | "iOS" | "Windows" | "Blackberry";
        ram_size: number;
        storage_size: number;
        screen_size: number;
        price: number;
        networks: {
            use: number;
            networkId: number;
            name: string;
            band: string;
        }[];
    };

    editModal: {
        message: string;
        visible: boolean;

        name: string;
        category_id: number;
        description: string;
        os: "Android" | "iOS" | "Windows" | "Blackberry";
        ram_size: number;
        storage_size: number;
        screen_size: number;
        price: number;
        networks: {
            use: number;
            networkId: number;
            name: string;
            band: string;
        }[];
    };
}

interface NetworkBaseType {
    networkId: number;
    name: string;
}

export default class AdministratorDashboardPhone extends React.Component {
    state: AdministratorDashboardPhoneState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            phones: [],
            categories: [],

            addModal: {
                visible: false,
                message: '',
                name: '',

                category_id: 1,
                description: '',
                os: 'Android',
                ram_size: 1,
                storage_size: 1,
                screen_size: 1,
                price: 1,
                networks: [],
            },

            editModal: {
                visible: false,
                message: '',
                name: '',

                category_id: 1,
                description: '',
                os: 'Android',
                ram_size: 1,
                storage_size: 1,
                screen_size: 1,
                price: 1,
                networks: [],
            },


        };
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            }),
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    private setAddmodalNetworkUse(networkId: number, use: boolean) {
        const addNetworks: { networkId: number; use: number; }[] = [...this.state.addModal.networks];
        for (const network of addNetworks) {
            if (network.networkId === networkId) {
                network.use = use ? 1 : 0;
                break;
            }
        }

        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                networks: addNetworks,
            }),
        ));
    }

    private setAddmodalNetworkValue(networkId: number, band: string) {
        const addNetworks: { networkId: number; band: string; }[] = [...this.state.addModal.networks];
        for (const network of addNetworks) {
            if (network.networkId === networkId) {
                network.band = band;
                break;
            }
        }

        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                networks: addNetworks,
            }),
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            }),
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    componentDidMount() {
        this.getCategories();
        this.getPhones();
    }

    private async getNetworksByCategoryId(categoryId: number): Promise<NetworkBaseType[]> {
        return new Promise(resolve => {
            api('/api/network/?filter=categoryId||$eq||' + categoryId + '/', 'get', {}, 'administrator')
                .then((res: ApiResponse) => {
                    if (res.status === 'error' || res.status === 'login') {
                        this.setLogginState(false);
                        resolve([]);
                    }
                    const networks: NetworkBaseType[] = res.data.map((item: any) => ({
                        networkId: item.networkId,
                        name: item.name,
                    }));
                    resolve(networks);
                })
        })
    }

    private getCategories() {
        api('/api/category', 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }
                this.putCategoriesInState(res.data);
            });
    }




    private putCategoriesInState(data?: ApiCategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
            };
        });

        this.setState(Object.assign(this.state, {
            categories: categories,
        }));
    }

    private getPhones() {
        api('/api/phone/?join=phoneNetworks&join=networks&join=phonePrices&join=photos&join=category', 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                const data: ApiPhoneDto[] = res.data;

                const phones: PhoneType[] = data.map(phone => ({
                    phoneId: phone.phoneId,
                    name: phone.name,
                    os: phone.os,
                    ramSize: phone.ramSize,
                    storageSize: phone.storageSize,
                    screenSize: phone.screenSize,
                    description: phone.description,
                    imageUrl: phone.photos[0].imagePath,
                    price: phone.phonePrices[phone.phonePrices.length - 1].price,
                    phoneNetworks: phone.phoneNetworks,
                    networks: phone.networks,
                    phonePrices: phone.phonePrices,
                    photos: phone.photos,
                    category: phone.category,
                }));

                this.setStatePhones(phones);
            });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStatePhones(phones: PhoneType[]) {
        this.setState(Object.assign(this.state, {
            phones: phones,
        }));
    }

    private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setAddModalNumberFieldState('categoryId', event.target.value);
        const networks = await this.getNetworksByCategoryId(this.state.addModal.category_id);

        const stateNetworks = networks.map(network => ({
            networkId: network.networkId,
            name: network.name,
            value: '',
            use: 0,
        }));

        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                networks: stateNetworks,
            })
        ));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="administrator" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Phones
                        </Card.Title>

                        <Table hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th colSpan={7}></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={() => this.showAddModal()}>
                                            <FontAwesomeIcon icon={faPlus} /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>OS</th>
                                    <th>Ram Size</th>
                                    <th>Storage Size</th>
                                    <th>Screen Size</th>
                                    <th className="text-right">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.phones.map(phone => (
                                    <tr>
                                        <td className="text-right">{phone.phoneId}</td>
                                        <td>{phone.name}</td>
                                        <td>{phone.category?.name}</td>
                                        <td>{phone.os}</td>
                                        <td>{phone.ramSize}</td>
                                        <td>{phone.storageSize}</td>
                                        <td>{phone.screenSize}</td>
                                        <td className="text-right">{phone.price}</td>
                                        <td className="text-center">

                                            <Button variant="info" size="sm"
                                                onClick={() => this.showEditModal(phone)}>
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                        </Button>
                                        </td>
                                    </tr>
                                ), this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal centered show={this.state.addModal.visible}
                    onHide={() => this.setAddModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new phone
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="new-name">Name</Form.Label>
                            <Form.Control type="text" id="new-name"
                                value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-categoryId">Category</Form.Label>
                            <Form.Control id="new-categoryId" as="select"
                                value={this.state.addModal.category_id.toString()}
                                onChange={(e) => this.setAddModalNumberFieldState('category_id', e.target.value)}>
                                {this.state.categories.map(category => (
                                    <option value={category.categoryId?.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-os">OS</Form.Label>
                            <Form.Control id="new-os" as="select"
                                value={this.state.addModal.os}
                                onChange={(e) => this.setAddModalNumberFieldState('os', e.target.value)}>
                                <option value="iOS">iOS</option>
                                <option value="Windows">Windows</option>
                                <option value="Android">Android</option>
                                <option value="Blackberry">Blackberry</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-desc">Description</Form.Label>
                            <Form.Control type="text" id="new-desc" as="textarea"
                                value={this.state.addModal.description}
                                onChange={(e) => this.setAddModalStringFieldState('description', e.target.value)}
                                rows={10}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-ram">Ram Size</Form.Label>
                            <Form.Control type="number" id="new-ram"
                                value={this.state.addModal.ram_size}
                                onChange={(e) => this.setAddModalNumberFieldState('ram_size', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-storage">Storage Size</Form.Label>
                            <Form.Control type="number" id="new-storage"
                                value={this.state.addModal.storage_size}
                                onChange={(e) => this.setAddModalNumberFieldState('storage_size', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-screen">Screen Size</Form.Label>
                            <Form.Control type="number" id="new-screen"
                                value={this.state.addModal.screen_size}
                                onChange={(e) => this.setAddModalNumberFieldState('screen_size', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Add phone
                            </Button>
                        </Form.Group>

                        <div>
                            {this.state.addModal.networks.map(this.printAddModalNetworkInput, this)}
                        </div>

                        {this.state.addModal.message ? (
                            <Alert variant="danger" value={this.state.addModal.message} />
                        ) : ''}
                    </Modal.Body>
                </Modal>

            </Container>
        );
    }

    private printAddModalNetworkInput(network: any) {
        return (
            <Form.Group>
                <Row>
                    <Col xs="4" sm="2">
                        <input type="checkbox" value="1" checked={network.use === 1}
                            onChange={(e) => this.setAddmodalNetworkUse(network.networkId, e.target.checked)} />
                    </Col>
                    <Col xs="8" sm="5">
                        {network.name}
                    </Col>
                    <Col xs="12" sm="5">
                        <Form.Control type="text" value={network.value}
                            onChange={(e) => this.setAddmodalNetworkValue(network.networkId, e.target.value)} />
                    </Col>
                </Row>
            </Form.Group>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('message', '');
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('imagePath', '');
        this.setAddModalNumberFieldState('parentPhoneId', 'null');
        this.setAddModalVisibleState(true);
    }

    private doAdd() {
        api('/api/phone/', 'post', {
        }, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                if (res.status === 'error') {
                    this.setAddModalStringFieldState('message', res.data.toString());
                    return;
                }

                this.getPhones();
                this.setAddModalVisibleState(false);
            });
    }

    private showEditModal(phone: PhoneType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('name', String(phone.name));
        this.setEditModalNumberFieldState('phoneId', phone.phoneId ? phone.phoneId?.toString() : 'null');
        this.setEditModalVisibleState(true);
    }

}
