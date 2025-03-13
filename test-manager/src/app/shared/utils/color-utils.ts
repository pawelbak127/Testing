export function getStatusColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    // Colors
    'green': 'success',
    'red': 'warn',
    'blue': 'primary',
    'purple': 'accent',
    'orange': 'accent',

    // Status labels
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

/**
 * Gets a CSS color variable based on a status code
 * Use this for dynamic styling where CSS classes aren't appropriate
 */
export function getStatusColorVariable(status: string): string {
  const cssVarMap: { [key: string]: string } = {
    'success': 'var(--success)',
    'warn': 'var(--error)',
    'primary': 'var(--primary)',
    'accent': 'var(--warning)',
    'default': 'var(--on-surface-medium)'
  };

  // First get the color class, then map to CSS variable
  const colorClass = getStatusColorClass(status);
  return cssVarMap[colorClass] || cssVarMap["default"];
}
