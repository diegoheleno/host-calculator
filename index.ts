import { execute } from './host-calculator'

let response

response = execute({
    host: [ 110, 254, 94, 132 ],
    mask: [ 255, 255, 240, 0 ]
})

console.log(response)

response = execute({
    host: [ 69, 69, 69, 69 ],
    mask: [ 255, 255, 248, 0 ]
})

console.log(response)