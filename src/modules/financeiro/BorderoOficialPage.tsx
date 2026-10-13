import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Percent,
  Clock,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Ticket,
  Users,
  CreditCard,
  QrCode,
  MapPin,
  Lock,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

interface EventBorderoData {
  id: string;
  code: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  alvaraNumber: string;
  ecadProtocol: string;
  status: 'CONCILIATED' | 'IN_LIQUIDATION' | 'DRAFT';
  capacity: number;
  totalTicketsIssued: number;
  ticketsSold: number;
  ticketsComplimentary: number;
  ticketsUnsold: number;
  halfPriceTickets: number; // For legal quota checking (40%)
  pricingTiers: {
    name: string;
    sold: number;
    price: number;
    total: number;
  }[];
  salesChannels: {
    pix: number;
    creditCardSingle: number;
    creditCardInstallments: number;
    posDebitCredit: number;
    cashBoxOffice: number;
  };
  deductions: {
    takeRatePct: number;
    takeRateAmount: number;
    complimentaryTicketFee: number;
    boxOfficePosCosts: number;
    issqnRatePct: number;
    issqnAmount: number;
    ecadRetentionRatePct: number;
    ecadRetentionAmount: number;
    chargebackReservePct: number;
    chargebackReserveAmount: number;
  };
  advances: {
    advanceItems: {
      id: string;
      code: string;
      date: string;
      amount: number;
      fee: number;
    }[];
    totalAdvances: number;
    totalAdvanceFees: number;
  };
  partialRepaymentsPaid: number;
  signers: {
    diskIngressosSigner: { name: string; role: string; signedAt: string; hash: string };
    producerSigner: { name: string; role: string; signedAt: string; hash: string };
  };
}

