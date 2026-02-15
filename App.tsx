
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx'; // New Import
import Academy from './pages/Academy.tsx';
import Marketing from './pages/Marketing.tsx';
import Foods from './pages/Foods.tsx';
import Tech from './pages/Tech.tsx';
import Learn from './pages/Learn.tsx';
import PathDetail from './pages/PathDetail.tsx'; 
import Jobs from './pages/Jobs.tsx';
import Interview from './pages/Interview.tsx';
import Events from './pages/Events.tsx';
import Community from './pages/Community.tsx';
import Referral from './pages/Referral.tsx';
import JobMela from './pages/JobMela.tsx';
import Meetups from './pages/Meetups.tsx';
import Admin from './pages/Admin.tsx';
import AdminSetup from './pages/AdminSetup.tsx';
import Sap from './pages/Sap.tsx';
import SapCommunity from './pages/SapCommunity.tsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Parent Home */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> 
          
          {/* Divisions */}
          <Route path="/academy" element={<Academy />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/tech" element={<Tech />} />

          {/* Academy Sub-routes */}
          <Route path="/sap" element={<Sap />} />
          <Route path="/sap-community" element={<SapCommunity />} />
          
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/path/:slug" element={<PathDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/job-mela" element={<JobMela />} />
          
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
