import {mobileInput,scrollEvent} from './dist/base'

mobileInput()
scrollEvent([
  {top: 300, fun: () => console.log(300)},
  {top: 700, fun: () => console.log(700)},
  {top: 1500, fun: () => console.log(1500)},
], () => console.log("end"))