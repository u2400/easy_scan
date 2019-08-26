import { error_log, info, sleep, debug_log } from "./util";
import * as requst from "request-promise";
import { tcp_port_scan } from "../package/port_scan/port_scan";

export class mapping<T> {
    private value: any;
    public length: number;

    set(key: string, value: T): void {
        if (!this.has(key)) {
            this.length++;
        }
        this.value[key] = value;
    }

    get_array_value(): Array<T> {
        let array_of_value: Array<T> = [];
        for (let key in this.value) {
            array_of_value.push(this.value[key]);
        }
        return array_of_value;
    }

    get(key: string): T {
        return this.value[key];
    }

    has(key: string): boolean {
        return this.value[key] === undefined ? false : true;
    }

    delete(key: string): boolean {
        if(this.has(key)) {
            delete this.value[key];
            this.length --;
            return true;
        }
        else {
            return false;
        }
    }

    async do(callback: Function): Promise<any> {
        for (let i in this.value) {
            await callback(this.value[i]);
        }
    }

    constructor() {
        this.value = {};
        this.length = 0;
    }
}

class ip_base {
    public name: Array<number>;

    constructor(ip_string: string) {
        this.name = this.ipv4_string_to_array(ip_string);
    }

    get_name(): string {
        return this.name.join("."); 
    }

    ipv4_string_to_array(ip_string: string): Array<number> {
        let tmp = ip_string.split(".").map(x => Number(x));
        for (let i of tmp) {
            if(!( i>=0 && i <= 255)) {
                throw new Error(`input ip is illegal expectd 0.0.0.0-254.254.254.254 found ${tmp.join('.')}`);
            }
        }
        return tmp;
    }

    static is_firest_bigger_then_second (ip_1: ip_base, ip_2: ip_base): boolean {
        let different_class: number;
        for (let i: number = 0; i < 4; i++) {
            if(ip_1.name[i] !== ip_2.name[i]) {
                different_class = i;
                break;
            }
        }
        if (ip_1.name[different_class] > ip_2.name[different_class]) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class ip_name extends ip_base {
    constructor(ip_string: string) {
        super(ip_string); //not use
    }

    add() {
        this.name[3]++;
        if(this.name[3] === 254) {
            this.name[2]++;
            this.name[3] = 1;
        }
        if(this.name[2] === 254) {
            this.name[1]++;
            this.name[2] = 0;
        }
        if(this.name[1] === 254) {
            this.name[0]++;
            this.name[1] = 0;
        }
        if(this.name[0] === 255) {
            this.name[0] = 254;
            error_log("254.254.254.254 is the biggest ip can't add!");
        }
    }
}

export class ip extends ip_base {
    public hosts: mapping<string>;
    public promise_list: mapping<Promise<any>>;
    private port_list: mapping<port>;

    constructor(ip_string: string) {
        super(ip_string);// not use
        this.port_list = new mapping();
        this.promise_list = new mapping();
        this.promise_list.set(`${ip_string}_port_scan`, tcp_port_scan(this));
        ip_map.set(this.get_name(), this);
    }

    scan_port(port_id: string | number) { //scan the port corresponding to ip
        info(`${this.get_name()}:${port_id} port scan start`);
        port_id = String(port_id);
        this.port_list.set(port_id, new port(port_id, this.get_name(), this));
        info(`${this.get_name()}:${port_id} port scan end`);
    }

    async wait_to_compiled(): Promise<void> {
        debug_log("wait_to_compiled start");
        while(this.promise_list.length == 0) {
            debug_log("sleep: this.promise_list.length == 0");
            await sleep(2000);
        }
        let last_lenth: number = this.promise_list.length;
        while (true) {
            debug_log("sleep: promise_list is growing");
            await sleep(1000);
            if(last_lenth == this.promise_list.length) {
                break;
            }
            else {
                last_lenth = this.promise_list.length;
            }
        }
        await Promise.all(this.promise_list.get_array_value());
        debug_log("wait_to_compiled end");
    }
}

export class port {
    name: Array<number>;
    server: string;
    title: string;
    statuscode: number;
    href: string;

    constructor(port_id: string, ip_name: string, this_ip: ip) {
        let host = `${ip_name}:${port_id}`;
        let this_obj = this;
        let pormise_req = requst({ 
            uri: `http://${host}`,
            rejectUnauthorized: false,
            simple: false,
            transform: function(body, response) {
                this_obj.href = response.request.href;
                this_obj.server = String(response.headers.server);
                try {
                    this_obj.title = body.match(/<title>(.*?)<\/title>/)[1];
                }
                catch(e) {
                    this_obj.title = body.match(/<h2>(.*?)<\/h2>/)[1];
                }
                this_obj.statuscode = response.statusCode;
            },
        })
        .catch((e: any) => {
            console.log(e);
            this_obj.server = "not http server";
            this_obj.title = "N/A";
        })
        this_ip.promise_list.set(`${port_id}`, pormise_req);
    }
}

export let ip_map: mapping<ip> = new mapping();