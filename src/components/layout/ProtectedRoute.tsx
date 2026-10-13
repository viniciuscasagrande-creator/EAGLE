import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * ProtectedRoute:
 * Acesso direto liberado temporariamente enquanto os ambientes segregados de
 * Administrador e Produtor (com perfis e visualizações distintas) estão em estruturação.
 */
export const ProtectedRoute: React.FC = () => {
  return <Outlet />;
};

