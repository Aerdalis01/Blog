import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { FormSection } from '../form/crud/formSection';
import { FormSectionUpdate } from '../form/crud/formSectionUpdate';


export const HomePage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (

    <section className="home-page">
      <div className="article">
        <div className="container-fluid">
          <div className="col d-flex align-items-center justify-content-center">
            <div className="article-content text-center">
              <h1 className="text-dark">Les news</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container-fluid">
          <div className="col d-flex align-items-center justify-content-center">
            <div className="section-content text-center">
              <h1 className="text-dark">Les sections</h1>
              <div className="">
                <Button variant="primary" onClick={handleShow}>
                  Créer une section
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Créer une section</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <FormSection />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>

                  </Modal.Footer>
                </Modal>
              </div>
              <div className="">

                <Button variant="primary" onClick={handleShow}>
                  Modifier une section
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modifier une section</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <FormSectionUpdate />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>

                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="galerie">
        <div className="container-fluid">
          <div className="col d-flex align-items-center justify-content-center">
            <div className="galerie-content text-center">
              <h1 className="text-dark">La Galerie</h1>
            </div>
          </div>
        </div>
      </div>


    </section>
  );

}