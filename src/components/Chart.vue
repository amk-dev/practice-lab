<template>
	<div :id="containerId"></div>
</template>

<script>
	 /* eslint-disable */
	import { firestore } from '../config.js'
	import { realtimedb } from '../config.js'
	import moment from 'moment'
	import ChartApiMixin from '../ChartApi/ChartApi.js'

	import { widget } from '../charting_library.min';

	export default {
		name: 'Chart',
		mixins: [ ChartApiMixin ],
		props: {
			'symbol': {
				default: 'ACC',
				type: String
			},
			'interval': {
				default: 'D',
				type: String
			},
			'containerId': {
				type: String
			}
		},
		data: () => {
			return {
				// TODO : Move This To Local Storage
				searchValue: '',
				from: this.$route.from,
				to: this.$route.to
			}
		},

		computed: {

			searchResults() {
				let searchKeys = Object.keys( this.symbols )
				let results = []
				for( let symbol of searchKeys ) {
					if( symbol.indexOf( this.searchValue ) != -1 ) 
						results.push( this.symbols[ symbol ] )
				}
				return results;
			}
		},
		methods: {
			onReady( callback ) {
				setTimeout( () => callback( { supports_search: false } ), 0)
			}
		},

		mounted() {

			const widgetOptions = {
				debug: true,
				timezone: 'Asia/Kolkata',
				symbol: this.symbol, 
				datafeed: TradeGargeDataFeed,
				interval: this.interval,
				container_id: this.containerId,
				library_path: '/charting_library/',
				// indicators_file_name: "customIndicators/indicators.js",
				locale: 'en',
				disabled_features: ['use_localstorage_for_settings', 'link_to_tradingview', 'display_market_status', 'header_screenshot', 'create_volume_indicator_by_default'],
				enabled_features: [],
				client_id: 'test',
				user_id: 'public_user_id',
				fullscreen: true,
				autosize: true,
				overrides: {
					"mainSeriesProperties.candleStyle.upColor" : "#13aa9f",
					"mainSeriesProperties.candleStyle.downColor" : "#ea675d",
					"mainSeriesProperties.candleStyle.drawBorder": false,
					"mainSeriesProperties.candleStyle.wickUpColor": "#389B96",
					"mainSeriesProperties.candleStyle.wickDownColor": "#EF5153",
					"mainSeriesProperties.haStyle.upColor" : "#13aa9f",
					"mainSeriesProperties.haStyle.downColor" : "#ea675d",
					"mainSeriesProperties.haStyle.drawBorder": false,
					"mainSeriesProperties.haStyle.wickUpColor": "#389B96",
					"mainSeriesProperties.haStyle.wickDownColor": "#EF5153",
					"mainSeriesProperties.hollowCandleStyle.upColor" : "#13aa9f",
					"mainSeriesProperties.hollowCandleStyle.downColor" : "#ea675d",
					"mainSeriesProperties.hollowCandleStyle.drawBorder": false,
					"mainSeriesProperties.hollowCandleStyle.wickUpColor": "#389B96",
					"mainSeriesProperties.hollowCandleStyle.wickDownColor": "#EF5153",
					"mainSeriesProperties.barStyle.upColor": "#26a69a",
					"mainSeriesProperties.barStyle.downColor": "#ef5350"
				},
				studies_overrides: {
				    "volume.volume.color.0": "#13aa9f",
				    "volume.volume.color.1": "#ea675d",
				    "volume.volume.transparency": 70
				},
				theme: 'dark'
			}


			window.addEventListener('DOMContentLoaded', () => {
				
				window.tvWidget = new widget(widgetOptions)

			} , false);

		}
	}



</script>