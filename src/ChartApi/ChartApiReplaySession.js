/* eslint-disable */
import moment from 'moment'
import { getResolutionString } from './ChartApi.js'

console.log( getResolutionString )

let dataFeed = {
	
}

function getRequestFromAndTo( from, to, session_from, session_to ) {

	from = moment(from, "DD-MM-YYYY")
	to = moment(to, "DD-MM-YYYY")
	session_from = moment(session_from, "DD-MM-YYYY")
	session_to = moment(session_to, "DD-MM-YYYY")


	if( from.isAfter(session_from) && to.isAfter( session_to ) ) {
        console.log('One')
		return false
    }
	if( from.isBefore(session_from) && ( to.isAfter( session_from ) || to.isSame(session_from) ) ) {
        console.log('Two')
		return  { from: from.format("DD-MM-YYYY"), to: session_from.subtract(1, 'days').format('DD-MM-YYYY')  }
    }
    if( from.isBefore( session_from ) && to.isBefore(session_from) ) {
        console.log('Three')
        return { from: from.format("DD-MM-YYYY"), to: to.format("DD-MM-YYYY") }
    }

    return false

}

export default dataFeed['getBars']