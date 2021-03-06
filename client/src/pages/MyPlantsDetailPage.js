import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Image from "react-bootstrap/Image";
import NavUser from "../components/NavUser";
import UserToDo from "../components/PlantToDoList";
import UserPlantsHistory from "../components/UserPlantsHistory";
import DetailPlant from "./DetailPlant/DetailPlant";
import API from "../utils/API";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import "./style.css";

class MyPlantsDetail extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: "todo",
      plantCare: {},
      startDate: new Date(),
      nextWaterDate: ""
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  componentDidMount() {
    this.getUserPlants();
  }

  getUserPlants = () => {
    API.getMyPlantDetail(this.props.match.params.plantId)
      .then(res => {
        console.log(res.data[0]);
        this.setState({
          ifResults: true,
          plantCare: res.data[0]
        });
      })
      .catch(err => console.log(err));
  }

  deleteUserPlant =(plantId)=>{
    API.deleteMyPlant(plantId)
    .then(res => {
      this.props.history.push("/myPlants");
    })
    .catch(err => console.log(err));
  }
  //when user pick date of water auto update next water time
  updateWater = () => {
    API.updateMyPlant({
      date: this.state.startDate,
      id: this.state.plantCare._id
    })
      .then(res => {
      this.updateNextWaterDate();
      })
      .then(res => {
        this.getUserPlants();
      })
      .catch(err => console.log(err));
  };

  calculatedNextWaterDate = () => {
    let lastWateredDate = this.state.startDate;
    let nextWaterDate = 0;
    nextWaterDate = moment(lastWateredDate, "YYYY-MM-DD HH:mm:mm");

    let waterRequirement = this.state.plantCare.plant.waterReq[0].toLowerCase();

    if (waterRequirement.indexOf("low") !== -1) {
      nextWaterDate.add(10, "days");
    } else if (waterRequirement.indexOf("medium") !== -1) {
      nextWaterDate.add(7, "days");
    } else if (waterRequirement.indexOf("moist") !== -1) {
      nextWaterDate.add(3, "days");
    }

    nextWaterDate = nextWaterDate.format("YYYY-MM-DD HH:mm:mm");
    this.setState({
      nextWaterDate: nextWaterDate
    });
  };

  updateNextWaterDate = () => {
    this.calculatedNextWaterDate();
    API.updateNextWaterDate({
      nextWaterDate: this.state.nextWaterDate,
      id: this.state.plantCare._id,
      recipient: this.state.plantCare.user.email,
      plantName: this.state.plantCare.plant.commonName
    })
    .catch(err => console.log(err));
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderTab = () => {
    if (this.state.currentTab === "todo") {
      return <UserToDo startDate={this.state.startDate} onChange={date => this.handleChange(date)} onClick={() => this.updateWater()} nextWaterDate={this.state.plantCare.nextWaterDate} />;
    } else if (this.state.currentTab === "history") {
      return <UserPlantsHistory wateredData={this.state.plantCare.wateredDates} />;
    } else if (this.state.currentTab === "DetailPlant") {
      return <DetailPlant />;
    }
  };

  render() {
    if (this.state.plantCare.plant == null) {
      return <p>Loading</p>;
    }
    return (
      <Container className="text-center">
        <div id="container">
          <Jumbotron style={{ backgroundColor: "transparent" }}>
            <h1>{this.state.plantCare.plant.commonName} </h1>
          </Jumbotron>
        </div>
        <Image rounded style={{ height: "450px" }} src={this.state.plantCare.plant.category && this.state.plantCare.plant.category[0] === "rare" ? this.state.plantCare.plant.image : "http://www.costafarms.com/CostaFarms/" + this.state.plantCare.plant.image} />

        <NavUser currentTab={this.state.currentTab} handleTabChange={this.handleTabChange} id={this.state.plantCare.plant._id} />
        {this.renderTab()}
        <Button style={{ backgroundColor: "transparent", width: "15%", fontSize: "20px" }} variant="primary" size="lg" className="mx-auto d-block" onClick={() => this.deleteUserPlant(this.state.plantCare._id)} >
          Delete Plant
        </Button>
      </Container>
    );
  }
}

export default withRouter(MyPlantsDetail);
