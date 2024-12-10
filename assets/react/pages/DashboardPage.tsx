import React, { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar"; 
import { Content } from "../components/dashboard/Content"; 

export const DashboardPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  return (
    <div id="dashboard" className="dashboard-container d-flex">
      <Sidebar onSectionChange={handleSectionChange} />
      
      <Content section={currentSection} />
    </div>
  );
};