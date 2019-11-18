const spreader = {
    letClusterize: true,
    small: 20,
    big: 30,
    side: 20,
    compose: function (x, y) {
        return `http://yandex.ru/maps/?from=api-maps`
            + `&ll=${x}%2C${y}&panorama%5Bpoint%5D=${x}%2C${y}`;
    }, getDateString: function (unixTime) {
        return (new Date(unixTime * 1000))
            .toLocaleDateString("ru-RU");
    },
    place: function (conditions = {types: [], address: ""}) {
        const doSelecting = conditions.types.length !== 0;
        let cluster;
        if (spreader.letClusterize) {
            spreader.side = spreader.big;
            cluster = new ymaps.Clusterer();
            cluster.balloon.events.add('open', function(e) {
                //alert(e);
            })
        }
        if (!spreader.letClusterize) {
            spreader.side = spreader.small;
        }
        $.each(points, function (index, place) {
            const allow = !doSelecting
                || conditions.types.includes(place.construct);

            const hasPermit = typeof place.permit !== typeof undefined;

            let header = "";
            let body = "";
            const panorama = spreader.compose(place.x, place.y);

            let footer = "";
            let name = place.name.split('(')[0];
            name = name.charAt(0).toUpperCase() + name.slice(1);
            let image = "";
            if(typeof place.images !== 'undefined' && place.images[0]) {
                image = place.images[0];
            } else {
                place.images = ["./assets/4218-1.JPG"];
                image = "./assets/4218-1.JPG";
            }
            if (allow) {
                header = `<div class="ballon-header">${name}, ${index}</div>`;
                body = `<div class="ballon-content row" style="margin-right:-30px; margin-left:0px">`
                    + `<div class="col-6 image" style="padding-right:0px;">`
                    + `<img src="${image}" class="img-thumbnail rounded-0 "/>`
                    + `</div><div class="col-6">`
                    + `<div class="rowdiv"><span class="address-label">Адрес:</span><br /> <strong>${place.location}</strong></div>`
                    + `<div class="rowdiv"><span class="address-label">Категория:</span><br /> <strong>${place.name}</strong></div></div></div>`;
                    footer = ``
                    + `<div class="row" style="margin-right:-15px; margin-left:0px""><div class="col-6" style="padding-right:0px;">`
                    + `<a class="btn btn-outline-primary btn-block"`
                    + ` href="#" onclick="painter.setPanorama(${index}); return false;">`
                    + `Панорама</a></div><div class="col-6" style="margin-left:0px;">`
                    + `<a class="btn btn-primary btn-block" `
                    + ` target="_blank"`
                    + ` href="#" onclick="painter.setProfileByIndex(${index});return false">`
                    + `Подробности</a></div></div>`;

            }
            let iconSet = [];
            if (allow && !hasPermit) {
                iconSet = iconSetup.available;
            }
            if (allow && hasPermit) {
                iconSet = iconSetup.inLease;
            }
            let permitInfo = {};
            if (allow && typeof place.permit !== typeof undefined) {

                const issuing_at = spreader.getDateString(place.permit.issuing_at);
                const start = spreader.getDateString(place.permit.start);
                const finish = spreader.getDateString(place.permit.finish);

                permitInfo = {
                    place_permit_number: place.permit.number,
                    place_permit_issuing_at: issuing_at,
                    place_permit_start: start,
                    place_permit_finish: finish,
                    place_permit_distributor: place.permit.distributor,
                    place_permit_contract: place.permit.contract,
                };
            }
            let placeInfo = {};
            if (allow) {
                placeInfo = {
                    place_images:place.images,
                    place_title: place.title ? place.title : name,
                    place_construct: place.name,
                    place_location: place.location,
                    place_remark: place.remark,
                    place_x: place.x,
                    place_y: place.y,
                    place_number_of_sides: place.number_of_sides,
                    place_construct_area: place.construct_area,
                    place_field_type: place.field_type,
                    place_fields_number: place.fields_number,
                    place_construct_height: place.construct_height,
                    place_construct_width: place.construct_width,
                    place_fields_area: place.fields_area,
                    place_lightening: place.lightening,
                    place_number: index,
                };
                const details = Object.assign(placeInfo, permitInfo);
                const side = Number(spreader.side);

                const point = painter.mark(place, index, header, body,
                    footer, details, iconSet, side);

                if (spreader.letClusterize) {
                    cluster.add(point);
                }
                if (!spreader.letClusterize) {
                    myMap.geoObjects.add(point);
                }

            }
        });

        if (spreader.letClusterize) {
            myMap.geoObjects.add(cluster);
        }
    },
};