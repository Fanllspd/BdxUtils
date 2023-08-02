const request = require('sync-request');
const zlib = require('zlib');
const fs = require('fs');
const crypto = require('crypto');

class BDXReaderClass {
    constructor() {
        this.brushPosition = [0, 0, 0];
        this.blockPalette = {};
        this.blockIndex = 0;
        this.setDetails = [];
        this.ifLogin = false;
        this.sourceAuthor = '';
        this.ifSign = false;
        //this.cmdArray = []
        this.offset = 0;
        //this.buf = Buffer.from(buffer);
        //this.commandArray = []
    }

    Read(path, callback) {
        let buf = fs.readFileSync(path);
        let index = 0;
        let blockPalette = [];
        let author = '';

        if (buf.subarray(0, 3).toString() !== 'BD@') {
            throw new Error('Non-standard BDX Files');
        }

        zlib.brotliDecompress(buf.subarray(3), (err, bufferDecompressed) => {
            if (err) {
                throw new Error(err);
            }
            this.buf = bufferDecompressed;
            //let ReaderClass = new BDXReaderClass(bufferDecompressed);
            let BDX = this.readString(this.offset);

            if (BDX != 'BDX') {
                throw new Error('Non-standard BDX Files');
            }

            // Get Auther
            //index += 4
            this.offset += 1;
            author = this.readString(index);
            console.log(author);
            //console.log(bufferDecompressed.length);
            let flag = true;
            while (flag) {
                //(flag) {

                this.offset += 1;
                //console.log(this.offset);
                switch (bufferDecompressed[this.offset - 1]) {
                    case 0x01: // CreateConstantString
                        let string = this.readString();
                        this.CreateConstantString(string);
                        blockPalette.push(string);
                        break;
                    case 0x05: // PlaceBlockWithBlockStates
                        blockConstantStringID = this.readUInt16BE();
                        blockStatesConstantStringID = this.readUInt16BE();
                        this.PlaceBlockWithBlockStates(
                            blockConstantStringID,
                            blockStatesConstantStringID,
                        );
                        break;
                    case 0x06: //AddInt16ZValue0
                        value = this.readUInt16BE();
                        this.AddInt16ZValue0(value);
                        break;
                    case 0x07: // PlaceBlockWithBlockStates
                        blockConstantStringID = this.readUInt16BE();
                        blockData = this.readUInt16BE();
                        this.PlaceBlockWithBlockStates(blockConstantStringID, blockData);
                        break;
                    case 0x08: // AddZValue0
                        this.AddZValue0();
                        break;
                    case 0x09: // NoOperation
                        this.NoOperation();
                        break;
                    case 0x0c: // AddInt32ZValue
                        value = this.readUInt32BE();
                        this.AddInt32ZValue(value);
                        break;
                    case 0x0d: // PlaceBlockWithBlockStatesDeprecated
                        blockConstantStringID = this.readUInt16BE();
                        blockData = this.readInt8();
                        this.PlaceBlockWithBlockStates(blockConstantStringID, blockData);
                        break;
                    case 0x0e:
                        this.AddXValue();
                        break;
                    case 0x0f:
                        this.SubtractXValue();
                        break;
                    case 0x10:
                        this.AddYValue();
                        break;
                    case 0x11:
                        this.SubtractYValue();
                        break;
                    case 0x12:
                        this.AddZValue();
                        break;
                    case 0x13:
                        this.SubtractZValue;
                        break;
                    case 0x14: // AddInt16XValue
                        value = this.readInt16BE();
                        this.AddInt16XValue(value);
                        break;
                    case 0x15: // AddInt32XValue
                        value = this.readInt32BE();
                        this.AddInt32XValue(value);
                        break;
                    case 0x16: // AddInt16YValue
                        value = this.readInt16BE();
                        this.AddInt16YValue(value);
                        break;
                    case 0x17: // AddInt32YValue
                        value = this.readInt32BE();
                        this.AddInt32YValue(value);
                        break;
                    case 0x18: // AddInt16ZValue
                        value = this.readInt16BE();
                        this.AddInt16ZValue(value);
                        break;
                    case 0x19: // AddInt32ZValue
                        value = this.readInt32BE();
                        this.AddInt32ZValue(value);
                        break;
                    case 0x1a: // SetCommandBlockData
                        mode = this.readUInt32BE();
                        command = this.readString();
                        customName = this.readString();
                        lastOutput = this.readString();
                        tickDelay = this.readInt32BE();
                        executeOnFirstTick = this.readBool();
                        trackOutput = this.readBool();
                        conditional = this.readBool();
                        needsRedstone = this.readBool();
                        this.SetCommandBlockData(
                            mode,
                            command,
                            customName,
                            lastOutput,
                            tickDelay,
                            executeOnFirstTick,
                            trackOutput,
                            conditional,
                            needsRedstone,
                        );
                        break;
                    case 0x1b: // PlaceBlockWithCommandBlockData
                        blockConstantStringID = this.readUInt16BE();
                        blockData = this.readUInt16BE();
                        mode = this.readUInt32BE();
                        command = this.readString();
                        customName = this.readString();
                        lastOutput = this.readString();
                        tickdelay = this.readInt32BE();
                        executeOnFirstTick = this.readBool();
                        trackOutput = this.readBool();
                        conditional = this.readBool();
                        needsRedstone = this.readBool();
                        this.PlaceBlockWithCommandBlockData(
                            blockConstantStringID,
                            blockData,
                            mode,
                            command,
                            customName,
                            lastOutput,
                            tickdelay,
                            executeOnFirstTick,
                            trackOutput,
                            conditional,
                            needsRedstone,
                        );
                        break;
                    case 0x1c: // AddInt8XValue
                        value = this.readInt8();
                        this.AddInt8XValue(value);
                        break;
                    case 0x1d: // AddInt8YValue
                        value = this.readInt8();
                        this.AddInt8YValue(value);
                        break;
                    case 0x1e: // AddInt8ZValue
                        value = this.readInt8();
                        this.AddInt8ZValue(value);
                        break;
                    case 0x1f: // UseRuntimeIDPool
                        poolId = this.readUInt8();
                        this.UseRuntimeIDPool(poolId);
                        break;
                    case 0x20: // PlaceRuntimeBlock
                        runtimeId = this.readUInt16BE();
                        this.PlaceRuntimeBlock(runtimeId);
                        break;
                    case 0x21: // PlaceRuntimeBlockWithUint32RuntimeID
                        runtimeId = this.readUInt32BE();
                        this.PlaceRuntimeBlockWithUint32RuntimeID(runtimeId);
                        break;
                    case 0x22: // PlaceRuntimeBlockWithCommandBlockData
                        runtimeId = this.readUInt16BE();
                        mode = this.readUInt32BE();
                        command = this.readString();
                        customName = this.readString();
                        lastOutput = this.readString();
                        tickdelay = this.readInt32BE();
                        executeOnFirstTick = this.readBool();
                        trackOutput = this.readBool();
                        conditional = this.readBool();
                        needsRedstone = this.readBool();
                        this.PlaceRuntimeBlockWithCommandBlockData(
                            runtimeId,
                            mode,
                            command,
                            customName,
                            lastOutput,
                            tickdelay,
                            executeOnFirstTick,
                            trackOutput,
                            conditional,
                            needsRedstone,
                        );
                        break;
                    case 0x23: // PlaceRuntimeBlockWithCommandBlockDataAndUint32RuntimeID
                        runtimeId = this.readUInt32BE();
                        mode = this.readUInt32BE();
                        command = this.readString();
                        customName = this.readString();
                        lastOutput = this.readString();
                        tickdelay = this.readInt32BE();
                        executeOnFirstTick = this.readBool();
                        trackOutput = this.readBool();
                        conditional = this.readBool();
                        needsRedstone = this.readBool();
                        this.PlaceRuntimeBlockWithCommandBlockDataAndUint32RuntimeID(
                            runtimeId,
                            mode,
                            command,
                            customName,
                            lastOutput,
                            tickdelay,
                            executeOnFirstTick,
                            trackOutput,
                            conditional,
                            needsRedstone,
                        );
                        break;
                    case 0x24: // PlaceCommandBlockWithCommandBlockData
                        data = this.readUInt16BE();
                        mode = this.readUInt32BE();
                        command = this.readString();
                        customName = this.readString();
                        lastOutput = this.readString();
                        tickdelay = this.readInt32BE();
                        executeOnFirstTick = this.readBool();
                        trackOutput = this.readBool();
                        conditional = this.readBool();
                        needsRedstone = this.readBool();
                        this.PlaceCommandBlockWithCommandBlockData(
                            runtimeId,
                            mode,
                            command,
                            customName,
                            lastOutput,
                            tickdelay,
                            executeOnFirstTick,
                            trackOutput,
                            conditional,
                            needsRedstone,
                        );
                        break;
                    case 0x25: // PlaceRuntimeBlockWithChestData
                        runtimeId = this.readUInt16BE();
                        slotCount = this.readUInt8();
                        data = this.readChestData(slotCount);
                        this.PlaceRuntimeBlockWithChestData(runtimeId, slotCount, data);
                        break;
                    case 0x26: // PlaceRuntimeBlockWithChestDataAndUint32RuntimeID
                        runtimeId = this.readUInt32BE();
                        slotCount = this.readUInt8();
                        data = this.readChestData(slotCount);
                        this.PlaceRuntimeBlockWithChestDataAndUint32RuntimeID(
                            runtimeId,
                            slotCount,
                            data,
                        );
                        break;
                    case 0x27: // AssignDebugData
                        length = this.readUInt32BE();
                        buffer = this.readUInt8();
                        this.AssignDebugData(length, buffer);
                        break;
                    case 0x28: // TODO: PlaceBlockWithChestData
                        blockConstantStringID = this.readUInt16BE();
                        blockData = this.readUInt16BE();
                        data = this.readChestData(1); // ?????
                        this.PlaceBlockWithChestData(blockConstantStringID, blockData, data);
                        break;
                    case 0x29: // TODO: PlaceBlockWithNBTData
                        blockConstantStringID = this.readUInt16BE();
                        blockStatesConstantStringID1 = this.readUInt16BE();
                        blockStatesConstantStringID2 = this.readUInt16BE();
                        data = 3;
                        break;
                    case 0x58:
                        this.Terminate();
                        //console.log(this.offset);
                        flag = false;
                        break;
                    case 0x5a:
                        break;
                }
                //index += 1

                //console.log(this.brushPosition)
            }
            if (flag == false) {
                // && bufferDecompressed[bufferDecompressed.length - 1] == 0x5a) {
                [this.ifSign, this.sourceAuthor] = this.verifyBDX();
            }
            callback(this);
        });
    }

