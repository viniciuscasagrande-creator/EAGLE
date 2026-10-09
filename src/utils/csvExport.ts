/**
 * Exportador de arquivos CSV padronizado em UTF-8 com BOM
 * Garante abertura correta de acentuação no Microsoft Excel e Google Sheets.
 * Suporta ambas assinaturas: (filename, headers, rows) ou (headers, rows, filename).
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void;
export function downloadCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][], filename: string): void;
export function downloadCsv(
  arg1: string | string[],
  arg2: string[] | (string | number | boolean | null | undefined)[][],
  arg3?: (string | number | boolean | null | undefined)[][] | string
): void {
  let filename: string;
  let headers: string[];
  let rows: (string | number | boolean | null | undefined)[][];

  if (typeof arg1 === 'string') {
    filename = arg1;
    headers = arg2 as string[];
    rows = (arg3 as (string | number | boolean | null | undefined)[][]) || [];
  } else {
    headers = arg1;
    rows = (arg2 as (string | number | boolean | null | undefined)[][]) || [];
    filename = (arg3 as string) || 'relatorio-diskingressos.csv';
  }

  const bom = '\uFEFF';
  const csvContent =
    bom +
    [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(';'),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const val = cell === null || cell === undefined ? '' : String(cell);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(';')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
