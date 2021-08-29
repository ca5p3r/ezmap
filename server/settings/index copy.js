export const connection = {
    "host": "localhost",
    "port": "5432",
    "username": "postgres",
    "password": "postgres",
    "database": "ezmap"
};
export const config = {
    "bookmarks": [],
    "map": {
        "center": [
            0,
            0
        ],
        "zoom": 0,
        "extent": [
            2099724.35,
            2504130.79,
            4659273.23,
            3724669.16
        ],
        "layers": []
    }
};
export const projections = {
    "EPSG:3857": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
    "EPSG:4326": "+proj=longlat +datum=WGS84 +no_defs ",
    "EPSG:22992": "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs ",
    "EPSG:32636": "+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs ",
    "EPSG:32637": "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs ",
    "EPSG:32237": "+proj=utm +zone=37 +ellps=WGS72 +towgs84=0,0,4.5,0,0,0.554,0.2263 +units=m +no_defs "
};