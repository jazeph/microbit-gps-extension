def on_data_received():
    global gpsline, gpsdata, latitude, longitude
    gpsline = serial.read_until(serial.delimiters(Delimiters.DOLLAR))
    if gpsline.includes("GPGLL"):
        basic.show_string(gpsline)
        gpsdata = gpsline.split(",")
        if len(gpsdata) > 1:
            latitude = gpsdata[2]
            longitude = gpsdata[3]
serial.on_data_received(serial.delimiters(Delimiters.DOLLAR), on_data_received)

longitude = ""
latitude = ""
gpsdata: List[str] = []
gpsline = ""
serial.redirect(SerialPin.P0, SerialPin.P1, BaudRate.BAUD_RATE9600)

def on_forever():
    global gpsline
    gpsline = serial.read_line()
basic.forever(on_forever)
