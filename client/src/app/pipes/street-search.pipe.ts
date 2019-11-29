import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'streetSearch'
})
export class StreetSearchPipe implements PipeTransform {

  transform(items: Array<any>, cityId: number): Array<any> {
    return items.filter(item => item.id === cityId);
  }

}
