import './assets/styles.css';
import { createSkateboardApp } from '@stevederico/skateboard-ui/App';
import constants from './constants.json';
import HomeView from './components/HomeView.jsx';
import OtherView from './components/OtherView.jsx';
import DetailView from './components/DetailView.jsx';

const appRoutes = [
  { path: 'home', element: <HomeView /> },
  { path: 'r/:id', element: <DetailView /> },
  { path: 'other', element: <OtherView /> }
];

createSkateboardApp({
  constants,
  appRoutes,
  defaultRoute: 'home'
});
