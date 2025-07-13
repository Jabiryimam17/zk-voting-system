import build_eddsa from "../utilities/circomlibjs/src/eddsa.js"
import build_babyjub from "../utilities/circomlibjs/src/babyjub.js"
import build_poseidon from "../utilities/circomlibjs/src/poseidon_opt.js"
import build_pedersen from "../utilities/circomlibjs/src/pedersen_hash.js"
import {li_buff_2_bits, li_int_2_bits, validate_point, bits_2_buffer} from "../utilities/IntBuffConv.js"
import { Scalar } from "ffjavascript";
import fs from "fs"
import dotenv from 'dotenv'
dotenv.config()

const priv_key_hex = process.env.PRIVATE_KEY;

const priv_key = Buffer.from(priv_key_hex, "hex");


async function main ()  {
    const [hid_str, sid_str] = process.argv.slice(2);
    const hid = BigInt(hid_str)
    const sid = BigInt(sid_str)

    const baby_jub = await build_babyjub();
    const eddsa = await build_eddsa();
    const poseidon =  await build_poseidon();
    const pedersen = await build_pedersen();



    const pub_key = eddsa.prv2pub(priv_key);
    const msg_hash = poseidon([hid, sid])
    const {R8, S} = eddsa.signPedersen(priv_key, msg_hash)


    await validate_point(pub_key)
    await validate_point(R8)


    const packed_A = baby_jub.packPoint(pub_key);
    const packed_R8 = baby_jub.packPoint(R8);


    const A_bits = li_buff_2_bits(packed_A);
    const R8_bits = li_buff_2_bits(packed_R8);
    const S_bits = li_int_2_bits(S, 256);
    const msg_bits = li_buff_2_bits(msg_hash).slice(0, 254);

    const output = {
        R8:R8_bits,
        S:S_bits,
        A:A_bits,
        msg:msg_bits,
        priv_key:priv_key_hex,
    }
    fs.writeFileSync("C:\\Users\\Jabir\\circoms\\ecdsa\\input.json", JSON.stringify(output,null,2))
    console.log(JSON.stringify(output))
}

await main();

