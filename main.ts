class GPSData {

    latitude: number;
    longitude: number;
    satellites: number;

    constructor() {
        this.satellites = 0;
    }

    init(tx: SerialPin, rx: SerialPin, baudRate: BaudRate) {
        serial.redirect(tx, rx, baudRate);
        // serial.setRxBufferSize(200)
    }

    update(latitudeStr: string, latitudeDir: string, longitudeStr: string, longitudeDir: string, satellitesStr: string) {
        this.latitude = (latitudeDir == "N" ? 1 : -1) * parseFloat(removeLeadingZeros(latitudeStr));
        this.longitude = (longitudeDir == "E" ? 1 : -1) * parseFloat(removeLeadingZeros(longitudeStr));
        this.satellites = parseFloat(removeLeadingZeros(satellitesStr));
    }

    toString() {
        return "lat=" + this.latitude + " lon=" + this.longitude + " sat=" + this.satellites;
    }
}

function removeLeadingZeros(str: string) {
    let removed_leading_zeros = str;
    while (removed_leading_zeros.substr(0, 1) == "0") {
        removed_leading_zeros = removed_leading_zeros.substr(1, removed_leading_zeros.length - 1);
    }
    return removed_leading_zeros;
}

let gps = new GPSData();

function readGPGGA() {
    let result: string[] = [
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma)),
        serial.readUntil(serial.delimiters(Delimiters.Comma))
    ];
    return result;
}

function updateGPS(gpggaData: string[]) {
    gps.update(gpggaData[1], gpggaData[2], gpggaData[3], gpggaData[4], gpggaData[6]);
}

basic.forever(function () {

    let nmeaField = serial.readUntil(serial.delimiters(Delimiters.Comma));

    if (nmeaField.includes("$GPGGA")) {
        let gpggaData = readGPGGA();
        updateGPS(gpggaData);
        //basic.showString(gps.toString());
    }
})

//% color=#00A928
//% icon="\uf3c5"
//% block="GPS"
namespace GPS {

    //% blockId=gps_init
    //% block="GPS init|tx pin $tx|rx pin $rx|baud rate $baudRate"
    //% tx.defl=SerialPin.P0
    //% rx.defl=SerialPin.P1
    //% baudRate.defl=BaudRate.BaudRate9600
    export function init(tx: SerialPin, rx: SerialPin, baudRate: BaudRate) {
        gps.init(tx, rx, baudRate);
    }

    //% block
    export function latitude() {
        return gps.latitude;
    }

    //% block
    export function longitude() {
        return gps.longitude;
    }

    //% block
    export function satellites() {
        return gps.satellites;
    }
}
