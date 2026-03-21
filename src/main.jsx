/**
 * Application entry point using Skateboard Application Shell Architecture
 *
 * Configures routing and initializes app with skateboard-ui framework.
 * Routes:
 * - /app/home - Rental listings grid with search
 * - /app/r/:id - Individual listing detail page
 *
 * @see {@link https://github.com/stevederico/skateboard|Skateboard Docs}
 */
import './assets/styles.css';
import { createSkateboardApp } from '@stevederico/skateboard-ui/App';
import constants from './constants.json';
import HomeView from './components/HomeView.jsx';
import DetailView from './components/DetailView.jsx';
import AnalyticsProvider from './components/AnalyticsProvider.jsx';

/**
 * Application route configuration
 * @type {Array<{path: string, element: JSX.Element}>}
 */
const appRoutes = [
  { path: 'home', element: <HomeView /> },
  { path: 'r/:id', element: <DetailView /> }
];

/**
 * Initialize and mount Skateboard app
 */
createSkateboardApp({
  constants,
  appRoutes,
  defaultRoute: 'home',
  wrapper: AnalyticsProvider
});
