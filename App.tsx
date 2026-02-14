import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Academy from './pages/Academy';
import Marketing from './pages/Marketing';
import Foods from './pages/Foods';
import Tech from './pages/Tech';
import Learn from './pages/Learn';
import Jobs from './pages/Jobs';
import Interview from './pages/Interview';
import Events from './pages/Events';
import Community from './pages/Community';
import Referral from './pages/Referral';
import JobMela from './pages/JobMela';
import Meetups from './pages/Meetups';
import Admin from './pages/Admin';
import AdminSetup from './pages/AdminSetup';
import Sap from './pages/Sap';
import SapCommunity from './pages/SapCommunity';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Parent Home */}
          <Route path="/" element={<Home />} />
          
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