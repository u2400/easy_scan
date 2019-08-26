export function input_port_list_to_scan_port_list(input_port_list: string): Array<number> {
    let port_list: Array<number> = [];
    let illage_char: any = input_port_list.match(/[^0-9\-,]/);
    if (illage_char) {
        throw `unexpect char ${illage_char[0]} in ${input_port_list}, port must satify /[^0-9,\\-]/`;
    }
    input_port_list = input_port_list.replace(/[\s]/g, "");
    let port_range_list: Array<string> = input_port_list.split(",");
    for (let port_range of port_range_list) {
        let [,a,b] = port_range.match(/([0-9]+)-([0-9]+)/);
        let [biger, smaller]: Array<number> = 
        Number(a) > Number(b) ? 
        [Number(a), Number(b)] :
        [Number(b), Number(a)]
        for (let i = smaller; i < biger; i++) {
            port_list.push(i);
        }
    }

    return port_list;
}

//"12-321".match(/([0-9]+)-([0-9]+)/);