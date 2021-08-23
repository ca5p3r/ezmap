import { useEffect, useState } from "react";
import { Map } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import {
	ZoomToExtent,
	FullScreen,
	OverviewMap,
	ScaleLine,
	defaults as defaultControls,
} from "ol/control";
import { transform } from "ol/proj";
import "ol/ol.css";
import { Draw } from "ol/interaction";
import {
	setCursor,
	setMapCenter,
	setMapZoom,
	resetPendingLayer,
	setActiveLayers,
	triggerTOCChange,
	triggerToast,
	resetMapExtent,
	setClickedPoint,
	clearResult,
	setResult,
	triggerIdentifyVisibility,
	triggerIsLoading,
} from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { setter } from "../../utils";
const MyMap = () => {
	const dispatch = useDispatch();
	const defaultExtent = useSelector((state) => state.mapInfo.defaultExtent);
	const mapCenter = useSelector((state) => state.mapInfo.mapCenter);
	const mapZoom = useSelector((state) => state.mapInfo.mapZoom);
	const clickedPoint = useSelector((state) => state.mapInfo.clickedPoint);
	const mapExtent = useSelector((state) => state.mapInfo.mapExtent);
	const pendingLayer = useSelector((state) => state.workspace.pendingLayer);
	const historicalData = useSelector((state) => state.toc.historicalData);
	const comonentChanged = useSelector((state) => state.toc.comonentChanged);
	const activeLayers = useSelector((state) => state.toc.activeLayers);
	const identifyState = useSelector((state) => state.identify.enabled);
	const draw = new Draw({
		type: "Point",
	});
	const [olmap] = useState(
		new Map({
			controls: defaultControls().extend([
				new ZoomToExtent({
					extent: defaultExtent,
				}),
				new FullScreen(),
				new OverviewMap({
					layers: [
						new TileLayer({
							source: new OSM(),
						}),
					],
				}),
				new ScaleLine({
					units: "metric",
				}),
			]),
		})
	);
	useEffect(() => {
		olmap.setTarget("map");
		olmap.on("pointermove", (e) => {
			dispatch(setCursor(e.coordinate));
		});
		olmap.on("moveend", (e) => {
			dispatch(setMapZoom(e.map.getView().getZoom()));
			dispatch(setMapCenter(e.map.getView().getCenter()));
		});
		olmap.on("click", (e) => {
			dispatch(setClickedPoint(e.coordinate));
		});
		olmap.addLayer(
			new TileLayer({
				title: "OpenStreetMap",
				source: new OSM(),
			})
		);
		historicalData.forEach((item) => {
			const obj = setter(
				item.url + "wms",
				`${item.title}&${item.id}`,
				item.name
			);
			olmap.addLayer(obj);
		});
		dispatch(setActiveLayers(olmap.getLayers().array_));
		olmap.getTargetElement().style.cursor = "circle";
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		olmap.getView().setCenter(mapCenter);
		olmap.getView().setZoom(mapZoom);
		// eslint-disable-next-line
	}, [mapZoom, mapCenter]);
	useEffect(() => {
		if (Object.keys(pendingLayer).length > 0) {
			olmap.addLayer(pendingLayer);
			dispatch(resetPendingLayer());
			dispatch(setActiveLayers(olmap.getLayers().array_));
			dispatch(
				triggerToast({
					title: "Success",
					message: "Layer has been added!",
					visible: true,
				})
			);
		}
		// eslint-disable-next-line
	}, [pendingLayer]);
	useEffect(() => {
		if (comonentChanged) {
			olmap.render();
			dispatch(triggerTOCChange());
		}
		// eslint-disable-next-line
	}, [comonentChanged]);
	useEffect(() => {
		if (activeLayers) {
			olmap.getLayers().array_ = activeLayers;
			olmap.render();
		}
		// eslint-disable-next-line
	}, [activeLayers]);
	useEffect(() => {
		if (mapExtent.length > 0) {
			olmap.getView().fit(mapExtent);
			dispatch(resetMapExtent());
		}
		// eslint-disable-next-line
	}, [mapExtent.length]);
	useEffect(() => {
		if (identifyState) {
			dispatch(
				triggerToast({
					title: "Info",
					message: "Select a feature on the map!",
					visible: true,
				})
			);
			olmap.addInteraction(draw);
		} else {
			olmap.getInteractions().forEach((interaction) => {
				if (interaction instanceof Draw) {
					olmap.removeInteraction(interaction);
				}
			});
		}
		// eslint-disable-next-line
	}, [identifyState]);
	useEffect(() => {
		if (identifyState) {
			if (clickedPoint.length > 0) {
				console.log(clickedPoint);
				dispatch(triggerIsLoading(true));
				dispatch(clearResult());
				const controller = new AbortController();
				const queriableLayers = historicalData.filter(
					(item) => item.geometry !== null
				);
				if (queriableLayers.length > 0) {
					queriableLayers.forEach((layer) => {
						// const buffer = makeBuffer(layer.type, clickedPoint);
						// const coords = buffer.map((point) =>
						// 	transform(point, "EPSG:3857", layer.crs).join(" ")
						// );
						// const queryParam = coords.join(" ");
						// const raw = `<wfs:GetFeature service="WFS" outputFormat="application/json" version="1.1.0" xmlns:topp="http://www.openplans.org/topp" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><wfs:Query typeName="${layer.name}"><Filter><Intersects><PropertyName>${layer.geometry}</PropertyName><gml:Polygon srsName="${layer.crs}"><gml:exterior><gml:LinearRing><gml:posList>${queryParam}</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon></Intersects></Filter></wfs:Query></wfs:GetFeature>`;
						const requestOptions = {
							method: "POST",
							// body: raw,
							mode: "cors",
						};
						fetch(layer.url + "wfs", requestOptions)
							.then((res) => {
								if (!res.ok) {
									dispatch(
										triggerToast({
											title: "Danger",
											message: "Could not fetch data!",
											visible: true,
										})
									);
								}
								return res.json();
							})
							.then((obj) => {
								if (obj.features.length > 0) {
									obj.features.forEach((feature) =>
										dispatch(
											setResult({ name: layer.name, id: layer.id, feature })
										)
									);
									dispatch(triggerIdentifyVisibility(true));
								} else {
									dispatch(
										triggerToast({
											title: "Warning",
											message: `No results found for layer ${layer.title}!`,
											visible: true,
										})
									);
								}
								dispatch(triggerIsLoading());
							})
							.catch((error) => {
								if (error.name !== "AbortError") {
									dispatch(
										triggerToast({
											title: "Danger",
											message: error.toString(),
											visible: true,
										})
									);
								}
								dispatch(triggerIsLoading());
							});
					});
				} else {
					dispatch(
						triggerToast({
							title: "Warning",
							message: "No queriable layers found!",
							visible: true,
						})
					);
					dispatch(triggerIsLoading());
				}
				return () => {
					controller.abort();
				};
			}
		}
		// eslint-disable-next-line
	}, [clickedPoint, identifyState]);
	return <div id="map"></div>;
};
export default MyMap;
