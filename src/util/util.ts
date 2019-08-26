import{ execSync } from 'child_process';
export declare var debug: boolean;
debug = true;

export function sleep(ms: number) { //sleep
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function debug_log(arg: any) {
    if(debug) {
        console.log("[ DEBUGLOG ]", arg);
    }
}

export function error_log(arg: any) {
    if (debug) {
        console.log("[ ERROR ]", arg);
    }
}

export function log(arg: any) {
    if(debug) {
        console.log("[ LOG ]", arg);
    }
}

export function is_ip(host: string) {
    if(/[^0-9.]/.test(host)) {
        //this is a host
        return false;
    }
    else {
        //this is a ip
        return true;
    }
}

export function info(arg: any) {
    if(debug) {
        console.log("[ INFO ]", arg);
    }
}

export async function exec_promise(cmd: string) {
    return execSync(cmd);
}