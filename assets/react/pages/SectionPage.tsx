
import { useEffect, useState } from 'react';
import { fetchSection } from '../services/sectionServices';
import { Section } from '../components/models/sectionInterface';
import { SectionDetail } from './SectionDetail';



export const SectionPage = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<number | null>(null);
  useEffect (() => {
    fetchSection().then(setSections).catch(console.error);
  }, []);

  const handleSectionClick = (id: number) => {
    setSectionId(id);
  }
  const handleBack = (id :number) => {
    setSectionId(null);
  }
  if (sectionId) {
    return <SectionDetail sectionId={sectionId} onBack={handleBack}/>
  }
  
  return (

    <section id='section' className="Section-page container-fluid d-flex flex-column align-items-center justify-content-around">
          {sections.map((section) => (
      <div key={section.id} onClick={()=>handleSectionClick(section.id)} style={{ cursor: 'pointer' }} className='card container-fluid article col-12'>
        <div className='card-body'>
              <div className="col d-flex align-items-center justify-content-center">
                <div className="article-content text-center">
                  <h1 className="card-title text-dark">{section.name} </h1>
                </div>
              </div>
          </div>
        </div>
              ))}
        
    </section >
  );

}