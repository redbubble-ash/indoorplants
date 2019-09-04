// Feature
//   map logic to pass data from database
//   sticky top component get the title name from discover main
//   list item component
//   Sticky bottom navbar component

import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import API from "../utils/API";
import ListItems from "../components/ListItems";

class Plants extends Component {
  state = {
    plants: []
  };

  componentDidMount() {
    this.getPlants();
  }

  getPlants = () => {
    API.getPlants(this.props.category)
      .then(res =>
        this.setState({
          plants: res.data
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1 className="text-center">
                <strong>Indoor Plants</strong>
              </h1>
              <h2 className="text-center">Discover new plants!</h2>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <div>
              {this.state.plants.length ? (
                <Container style={{ marginBottom: "5%" }}>
                  {this.state.plants.map(plant => {
                    if (plant.category && plant.category[0] === "rare") {
                      return <ListItems key={plant._id} images={plant.image} commonName={plant.commonName} scientificName={plant.scientificName} description={plant.fullDescription} title={plant.title} id={plant._id} />;
                    } else {
                      return <ListItems key={plant._id} images={"http://www.costafarms.com/CostaFarms/" + plant.image} commonName={plant.commonName} scientificName={plant.scientificName} description={plant.fullDescription} title={plant.title} id={plant._id} />;
                    }
                  })}
                </Container>
              ) : (
                <h2 className="text-center">No Plants Match Your Criteria</h2>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Plants;
