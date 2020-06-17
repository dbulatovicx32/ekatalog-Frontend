import React from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';

interface HomePageState {
  isUserLoggedIn: boolean;
  categories: CategoryType[];
}

interface CategoryDto {
  categoryId: number;
  name: string;
}

export default class HomePage extends React.Component {
  state: HomePageState;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      isUserLoggedIn: true,
      categories: [],
    };
  }

  private setUserLoggedInState(state: boolean) {
    this.setState(Object.assign(this.state, {
      isUserLoggedIn: state,
    }));
  }

  private setCategories(categories: CategoryType[]) {
    this.setState(Object.assign(this.state, {
      categories: categories,
    }));
  }

  render() {
    if (this.state.isUserLoggedIn === false) {
      return (
        <Redirect to="/user/login/" />
      );
    }

    return (
      <Container>
        <Card>
          <Card.Body>
            <Card.Title>
              <FontAwesomeIcon icon={ faHome } /> Home Page
            </Card.Title>
            <Row>
              { this.state.categories.map(this.renderSingleCategory) }
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  private renderSingleCategory(category: CategoryType) {
    return (
      <Col xs="12" sm="6" md="4" lg="3">
        <Card className="mt-3">
          <Card.Body>
            <Card.Title as="p">
              <strong>
                { category.name }
              </strong>
            </Card.Title>
            <Link to={ `category/${ category.categoryId }/` }
                  className="btn btn-sm btn-primary btn-block">
              Click to open
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  }

  private getCategories() {
    api('/api/category/', 'get', {})
    .then((res: ApiResponse) => {
      if (res.status === 'error' || res.status === 'login') {
        this.setUserLoggedInState(false);
        return;
      }
      this.storeCategoriesIntoTheState(res.data);
    });
  }

  private storeCategoriesIntoTheState(apiCategories: CategoryDto[]) {
    if (!apiCategories || apiCategories.length === 0) {
      this.setCategories([]);
      return;
    }

    const categories: CategoryType[] = apiCategories.map(apiCategory => {
      return {
        categoryId: apiCategory.categoryId,
        name: apiCategory.name,
      };
    });
    this.setCategories(categories);
  }

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate() {
    this.getCategories();
  }
}
