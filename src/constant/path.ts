import { HdPath, Slip10RawIndex } from "@cosmjs/crypto";

export function makeQubePath(): HdPath {
        return [
                Slip10RawIndex.hardened(44),
                Slip10RawIndex.hardened(60),
                Slip10RawIndex.hardened(0),
                Slip10RawIndex.normal(0),
                Slip10RawIndex.normal(0),
        ];
}