/*
Page for singe building information selected from the main table

*/

import React from 'react';
import { Alert, Glyphicon, Button, Modal } from 'react-bootstrap';
import CalcPointAddForm from "./CalcPointAddForm";
import CalcPointEditForm from './CalcPointEditForm';

export default class Building extends React.Component {
  constructor(props) {
    super(props);

    this.showAddCalcPointModal = this.showAddCalcPointModal.bind(this);
    this.hideCalcPointAddModal = this.hideCalcPointAddModal.bind(this);
    this.addCalcPoint = this.addCalcPoint.bind(this);

    this.submitEditCalcPoint = this.submitEditCalcPoint.bind(this);
    this.hideCalcPointEditModal = this.hideCalcPointEditModal.bind(this);
    this.showCalcPointEditModal = this.showCalcPointEditModal.bind(this);

    this.showCalcPointDeleteModal = this.showCalcPointDeleteModal.bind(this);
    this.hideCalcPointDeleteModal = this.hideCalcPointDeleteModal.bind(this);
    this.cofirmDeleteCalcPoint = this.cofirmDeleteCalcPoint.bind(this);
    
  }

  componentDidMount() {
    this.props.mappedfetchBuildingById(this.props.params.id);
  }

  showAddCalcPointModal() {
    this.props.mappedShowCalcPointAddModal();
  }

  hideCalcPointAddModal() {
    this.props.mappedHideCalcPointAddModal();
  }

  addCalcPoint(e) {
    e.preventDefault();
    const editForm = document.getElementById('CalcPointAddForm');
    if (editForm.shortDesc.value !== "") {

      const data = new FormData();
      data.append('shortDesc', editForm.shortDesc.value);
      data.append('longDesc', editForm.longDesc.value);
      data.append('parent', this.props.params.id);

      this.props.mappedAddCalcPoint(data);
    }
    else {
      return;
    }
  }

  // edits
  showCalcPointEditModal(calcPointToEdit) {
    this.props.mappedShowCalcPointEditModal(calcPointToEdit);
  }

  hideCalcPointEditModal() {
    this.props.mappedHideCalcPointEditModal();
  }

  submitEditCalcPoint(e) {
    e.preventDefault();
    const cpEditForm = document.getElementById('CalcPointEditForm');
    if (cpEditForm.shortDesc.value !== "") {
      const data = new FormData();
      data.append('id', cpEditForm.id.value);
      data.append('shortDesc', cpEditForm.shortDesc.value);
      data.append('longDesc', cpEditForm.longDesc.value);
      this.props.mappedEditCalcPoint(data);
    }
    else {
      return;
    }

  }

  hideCalcPointDeleteModal() {
    this.props.mappedHideCalcPointDeleteModal();
  }

  showCalcPointDeleteModal(calcPointToDelete) {
    this.props.mappedShowCalcPointDeleteModal(calcPointToDelete);
  }

  cofirmDeleteCalcPoint() {
    this.props.mappedDeleteCalcPoint(this.props.mappedBuildingState.calcPointToDelete);
  }