    /*
    char *constantString
    */
    CreateConstantString(constantString) {
        // 0x01
        let obj = {
            internalName: 'CreateConstantString',
            constantString: constantString,
        };
        this.blockPalette[this.blockIndex] = constantString;
        this.blockIndex += 1;
        this.setDetails.push(obj);
    }

    /*
    unsigned short blockConstantStringID
    unsigned short blockStatesConstantStringID
    */
    PlaceBlockWithBlockStates(blockConstantStringID, blockStatesConstantStringID) {
        // 0x05
        let obj = {
            internalName: 'PlaceBlockWithBlockStates',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            data: blockStatesConstantStringID,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short value
    */
    AddInt16ZValue0(value) {
        // 0x06
        this.brushPosition[2] += value;
        let obj = {
            internalName: 'AddInt16ZValue0',
            value: value,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short blockConstantStringID
    unsigned short blockData
    */
    PlaceBlock(blockConstantStringID, blockData) {
        // 0x07
        let obj = {
            internalName: 'PlaceBlock',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            data: blockData,
        };
        this.setDetails.push(obj);
    }

    AddZValue0() {
        // 0x08
        this.brushPosition[2] += 1;
        let obj = {
            internalName: 'AddZValue0',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    NoOperation() {
        // 0x09
        let obj = {
            internalName: 'NoOperation',
        };
        this.setDetails.push(obj);
        //console.log('No Operation');
    }

    /*
    unsigned int value
    */
    AddInt32ZValue0(value) {
        // 0x0C
        this.brushPosition[2] += value;
        let obj = {
            internalName: 'AddInt32ZValue0',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short blockConstantStringID
    char *blockStatesString
    */
    PlaceBlockWithBlockStatesDeprecated(blockConstantStringID, blockStatesString) {
        // 0x0D
        let obj = {
            internalName: 'PlaceBlockWithBlockStatesDeprecated',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            State: blockStatesString,
        };
        this.setDetails.push(obj);
    }

    AddXValue() {
        // 0x0E
        this.brushPosition[0] += 1;
        let obj = {
            internalName: 'AddXValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    SubtractXValue() {
        // 0x0F
        this.brushPosition[0] -= 1;
        let obj = {
            internalName: 'SubtractXValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    AddYValue() {
        // 0x10
        this.brushPosition[1] += 1;
        let obj = {
            internalName: 'AddYValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    SubtractYValue() {
        // 0x11
        this.brushPosition[1] -= 1;
        let obj = {
            internalName: 'SubtractYValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }
    AddZValue() {
        // 0x12
        this.brushPosition[2] += 1;
        let obj = {
            internalName: 'AddZValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    SubtractZValue() {
        // 0x13
        this.brushPosition[2] -= 1;
        let obj = {
            internalName: 'SubtractZValue',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    short value
    */
    AddInt16XValue(value) {
        // 0x14
        this.brushPosition[0] += value;
        let obj = {
            internalName: 'AddInt16XValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    int value
    */
    AddInt32XValue(value) {
        // 0x15
        this.brushPosition[0] += value;
        let obj = {
            internalName: 'AddInt32XValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    short value
    */
    AddInt16YValue(value) {
        // 0x16
        this.brushPosition[1] += value;
        let obj = {
            internalName: 'AddInt16YValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    int value
    */
    AddInt32YValue(value) {
        // 0x17
        this.brushPosition[1] += value;
        let obj = {
            internalName: 'AddInt32YValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    short value
    */
    AddInt16ZValue(value) {
        // 0x18
        this.brushPosition[2] += value;
        let obj = {
            internalName: 'AddInt16ZValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    int value
    */
    AddInt32ZValue(value) {
        // 0x19
        this.brushPosition[2] += value;
        let obj = {
            internalName: 'AddInt32ZValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned int mode {Impulse=0, Repeat=1, Chain=2}
    char *command
    char *customName
    char *lastOutput (no effect and can be set to'\0')
    int tickDelay
    bool executeOnFirstTick
    bool trackOutput
    bool conditional
    bool needsRedstone
    */
    SetCommandBlockData(
        mode,
        command,
        customName,
        lastOutput,
        tickDelay,
        executeOnFirstTick,
        trackOutput,
        conditional,
        needsRedstone,
    ) {
        // 0x1A
        let modeArr = ['Impulse', 'Repeat', 'Chain'];
        let obj = {
            internalName: 'SetCommandBlockData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: 'command_block',
            mode: modeArr[mode],
            command: command,
            customName: customName,
            lastOutput: lastOutput,
            tickDelay: tickDelay,
            executeOnFirstTick: executeOnFirstTick,
            trackOutput: trackOutput,
            conditional: conditional,
            needsRedstone: needsRedstone,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short blockConstantStringID
    unsigned short blockData
    unsigned int mode {Impulse=0, Repeat=1, Chain=2}
    char *command
    char *customName
    char *lastOutput (no effect and can be set to'\0')
    int tickdelay
    bool executeOnFirstTick
    bool trackOutput
    bool conditional
    bool needRedstone
    */
    PlaceBlockWithCommandBlockData(
        blockConstantStringID,
        blockData,
        mode,
        command,
        customName,
        lastOutput,
        tickdelay,
        executeOnFirstTick,
        trackOutput,
        conditional,
        needsRedstone,
    ) {
        // 0x1B
        let modeArr = ['Impulse', 'Repeat', 'Chain'];
        let obj = {
            internalName: 'PlaceBlockWithCommandBlockData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            data: blockData,
            mode: modeArr[mode],
            command: command,
            customName: customName,
            lastOutput: lastOutput,
            tickdelay: tickdelay,
            executeOnFirstTick: executeOnFirstTick,
            trackOutput: trackOutput,
            conditional: conditional,
            needsRedstone: needsRedstone,
        };
        this.setDetails.push(obj);
    }

    /*
    char value //int8_t value
    */
    AddInt8XValue(value) {
        // 0x1C
        this.brushPosition[0] += value;
        let obj = {
            internalName: 'AddInt8XValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    char value //int8_t value
    */
    AddInt8YValue(value) {
        // 0x1D
        this.brushPosition[1] += value;
        let obj = {
            internalName: 'AddInt8YValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    char value //int8_t value
    */
    AddInt8ZValue(value) {
        // 0x1E
        this.brushPosition[2] += value;
        let obj = {
            internalName: 'AddInt8ZValue',
            value: value,
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned char poolId
    */
    UseRuntimeIDPool(poolId) {
        // 0x1F
        let obj = {
            internalName: 'UseRuntimeIDPool',
            poolId: poolId,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short runtimeId
    */
    PlaceRuntimeBlock(runtimeId) {
        // 0x20
        let obj = {
            internalName: 'PlaceRuntimeBlock',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: 'Unkwonn',
            data: 'Unkownn',
            runtimeId: runtimeId,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned int runtimeId
    */
    PlaceRuntimeBlockWithUint32RuntimeID(runtimeId) {
        // 0x21
        let obj = {
            internalName: 'PlaceRuntimeBlockWithUint32RuntimeID',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: undefined,
            data: undefined,
            runtimeId: runtimeId,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short runtimeId
    unsigned int mode {Impulse=0, Repeat=1, Chain=2}
    char *command
    char *customName
    char *lastOutput (no effect and can be set to'\0')
    int tickdelay
    bool executeOnFirstTick
    bool trackOutput
    bool conditional
    bool needRedstone
    */
    PlaceRuntimeBlockWithCommandBlockData(
        runtimeId,
        mode,
        command,
        customName,
        lastOutput,
        tickdelay,
        executeOnFirstTick,
        trackOutput,
        conditional,
        needsRedstone,
    ) {
        // 0x22
        let modeArr = ['Impulse', 'Repeat', 'Chain'];
        let obj = {
            internalName: 'PlaceRuntimeBlockWithCommandBlockData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: undefined,
            data: undefined,
            runtimeId: runtimeId,
            mode: modeArr[mode],
            command: command,
            customName: customName,
            lastOutput: lastOutput,
            tickdelay: tickdelay,
            executeOnFirstTick: executeOnFirstTick,
            trackOutput: trackOutput,
            conditional: conditional,
            needsRedstone: needsRedstone,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned int runtimeId
    unsigned int mode {Impulse=0, Repeat=1, Chain=2}
    char *command
    char *customName
    char *lastOutput (no effect and can be set to'\0')
    int tickdelay
    bool executeOnFirstTick
    bool trackOutput
    bool conditional
    bool needRedstone
    */
    PlaceRuntimeBlockWithCommandBlockDataAndUint32RuntimeID(
        runtimeId,
        mode,
        command,
        customName,
        lastOutput,
        tickdelay,
        executeOnFirstTick,
        trackOutput,
        conditional,
        needsRedstone,
    ) {
        // 0x23
        let modeArr = ['Impulse', 'Repeat', 'Chain'];
        let obj = {
            internalName: 'PlaceRuntimeBlockWithCommandBlockDataAndUint32RuntimeID',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: undefined,
            data: undefined,
            runtimeId: runtimeId,
            mode: modeArr[mode],
            command: command,
            customName: customName,
            lastOutput: lastOutput,
            tickdelay: tickdelay,
            executeOnFirstTick: executeOnFirstTick,
            trackOutput: trackOutput,
            conditional: conditional,
            needsRedstone: needsRedstone,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short data
    unsigned int mode {Impulse=0, Repeat=1, Chain=2}
    char *command
    char *customName
    char *lastOutput (no effect and can be set to'\0')
    int tickdelay
    bool executeOnFirstTick
    bool trackOutput
    bool conditional
    bool needRedstone
    */
    PlaceCommandBlockWithCommandBlockData(
        data,
        mode,
        command,
        customName,
        lastOutput,
        tickdelay,
        executeOnFirstTick,
        trackOutput,
        conditional,
        needsRedstone,
    ) {
        // 0x24
        let modeArr = ['Impulse', 'Repeat', 'Chain'];
        let obj = {
            internalName: 'PlaceCommandBlockWithCommandBlockData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: 'command_block',
            data: data,
            runtimeId: runtimeId,
            mode: modeArr[mode],
            command: command,
            customName: customName,
            lastOutput: lastOutput,
            tickdelay: tickdelay,
            executeOnFirstTick: executeOnFirstTick,
            trackOutput: trackOutput,
            conditional: conditional,
            needsRedstone: needsRedstone,
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned short runtimeId
    unsigned char slotCount
    struct ChestData data
    */
    PlaceRuntimeBlockWithChestData(runtimeId, slotCount, data) {
        // 0x25
        let obj = {
            internalName: 'PlaceRuntimeBlockWithChestData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: undefined,
            chestData: data,
            runtimeId: runtimeId,
            slotCount: slotCount,
        };
        this.setDetails.push(obj);
    }

    /* 
    unsigned int runtimeId
    unsigned char slotCount
    struct ChestData data
    */
    PlaceRuntimeBlockWithChestDataAndUint32RuntimeID(runtimeId, slotCount, data) {
        // 0x26
        let obj = {
            internalName: 'PlaceRuntimeBlockWithChestDataAndUint32RuntimeID',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: undefined,
            chestData: data,
            runtimeId: runtimeId,
            slotCount: slotCount,
        };
        this.setDetails.push(obj);
    }

    /*
    uint32_t length
    unsigned char buffer[length]
    */
    AssignDebugData(length, buffer) {
        // 0x27
        let obj = {
            internalName: 'AssignDebugData',
            length: length,
            buffer: buffer,
        };
        this.setDetails.push(obj);
    }

    /*
    uint16_t blockConstantStringID
    uint16_t blockData
    struct ChestData data
    */
    PlaceBlockWithChestData(blockConstantStringID, blockData, data) {
        // 0x28
        let obj = {
            internalName: 'PlaceBlockWithChestData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            data: blockData,
            chestData: data,
        };
        this.setDetails.push(obj);
    }

    /*
    uint16_t blockConstantStringID
    uint16_t blockStatesConstantStringID
    uint16_t blockStatesConstantStringID
    void *buffer
    */
    PlaceBlockWithNBTData(
        blockConstantStringID,
        blockStatesConstantStringID1,
        blockStatesConstantStringID2,
        buffer,
    ) {
        // 0x29
        let obj = {
            internalName: 'PlaceBlockWithNBTData',
            brushPosition: JSON.parse(JSON.stringify(this.brushPosition)),
            block: this.blockPalette[blockConstantStringID],
            data: blockData,
            blockState1: blockStatesConstantStringID1,
            blockState2: blockStatesConstantStringID2,
            nbtData: buffer,
        };
        this.setDetails.push(obj);
    }

    Terminate() {
        // 0x58 "X"
        let obj = {
            internalName: 'Terminate',
        };
        this.setDetails.push(obj);
    }

    /*
    unsigned char signatureSize
    */
    isSigned(signatureSize) {
        // 0x5A
        let obj = {
            internalName: 'isSigned',
            isSigned: signatureSize,
        };
        this.setDetails.push(obj);
    }

    readString() {
        let end = this.buf.indexOf(0x00, this.offset);
        let str = this.buf.toString('utf-8', this.offset, end);
        this.offset = end;
        return str;
    }

    readBool() {
        let byte = this.buf.readInt8(this.offset);
        this.offset += 1;
        let bool = (byte = 1 ? true : false);
        return bool;
    }

    // Unsigned
    readUInt8() {
        let value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }
    readUInt16BE() {
        let value = this.buf.readUInt16BE(this.offset);
        this.offset += 2;
        return value;
    }
    readUInt32BE() {
        let value = this.buf.readUInt32BE(this.offset);
        this.offset += 4;
        return value;
    }

    // Signed
    readInt8() {
        let value = this.buf.readInt8(this.offset);
        this.offset += 1;
        return value;
    }
    readInt16BE() {
        let value = this.buf.readInt16BE(this.offset);
        this.offset += 2;
        return value;
    }
    readInt32BE() {
        let value = this.buf.readInt32BE(this.offset);
        this.offset += 4;
        return value;
    }

    readChestData(slotCount) {
        let chestData = [];
        for (let i = 0; i < slotCount; i++) {
            let itemName = this.readString();
            this.offset += 1;
            let count = this.readUInt8();
            let data = this.readUInt16BE();
            let slotID = this.readUInt8();
            chestData.push({
                itemName: itemName,
                count: count,
                data: data,
                slotID,
            });
        }
        return chestData;
    }

    verifyBDX() {
        if (this.buf[this.buf.length - 1] !== 0x5a) {
            return [false, ''];
        }
        let constantServerKey =
            '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAzOoZfky1sYQXkTXWuYqf7HZ+tDSLyyuYOvyqt/dO4xahyNqvXcL5\n1A+eNFhsk6S5u84RuwsUk7oeNDpg/I0hbiRuJwCxFPJKNxDdj5Q5P5O0NTLR0TAT\nNBP7AjX6+XtNB/J6cV3fPcduqBbN4NjkNZxP4I1lgbupIR2lMKU9lXEn58nFSqSZ\nvG4BZfYLKUiu89IHaZOG5wgyDwwQrejxqkLUftmXibUO4s4gf8qAiLp3ukeIPYRj\nwGhGNlUfdU0foCxf2QwAoBV2xREL8/Sx1AIvmoVUg1SqCiIVMvbBkDoFfkzPZCgC\nLtmbkmqZJnpoBVHcBhBdUYsfyM6QwtWBNQIDAQAB\n-----END RSA PUBLIC KEY-----';

        if (this.buf[this.offset] !== 0x00 || this.buf[this.offset + 1] !== 0x8b) {
            throw new Error('Not a valid 2nd generation signature format');
        }
        let source = this.buf.subarray(0, this.offset - 1);
        console.log(source);
        let sourceSignLen;
        if (this.buf[this.buf.length - 2] == 0xff) {
            sourceSignLen = this.buf.readUInt16LE(this.buf.length - 4);
            //cryptoO = this.buf.subarray(this.offset, );
        } else {
            sourceSignLen = this.buf.readUInt8LE(this.buf.length - 3);
        }
        this.offset += 2;
        let signLen = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        let info = this.buf.toString('utf-8', this.offset, this.offset + signLen);
        this.offset += signLen;
        let firstSplit = info.split('::');
        let publicKey = firstSplit[0].split('|')[0];
        let author = firstSplit[0].split('|')[1];
        let sign = firstSplit[1];
        let verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(firstSplit[0]);
        let result = verifier.verify(constantServerKey, sign, 'hex');
        if (!result) {
            return [false, ''];
        }
        let sign2 = this.buf.subarray(this.offset, this.offset + sourceSignLen);
        verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(source);
        result = verifier.verify(publicKey, sign2, 'hex');
        if (!result) {
            return [false, ''];
        }
        return [true, author];
    }
    getSignature(source) {
        if (this.ifLogin == false) {
            throw new Error('Not Logged In');
        }

        let sign = crypto.createSign('SHA256');
        sign.update(source);
        let signature = sign.sign(this.privateSigningKey);
        return signature;
    }
    getUuid() {
        let res = request('GET', 'https://api.fastbuilder.pro/api/new', (error, response, body) => {
            if (!error && response.statusCode == 200) {
                throw new Error(error);
            }
        });
        return res.getBody('utf-8');
    }

    /*
    char *login_token fbToken 通过FB用户中心获取
    char *server_code 网易MC租赁服编号
    char *server_passcode 网易MC租赁服密码
    */
    setLogin(login_token, server_code, server_passcode) {
        let uuid = this.getUuid();
        let { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'der',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });
        let res = request('POST', 'https://api.fastbuilder.pro/api/phoenix/login', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${uuid}`,
            },
            body: JSON.stringify({
                login_token: login_token,
                server_code: server_code,
                server_passcode: server_passcode,
                client_public_key: publicKey.toString('base64'),
            }),
        });
        let body = JSON.parse(res.getBody());
        if (body.success == false) {
            throw new Error(body.message);
        }
        this.ifLogin = body.success;
        this.chainInfo = body.chainInfo;
        this.ip_address = body.ip_address;
        this.privateSigningKey = body.privateSigningKey;
        this.prove = body.prove;
        this.respond_to = body.respond_to;
        this.uid = body.uid;
        this.username = body.username;
    }
}

/*
var a = new BDXReaderClass()
a.CreateConstantString('glass')
console.log(a.blockPalette[0])
a.PlaceBlockWithBlockStates(0, 0)
a.SetCommandBlockData(1, '/say fuck', 'fucker', '\0', 1000, true, true, true, true)

console.log(a.setDetails)
*/
module.exports = BDXReaderClass;
