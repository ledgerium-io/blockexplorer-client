import React, { Component, Fragment } from "react";
import ValidatorCircle from "Components/ValidatorCircle";
import { Row, Card, CardBody,CardHeader, CardTitle, Button, Jumbotron, Badge } from "reactstrap";
import { Colxx, Separator } from "Components/CustomBootstrap";


export default class extends Component {

  render() {
    return (
      <Fragment>
        <Card>
          <CardBody>
            <ValidatorCircle/>
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}