const mockBorderosList: EventBorderoData[] = [
  {
    id: 'ev-101',
    code: 'BORD-2026-089',
    name: 'Festival de Inverno 2026',
    venue: 'Pedreira Paulo Leminski',
    city: 'Curitiba / PR',
    date: '28/09/2026',
    alvaraNumber: 'ALV-CTBA-2026/89412',
    ecadProtocol: 'ECAD-PR-992144',
    status: 'IN_LIQUIDATION',
    capacity: 12000,
    totalTicketsIssued: 12000,
    ticketsSold: 11450,
    ticketsComplimentary: 400,
    ticketsUnsold: 150,
    halfPriceTickets: 3800,
    pricingTiers: [
      { name: 'Pista Inteira (1º e 2º Lotes)', sold: 4200, price: 160, total: 672000 },
      { name: 'Pista Meia-Entrada / Solidária', sold: 4800, price: 80, total: 384000 },
      { name: 'Área VIP Premium Inteira', sold: 1450, price: 340, total: 493000 },
      { name: 'Camarote Open Bar Inteira', sold: 1000, price: 378, total: 378000 },
    ],
    salesChannels: {
      pix: 890400,
      creditCardSingle: 510200,
      creditCardInstallments: 380000,
      posDebitCredit: 98400,
      cashBoxOffice: 48000,
    },
    deductions: {
      takeRatePct: 8.5,
      takeRateAmount: 163795,
      complimentaryTicketFee: 2000,
      boxOfficePosCosts: 12400,
      issqnRatePct: 5.0,
      issqnAmount: 96350,
      ecadRetentionRatePct: 2.5,
      ecadRetentionAmount: 48175,
      chargebackReservePct: 5.0,
      chargebackReserveAmount: 96350,
    },
    advances: {
      advanceItems: [
        { id: 'adv-01', code: 'ANT-2026-041', date: '15/08/2026', amount: 400000, fee: 12800 },
        { id: 'adv-02', code: 'ANT-2026-068', date: '10/09/2026', amount: 350000, fee: 11200 },
      ],
      totalAdvances: 750000,
      totalAdvanceFees: 24000,
    },
    partialRepaymentsPaid: 450000,
    signers: {
      diskIngressosSigner: {
        name: 'Fernando Vianna',
        role: 'Diretor de Operações e Compliance DiskIngressos',
        signedAt: '30/09/2026 14:22:18',
        hash: 'SHA256: 8f4a1c90e2b4f91d098e72c5fa2b7049c6d3e8b1',
      },
      producerSigner: {
        name: 'Carlos Mendonça de Souza',
        role: 'Sócio-Administrador ABC Produções & Eventos',
        signedAt: '01/10/2026 09:15:44',
        hash: 'SHA256: 7d11e84a20b991cf8e45217bc429ad90e6fa0014',
      },
    },
  },
  {
    id: 'ev-102',
    code: 'BORD-2026-077',
    name: 'Show Jorge & Mateus - Sunset Edition',
    venue: 'Live Curitiba',
    city: 'Curitiba / PR',
    date: '12/09/2026',
    alvaraNumber: 'ALV-CTBA-2026/74102',
    ecadProtocol: 'ECAD-PR-881023',
    status: 'CONCILIATED',
    capacity: 6500,
    totalTicketsIssued: 6500,
    ticketsSold: 6500,
    ticketsComplimentary: 250,
    ticketsUnsold: 0,
    halfPriceTickets: 2400,
    pricingTiers: [
      { name: 'Pista Premium', sold: 4000, price: 140, total: 560000 },
      { name: 'Camarote Coletivo', sold: 2000, price: 260, total: 520000 },
      { name: 'Mesa Bistrô Ouro', sold: 500, price: 400, total: 200000 },
    ],
    salesChannels: {
      pix: 680000,
      creditCardSingle: 340000,
      creditCardInstallments: 210000,
      posDebitCredit: 40000,
      cashBoxOffice: 10000,
    },
    deductions: {
      takeRatePct: 8.5,
      takeRateAmount: 108800,
      complimentaryTicketFee: 1250,
      boxOfficePosCosts: 7800,
      issqnRatePct: 5.0,
      issqnAmount: 64000,
      ecadRetentionRatePct: 2.5,
      ecadRetentionAmount: 32000,
      chargebackReservePct: 5.0,
      chargebackReserveAmount: 64000,
    },
    advances: {
      advanceItems: [
        { id: 'adv-03', code: 'ANT-2026-031', date: '01/08/2026', amount: 500000, fee: 16000 },
      ],
      totalAdvances: 500000,
      totalAdvanceFees: 16000,
    },
    partialRepaymentsPaid: 400000,
    signers: {
      diskIngressosSigner: {
        name: 'Fernando Vianna',
        role: 'Diretor de Compliance DiskIngressos',
        signedAt: '15/09/2026 11:30:10',
        hash: 'SHA256: 4e91b4fa8120c897a1d35ef2944bca07e810f221',
      },
      producerSigner: {
        name: 'Carlos Mendonça de Souza',
        role: 'Sócio-Administrador ABC Produções',
        signedAt: '16/09/2026 16:45:22',
        hash: 'SHA256: 9a01f92e7311d84b2c45167e9f4a12cc90ab83f1',
      },
    },
  },
  {
    id: 'ev-103',
    code: 'BORD-2026-092',
    name: 'Tributo Queen Sinfônico',
    venue: 'Teatro Guaíra',
    city: 'Curitiba / PR',
    date: '04/10/2026',
    alvaraNumber: 'ALV-CTBA-2026/91104',
    ecadProtocol: 'ECAD-PR-993412',
    status: 'IN_LIQUIDATION',
    capacity: 2170,
    totalTicketsIssued: 2170,
    ticketsSold: 2120,
    ticketsComplimentary: 50,
    ticketsUnsold: 0,
    halfPriceTickets: 840,
    pricingTiers: [
      { name: 'Plateia A Especial', sold: 800, price: 220, total: 176000 },
      { name: 'Plateia B Nobre', sold: 720, price: 180, total: 129600 },
      { name: '1º Balcão Central', sold: 600, price: 120, total: 72000 },
    ],
    salesChannels: {
      pix: 188800,
      creditCardSingle: 114000,
      creditCardInstallments: 54800,
      posDebitCredit: 16000,
      cashBoxOffice: 4000,
    },
    deductions: {
      takeRatePct: 8.5,
      takeRateAmount: 32100,
      complimentaryTicketFee: 250,
      boxOfficePosCosts: 3400,
      issqnRatePct: 5.0,
      issqnAmount: 18880,
      ecadRetentionRatePct: 2.5,
      ecadRetentionAmount: 9440,
      chargebackReservePct: 5.0,
      chargebackReserveAmount: 18880,
    },
    advances: {
      advanceItems: [],
      totalAdvances: 0,
      totalAdvanceFees: 0,
    },
    partialRepaymentsPaid: 150000,
    signers: {
      diskIngressosSigner: {
        name: 'Fernando Vianna',
        role: 'Diretor de Compliance DiskIngressos',
        signedAt: '05/10/2026 10:14:00',
        hash: 'SHA256: 3c8812fa910ab342ef9987110034a1bc4028ddfa',
      },
      producerSigner: {
        name: 'Carlos Mendonça de Souza',
        role: 'Sócio-Administrador ABC Produções',
        signedAt: 'Pendente de Assinatura',
        hash: 'Aguardando validação',
      },
    },
  },
];

