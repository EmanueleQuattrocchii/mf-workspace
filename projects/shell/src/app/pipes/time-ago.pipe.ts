import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';
    const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return formatDistanceToNow(date, { locale: it, addSuffix: true });
  }
}
