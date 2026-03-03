import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ThankYouPage from './pages/ThankYouPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { NotFoundPage } from './components/NotFoundPage';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage
      },
      {
        path: 'thank-you',
        Component: ThankYouPage
      },
      {
        path: 'services/:serviceSlug',
        Component: ServiceDetailPage
      },
      {
        path: 'privacy-policy',
        Component: PrivacyPolicyPage
      },
      {
        path: 'terms-of-service',
        Component: TermsOfServicePage
      },
      {
        path: '*',
        Component: NotFoundPage
      }
    ]
  }
]);