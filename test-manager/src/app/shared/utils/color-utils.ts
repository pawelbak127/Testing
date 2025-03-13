export function getStatusColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'green': 'success',
    'red': 'warn',
    'blue': 'primary',
    'purple': 'accent',
    'orange': 'accent',
    // Statusy
    'Wysoki': 'warn',
    'Średni': 'accent',
    'Niski': 'primary',
    'Aktywny': 'success',
    'W przeglądzie': 'default',
    'Nieaktywny': 'warn',
    'Krytyczny': 'warn'
  };

  return colorMap[color] || 'default';
}
