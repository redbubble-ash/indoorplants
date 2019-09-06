import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import API from "../utils/API";
import ToDoItems from "../components/ToDoItems";
import "./style.css";

class MyPlantsMain extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      loggedIn: false,
      username: null,
      userPlants: {}
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
    this.getUserPlants();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get("/api/user/").then(response => {
      if (response.data.user) {
        console.log("Get User: There is a user saved in the server session: ");

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        });
      } else {
        console.log("Get user: no user");
        this.props.history.push("/");
      }
    });
  }

  getUserPlants = () => {
    API.getMyPlants()
      .then(res => {
        console.log(res.data);
        this.setState({
          ifResults: true,
          userPlants: res.data
        });
      })
      .catch(err => console.log(err));
  };

  logout(event) {
    event.preventDefault();
    axios
      .post("/api/user/logout")
      .then(response => {
        console.log(response.data);
        this.props.history.push("/");
      })
      .catch(error => {
        console.log("Logout error:" + error);
      });
  }

  render() {
    return (
      <Container>
        <Jumbotron style={{ marginBottom: "5%" }} fluid className="text-center">
          {/* User's plant if logged in: */}
          {this.state.loggedIn && <h1 className="text-primary">Your saved plants, {this.state.username}! </h1>}
        </Jumbotron>

        <div className="card-container">
          {this.state.userPlants.length ? (
            <Container>
              {this.state.userPlants.map(plant => {
                if (plant.plant.category && plant.plant.category[0] === "rare") {
                  return (
                    <ToDoItems
                      //plant.plant._id is the kind on plant in the plant collection
                      key={plant._id}
                      image={plant.plant.image}
                      alt={plant.plant.imageAlt}
                      //id is the specific user's plant id in userPlant collection
                      id={plant._id}
                      commonName={plant.plant.commonName}
                      scientificName={plant.plant.scientificName}
                    />
                  );
                } else {
                  return (
                    <ToDoItems
                      //plant.plant._id is the kind on plant in the plant collection
                      key={plant._id}
                      image={"http://www.costafarms.com/CostaFarms/" + plant.plant.image}
                      alt={plant.plant.imageAlt}
                      //id is the specific user's plant id in userPlant collection
                      id={plant._id}
                      commonName={plant.plant.commonName}
                      scientificName={plant.plant.scientificName}
                    />
                  );
                }
              })}
            </Container>
          ) : (
            <h2 className="text-center">No Plants Match Your Criteria</h2>
          )}
        </div>

        <div>
          <Button style={{ fontSize: "20px", marginBottom: "10%" }} onClick={this.logout} variant="primary" type="submit">
            Log out
          </Button>
        </div>
      </Container>
    );
  }
}

export default MyPlantsMain;
