function removeLeadingZeros (str: string) {
    removed_leading_zeros = str
    while (removed_leading_zeros.substr(0, 1) == "0") {
        removed_leading_zeros = removed_leading_zeros.substr(1, removed_leading_zeros.length - 1)
    }
    return removed_leading_zeros
}
let gps_satellites = ""
let _gps_lon_ew = ""
let gps_longitude = ""
let _gps_lat_ns = ""
let gps_latitude = ""
let _gps_ignore = ""
let _gps_field = ""
let removed_leading_zeros = ""
serial.redirect(
SerialPin.P0,
SerialPin.P1,
BaudRate.BaudRate9600
)
serial.setRxBufferSize(200)
basic.forever(function () {
    _gps_field = serial.readUntil(serial.delimiters(Delimiters.Comma))
    if (_gps_field.includes("$GPGGA")) {
        _gps_ignore = serial.readUntil(serial.delimiters(Delimiters.Comma))
        gps_latitude = removeLeadingZeros(serial.readUntil(serial.delimiters(Delimiters.Comma)))
        _gps_lat_ns = serial.readUntil(serial.delimiters(Delimiters.Comma))
        if (_gps_lat_ns == "S") {
        	
        }
        gps_longitude = removeLeadingZeros(serial.readUntil(serial.delimiters(Delimiters.Comma)))
        _gps_lon_ew = serial.readUntil(serial.delimiters(Delimiters.Comma))
        _gps_ignore = serial.readUntil(serial.delimiters(Delimiters.Comma))
        gps_satellites = removeLeadingZeros(serial.readUntil(serial.delimiters(Delimiters.Comma)))
        basic.showString("lat=" + gps_latitude + " lon=" + gps_longitude + " sat=" + gps_satellites)
    }
})
