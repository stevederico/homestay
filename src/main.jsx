/**
 * Application entry point using Skateboard Application Shell Architecture
 *
 * Configures routing and initializes app with skateboard-ui framework.
 * Routes:
 * - /app/home - Stay listings grid with search
 * - /app/r/:id - Individual listing detail page
 *
 * @see {@link https://github.com/stevederico/skateboard|Skateboard Docs}
 */
import './assets/styles.css';
import { createSkateboardApp } from '@stevederico/skateboard-ui/App';
import Layout from '@stevederico/skateboard-ui/Layout';
import constants from './constants.json';
import HomeView from './components/HomeView.jsx';
import DetailView from './components/DetailView.jsx';
import AnalyticsProvider from './components/AnalyticsProvider.jsx';
import CommandMenu from './components/CommandMenu.jsx';

/**
 * App layout with global command menu overlay.
 *
 * Wraps the default skateboard-ui Layout and injects CommandMenu
 * so the Cmd+K shortcut is available on all authenticated routes.
 *
 * @returns {JSX.Element} Layout with command menu
 */
function AppLayout() {
  return (
    <>
      <CommandMenu />
      <Layout />
    </>
  );
}

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
  wrapper: AnalyticsProvider,
  overrides: { layout: AppLayout }
});
