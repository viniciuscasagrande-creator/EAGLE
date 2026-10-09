import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, informe seu e-mail e senha de acesso.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Erro ao comunicar com o servidor de autenticação. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('produtor@diskingressos.com.br');
    setPassword('disk@produtor2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#111827]/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-extrabold text-2xl shadow-xl shadow-blue-500/25 mb-3">
            D
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              DiskIngressos
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              EAGLE ONE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Portal Oficial de Operações e Gestão do Produtor
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-mail Corporativo do Produtor
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@produtora.com.br"
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Senha de Acesso
              </label>
              <a
                href="#esqueci-senha"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Para redefinir sua senha, entre em contato com o suporte da DiskIngressos ou acione seu gerente de contas.');
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-10 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-400">Lembrar este dispositivo</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Acessar Portal do Produtor</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill for Auditors */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Preencher credenciais de homologação</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Conexão Criptografada SSL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Keeper ERP Integrado
          </span>
        </div>
      </div>
    </div>
  );
};
