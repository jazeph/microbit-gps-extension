class GPS {

    latitude: number
    longitude: number
    satellites: number

    init(tx: SerialPin, rx: SerialPin, baudRate: BaudRate) {
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate9600
        )
        // serial.setRxBufferSize(200)
    }

    update(latitudeStr: string, latitudeDir: string, longitudeStr: string, longitudeDir: string, satellitesStr: string) {
        this.latitude = (latitudeDir == "N" ? 1 : -1) * parseFloat(removeLeadingZeros(latitudeStr))
        this.longitude = (longitudeDir == "E" ? 1 : -1) * parseFloat(removeLeadingZeros(longitudeStr))
        this.satellites = parseFloat(removeLeadingZeros(satellitesStr))
    }

    toString() {
        return "lat=" + this.latitude + " lon=" + this.longitude + " sat=" + this.satellites
    }
}

function removeLeadingZeros(str: string) {
    let removed_leading_zeros = str
    while (removed_leading_zeros.substr(0, 1) == "0") {
        removed_leading_zeros = removed_leading_zeros.substr(1, removed_leading_zeros.length - 1)
    }
    return removed_leading_zeros
}

let gps = new GPS()

basic.forever(function () {

    let nmeaField = serial.readUntil(serial.delimiters(Delimiters.Comma))

    if (nmeaField.includes("$GPGGA")) {

        serial.readUntil(serial.delimiters(Delimiters.Comma)) // ignore

        let latitude = removeLeadingZeros(serial.readUntil(serial.delimiters(Delimiters.Comma)))
        let latitudeDir = serial.readUntil(serial.delimiters(Delimiters.Comma))
        let longitude = serial.readUntil(serial.delimiters(Delimiters.Comma))
        let longitudeDir = serial.readUntil(serial.delimiters(Delimiters.Comma))

        serial.readUntil(serial.delimiters(Delimiters.Comma)) // ignore

        let satellites = serial.readUntil(serial.delimiters(Delimiters.Comma))

        gps.update(latitude, latitudeDir, longitude, longitudeDir, satellites)

        basic.showString(gps.toString())
    }
})

//% color=#0000FF
//% icon="\uf3c5"
//% block="GPS"
//% baudRate.defl=9600
namespace GPS {

    //% block="GPS init|tx pin $tx|rx pin $rx|baud rate $baudRate"
    export function init(tx: SerialPin, rx: SerialPin, baudRate: BaudRate) {
        gps.init(tx, rx, baudRate)
    }

    //% block
    export function latitude() {
        return gps.latitude;
    }

    //% block
    export function longitude() {
        return gps.longitude;
    }
}