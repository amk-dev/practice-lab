/* eslint-disable */
import moment from "moment"	
import axios from "axios"
import { realtimedb } from '../config.js'
import { widget } from '../charting_library.min';
import uuid from 'uuid'

export default {

	data() {
		return {

			lastBar: 0,
			status: '',
			paused: false,
			floatingBoxs: {

				barSpeed: false,
				buyOrderForm: false,
				sellOrderForm: false,
				pnlBox: false,
				orders: false
			},
			active: null,
			speed: 1,
			errors: {}

		}
	},

	computed: {
		
		tradingViewInterval() {
			return {
				'1minute': '1',
				'3minute': '3',
				'5minute': '5',
				'10minute': '10',
				'15minute': '15',
				'30minute': '30',
				'60minute': '60',
				'day': 'D'
			}[this.session.timeframe]
		},

		supported_resolutions() {

			let resolutions = [ '1', '3', '5', '10', '15', '30', '60', '120', '240' ]

			return resolutions.filter( ( resolution ) => { return parseInt(resolution) >= parseInt( this.tradingViewInterval ) } )

		}

	},

	methods: {

		onReady ( callback ) {

			let that = this

			setTimeout( () => callback( { 

				supports_search: false,
				supported_resolutions: that.supported_resolutions

			} ), 0)
		},

		resolveSymbol ( symbolName, onSymbolResolvedCallback, onResolveErrorCallback ) {

			getSymbolStub( symbolName, this.tradingViewInterval ).then( res => {

				if( res.error ) {
					onResolveErrorCallback( res.error )
				} else {
					setTimeout(function() {
						onSymbolResolvedCallback(res.symbolStub)
					}, 0)
				}

			} )

		},

		getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {

			let candles = []
			from *= 1000
			to *= 1000

			from = moment( from ).format('YYYY-MM-DD')
			to = moment( to ).format('YYYY-MM-DD')

			let kiteResolution = getResolutionString( resolution )
			let url = this.$store.getters.apiBaseUrl + '/candles/'+ symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ from +'&to='+ to

			if( symbolInfo.type == 'NFO-FUT' && resolution == 'D' ) {
				url += '&continuous=1'
			}
			
			getCandles( url, kiteResolution ).then( candles => {

				if( candles.error ) {
					onErrorCallback(candles.error)				
				}
				onHistoryCallback( candles.candles, { noData: false } )

			} )

		}
	},

	mounted() {

		let TradeGarageDataFeed = {
			onReady: this.onReady,
			resolveSymbol: this.resolveSymbol,
			getBars: this.getBars,
			subscribeBars: this.subscribeBars
		}

		const widgetOptions = {
			// debug: true,
			timezone: 'Asia/Kolkata',
			symbol: this.session.symbol, 
			datafeed: TradeGarageDataFeed,
			interval: this.tradingViewInterval,
			container_id: this.containerId,
			library_path: '/charting_library/',
			// indicators_file_name: "customIndicators/indicators.js",
			locale: 'en',
			disabled_features: ['use_localstorage_for_settings', 'link_to_tradingview', 'display_market_status', 'header_screenshot', 'create_volume_indicator_by_default', 'go_to_date'],
			enabled_features: ['trading_options'],
			client_id: 'test',
			user_id: 'public_user_id',
			fullscreen: true,
			autosize: true,
			overrides: {
				"mainSeriesProperties.candleStyle.upColor" : "#13aa9f",
				"mainSeriesProperties.candleStyle.downColor" : "#ef5350",
				"mainSeriesProperties.candleStyle.drawBorder": false,
				"mainSeriesProperties.candleStyle.wickUpColor": "#389B96",
				"mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
				"mainSeriesProperties.haStyle.upColor" : "#13aa9f",
				"mainSeriesProperties.haStyle.downColor" : "#ef5350",
				"mainSeriesProperties.haStyle.drawBorder": false,
				"mainSeriesProperties.haStyle.wickUpColor": "#389B96",
				"mainSeriesProperties.haStyle.wickDownColor": "#ef5350",
				"mainSeriesProperties.hollowCandleStyle.upColor" : "#13aa9f",
				"mainSeriesProperties.hollowCandleStyle.downColor" : "#ef5350",
				"mainSeriesProperties.hollowCandleStyle.drawBorder": false,
				"mainSeriesProperties.hollowCandleStyle.wickUpColor": "#389B96",
				"mainSeriesProperties.hollowCandleStyle.wickDownColor": "#ef5350",
				"mainSeriesProperties.barStyle.upColor": "#26a69a",
				"mainSeriesProperties.barStyle.downColor": "#ef5350",
				"paneProperties.vertGridProperties.color": "rgba(0,0,0,0)",
				"paneProperties.horzGridProperties.color": ""
			},
			studies_overrides: {
			    "volume.volume.color.0": "#ef5350",
			    "volume.volume.color.1": "#13aa9f",
			    "volume.volume.transparency": 70
			},
			theme: 'dark'
		}


		let that = this

		window.tvWidget = new widget(widgetOptions)
		tvWidget.headerReady().then(function() {
		    
		    let buttonReplay = tvWidget.createButton();
		    buttonReplay.setAttribute('title', 'Play / Pause The Chart Replay');
		    buttonReplay.addEventListener('click', function() { 

		    	that.paused = !that.paused
		    	that.$store.dispatch('showNotification', that.paused ? { message: 'Replay Paused', context: 'info' } : { message: 'Replay Continuing', context: 'info' } )

		    });

		    buttonReplay.textContent = 'Play / Pause'

		    let buttonSpeed = tvWidget.createButton();
		    buttonSpeed.setAttribute('title', 'Control Speed Of Your Replay');
		    buttonSpeed.addEventListener('click', function() { 

		    	that.floatingBoxs.barSpeed = true
		    	that.active = 'barSpeed'

		    });
		    buttonSpeed.textContent = "Speed"

		    let buttonBuy = tvWidget.createButton();
		    buttonBuy.setAttribute('title', 'Create A Buy Order');
		    buttonBuy.addEventListener('click', function() { 

		    	that.floatingBoxs.buyOrderForm = true
		    	that.active = 'buyOrderForm'

		    });
		    buttonBuy.textContent = "Buy"

		    let buttonSell = tvWidget.createButton();
		    buttonSell.setAttribute('title', 'Create A Sell Order');
		    buttonSell.addEventListener('click', function() { 

		    	that.floatingBoxs.sellOrderForm = true
		    	that.active = 'sellOrderForm'

		    });
		    buttonSell.textContent = "Sell"

		    let buttonPnL = tvWidget.createButton();
		    buttonPnL.setAttribute('title', 'Show Details Of PnL');
		    buttonPnL.addEventListener('click', function() { 

		    	that.floatingBoxs.pnlBox = true
		    	that.active = 'pnlBox'

		    });
		    buttonPnL.textContent = "PnL"

		    let buttonOrders = tvWidget.createButton();
		    buttonOrders.setAttribute('title', 'Alert Feed');
		    buttonOrders.addEventListener('click', function() { 

		    	that.floatingBoxs.orders = true
		    	that.active = 'orders'

		    });
		    buttonOrders.textContent = "Orders"
		    

		});

	}

}

