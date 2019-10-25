import {Observable} from 'rxjs'
const source$ = new Observable(observer => {
  observer.next(1)
  observer.next(2)
  observer.next(3)
})
source$.subscribe({
  next: item => console.log(item)
})