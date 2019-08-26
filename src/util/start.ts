// import * as inquirer from "inquirer";
import { _global } from "..";
import { error_log, debug_log, info } from "./util";
import { ip_name } from "./class";
import * as yargs from "yargs";

export let answers = yargs
.option("i",{
    alias: "ip",
    describe: "input ip(s) you want to scan",
    type: "string",
})
.option("p", {
    alias: "port",
    describe: "input port(s) you want to scan",
    type: "string",
})
.example('node easyscan -i 127.0.0.1 -p 1-65535', 'scan an ip')
.example('node easyscan -i 192.168.1.1-192.168.1.225 -p 1-65535', 'scan ips')
.help("h")
.alias('h', 'help')
.argv;

export async function start(): Promise<Array<ip_name>> {
    debug_log("start.js start");
    debug_log(answers);
    // let questions: Array<object> = [
    //     {
    //         type: 'input',
    //         name: 'i',
    //         message: "input ip you want to scan",
    //     },
    //     {
    //         type: 'input',
    //         name: 'p',
    //         message: "input port you want to scan (1-65535)",
    //         default: function() {
    //             return '1-65535';
    //         }
    //     }
    // ]
    
    // let answers = await inquirer.prompt(questions).then((answers: any) => {
    //     return answers;
    // });
    // console.log(answers);
    let _tmp1: number, _tmp2: number;
    if(/^[0-9]{0,5}$/.test(answers.p) && (Number(answers.p) > 0 && Number(answers.p) <= 65535)) {
        _tmp1 = Number(answers.p);
        _tmp2 = Number(answers.p);
    }
    else if(/^[0-9]{0,5}-[0-9]{0,5}$/.test(answers.p)) {
        [_tmp1, _tmp2] = answers.p.split("-").map((x: string)=> Number(x)).sort(); 
    }
    else {
        error_log(`unexpected char in port, port need to meet '[0-9\-]+' or '[0-9]{0,5}-[0-9]{0,5}', found ${answers.p}`);
        process.exit(-1);
    }
    
    _global.set("port_start", _tmp1);
    _global.set("port_end", _tmp2);
    debug_log("start.js end");
    let _tmp_s: string, _tmp_e: string;
    if (/^[0-9.]+$/) {
        _tmp_s = answers.i;
        _tmp_e = answers.i;
    }
    else if(/^[0-9.\-]+$/.test(answers.i)) {
        [_tmp_s, _tmp_e] = answers.i.split("-");
    } 
    else {
        throw new Error("illegal ip");
    }
    let [start, end] = [_tmp_s, _tmp_e];
    info(`get ip start:${start}, end: ${end}`);
    let start_ip = new ip_name(start);
    let end_ip = new ip_name(end);
    end_ip.add();
    
    return [start_ip, end_ip];
}