export async function getSymbolStub( symbolName, timeframe ) {

	let data

	if( symbolName.indexOf(":") != -1 ) 
		symbolName = symbolName.split(":")[1]

	try {

		let snapshot = await realtimedb.ref('symbols/' + symbolName).once('value')
		data = snapshot.val()	

	} catch( err ) {

		console.log( err )
		return {'error': 'Something Went Wrong'}

	}

	if( data ) {

		let symbolStub = {
			name: data.tradingsymbol,
			ticker: data.tradingsymbol,
			description: data.tradingsymbol,
			type: data.segment,
			session: '0915-1530',
			exchange: data.exchange,
			timezone: 'Asia/Kolkata',
			minmov: 5,
			pricescale: 100,
			has_intraday: true,
			intraday_multipliers: [ timeframe.toString() ],
			has_daily: false,
			instrument_token: data.instrument_token
		}

		return { 'success': true, 'symbolStub': symbolStub }

	} else {
		return { 'error': 'Invalid Symbol' }
	}

}

export function getResolutionString( resolution ) {

	let kiteResolutionString = {
		'1': 'minute',
		'3': '3minute',
		'5': '5minute',
		'10': '10minute',
		'15': '15minute',
		'30': '30minute',
		'60': '60minute',
		'1D': 'day',
		'D': 'day'
	}

	return kiteResolutionString[resolution] || resolution

}

async function getData( url ) {

	try {

		let data = await axios.get(url)
		data = data.data
		return data

	} catch( err ) {
		console.log( err )
		return { 'error': true }
	}
}

async function getCandles( url, resolution ) {

	let kite = await getData( url )

	if( kite.error ) {
		return { 'error': 'Cannot Contact Server' }
	}

	let candles = []

	let times = []

	for( let item of kite.data.candles ) {
		
		let candle = {}
		candle['time'] = resolution == 'day' ? moment( item[0] ).add( 5, "hours").add( 30, "minutes" ).valueOf() : moment(item[0]).valueOf()
		candle['open'] = item[1]
		candle['high'] = item[2]
		candle['low'] = item[3]
		candle['close'] = item[4]
		candle['volume'] = item[5]
		candles.push( candle ) 
	}

	return { 'success': 'true', 'candles': candles }
}

