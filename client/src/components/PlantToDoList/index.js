import React from "react";
import Container from "react-bootstrap/Container";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Moment from "react-moment";

export function UserToDo(props) {
  const styleObj = {
    fontSize: "15px"
  };
  return (
    <Container style={{ marginBottom: "20%" }}>
      <h2 className="mt-2">Todo List</h2>
      <Row>
        <Col className="mx-2">
          <p className="mt-2">Water</p>
        </Col>
        <Col>
          <DatePicker selected={props.startDate} onChange={props.onChange} className="mt-2" />
        </Col>
        <Col>
          <Button variant="outline-primary" onClick={props.onClick} style={styleObj}>
            Complete
          </Button>
        </Col>
      </Row>
      <h2 className="mt-2">Next Water Date</h2>
      <Row>
        <Col className="mx-2">
          <Moment format="MM/DD/YYYY">{props.nextWaterDate}</Moment>
        </Col>
      </Row>
    </Container>
  );
}

export default UserToDo;
