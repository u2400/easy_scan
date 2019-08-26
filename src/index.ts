import { ip, mapping, ip_name, ip_map } from "./util/class";
import { start } from "./util/start";
import { error_log } from "./util/util";

export let _global: mapping<any> = new mapping();
export let promise_list: Array<Promise<any>> = [];

async function main () {
    let [start_ip, end_ip]: Array<ip_name> = await start();
    try {
        while (ip.is_firest_bigger_then_second(end_ip, start_ip)) {
            new ip(start_ip.get_name());
            start_ip.add();
        }
    }
    catch(e) {
        error_log(e);
    }
    await ip_map.do(async (one_of_ip: ip) => {
        await one_of_ip.wait_to_compiled();
    })
}

main()
.then(() => {
    console.log(JSON.stringify(ip_map.get_array_value()));
})
