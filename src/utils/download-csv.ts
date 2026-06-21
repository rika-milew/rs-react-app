'use client';

export function downloadCSV(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.append(link);

  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
