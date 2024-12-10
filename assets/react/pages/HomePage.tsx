import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { FormSection } from '../form/crud/formSection';



export const HomePage = () => {

  return (

    <section className="home-page container-fluid d-flex flex-column align-items-center justify-content-around">
      <div className='card container-fluid article col-12'>
        <div className='card-body'>
              <div className="col d-flex align-items-center justify-content-center">
                <div className="article-content text-center">
                  <h1 className="card-title text-dark">Les news</h1>
                  <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <a href="/news" className="btn btn-primary">Voir plus</a>
                </div>
              </div>
          </div>
        </div>
        <div className='card container-fluid article col-12'>
        <div className='card-body'>
              <div className="col d-flex align-items-center justify-content-center">
                <div className="article-content text-center">
                  <h1 className="card-title text-dark">Les sections</h1>
                  <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <a href="/news" className="btn btn-primary">Voir plus</a>
                </div>
              </div>
          </div>
        </div>
        <div className='card container-fluid article col-12'>
        <div className='card-body'>
              <div className="col d-flex align-items-center justify-content-center">
                <div className="article-content text-center">
                  <h1 className="card-title text-dark">La galerie</h1>
                  <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <a href="/news" className="btn btn-primary">Voir plus</a>
                </div>
              </div>
          </div>
        </div>

    </section >
  );

}