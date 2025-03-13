import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'enumDisplay'
})
export class EnumDisplayPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
        // Convert to lowercase, split by underscores, then capitalize each word.
        return value
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
