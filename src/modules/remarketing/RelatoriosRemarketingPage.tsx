import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { remarketingV5, type ReportItem } from '@/services/api/eagleRemarketingV5';
import { downloadCsv } from '@/utils/csvExport';
import {
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const RelatoriosRemarketingPage: React.FC = () => {
  const { id: routeEventId } = useParams<{ id: string }>();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await remarketingV5.listReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      setReports([]);
      setError(e instanceof Error ? e.message : 'Catálogo de relatórios indisponível.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const exportReport = async (key: string, label: string) => {
    setBusyKey(key);
    setError('');
    try {
      const { columns, rows } = await remarketingV5.getReport(key, routeEventId);
      if (!Array.isArray(columns) || !Array.isArray(rows)) {
        throw new Error('Formato de dados inválido retornado pelo serviço de relatórios.');
      }
      const stringRows = rows.map((row) =>
        row.map((val) => (val === null || val === undefined ? '' : String(val)))
      );
      downloadCsv(
        columns,
        stringRows,
        `remarketing-${key}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      setToastMessage(`Relatório "${label}" exportado com sucesso via API autorizada!`);
      setTimeout(() => setToastMessage(null), 4500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao obter dados do relatório.');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div role="alert" className="p-3.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}. Planilhas demonstrativas não foram geradas.</span>
          </div>
          <button onClick={() => void loadReports()} className="text-red-400 hover:text-white underline cursor-pointer text-xs ml-2">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Relatórios & Auditoria de Remarketing
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Exportação Oficial V5
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Somente relatórios provenientes do serviço autorizado e conciliados no backend do Eagle One. Sem planilhas fictícias.
          </p>
        </div>

        <button
          onClick={() => void loadReports()}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2c2d33] hover:bg-[#37393e] border border-[#37393e] text-slate-300 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Catálogo</span>
        </button>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#2c2d33] border border-[#37393e] rounded-xl flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-pink-400" />
          <p className="text-xs">Consultando catálogo de relatórios autorizados...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-xl bg-[#2c2d33] border border-[#37393e] p-8 text-center text-slate-400">
          <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="font-semibold text-white">Não há relatórios disponíveis no momento.</p>
          <p className="text-xs text-slate-400 mt-1">
            Verifique as permissões de acesso ou aguarde a consolidação das rotinas de remarketing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => {
            const isBusy = busyKey === rep.key;
            return (
              <div
                key={rep.key}
                className="bg-[#2c2d33] border border-[#37393e] rounded-xl p-5 hover:border-[#4a4c55] transition flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      CSV / Auditado
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{rep.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{rep.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#37393e] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dados Reais do Servidor</span>
                  </div>

                  <button
                    disabled={!!busyKey}
                    onClick={() => void exportReport(rep.key, rep.label)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#202124] hover:bg-[#37393e] disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg border border-[#37393e] transition cursor-pointer"
                  >
                    <Download className={`w-3.5 h-3.5 text-pink-400 ${isBusy ? 'animate-bounce' : ''}`} />
                    <span>{isBusy ? 'Gerando...' : 'Exportar CSV'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelatoriosRemarketingPage;
