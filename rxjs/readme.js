//////////////////////////////////////////////
// demo1：入门
//////////////////////////////////////////////
// import { of } from 'rxjs'
// const source$ = of(1, 2, 3)
// source$.subscribe(console.log)


//////////////////////////////////////////////
// demo2: next
//////////////////////////////////////////////
// import {Observable} from 'rxjs'
// const source$ = new Observable(observer => {
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
// })
// source$.subscribe({
//   next: item => console.log(item)
// })


//////////////////////////////////////////////
// demo3: 延迟next
//////////////////////////////////////////////
// import {Observable} from 'rxjs'
// const source$ = new Observable(observer => {
//   let number = 1
//   const handle = setInterval(() => {
//     observer.next(number++)
//     if (number > 3) {
//       clearInterval(handle)
//     }
//   }, 1000)
// })
// source$.subscribe({
//   next: item => console.log(item)
// })



//////////////////////////////////////////////
// demo4: complete
//////////////////////////////////////////////
// import { Observable } from 'rxjs'
// const source$ = new Observable(observer => {
//   let number = 1
//   const handle = setInterval(() => {
//     observer.next(number++)
//     if (number > 3) {
//       clearInterval(handle)
//       observer.complete()
//     }
//   }, 1000)
// })
// source$.subscribe({
//   next: item => console.log(item),
//   complete: () => console.log('No More Data')
// })




//////////////////////////////////////////////
// demo5: error
//////////////////////////////////////////////
// import { Observable } from 'rxjs'
// const source$ = new Observable(observer => {
//   observer.next(1)
//   observer.error('Someting Wrong')
//   observer.complete()
// })
// source$.subscribe({
//   next: item => console.log(item),
//   error: err => console.log(err),
//   complete: () => console.log('No More Data'),
// })




//////////////////////////////////////////////
// demo6: Observable简单形式（next、error、complete）
//////////////////////////////////////////////
// import { Observable } from 'rxjs'
// const source$ = new Observable(observer => {
//   observer.next(1)
//   observer.error('Someting Wrong')
//   observer.complete()
// })
// source$.subscribe(
//   // next
//   item => console.log(item),
//   // error，如果不关心错误处理，该参数可以用null占位：source$.subscribe(item => console.log(item), null, complete: () => console.log('No More Data') )
//   err => console.log(err),
//   // complete
//   () => console.log('No More Data'),
// )




//////////////////////////////////////////////
// demo7: 退订Observable
//////////////////////////////////////////////
// import { Observable } from 'rxjs'
// const source$ = new Observable(observer => {
//   let number = 1
//   const handle = setInterval(() => {
//       console.log('in onSubscribe ', number)
//       // 当退订之后，Observer不会造成任何响应，哪怕本程序依然在执行。
//     observer.next(number++)
//   }, 1000)
//   return {
//       // 退订的回调函数
//     unsubscribe: () => {
//       // clearInterval(handle)
//     }
//   }
// })
// const subscription = source$.subscribe(item => console.log(item))
// setTimeout(() => {
//   subscription.unsubscribe()
// }, 3000)




//////////////////////////////////////////////
// demo8： (流)管道 与 map操作符
//////////////////////////////////////////////
// import { Observable } from 'rxjs'
// import { map } from 'rxjs/operators'
// const source$ = Observable.create(observer => {
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
// })
// source$.pipe(map(x => x * x)).subscribe(console.log)




//////////////////////////////////////////////
// demo9： range 指定范围生成数据
//////////////////////////////////////////////
// import { range } from 'rxjs'
// const source$ = range(1, 100)
// source$.subscribe(console.log)




//////////////////////////////////////////////
// demo10： generate 循环创建
//////////////////////////////////////////////
// import { generate } from 'rxjs'
// const source$ = generate(
//   2, // 初始值，相当于for循环中的i=2
//   value => value < 10, //继续的条件，相当于for中的条件判断
//   value => value + 2, //每次值的递增
//   value => value * value // 产⽣的结果： 4 16 36 64
// )
// source$.subscribe(console.log)




//////////////////////////////////////////////
// demo10： interval 与 take
//////////////////////////////////////////////
// import { interval } from 'rxjs'
// import { take, map } from 'rxjs/operators'
// 每一秒吐出从0开始的索引
// const source$ = interval(1000)
// const result$ = source$.pipe(map(x => x + 1), take(4))
// result$.subscribe(console.log)




//////////////////////////////////////////////
// demo10： timer 与 take
//////////////////////////////////////////////
// import { timer } from 'rxjs'
// import { take } from 'rxjs/operators'
// // 3秒之后，每个1秒吐出（从0开始）
// const numbers$ = timer(3000, 1000)
// numbers$.pipe(take(4)).subscribe(x => console.log(x))




//////////////////////////////////////////////
// demo11: from 可把⼀切转化为Observable
//////////////////////////////////////////////
// import { from } from 'rxjs'
// const source$ = from([1, 2, 3])
// source$.subscribe(console.log)




//////////////////////////////////////////////
// demo12: fromPromise 异步处理的交接
//////////////////////////////////////////////
// import { from } from 'rxjs'
// const promise = Promise.resolve('good')
// // const promise = Promise.reject('oops')
// const source$ = from(promise)
// source$.subscribe(
//   console.log,  // good
//   error => console.log('catch', error),  // 如果解释reject则会输出 oops
//   () => console.log('complete')  // complete
// )




