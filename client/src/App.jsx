// Main application entry point for BrandShield.ai
// Simplified – no authentication, direct flow to signup type selection and dashboard.

import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// UI components and pages
import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import BrandLibraryPage from './pages/BrandLibraryPage';
import NewSubmissionPage from './pages/NewSubmissionPage';
import ReviewWorkspacePage from './pages/ReviewWorkspacePage';
import ReviewerQueuePage from './pages/ReviewerQueuePage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import LegalPage from './pages/LegalPage';
import SignupTypePage from './pages/SignupTypePage';
import SignupDetailsPage from './pages/SignupDetailsPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PendingApprovalPage from './pages/PendingApprovalPage';

// -----------------------------------------------------------------------------
// Helper components
// -----------------------------------------------------------------------------

function LoadingScreen({ label = 'Opening the Ink Vault…' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

// Simple passthrough wrapper – retains layout without auth checks.
function Protected({ children }) {
  return children;
}

function PublicAccountRoute({ children }) {
  return children;
}

// 404 page
function NotFound() {
  return (
    <section className="page">
      <div className="empty-state">
        <p className="eyebrow">Page not found</p>
        <h2>That page is not in the vault.</h2>
        <p>Use the navigation to return to a workspace you have access to.</p>
      </div>
    </section>
  );
}

// Global error boundary – shows a friendly UI if the React tree crashes.
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <main className="loading-screen">
          <div className="panel" role="alert" style={{ maxWidth: 560 }}>
            <p className="eyebrow">Something interrupted the review</p>
            <h1 style={{ marginBottom: 12 }}>BrandShield.ai needs a refresh.</h1>
            <p className="muted" style={{ marginBottom: 18 }}>
              The interface hit an unexpected error. Your content and decisions are stored on the server, so nothing is lost.
              Reload to continue.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Reload BrandShield.ai
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// -----------------------------------------------------------------------------
// Application component – routing tree without login/auth.
// -----------------------------------------------------------------------------

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Entry point – choose account type */}
          <Route path="/" element={<SignupTypePage />} />
          <Route path="/signup/details" element={<SignupDetailsPage />} />
          {/* Additional demo pages */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pending" element={<PendingApprovalPage />} />

          {/* Wrapped routes – use AppShell for layout */}
          <Route element={<Protected><AppShell /></Protected>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new" element={<Protected><NewSubmissionPage /></Protected>} />
            <Route path="/queue" element={<Protected><ReviewerQueuePage /></Protected>} />
            <Route path="/library" element={<Protected><BrandLibraryPage /></Protected>} />
            <Route path="/insights" element={<Protected><InsightsPage /></Protected>} />
            <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
            <Route path="/submissions/:id" element={<ReviewWorkspacePage />} />
          </Route>

          {/* Legal page */}
          <Route path="/legal/:kind" element={<LegalPage />} />

          {/* Catch‑all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