export function getBarsSession (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest)  {

	let candles = []
	from *= 1000
	to *= 1000

	let sessionFrom = this.session.startDate
	let sessionTo = this.session.endDate

	from = moment( from ).format('YYYY-MM-DD')
	to = moment( to ).format('YYYY-MM-DD')

	let requestFromTo = getRequestFromAndTo(from, to, sessionFrom, sessionTo, resolution)

	if( requestFromTo.invalid ) {

		onHistoryCallback( [], { nodData: false } )

	} else if( requestFromTo.noData ) {

		onHistoryCallback([], { noData: true })

	} else {

		let kiteResolution = getResolutionString( resolution )
		let url = this.$store.getters.apiBaseUrl + '/candles/'+ symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ requestFromTo['from'] +'&to='+ requestFromTo['to']

		if( symbolInfo.type == 'NFO-FUT' && resolution == 'D' ) {
			url += '&continuous=1'
		}

		let that = this
		getCandles( url, kiteResolution ).then( candles => {

			if( candles.error ) {
				onErrorCallback(candles.error)				
			}
			
			onHistoryCallback( candles.candles, { noData: false } )

		} )

	}
}

export async function subscribeBarsSession(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {

	// Get All The Data For The Requested Period.

	let sessionFrom = this.session.startDate
	let sessionTo = this.session.endDate

	let kiteResolution = getResolutionString( this.tradingViewInterval )
	let url = this.$store.getters.apiBaseUrl + '/candles/' + symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ sessionFrom +'&to='+ sessionTo

	if( symbolInfo.type == 'NFO-FUT' && resolution == 'D' ) {
		url += '&continuous=1'
	}

	let that = this

	getCandles( url, kiteResolution ).then( candles => {

		if( candles.candles ) {

			candles = candles.candles

			let count = 0
			let length = candles.length

			let giveBar = function() {

				if( count != length -1 ) {

					setTimeout( function() {

						if( !that.paused ) {

						 	that.$store.dispatch( 'lastBarChanged', candles[count] )
						 	that.$store.dispatch('checkOrders')
							onRealtimeCallback( candles[ count ] , { noData: false } );
							count++
						 	
						}

						giveBar()

					}, that.speed * 1000 )

				}

			}

			giveBar()

		}

	} )
	
	// And With Specific Interval Pass That To onRealtimeCallback.	
}

// TODO: Make Sure You Test This Function
function getRequestFromAndTo( from, to, session_from, session_to, resolution ) {

	from = moment(from, "YYYY-MM-DD HH:MM:mm")
	to = moment(to, "YYYY-MM-DD HH:MM:mm")
	session_from = moment(session_from, "YYYY-MM-DD HH:MM:mm")
	session_to = moment(session_to, "YYYY-MM-DD HH:MM:mm")

	let requestFromAndTo

	let historyLimits = {
		'1': 60,
		'3': 100,
		'5': 100,
		'10': 100,
		'15': 200,
		'30': 200,
		'60': 400,
		'D': 2000
	}

	// get the from and to w.r.t session from and to

	if( from.isBefore(session_from) && ( to.isAfter( session_from ) || to.isSame(session_from) ) ) {

		requestFromAndTo = { from: from.format("YYYY-MM-DD HH:MM:mm"), to: session_from.subtract(1, 'days').format("YYYY-MM-DD HH:MM:mm")  }

    } else if( from.isBefore( session_from ) && to.isBefore(session_from) ) {

        requestFromAndTo =  { from: from.format("YYYY-MM-DD HH:MM:mm"), to: to.format("YYYY-MM-DD HH:MM:mm") }

    } else {

    	requestFromAndTo = { invalid: true }

    }

    /*  check if the current request period could cause an interval exceeded issue from kite api. 
    	this implementation has a possible chance of missing some candles from the last day. 
    */

    if( requestFromAndTo.from ) {

    	let lastAvailableDay = moment().subtract( historyLimits[ resolution ], 'days' )
		let requestFrom = moment(requestFromAndTo.from, 'YYYY-MM-DD')
		let requestTo = moment(requestFromAndTo.to, 'YYYY-MM-DD')

		if( requestFrom.isBefore( lastAvailableDay ) ) {
			requestFromAndTo = { from: lastAvailableDay.format("YYYY-MM-DD HH:MM:mm"), to: to.format("YYYY-MM-DD HH:MM:mm") }
		}

		// handle noData
		if( requestFrom.isBefore( lastAvailableDay ) && requestTo.isBefore( lastAvailableDay ) ) {
			requestFromAndTo = { noData: true }
		}

    }
	
    return requestFromAndTo

}