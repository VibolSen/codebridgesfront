type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean | undefined | null };

/**
 * Lightweight class name merge utility without extra external dependencies.
 */
export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  const classes: string[] = [];

  const process = (val: ClassValue | ClassValue[]) => {
    if (!val) return;

    if (typeof val === 'string' || typeof val === 'number') {
      classes.push(String(val));
    } else if (Array.isArray(val)) {
      val.forEach(process);
    } else if (typeof val === 'object') {
      for (const [key, enabled] of Object.entries(val)) {
        if (enabled) {
          classes.push(key);
        }
      }
    }
  };

  inputs.forEach(process);
  return classes.join(' ').trim();
}
