type Bit = 0 | 1
type Host = [number, number, number, number]
type Byte = [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]
type HostBinary = [Byte, Byte, Byte, Byte]

const binaries = [128, 64, 32, 16, 8, 4, 2, 1]

const defaultHost = () : Host => [0, 0, 0, 0]
const defaultByte = () : Byte => [0, 0, 0, 0, 0, 0, 0, 0]
const defaultHostBinary = () : HostBinary => [defaultByte(), defaultByte(), defaultByte(), defaultByte()]

interface HostResquest {
    host: Host
    mask: Host
}

interface HostResponse extends HostResquest {
    net: Host
    broad: Host
    first: Host
    last: Host
    totalHost: number
}

const decimalToByte = (value: number): Byte => {
    const byte: Byte = defaultByte()

    binaries.map((binary, index) => {
        if (value >= binary) {
            byte[index] = 1
            value -= binary
        }
    })

    return byte
}

const hostToBinary = (host: Host): HostBinary => {
    const hostBinary: HostBinary = defaultHostBinary()

    host.map((value, index) => {
        hostBinary[index] = decimalToByte(value)
    })

    return hostBinary
}

const binaryToHost = (binary: HostBinary): Host => {
    const host: Host = defaultHost()

    binary.map((byte, index) => {
        byte.map((bit, i) => {
            if (bit)
                host[index] += binaries[i]
        })
    })

    return host
}

const getNet = (host: HostBinary, mask: HostBinary): HostBinary => {
    const net: HostBinary = defaultHostBinary()

    for (let x = 0; x < 4; x++)
        for (let y = 0; y < 8; y++) {
            if (host[x][y] && mask[x][y])
                net[x][y] = 1
        }

    return net
}

const getFirstLastAndBroad = (net: HostBinary, mask: HostBinary) => {
    const first: HostBinary = defaultHostBinary()
    const last: HostBinary = defaultHostBinary()
    const broad: HostBinary = defaultHostBinary()
    let totalHost = 0

    for (let x = 0; x < 4; x++)
        for (let y = 0; y < 8; y++) {
            if (mask[x][y]) {
                first[x][y] = net[x][y]
                last[x][y] = net[x][y]
                broad[x][y] = net[x][y]
            } else {
                first[x][y] = 0
                last[x][y] = 1
                broad[x][y] = 1
                totalHost = totalHost == 0 ? 1 : totalHost * 2
            }
        }

    first[3][7] = 1
    last[3][7] = 0

    return {
        first: binaryToHost(first),
        last: binaryToHost(last),
        broad: binaryToHost(broad),
        totalHost
    }
}

export const execute = (request: HostResquest): HostResponse => {
    const host = hostToBinary(request.host)
    const mask = hostToBinary(request.mask)
    
    const net = getNet(host, mask)
    const { first, last, broad, totalHost } = getFirstLastAndBroad(net, mask)

    return {
        ...request, net: binaryToHost(net), first, last, broad, totalHost
    }
}