export const BorderoOficialPage: React.FC = () => {
  const { producer } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState<string>('ev-101');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);
  const [hasSigned, setHasSigned] = useState<boolean>(false);

  const bordero = mockBorderosList.find((b) => b.id === selectedEventId) || mockBorderosList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const grossSalesTotal =
    bordero.salesChannels.pix +
    bordero.salesChannels.creditCardSingle +
    bordero.salesChannels.creditCardInstallments +
    bordero.salesChannels.posDebitCredit +
    bordero.salesChannels.cashBoxOffice;

  const totalDeductions =
    bordero.deductions.takeRateAmount +
    bordero.deductions.complimentaryTicketFee +
    bordero.deductions.boxOfficePosCosts +
    bordero.deductions.issqnAmount +
    bordero.deductions.ecadRetentionAmount +
    bordero.deductions.chargebackReserveAmount;

  const totalAdvancesCompensated = bordero.advances.totalAdvances + bordero.advances.totalAdvanceFees;

  const netLiquidationBalance = Math.max(
    0,
    grossSalesTotal - totalDeductions - totalAdvancesCompensated - bordero.partialRepaymentsPaid
  );

  const halfPriceQuotaPct = ((bordero.halfPriceTickets / bordero.ticketsSold) * 100).toFixed(1);
  const occupationRatePct = ((bordero.ticketsSold / bordero.capacity) * 100).toFixed(1);

  const handleExportCsv = () => {
    const headers = ['Seção do Borderô', 'Item / Descrição', 'Valor / Quantidade', 'Observações'];
    const rows = [
      ['IDENTIFICAÇÃO', 'Evento', bordero.name, `Código: ${bordero.code}`],
      ['IDENTIFICAÇÃO', 'Local & Data', `${bordero.venue} - ${bordero.city}`, bordero.date],
      ['IDENTIFICAÇÃO', 'Alvará Municipal', bordero.alvaraNumber, 'Regularizado'],
      ['IDENTIFICAÇÃO', 'Protocolo ECAD', bordero.ecadProtocol, 'Taxa retida'],
      ['INGRESSOS', 'Capacidade Autorizada', `${bordero.capacity} un.`, '100%'],
      ['INGRESSOS', 'Ingressos Vendidos', `${bordero.ticketsSold} un.`, `${occupationRatePct}% ocupação`],
      ['INGRESSOS', 'Meia-Entrada Legal', `${bordero.halfPriceTickets} un.`, `${halfPriceQuotaPct}% (limite legal 40%)`],
      ['INGRESSOS', 'Cortesias Emitidas', `${bordero.ticketsComplimentary} un.`, 'Autorizadas pela produção'],
      ['FATURAMENTO', 'Vendas PIX', formatCurrency(bordero.salesChannels.pix), 'Online'],
      ['FATURAMENTO', 'Vendas Cartão à Vista', formatCurrency(bordero.salesChannels.creditCardSingle), 'Online'],
      ['FATURAMENTO', 'Vendas Cartão Parcelado', formatCurrency(bordero.salesChannels.creditCardInstallments), 'Online'],
      ['FATURAMENTO', 'Vendas Bilheteria POS', formatCurrency(bordero.salesChannels.posDebitCredit), 'Presencial'],
      ['FATURAMENTO', 'Vendas Espécie', formatCurrency(bordero.salesChannels.cashBoxOffice), 'Bilheteria Dia'],
      ['FATURAMENTO', 'FATURAMENTO BRUTO TOTAL', formatCurrency(grossSalesTotal), '100% da Bilheteria'],
      ['DEDUÇÕES', 'Take Rate DiskIngressos', `-${formatCurrency(bordero.deductions.takeRateAmount)}`, `${bordero.deductions.takeRatePct}%`],
      ['DEDUÇÕES', 'Retenção ISSQN Fonte', `-${formatCurrency(bordero.deductions.issqnAmount)}`, `${bordero.deductions.issqnRatePct}%`],
      ['DEDUÇÕES', 'Retenção ECAD', `-${formatCurrency(bordero.deductions.ecadRetentionAmount)}`, `${bordero.deductions.ecadRetentionRatePct}%`],
      ['DEDUÇÕES', 'Fundo de Reserva Chargeback', `-${formatCurrency(bordero.deductions.chargebackReserveAmount)}`, 'Liberado D+30'],
      ['DEDUÇÕES', 'Custos Operacionais POS & Portaria', `-${formatCurrency(bordero.deductions.boxOfficePosCosts)}`, 'Operação de campo'],
      ['COMPENSAÇÕES', 'Adiantamentos Keeper ERP', `-${formatCurrency(bordero.advances.totalAdvances)}`, 'Quitados no fechamento'],
      ['COMPENSAÇÕES', 'Deságio Antecipações', `-${formatCurrency(bordero.advances.totalAdvanceFees)}`, 'Taxa de antecipação'],
      ['COMPENSAÇÕES', 'Repasses Parciais já Quitados', `-${formatCurrency(bordero.partialRepaymentsPaid)}`, 'D-30 / D-15'],
      ['FECHAMENTO FINAL', 'SALDO LÍQUIDO A REPASSAR (PIX)', formatCurrency(netLiquidationBalance), 'Liquidação D+2'],
    ];

    downloadCsv(`bordero-oficial-${bordero.code}`, headers, rows);
    showToast('Borderô Oficial exportado em formato planilha (.csv)!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignBordero = () => {
    setHasSigned(true);
    setIsSignModalOpen(false);
    showToast('Borderô assinado digitalmente com sucesso via Token Seguro DiskIngressos!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Borderô Oficial & Fechamento Financeiro
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                bordero.status === 'CONCILIATED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {bordero.status === 'CONCILIATED' ? '✓ Conciliado & Liquidado' : '⏳ Em Liquidação D+2'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Demonstrativo fiscal e contábil definitivo pós-evento: conciliação de ingressos, canais de pagamento, deduções de taxas, retenções legais (ISS/ECAD) e quitação de adiantamentos.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Planilha (.XLSX)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span>Imprimir Borderô</span>
          </button>

          <button
            onClick={() => setIsSignModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{hasSigned ? 'Assinado Digitalmente' : 'Assinar Termo de Quitação'}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Event Selector & Protocol Bar */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Selecionar Evento:</span>
          </div>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setHasSigned(false);
              showToast(`Borderô carregado para o evento selecionado.`);
            }}
            aria-label="Selecione o Evento para Visualizar o Borderô"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer min-w-[280px]"
          >
            {mockBorderosList.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} ({evt.date}) - {evt.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px] text-slate-300">Protocolo: {bordero.code}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Validade Jurídica ICP-Brasil</span>
          </div>
        </div>
      </div>

      {/* Main Borderô Document Box (Timbrado) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Borderô Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-wider">DISKINGRESSOS</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                BORDERÔ OFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Disk Ingressos Entretenimento S.A. • CNPJ: 07.822.454/0001-09 • Curitiba - PR
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400">
            <p className="font-bold text-slate-200">Produtora Parceira:</p>
            <p className="text-white font-medium">{producer?.name || 'ABC Produções & Eventos Ltda'}</p>
            <p className="text-slate-400">CNPJ: {producer?.cnpj || '12.345.678/0001-90'}</p>
          </div>
        </div>

        {/* Event Identification Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evento</span>
            <p className="text-sm font-black text-white truncate">{bordero.name}</p>
            <p className="text-xs text-slate-400">{bordero.code}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Local & Realização</span>
            <p className="text-sm font-bold text-white truncate">{bordero.venue}</p>
            <p className="text-xs text-slate-400">{bordero.city} • {bordero.date}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alvará & ECAD</span>
            <p className="text-xs font-mono text-slate-300 truncate">{bordero.alvaraNumber}</p>
            <p className="text-xs font-mono text-slate-400 truncate">{bordero.ecadProtocol}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conta de Liquidação (PIX)</span>
            <p className="text-xs font-bold text-emerald-400">{producer?.bankName || 'Banco Santander'} (033)</p>
            <p className="text-xs font-mono text-slate-300">PIX: {producer?.pixKey || 'financeiro@abcproducoes.com.br'}</p>
          </div>
        </div>

        {/* Section 1: Ticket Reconciliation & Quotas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>1. Conciliação de Carga de Ingressos & Auditoria de Meia-Entrada</span>
            </h2>
            <span className="text-xs text-slate-400">
              Ocupação Real: <strong className="text-emerald-400">{occupationRatePct}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[10px] text-slate-400">Capacidade Autorizada</span>
              <p className="text-base font-black text-white">{bordero.capacity.toLocaleString()} un.</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-300">Ingressos Vendidos</span>
              <p className="text-base font-black text-emerald-400">{bordero.ticketsSold.toLocaleString()} un.</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20">
              <span className="text-[10px] text-blue-300">Meia-Entrada Legal</span>
              <p className="text-base font-black text-blue-400">{bordero.halfPriceTickets.toLocaleString()} un.</p>
              <span className="text-[9px] text-blue-300/80">({halfPriceQuotaPct}% - limite 40%)</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[10px] text-purple-300">Cortesias Emitidas</span>
              <p className="text-base font-black text-purple-400">{bordero.ticketsComplimentary.toLocaleString()} un.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[10px] text-slate-400">Encalhe / Não Vendidos</span>
              <p className="text-base font-black text-slate-400">{bordero.ticketsUnsold.toLocaleString()} un.</p>
            </div>
          </div>

          {/* Pricing Tiers Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Setor / Modalidade de Ingresso</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Quantidade Vendida</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Preço Facial Médio</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Subtotal Bruto (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {bordero.pricingTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2 px-4 text-white font-medium">{tier.name}</td>
                    <td className="py-2 px-4 text-center text-slate-300">{tier.sold.toLocaleString()} un.</td>
                    <td className="py-2 px-4 text-right text-slate-300">{formatCurrency(tier.price)}</td>
                    <td className="py-2 px-4 text-right font-bold text-white">{formatCurrency(tier.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Sales Channels & Payment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>2. Apuração de Vendas por Canal e Modalidade de Pagamento</span>
            </h2>
            <span className="text-xs font-bold text-emerald-400">
              Total Bruto: {formatCurrency(grossSalesTotal)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <QrCode className="w-3.5 h-3.5 text-teal-400" /> PIX E-commerce
                </span>
                <span className="text-teal-400 font-mono text-[10px]">
                  {((bordero.salesChannels.pix / grossSalesTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                {formatCurrency(bordero.salesChannels.pix)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Compensação instantânea</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Crédito à Vista
                </span>
                <span className="text-blue-400 font-mono text-[10px]">
                  {((bordero.salesChannels.creditCardSingle / grossSalesTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                {formatCurrency(bordero.salesChannels.creditCardSingle)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">1x sem juros Web/App</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Crédito Parcelado
                </span>
                <span className="text-purple-400 font-mono text-[10px]">
                  {((bordero.salesChannels.creditCardInstallments / grossSalesTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                {formatCurrency(bordero.salesChannels.creditCardInstallments)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">2x a 12x parcelas</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Ticket className="w-3.5 h-3.5 text-amber-400" /> Bilheteria Maquininhas
                </span>
                <span className="text-amber-400 font-mono text-[10px]">
                  {((bordero.salesChannels.posDebitCredit / grossSalesTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                {formatCurrency(bordero.salesChannels.posDebitCredit)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">PDV Físico / POS Local</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Dinheiro em Espécie
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {((bordero.salesChannels.cashBoxOffice / grossSalesTotal) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                {formatCurrency(bordero.salesChannels.cashBoxOffice)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Bilheteria dia do evento</p>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Deductions, Taxes, Advances (Two-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: Deductions and Taxes */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-rose-400" />
                <span>3. Deduções Operacionais, Taxas & Tributos</span>
              </span>
              <span className="text-xs font-bold text-rose-400">
                -{formatCurrency(totalDeductions)}
              </span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">
                    Taxa DiskIngressos / Bilhetagem ({bordero.deductions.takeRatePct}%)
                  </p>
                  <p className="text-[10px] text-slate-500">Take Rate acordado em contrato de bilhetagem</p>
                </div>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(bordero.deductions.takeRateAmount)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">
                    Retenção Municipal ISSQN Fonte ({bordero.deductions.issqnRatePct}%)
                  </p>
                  <p className="text-[10px] text-slate-500">Prefeitura Municipal de {bordero.city.split('/')[0]}</p>
                </div>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(bordero.deductions.issqnAmount)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">
                    Retenção Provisória ECAD Direitos Autorais ({bordero.deductions.ecadRetentionRatePct}%)
                  </p>
                  <p className="text-[10px] text-slate-500">Protocolo: {bordero.ecadProtocol}</p>
                </div>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(bordero.deductions.ecadRetentionAmount)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">
                    Fundo de Reserva de Chargeback ({bordero.deductions.chargebackReservePct}%)
                  </p>
                  <p className="text-[10px] text-slate-500">Garantia cautelar de contestações (Liberado em D+30)</p>
                </div>
                <span className="font-bold text-amber-400">
                  -{formatCurrency(bordero.deductions.chargebackReserveAmount)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Custos Operacionais POS & Validação Portaria</p>
                  <p className="text-[10px] text-slate-500">Locação de coletores e maquininhas no local</p>
                </div>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(bordero.deductions.boxOfficePosCosts + bordero.deductions.complimentaryTicketFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Column B: Advances and Repayments */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>4. Adiantamentos Keeper ERP & Repasses Parciais</span>
              </span>
              <span className="text-xs font-bold text-purple-400">
                -{formatCurrency(totalAdvancesCompensated + bordero.partialRepaymentsPaid)}
              </span>
            </h2>

            <div className="space-y-2 text-xs">
              {bordero.advances.advanceItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
                  Nenhum adiantamento de pré-venda solicitado para este evento.
                </div>
              ) : (
                bordero.advances.advanceItems.map((adv) => (
                  <div
                    key={adv.id}
                    className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">
                        {adv.code} • Desembolsado em {adv.date}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Taxa de deságio Keeper: {formatCurrency(adv.fee)}
                      </p>
                    </div>
                    <span className="font-bold text-purple-300">
                      -{formatCurrency(adv.amount + adv.fee)}
                    </span>
                  </div>
                ))
              )}

              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">Repasses Parciais de Pré-Venda já Liquidados</p>
                  <p className="text-[10px] text-slate-500">Transferências D-30 e D-15 creditadas na conta do produtor</p>
                </div>
                <span className="font-bold text-slate-300">
                  -{formatCurrency(bordero.partialRepaymentsPaid)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-slate-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Todos os adiantamentos tomados no Keeper ERP foram quitados integralmente através desta compensação de bilheteria.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Final Settlement Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Resultado Final do Fechamento
              </span>
              <h2 className="text-lg font-black text-white mt-1">
                Saldo Líquido Final a Quitar via PIX
              </h2>
              <p className="text-xs text-slate-300">
                Líquido liberado para transferência instantânea imediata na conta bancária homologada da produtora.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Valor Líquido Apurado
              </span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                {formatCurrency(netLiquidationBalance)}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Status: {bordero.status === 'CONCILIATED' ? 'Pago & Liquidado' : 'Pronto para Liberação D+2'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Digital Signatures & Compliance ICP-Brasil */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Termo de Quitação e Homologação Mútua de Contas</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Certificação Digital SHA-256 e Carimbo do Tempo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DiskIngressos Signer */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{bordero.signers.diskIngressosSigner.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Assinado
                </span>
              </div>
              <p className="text-slate-400">{bordero.signers.diskIngressosSigner.role}</p>
              <p className="text-slate-400 text-[11px]">
                Data/Hora: {bordero.signers.diskIngressosSigner.signedAt}
              </p>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                {bordero.signers.diskIngressosSigner.hash}
              </p>
            </div>

            {/* Producer Signer */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  {producer?.name || bordero.signers.producerSigner.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    hasSigned || bordero.signers.producerSigner.signedAt !== 'Pendente de Assinatura'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {hasSigned || bordero.signers.producerSigner.signedAt !== 'Pendente de Assinatura'
                    ? 'Assinado'
                    : 'Pendente de Assinatura'}
                </span>
              </div>
              <p className="text-slate-400">{bordero.signers.producerSigner.role}</p>
              <p className="text-slate-400 text-[11px]">
                Data/Hora:{' '}
                {hasSigned
                  ? `${formatDate(new Date().toISOString())} às ${new Date().toLocaleTimeString()}`
                  : bordero.signers.producerSigner.signedAt}
              </p>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                {hasSigned
                  ? 'SHA256: 9e0018a1bf728da411cc8420e981ba70cf23199b'
                  : bordero.signers.producerSigner.hash}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Confirmation Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141b2d] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Assinar Borderô Oficial</h2>
                <p className="text-xs text-slate-400">Protocolo {bordero.code}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                Ao assinar este documento digitalmente, a produtora{' '}
                <strong className="text-white">{producer?.name || 'ABC Produções & Eventos'}</strong> declara ter conferido todos os valores brutos, deduções legais e compensações de antecipações do evento{' '}
                <strong className="text-white">{bordero.name}</strong>, conferindo quitação financeira recíproca com a DiskIngressos Entretenimento S.A.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Saldo Líquido Quitado:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(netLiquidationBalance)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSignBordero}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Assinatura Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
