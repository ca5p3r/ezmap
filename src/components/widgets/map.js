import { useEffect, useState } from "react";
import { Map } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import {
	ZoomToExtent,
	FullScreen,
	OverviewMap,
	ScaleLine,
	defaults as defaultControls,
} from "ol/control";
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
	setSpatialResult,
	setDrawnPolygon,
	clearSpatialResult,
	triggerSpatialSearchVisibility
} from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { setter } from "../../utils";
const MyMap = () => {
	const dispatch = useDispatch();
	const defaultExtent = useSelector(state => state.mapInfo.defaultExtent);
	const mapCenter = useSelector(state => state.mapInfo.mapCenter);
	const mapZoom = useSelector(state => state.mapInfo.mapZoom);
	const clickedPoint = useSelector(state => state.mapInfo.clickedPoint);
	const mapExtent = useSelector(state => state.mapInfo.mapExtent);
	const pendingLayer = useSelector(state => state.workspace.pendingLayer);
	const historicalData = useSelector(state => state.toc.historicalData);
	const comonentChanged = useSelector(state => state.toc.comonentChanged);
	const activeLayers = useSelector(state => state.toc.activeLayers);
	const identifyState = useSelector(state => state.identify.enabled);
	const spatialSearchState = useSelector(state => state.spatialSearch.enabled);
	const drawnPolygon = useSelector(state => state.mapInfo.drawnPolygon);
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
				item.provider,
				item.url,
				item.id,
				item.title,
				item.name,
				item.opacity,
				item.visible
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
		const drawPoint = new Draw({
			type: "Point",
		});
		if (identifyState) {
			dispatch(
				triggerToast({
					title: "Info",
					message: "Select a feature on the map!",
					visible: true,
				})
			);
			olmap.addInteraction(drawPoint);
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
		const source = new VectorSource({ wrapX: false });
		const vector = new VectorLayer({
			source: source,
			title: 'Drawing&h79mm8h'
		});
		const drawPolygon = new Draw({
			type: "Polygon",
			source
		});
		if (spatialSearchState) {
			dispatch(
				triggerToast({
					title: "Info",
					message: "Draw a polygon on desired features!",
					visible: true,
				})
			);
			olmap.addLayer(vector);
			olmap.addInteraction(drawPolygon);
			drawPolygon.on('drawstart', e => {
				dispatch(clearSpatialResult());
				dispatch(setDrawnPolygon());
				source.clear();
			});
			drawPolygon.on('drawend', e => {
				dispatch(setDrawnPolygon(e.feature.getGeometry().getCoordinates()[0]));
			});
		} else {
			olmap.getInteractions().forEach((interaction) => {
				if (interaction instanceof Draw) {
					olmap.removeInteraction(interaction);
				}
			});
		};
		return () => {
			olmap.removeLayer(vector);
			source.clear();
		};
		// eslint-disable-next-line
	}, [spatialSearchState]);
	useEffect(() => {
		const controller = new AbortController();
		if (identifyState) {
			if (clickedPoint.length > 0) {
				dispatch(triggerIsLoading(true));
				dispatch(clearResult());
				const queriableLayers = historicalData.filter(item => item.geometry !== null);
				const data = {
					layers: queriableLayers,
					clickedPoint,
					type: 'query',
					subtype: 'identify'
				}
				if (queriableLayers.length > 0) {
					fetch("http://localhost:9090/queryService/query", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
						signal: controller.signal
					})
						.then(res => {
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
						.then(obj => {
							const result = [];
							obj.response.forEach(item => {
								let returnedData = [];
								switch (item.provider) {
									case 'EsriOGC':
										if (item.data['wfs:FeatureCollection']['gml:featureMember']) {
											if (item.data['wfs:FeatureCollection']['gml:featureMember'].length > 1) {
												item.data['wfs:FeatureCollection']['gml:featureMember'].forEach(entry => {
													returnedData.push(Object.entries(entry)[0]);
												});
											}
											else {
												returnedData = Object.entries(item.data['wfs:FeatureCollection']['gml:featureMember']);
											};
										}
										else {
											dispatch(
												triggerToast({
													title: "Warning",
													message: 'One or more layers did not return any data!',
													visible: true,
												})
											);
										};
										break;
									case 'GeoServer':
										returnedData = item.data.features;
										break;
									default:
										break;
								}
								if (returnedData.length > 0) {
									returnedData.forEach(feature => {
										switch (item.provider) {
											case 'EsriOGC':
												result.push({ provider: item.provider, name: item.name, id: item.id, feature: feature[1] })
												break;
											case 'GeoServer':
												result.push({ provider: item.provider, name: item.name, id: item.id, feature })
												break;
											default:
												break;
										}
									});
								}
								else {
									dispatch(
										triggerToast({
											title: "Warning",
											message: 'One or more layers did not return any data!',
											visible: true,
										})
									);
								}
							});
							if (result.length > 0) {
								dispatch(setResult(result));
								dispatch(triggerIdentifyVisibility(true));
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
			}
		};
		return () => {
			dispatch(triggerIsLoading());
			controller.abort()
		};
		// eslint-disable-next-line
	}, [clickedPoint, identifyState]);
	useEffect(() => {
		const controller = new AbortController();
		if (spatialSearchState) {
			if (drawnPolygon.length > 3) {
				dispatch(triggerIsLoading(true));
				const queriableLayers = historicalData.filter(item => item.geometry !== null);
				const data = {
					layers: queriableLayers,
					drawnPolygon,
					type: 'query',
					subtype: 'spatialSearch'
				}
				if (queriableLayers.length > 0) {
					fetch("http://localhost:9090/queryService/query", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data),
						signal: controller.signal
					})
						.then(res => {
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
						.then(obj => {
							const result = [];
							obj.response.forEach(item => {
								let returnedData = [];
								switch (item.provider) {
									case 'EsriOGC':
										if (item.data['wfs:FeatureCollection']['gml:featureMember']) {
											if (item.data['wfs:FeatureCollection']['gml:featureMember'].length > 1) {
												item.data['wfs:FeatureCollection']['gml:featureMember'].forEach(entry => {
													returnedData.push(Object.entries(entry)[0]);
												});
											}
											else {
												returnedData = Object.entries(item.data['wfs:FeatureCollection']['gml:featureMember']);
											};
										}
										else {
											dispatch(
												triggerToast({
													title: "Warning",
													message: 'One or more layers did not return any data!',
													visible: true,
												})
											);
										};
										break;
									case 'GeoServer':
										returnedData = item.data.features;
										break;
									default:
										break;
								}
								if (returnedData.length > 0) {
									returnedData.forEach(feature => {
										switch (item.provider) {
											case 'EsriOGC':
												result.push({ provider: item.provider, name: item.name, id: item.id, feature: feature[1] })
												break;
											case 'GeoServer':
												result.push({ provider: item.provider, name: item.name, id: item.id, feature })
												break;
											default:
												break;
										}
									});
								}
								else {
									dispatch(
										triggerToast({
											title: "Warning",
											message: 'One or more layers did not return any data!',
											visible: true,
										})
									);
								}
							});
							if (result.length > 0) {
								dispatch(setSpatialResult(result));
								dispatch(triggerSpatialSearchVisibility(true));
							};
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
			}
		};
		return () => {
			dispatch(triggerIsLoading());
			controller.abort()
		};
		// eslint-disable-next-line
	}, [drawnPolygon, spatialSearchState]);
	return <div id="map"></div>;
};
export default MyMap;
