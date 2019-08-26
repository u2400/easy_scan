import * as net from "net";

//探测端口是否开放.
export async function scan_a_port(ip: string, port: number): Promise<boolean> {
    return new Promise(async (resolve,) => {
        let socket = net.createConnection(port,ip);
        socket.setTimeout(500);
        socket.on('timeout', () => {
            socket.destroy();
            console.log(`${port} is timeout`);
            resolve(false);
        })
        socket.on('error',() => {
            socket.destroy();
            resolve(false);
        }) 
        socket.on("connect", () => {
            try {
                socket.destroy();
            }
            catch(e){}
            console.log(`${port} is open`);
            resolve(true);
        })
    })
}

