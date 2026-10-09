import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Shield, Key, Bell, CheckCircle2, Save } from 'lucide-react';

export const ConfiguracoesProdutorPage: React.FC = () => {
  const { producer, user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Configurações & Dados Cadastrais
        </h1>
        <p className="text-sm text-slate-400">
          Dados da organização produtora, credenciais bancárias e usuários autorizados
        </p>
      </div>

      <div className="bg-[#2c2d33] border border-[#37393e] rounded-lg p-6 shadow-md space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#37393e]">
          <Building className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">
            Dados da Empresa Produtora
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Razão Social</label>
            <input
              type="text"
              readOnly
              value={producer.name}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Nome Fantasia</label>
            <input
              type="text"
              readOnly
              value={producer.tradeName || producer.name}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">CNPJ</label>
            <input
              type="text"
              readOnly
              value={producer.cnpj}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">E-mail Financeiro</label>
            <input
              type="text"
              readOnly
              value={producer.email}
              className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#37393e] space-y-4">
          <h4 className="font-bold text-white text-sm">Dados Bancários para Liquidação PIX</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Banco</label>
              <input
                type="text"
                readOnly
                value={producer.bankName}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Agência e Conta</label>
              <input
                type="text"
                readOnly
                value={`${producer.agency} / ${producer.account}`}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Chave PIX Oficial</label>
              <input
                type="text"
                readOnly
                value={producer.pixKey}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#232429] border border-[#37393e] rounded-lg text-xs text-slate-300 flex items-center justify-between">
          <span>Para alterar dados bancários ou CNPJ, abra uma solicitação na Central de Suporte para validação documental.</span>
        </div>
      </div>
    </div>
  );
};