////////////////////////////////////////////////////////////
// demo13: fromEvent 把DOM中的事件转化为Observable对象中的数据
// <button id="button">button</button>
// <div id="text"></div>
////////////////////////////////////////////////////////////
// import { fromEvent } from 'rxjs'
// let clickCount = 0
// const event$ = fromEvent(document.querySelector('#button'), 'click')
// event$.subscribe(
//   () => {
//     document.querySelector('#text').innerText = ++clickCount
//   }
// )



//////////////////////////////////////////////
// demo13: fromEventPattern 接受两个函数参数，分别对应产⽣的Observable对象, 被订阅和退订时的动作
//////////////////////////////////////////////
// import { fromEventPattern } from 'rxjs'
// import EventEmitter from 'events'
// const emitter = new EventEmitter()
// const addHandler = (handler) => {
//   emitter.addListener('msg', handler)
// }
// const removeHandler = (handler) => {
//   emitter.removeListener('msg', handler)
// }
// const source$ = fromEventPattern(addHandler, removeHandler)
// const subscription = source$.subscribe(
//   console.log,
//   error => console.log('catch', error),
//   () => console.log('complete')
// )
// emitter.emit('msg', 'hello')
// emitter.emit('msg', 'world')
// subscription.unsubscribe()
// // 由于退订时触发的removeHandler，删除了订阅，所以输出不了fuck
// emitter.emit('msg', 'fuck')





//////////////////////////////////////////////
// demo14: ajax
// <button id="button">button</button>
// <div id="text"></div>
//////////////////////////////////////////////
// import { fromEvent } from 'rxjs'
// import { ajax } from 'rxjs/ajax'
// fromEvent(document.querySelector('#button'), 'click').subscribe(() => {
//     ajax('https://api.github.com/repos/ReactiveX/rxjs', {responseType: 'json'}).subscribe(value => {
//       const starCount = value.response.stargazers_count
//       document.querySelector('#text').innerText = starCount
//     })
// })






//////////////////////////////////////////////
// demo15: repeatWhen 重复订阅
//////////////////////////////////////////////
// import { of } from 'rxjs'
// import { repeatWhen, delay } from 'rxjs/operators'
// const source$ = of(1, 2, 3)
// const notifier = (notification$) => {
//   return notification$.pipe(delay(2000))
// }
// const repeated$ = source$.pipe(repeatWhen(notifier))
// repeated$.subscribe(console.log)







//////////////////////////////////////////////
// demo16: concat 合并流（首尾合并）
//////////////////////////////////////////////
// import { of, concat } from 'rxjs'
// // import { concat } from 'rxjs/operators' // source1$.pipe(concat(source2$))
// const source1$ = of(1, 2, 3)
// const source2$ = of(4, 5, 6)
// const concated$ = concat(source1$, source2$)
// concated$.subscribe(console.log)





//////////////////////////////////////////////
// demo17: merge 合并流（先到先得）
//////////////////////////////////////////////
// import { timer, merge } from 'rxjs'
// import { map } from 'rxjs/operators'
// const source1$ = timer(0, 1000).pipe(map(x => x + 'A'))
// const source2$ = timer(500, 1000).pipe(map(x => x + 'B'))
// const merged$= merge(source1$, source2$)
// merged$.subscribe(
//   console.log,
//   null,
//   () => console.log('complete')
// )




//////////////////////////////////////////////
// demo18: merge 同步限流
//////////////////////////////////////////////
// import { timer, merge } from 'rxjs'
// import { map } from 'rxjs/operators'
// const source1$ = timer(0, 1000).pipe(map(x => x+'A'))
// const source2$ = timer(500, 1000).pipe(map(x => x+'B'))
// const source3$ = timer(1000, 1000).pipe(map(x => x+'C'))
// // 其中source3$永远不会有进入merged$的机会，因为我限制了最多只合并2个。
// const merged$ = merge(source1$, source2$, source3$, 2)
// merged$.subscribe(
//   console.log,
//   null,
//   () => console.log('complete')
// )




//////////////////////////////////////////////
// demo18: merge 合并事件（同时触发click和touchend）
//////////////////////////////////////////////
// import { merge, fromEvent } from 'rxjs'
// const element = document.getElementById('button')
// const click$ = fromEvent(element, 'click')
// const touchend$ = fromEvent(element, 'touchend')
// merge(click$, touchend$).subscribe(console.log)






//////////////////////////////////////////////
// demo19: zip 神奇的拉链合并（像拉链⼀样做到⼀对⼀咬合）
//////////////////////////////////////////////
// import { of, zip } from 'rxjs'
// const source1$ = of(1, 2, 3);
// const source2$ = of('a', 'b', 'c');
// const zipped$ = zip(source1$, source2$);
// // (2) [1, "a"]
// // (2) [2, "b"]
// // (2) [3, "c"]
// zipped$.subscribe(
//   console.log,
//   null,
//   () => console.log('complete')
// );






//////////////////////////////////////////////
// demo20: combineLatest 合并最后⼀个数据 （较难理解，但理解之后非常牛逼有趣）
//////////////////////////////////////////////
// import { timer, combineLatest } from 'rxjs'
// const source1$ = timer(500, 1000);
// const source2$ = timer(1000, 1000);
// const result$ = combineLatest(source1$, source2$);
// // (2) [0, 0]
// // (2) [1, 0]
// // (2) [1, 1]
// // (2) [2, 1]
// // (2) [2, 2]
// // (2) [3, 2]
// // (2) [3, 3]
// // (2) [4, 3]
// result$.subscribe(
//   console.log,
//   null,
//   () => console.log('complete')
// );