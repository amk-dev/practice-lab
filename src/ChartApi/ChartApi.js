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
		}

	},

	methods: {

		onReady: callback => {
			setTimeout( () => callback( { supports_search: false } ), 0)
		},

		resolveSymbol: async ( symbolName, onSymbolResolvedCallback, onResolveErrorCallback ) => {

			getSymbolStub( symbolName ).then( res => {

				if( res.error ) {
					onResolveErrorCallback( res.error )
				} else {
					setTimeout(function() {
						onSymbolResolvedCallback(res.symbolStub)
					}, 0)
				}

			} )

		},

		getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {

			let candles = []
			from *= 1000
			to *= 1000

			from = moment( from ).format('YYYY-MM-DD')
			to = moment( to ).format('YYYY-MM-DD')

			let kiteResolution = getResolutionString( resolution )
			let url = 'http://localhost:8080/candles/'+ symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ from +'&to='+ to

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

		console.log('Hey i\'m getting mounted')
		console.log(this.session)

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

export async function getSymbolStub( symbolName ) {

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
			intraday_multipliers: ['1', '3', '5', '10', '15', '30', '60'],
			has_daily: true,
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

	let requestFromTo = getRequestFromAndTo(from, to, sessionFrom, sessionTo)

	if( requestFromTo ) {

		let kiteResolution = getResolutionString( resolution )
		let url = 'http://localhost:8080/candles/'+ symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ requestFromTo['from'] +'&to='+ requestFromTo['to']

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

	} else {
		onHistoryCallback([], { noData: false })
	}
}

export async function subscribeBarsSession(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {

	// Get All The Data For The Requested Period.

	console.log('Calling Subscribe Bars')

	let sessionFrom = this.session.startDate
	let sessionTo = this.session.endDate

	let kiteResolution = getResolutionString( resolution )
	let url = 'http://localhost:8080/candles/'+ symbolInfo.instrument_token + '/' + kiteResolution + '?from='+ sessionFrom +'&to='+ sessionTo

	if( symbolInfo.type == 'NFO-FUT' && resolution == 'D' ) {
		url += '&continuous=1'
	}

	let that = this

	getCandles( url, kiteResolution ).then( candles => {

		console.log( candles )

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

function getRequestFromAndTo( from, to, session_from, session_to ) {

	from = moment(from, "YYYY-MM-DD HH:MM:mm")
	to = moment(to, "YYYY-MM-DD HH:MM:mm")
	session_from = moment(session_from, "YYYY-MM-DD HH:MM:mm")
	session_to = moment(session_to, "YYYY-MM-DD HH:MM:mm")

	if( from.isAfter(session_from) && to.isAfter( session_to ) ) {
		return false
    }
	if( from.isBefore(session_from) && ( to.isAfter( session_from ) || to.isSame(session_from) ) ) {
		return  { from: from.format("YYYY-MM-DD HH:MM:mm"), to: session_from.subtract(1, 'days').format("YYYY-MM-DD HH:MM:mm")  }
    }
    if( from.isBefore( session_from ) && to.isBefore(session_from) ) {
        return { from: from.format("YYYY-MM-DD HH:MM:mm"), to: to.format("YYYY-MM-DD HH:MM:mm") }
    }

    return false

}

// buy( type, quantity, price)
// buy( 'market', buy )
// buy( 'limit', quantity, price )
// buy( 'stoploss', quantity, price )

// New Session
// Enters Symbol, Timeframe, From, To, Capital
// Session Is Inserted On Firebase, Once Completed It Is Inserted On To The Vuex Sessions Store ( Message To User "We're Creating Session" )
// A New URL /sessions/:sessionid opens up
// we get the symbol, timeframe and other info from the store
// loads data
// everything set. Start Replay 

// User Has To Place An Order
// User Enters An Order, Order Is Placed On The Server And Is Added To Orders, An Orderline Is Placed
// everytime lastbar is changed orders are checked for fill
// if filled user is shown a message, that their order is filled
// Top Buttons - End,Pause,Profit	