import { ip } from "../../util/class";
import { scan_a_port } from "./rely/scan_a_port";
import { _global } from "../..";
import { sleep } from "../../util/util";

export async function tcp_port_scan(ip: ip) {
    let port_end: number = _global.get("port_end") + 1;
    for (let port_id = _global.get("port_start"); port_id < port_end; port_id++) {
        await sleep(1);
        let tmp: Promise<any> = scan_a_port(ip.get_name(), port_id) //check if the port is open
        .then((res: boolean) => {
            if(res) { //open...
                ip.scan_port(port_id);
            }
            //if port is closed, nothing will be done
        })
        ip.promise_list.set(`${port_id}`, tmp);
    }
}
