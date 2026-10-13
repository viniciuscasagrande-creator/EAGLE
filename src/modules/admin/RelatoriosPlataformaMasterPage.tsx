import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart as PieIcon,
  Percent,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Printer,
  ChevronDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadCsv } from '@/utils/csvExport';

export const RelatoriosPlataformaMasterPage: React.FC = () => {
  const { availableProducers, platformKpis } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-10');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Monthly DRE Evolution Data for Platform
  const monthlyDreData = [
    { mes: 'Mai/26', gmv: 34200000, receitaPlataforma: 2907000, ebitda: 1540000 },
    { mes: 'Jun/26', gmv: 36800000, receitaPlataforma: 3128000, ebitda: 1680000 },
    { mes: 'Jul/26', gmv: 39500000, receitaPlataforma: 3357500, ebitda: 1820000 },
    { mes: 'Ago/26', gmv: 41200000, receitaPlataforma: 3502000, ebitda: 1910000 },
    { mes: 'Set/26', gmv: 42100000, receitaPlataforma: 3578500, ebitda: 1970000 },
    { mes: 'Out/26 (Atual)', gmv: 42850000, receitaPlataforma: 4257750, ebitda: 2366105 },
  ];

  // Producer Profitability breakdown
  const producerDreBreakdown = [
    {
      id: 'prod-01',
      name: 'ABC Produções & Eventos',
      gmv: 4250000,
      takeRatePct: 8.5,
      takeRateRev: 361250,
      advanceSpread: 38400,
      gatewayCost: 85000,
      netPlatformProfit: 278450,
      marginPct: 70.3,
      category: 'Shows & Festivais',
    },
    {
      id: 'prod-02',
      name: 'Opus Entretenimento',
      gmv: 18600000,
      takeRatePct: 7.8,
      takeRateRev: 1450800,
      advanceSpread: 162000,
      gatewayCost: 372000,
      netPlatformProfit: 1114200,
      marginPct: 69.1,
      category: 'Teatros & Musicais',
    },
    {
      id: 'prod-03',
      name: 'Seven Entretenimento',
      gmv: 8200000,
      takeRatePct: 8.0,
      takeRateRev: 656000,
      advanceSpread: 74000,
      gatewayCost: 164000,
      netPlatformProfit: 504600,
      marginPct: 69.1,
      category: 'Festivais',
    },
    {
      id: 'prod-04',
      name: 'Live Nation Brasil',
      gmv: 11800000,
      takeRatePct: 9.0,
      takeRateRev: 1062000,
      advanceSpread: 114000,
      gatewayCost: 236000,
      netPlatformProfit: 864500,
      marginPct: 73.5,
      category: 'Turnês Internacionais',
    },
  ];

  const filteredProducers = producerDreBreakdown.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  const handleExportCsv = () => {
    const headers = [
      'Item DRE',
      'Conta Contábil',
      'Valor Realizado (R$)',
      '% Sobre GMV',
      '% Sobre Receita Plataforma',
    ];

    const rows = [
      ['1. RECEITA OPERACIONAL BRUTA DA REDE (GMV)', '3.1.1.01', '42.850.000,00', '100,00%', '-'],
      ['  1.1 Vendas Online Web/App (PIX & Cartão)', '3.1.1.02', '35.137.000,00', '82,00%', '-'],
      ['  1.2 Vendas Bilheterias Oficiais & PDVs', '3.1.1.03', '7.713.000,00', '18,00%', '-'],
      ['2. RECEITA OPERACIONAL DA PLATAFORMA DISKINGRESSOS', '3.1.2.01', '4.257.750,00', '9,94%', '100,00%'],
      ['  2.1 Take Rate de Bilhetagem (Média 8.5%)', '3.1.2.02', '3.642.250,00', '8,50%', '85,54%'],
      ['  2.2 Spread de Antecipações Keeper ERP (3.2% a.m.)', '3.1.2.03', '388.400,00', '0,91%', '9,12%'],
      ['  2.3 Repasses de Taxas de Processamento / Gateway', '3.1.2.04', '142.100,00', '0,33%', '3,34%'],
      ['  2.4 Serviços de Marketing & Portaria', '3.1.2.05', '85.000,00', '0,20%', '2,00%'],
      ['3. DEDUÇÕES DIRETAS & CUSTOS DE PROCESSAMENTO', '4.1.1.01', '-1.306.645,00', '-3,05%', '-30,69%'],
      ['  3.1 Adquirência & Gateway (Stone / Cielo - 2.0%)', '4.1.1.02', '-857.000,00', '-2,00%', '-20,13%'],
      ['  3.2 Antifraude Konduto / ClearSale', '4.1.1.03', '-42.850,00', '-0,10%', '-1,01%'],
      ['  3.3 Cloud Computing AWS / Cloudflare', '4.1.1.04', '-38.500,00', '-0,09%', '-0,90%'],
      ['  3.4 Tributos Incidentes (ISS 5% / PIS / COFINS)', '4.1.1.05', '-368.295,00', '-0,86%', '-8,65%'],
      ['4. MARGEM DE CONTRIBUIÇÃO BRUTA DA PLATAFORMA', '3.2.1.01', '2.951.105,00', '6,89%', '69,31%'],
      ['5. DESPESAS OPERACIONAIS E COMERCIAIS', '4.2.1.01', '-585.000,00', '-1,37%', '-13,74%'],
      ['  5.1 Equipe Comercial & Account Managers', '4.2.1.02', '-380.000,00', '-0,89%', '-8,92%'],
      ['  5.2 SAC e Suporte 24/7', '4.2.1.03', '-140.000,00', '-0,33%', '-3,29%'],
      ['  5.3 Ferramentas e WhatsApp API Meta', '4.2.1.04', '-65.000,00', '-0,15%', '-1,53%'],
      ['6. EBITDA OPERACIONAL DISKINGRESSOS', '3.3.1.01', '2.366.105,00', '5,52%', '55,57%'],
    ];

    downloadCsv('dre-master-diskingressos-2026', headers, rows);
    showToast('Planilha DRE Master (.csv) exportada com sucesso!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              DRE Master & Inteligência Executiva
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Admin Master
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Demonstrativo de Resultado do Exercício consolidado da DiskIngressos: GMV, Take Rate, Antecipações Keeper, Custos de Adquirência e EBITDA.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar DRE (.XLSX)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF Executivo</span>
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

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Competência:</span>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              showToast(`Filtro atualizado para ${e.target.value}`);
            }}
            aria-label="Competência do DRE"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="2026-10">Mês Vigente (Outubro / 2026)</option>
            <option value="2026-09">Setembro / 2026</option>
            <option value="2026-Q3">3º Trimestre 2026 (Jul - Set)</option>
            <option value="2026-YTD">Ano 2026 (YTD)</option>
          </select>

          <div className="flex items-center gap-2 ml-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Segmento:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Segmento de Eventos"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="Shows & Festivais">Shows & Festivais</option>
            <option value="Teatros & Musicais">Teatros & Musicais</option>
            <option value="Festivais">Festivais</option>
            <option value="Turnês Internacionais">Turnês Internacionais</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fechamento Contábil D+0 integrado ao Keeper ERP</span>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>GMV Rede DiskIngressos</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +18.4%
            </span>
          </div>
          <p className="text-2xl font-black text-white mt-1">R$ 42.850.000</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>254.300 Ingressos</span>
            <span className="text-slate-300">Tkt Médio: R$ 168,50</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span>Receita Própria Plataforma</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Take 9.94%
            </span>
          </div>
          <p className="text-2xl font-black text-purple-300 mt-1">R$ 4.257.750</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Take Rate: R$ 3,64M</span>
            <span className="text-amber-400">Crédito: R$ 388k</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Margem de Contribuição</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              69.31%
            </span>
          </div>
          <p className="text-2xl font-black text-blue-400 mt-1">R$ 2.951.105</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Custo Adquirência: 2.0%</span>
            <span className="text-slate-300">Tributos: -R$ 368k</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-[#141b2d] border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-transparent">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>EBITDA Operacional Disk</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              55.57%
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-1">R$ 2.366.105</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Lucro Líquido Operacional</span>
            <span className="text-emerald-300 font-bold">Excelente</span>
          </div>
        </div>
      </div>

      {/* Main DRE Statement Table */}
      <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Demonstrativo do Resultado do Exercício (DRE Master Consolidado)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Estruturado de acordo com as normas contábeis brasileiras (CPC 26) para plataformas SaaS & FinTech de Entretenimento.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Moeda: BRL (R$)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/60">
                <th className="py-2.5 px-4">Linha do Demonstrativo</th>
                <th className="py-2.5 px-4">Conta Contábil</th>
                <th className="py-2.5 px-4 text-right">Valor Realizado (R$)</th>
                <th className="py-2.5 px-4 text-right">% s/ GMV</th>
                <th className="py-2.5 px-4 text-right">% s/ Receita Disk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {/* Grupo 1: GMV */}
              <tr className="bg-slate-900/40 text-slate-200 font-bold">
                <td className="py-2.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>1. RECEITA OPERACIONAL BRUTA DA REDE (GMV Transacionado)</span>
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-400">3.1.1.01</td>
                <td className="py-2.5 px-4 text-right font-black text-white">R$ 42.850.000,00</td>
                <td className="py-2.5 px-4 text-right text-slate-300">100,00%</td>
                <td className="py-2.5 px-4 text-right text-slate-500">-</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">1.1 Vendas Online E-commerce Web & App (PIX / Cartão)</td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.1.02</td>
                <td className="py-2 px-4 text-right text-slate-300">R$ 35.137.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">82,00%</td>
                <td className="py-2 px-4 text-right text-slate-500">-</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">1.2 Vendas Bilheterias Físicas Oficiais & Pontos de Venda (PDVs)</td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.1.03</td>
                <td className="py-2 px-4 text-right text-slate-300">R$ 7.713.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">18,00%</td>
                <td className="py-2 px-4 text-right text-slate-500">-</td>
              </tr>

              {/* Grupo 2: Receita Própria Plataforma */}
              <tr className="bg-purple-950/20 text-purple-300 font-bold">
                <td className="py-2.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>2. RECEITA OPERACIONAL PRÓPRIA DA DISKINGRESSOS</span>
                </td>
                <td className="py-2.5 px-4 font-mono text-purple-400">3.1.2.01</td>
                <td className="py-2.5 px-4 text-right font-black text-purple-200">R$ 4.257.750,00</td>
                <td className="py-2.5 px-4 text-right text-purple-300">9,94%</td>
                <td className="py-2.5 px-4 text-right text-purple-300">100,00%</td>
              </tr>
              <tr className="text-slate-300 hover:bg-slate-800/30">
                <td className="py-2 px-8">2.1 Taxa de Bilhetagem / Take Rate Base (Média de 8,50%)</td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.2.02</td>
                <td className="py-2 px-4 text-right text-white">R$ 3.642.250,00</td>
                <td className="py-2 px-4 text-right text-slate-400">8,50%</td>
                <td className="py-2 px-4 text-right text-slate-300">85,54%</td>
              </tr>
              <tr className="text-slate-300 hover:bg-slate-800/30">
                <td className="py-2 px-8 flex items-center gap-1.5">
                  <span>2.2 Receitas Financeiras de Antecipação (Keeper ERP Spread de 3.2% a.m.)</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                    FinTech
                  </span>
                </td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.2.03</td>
                <td className="py-2 px-4 text-right text-amber-300 font-semibold">R$ 388.400,00</td>
                <td className="py-2 px-4 text-right text-slate-400">0,91%</td>
                <td className="py-2 px-4 text-right text-slate-300">9,12%</td>
              </tr>
              <tr className="text-slate-300 hover:bg-slate-800/30">
                <td className="py-2 px-8">2.3 Spread Operacional de Taxas de Processamento Gateway</td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.2.04</td>
                <td className="py-2 px-4 text-right text-slate-200">R$ 142.100,00</td>
                <td className="py-2 px-4 text-right text-slate-400">0,33%</td>
                <td className="py-2 px-4 text-right text-slate-300">3,34%</td>
              </tr>
              <tr className="text-slate-300 hover:bg-slate-800/30">
                <td className="py-2 px-8">2.4 Serviços Adicionais (Marketing Disk, Portaria & Telão)</td>
                <td className="py-2 px-4 font-mono text-slate-500">3.1.2.05</td>
                <td className="py-2 px-4 text-right text-slate-200">R$ 85.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">0,20%</td>
                <td className="py-2 px-4 text-right text-slate-300">2,00%</td>
              </tr>

              {/* Grupo 3: Deduções e Custos Diretos */}
              <tr className="bg-rose-950/20 text-rose-300 font-bold">
                <td className="py-2.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>3. DEDUÇÕES DIRETAS & CUSTOS VARIÁVEIS DE PROCESSAMENTO</span>
                </td>
                <td className="py-2.5 px-4 font-mono text-rose-400">4.1.1.01</td>
                <td className="py-2.5 px-4 text-right font-black text-rose-300">- R$ 1.306.645,00</td>
                <td className="py-2.5 px-4 text-right text-rose-300">-3,05%</td>
                <td className="py-2.5 px-4 text-right text-rose-300">-30,69%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">3.1 Custos de Gateway & Adquirência (Stone / Cielo / Rede - 2.0%)</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.1.1.02</td>
                <td className="py-2 px-4 text-right text-rose-400">- R$ 857.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-2,00%</td>
                <td className="py-2 px-4 text-right text-slate-400">-20,13%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">3.2 Antifraude & Scoring de Risco (Konduto / ClearSale)</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.1.1.03</td>
                <td className="py-2 px-4 text-right text-rose-400">- R$ 42.850,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,10%</td>
                <td className="py-2 px-4 text-right text-slate-400">-1,01%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">3.3 Infraestrutura de Nuvem, Tráfego & Cloudflare Workers</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.1.1.04</td>
                <td className="py-2 px-4 text-right text-rose-400">- R$ 38.500,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,09%</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,90%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">3.4 Tributos Sobre Serviços (ISSQN 5,0% + PIS 0,65% + COFINS 3,0%)</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.1.1.05</td>
                <td className="py-2 px-4 text-right text-rose-400">- R$ 368.295,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,86%</td>
                <td className="py-2 px-4 text-right text-slate-400">-8,65%</td>
              </tr>

              {/* Grupo 4: Margem de Contribuição */}
              <tr className="bg-blue-950/30 text-blue-300 font-bold text-sm">
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span>4. MARGEM DE CONTRIBUIÇÃO BRUTA DA PLATAFORMA</span>
                </td>
                <td className="py-3 px-4 font-mono text-blue-400">3.2.1.01</td>
                <td className="py-3 px-4 text-right font-black text-blue-200">R$ 2.951.105,00</td>
                <td className="py-3 px-4 text-right text-blue-300">6,89%</td>
                <td className="py-3 px-4 text-right text-blue-300">69,31%</td>
              </tr>

              {/* Grupo 5: Despesas Operacionais */}
              <tr className="bg-slate-900/50 text-slate-300 font-bold">
                <td className="py-2.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span>5. DESPESAS OPERACIONAIS FIXAS & ESTRUTURA COMERCIAL</span>
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-400">4.2.1.01</td>
                <td className="py-2.5 px-4 text-right font-bold text-slate-300">- R$ 585.000,00</td>
                <td className="py-2.5 px-4 text-right text-slate-400">-1,37%</td>
                <td className="py-2.5 px-4 text-right text-slate-400">-13,74%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">5.1 Time Comercial, Parcerias & Gerentes de Contas</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.2.1.02</td>
                <td className="py-2 px-4 text-right text-slate-300">- R$ 380.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,89%</td>
                <td className="py-2 px-4 text-right text-slate-400">-8,92%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">5.2 SAC, Suporte 24/7 & Relacionamento com Fãs</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.2.1.03</td>
                <td className="py-2 px-4 text-right text-slate-300">- R$ 140.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,33%</td>
                <td className="py-2 px-4 text-right text-slate-400">-3,29%</td>
              </tr>
              <tr className="text-slate-400 hover:bg-slate-800/30">
                <td className="py-2 px-8">5.3 Licenciamento WhatsApp Cloud API, Telefonia & CRM</td>
                <td className="py-2 px-4 font-mono text-slate-500">4.2.1.04</td>
                <td className="py-2 px-4 text-right text-slate-300">- R$ 65.000,00</td>
                <td className="py-2 px-4 text-right text-slate-400">-0,15%</td>
                <td className="py-2 px-4 text-right text-slate-400">-1,53%</td>
              </tr>

              {/* Grupo 6: EBITDA */}
              <tr className="bg-emerald-950/40 text-emerald-300 font-black text-sm border-t-2 border-emerald-500/50">
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>6. RESULTADO OPERACIONAL LÍQUIDO / EBITDA DA PLATAFORMA</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">3.3.1.01</td>
                <td className="py-3.5 px-4 text-right font-black text-emerald-300 text-base">
                  R$ 2.366.105,00
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">5,52%</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-black">55,57%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Evolution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Evolution */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Evolução Mensal: Receita Plataforma vs EBITDA (R$)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Últimos 6 meses</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyDreData}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEbit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(val) => `R$ ${(val / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="receitaPlataforma"
                  name="Receita Plataforma"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorRec)"
                />
                <Area
                  type="monotone"
                  dataKey="ebitda"
                  name="EBITDA Líquido"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEbit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Profitability per Producer */}
        <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              <span>Lucro Líquido Gerado para a DiskIngressos por Produtora</span>
            </h3>
            <span className="text-[11px] text-slate-400">Competência Atual</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={producerDreBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(n) => n.split(' ')[0]}
                />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Lucro Líquido']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="netPlatformProfit" name="Lucro Líquido Plataforma" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Producer Breakdown Table */}
      <div className="p-5 rounded-2xl bg-[#141b2d] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Rentabilidade Segmentada por Produtora Parceira</span>
            </h3>
            <p className="text-xs text-slate-400">
              Análise unit economics de cada produtora no ecossistema DiskIngressos.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/60">
                <th className="py-2.5 px-4">Produtora</th>
                <th className="py-2.5 px-4">Segmento</th>
                <th className="py-2.5 px-4 text-right">GMV Transacionado</th>
                <th className="py-2.5 px-4 text-center">Take Rate Base</th>
                <th className="py-2.5 px-4 text-right">Receita Take</th>
                <th className="py-2.5 px-4 text-right">Spread Crédito</th>
                <th className="py-2.5 px-4 text-right">Custo Adquirência</th>
                <th className="py-2.5 px-4 text-right">Lucro Líquido Plataforma</th>
                <th className="py-2.5 px-4 text-center">Margem (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProducers.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>{prod.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-200">
                    {formatCurrency(prod.gmv)}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-purple-300">
                    {prod.takeRatePct}%
                  </td>
                  <td className="py-3 px-4 text-right text-slate-200">
                    {formatCurrency(prod.takeRateRev)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-400 font-medium">
                    +{formatCurrency(prod.advanceSpread)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400 font-medium">
                    -{formatCurrency(prod.gatewayCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-400">
                    {formatCurrency(prod.netPlatformProfit)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {prod.marginPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
