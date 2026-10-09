import React, { useState } from 'react';
import { X, Briefcase, CheckCircle2 } from 'lucide-react';

interface NovoPedidoCorporativoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (order: {
    companyName: string;
    cnpj: string;
    contactName: string;
    eventName: string;
    ticketQuantity: number;
    sector: string;
    totalAmount: number;
    paymentTerm: string;
  }) => Promise<void>;
}

export const NovoPedidoCorporativoModal: React.FC<NovoPedidoCorporativoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contactName, setContactName] = useState('');
  const [eventName, setEventName] = useState('Festival de Verão Curitiba 2026');
  const [ticketQuantity, setTicketQuantity] = useState(100);
  const [sector, setSector] = useState('Pista Premium VIP');
  const [totalAmount, setTotalAmount] = useState(25000);
  const [paymentTerm, setPaymentTerm] = useState('Faturado 15 DDL');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        companyName,
        cnpj,
        contactName,
        eventName,
        ticketQuantity: Number(ticketQuantity),
        sector,
        totalAmount: Number(totalAmount),
        paymentTerm,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2c2d33] border border-[#37393e] rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Novo Pedido Corporativo B2B</h3>
            <p className="text-xs text-slate-400">
              Venda em lote fechado com faturamento a prazo ou PIX direto
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">Empresa / Razão Social *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Grupo Volvo do Brasil"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">CNPJ *</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Contato Responsável *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Amanda Castro (RH)"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-300 font-semibold block mb-1">Evento Vinculado *</label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Quantidade de Ingressos *</label>
              <input
                type="number"
                required
                min={1}
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Setor do Ingresso *</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ex: Pista Premium VIP"
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Valor Total Faturado (R$) *</label>
              <input
                type="number"
                required
                min={100}
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Condição de Pagamento</label>
              <select
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
                className="w-full bg-[#202124] border border-[#37393e] rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="À vista PIX">À vista PIX</option>
                <option value="Faturado 15 DDL">Faturado 15 DDL</option>
                <option value="Faturado 30 DDL">Faturado 30 DDL</option>
                <option value="Boleto Parcelado 2x">Boleto Parcelado 2x</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#37393e] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white bg-[#202124] rounded-lg border border-[#37393e] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Gerando...' : 'Criar Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