  render() {

    // these values changes according to the state - keep that in mind!
    const buildingState = this.props.mappedBuildingState;
    const calcPointToEdit = buildingState.calcPointToEdit;
    const calcPointToAdd = buildingState.calcPointToAdd;
    const calcPoints = buildingState.calcPoints;

    return (
      <div className="buildingDetail">
        <h2>Rakennuksen tiedot</h2>
        {!buildingState.building && buildingState.isFetching &&
          <div>
            <p>Ladataan....</p>
          </div>
        }
        {buildingState.building && !buildingState.isFetching &&
          <div>
            <h3>{buildingState.building.todoText}</h3>
            <p><b>Rakennuksen lisätieto: </b>{buildingState.building.todoDesc}</p>
            <p><b>Rakennuksen tyyppi: </b>{buildingState.building.buildingType}</p>
            <p><b>Rakennuksen ID: </b>{buildingState.building._id}</p>

            <p>Lisää uusi mittauspaikka: <Button type="button" className="btn btn-primary" onClick={this.showAddCalcPointModal}><Glyphicon glyph="pencil" /></Button></p>

            {buildingState.building.calcPoints &&
              <table className="table booksTable">
                <thead>
                  <tr><th>Mittauspaikan nimi</th><th>Lisätieto</th><th className="textCenter">Mittaustulokset</th><th className="textCenter">Muokkaa mittauspaikkaa</th><th className="textCenter">Poista mittauspaikka</th></tr>
                </thead>
                <tbody>
                  {calcPoints.map((calcPoint, i) => <tr key={i}>
                    <td>{calcPoint.shortDesc}</td>
                    <td>{calcPoint.longDesc}</td>
                    <td>Loopppaa mittaustulokset ID:lle: {calcPoint._id}</td>
                    <td className="textCenter"><Button onClick={() => this.showCalcPointEditModal(calcPoint)} bsStyle="primary" bsSize="xsmall"><Glyphicon glyph="edit" /></Button></td>
                    <td className="textCenter"><Button onClick={() => this.showCalcPointDeleteModal(calcPoint)} bsStyle="danger" bsSize="xsmall"><Glyphicon glyph="trash" /></Button></td>


                    {/* CONTINUE FROM HERE: implement edit and delete for calc points + then logic to add the actual results. <td className="textCenter"><Button onClick={() => this.showEditModal(building)} bsStyle="info" bsSize="xsmall"><Glyphicon glyph="pencil" /></Button></td>
                  <td className="textCenter"><Link to={`/${building._id}`}>Lisätiedot</Link> </td>
                  <td className="textCenter"><Button onClick={() => this.showDeleteModal(building)} bsStyle="danger" bsSize="xsmall"><Glyphicon glyph="trash" /></Button></td> */}
                  </tr>)
                  }
                </tbody>
              </table>
            }




            {/*Add new calc point with null id?*/}
            {/* <p><Button onClick={() => this.openCPModal()} bsStyle="new" bsSize="xsmall"><Glyphicon glyph="pencil" /></Button></p> */}



            {/*TODO: jatka tästä, ao:n pitäisi siis muokata valittuja calc pointteja, lisäys uupuu
          
          looppaa läpi olemassaolevien calcpointtien ja näytä editit niille ao. riveillä.*/}
            {/* <p><Button onClick={() => this.showCalcPointEditModal(buildingState.building.calcPoint)} bsStyle="info" bsSize="xsmall"><Glyphicon glyph="pencil" /></Button></p> */}


            {/* Modal for adding calc point*/}
            <Modal
              show={buildingState.addCalcPointModal}
              onHide={this.hideCalcPointAddModal}
              container={this}
              aria-labelledby="contained-modal-title"
            >

              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Lisää uusi mittauspaikka</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-md-12">
                  {buildingState.addCalcPointModal &&
                    <CalcPointAddForm addCalcPoint={this.addCalcPoint} />

                  }

                  {calcPointToAdd && buildingState.isFetching &&
                    <Alert bsStyle="info">
                      <strong>Päivitetään...... </strong>
                    </Alert>
                  }
                  {calcPointToAdd && !buildingState.isFetching && buildingState.error &&
                    <Alert bsStyle="danger">
                      <strong>Epäonnistui. {buildingState.error} </strong>
                    </Alert>
                  }
                  {calcPointToAdd && buildingState.successMsg &&
                    <Alert bsStyle="success">
                      Kohde <strong> {calcPointToAdd.todoText} </strong>{buildingState.successMsg}
                    </Alert>
                  }
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.hideCalcPointAddModal}>Sulje</Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for editing calc point*/}
            <Modal
              show={buildingState.showCalcPointEditModal}
              onHide={this.hideCalcPointEditModal}
              container={this}
              aria-labelledby="contained-modal-title"
            >

              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Muokkaa mittauspaikkaa</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-md-12">

                  {calcPointToEdit && buildingState.showCalcPointEditModal &&
                    <CalcPointEditForm calcPointData={calcPointToEdit} calcPointToEdit={this.submitEditCalcPoint} />
                  }

                  {calcPointToEdit && buildingState.isFetching &&
                    <Alert bsStyle="info">
                      <strong>Päivitetään...... </strong>
                    </Alert>
                  }
                  {calcPointToEdit && !buildingState.isFetching && buildingState.error &&
                    <Alert bsStyle="danger">
                      <strong>Epäonnistui. {buildingState.error} </strong>
                    </Alert>
                  }
                  {calcPointToEdit && buildingState.successMsg &&
                    <Alert bsStyle="success">
                      <strong> {calcPointToEdit.shortDesc} </strong>{buildingState.successMsg}
                    </Alert>
                  }
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.hideCalcPointEditModal}>Sulje</Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for deleting building */}
            <Modal
              show={buildingState.showCalcPointDeleteModal}
              onHide={this.hideCalcPointDeleteModal}
              container={this}
              aria-labelledby="contained-modal-title"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title">Poista mittauspaikka</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {buildingState.calcPointToDelete && !buildingState.error && !buildingState.isFetching &&
                  <Alert bsStyle="warning">
                    Oletko varma, että haluat poistaa mittauspaikan <strong>{buildingState.calcPointToDelete.shortDesc} </strong> ?
              </Alert>
                }
                {buildingState.calcPointToDelete && buildingState.error &&
                  <Alert bsStyle="warning">
                    Epäonnistui. <strong>{buildingState.error} </strong>
                  </Alert>
                }

                {buildingState.calcPointToDelete && !buildingState.error && buildingState.isFetching &&
                  <Alert bsStyle="success">
                    <strong>Poistetaan.... </strong>
                  </Alert>
                }

                {!buildingState.calcPointToDelete && !buildingState.error && !buildingState.isFetching &&
                  <Alert bsStyle="success">
                    Mittauspaikka <strong>{buildingState.successMsg} </strong>
                  </Alert>
                }
              </Modal.Body>
              <Modal.Footer>
                {!buildingState.successMsg && !buildingState.isFetching &&
                  <div>
                    <Button onClick={this.cofirmDeleteCalcPoint}>Kyllä</Button>
                    <Button onClick={this.hideCalcPointDeleteModal}>Ei</Button>
                  </div>
                }
                {buildingState.successMsg && !buildingState.isFetching &&
                  <Button onClick={this.hideCalcPointDeleteModal}>Sulje</Button>
                }
              </Modal.Footer>
            </Modal>
          </div>
        }
      </div>
    );
  }
}