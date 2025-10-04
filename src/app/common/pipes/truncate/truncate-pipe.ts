import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, trail = '...'): unknown {
    if (!value) return '';
    if (value.length <= limit) return;
    return value.substring(0, limit) + trail;
  }
}
