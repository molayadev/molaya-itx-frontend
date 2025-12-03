import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DIProvider } from '@core/di';
import { configureServices } from '@app/di';
import { AppLayout } from '@shared/ui/components';
import { Home } from '@shared/ui/pages';
import { DesignSystemPage } from '@shared/ui/pages/DesignSystemPage';
import { ProductListPage } from '@features/products/infrastructure/ui/pages';
import '@shared/ui/styles/global.css';

const services = configureServices();

const App = () => {
  return (
    <DIProvider services={services}>
      <BrowserRouter>
        <Routes>
          {/* Routes with layout (AppHeader) */}
          <Route element={<AppLayout />}>
            <Route path="/products" element={<ProductListPage />} />
            {/* Future routes: PDP, Cart, etc. */}
          </Route>

          {/* Routes without layout */}
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<DesignSystemPage />} />
        </Routes>
      </BrowserRouter>
    </DIProvider>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
